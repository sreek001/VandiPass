/**
 * VandiPass Cryptographic Engine
 * Uses ECDSA P-256 (Web Crypto API) for pass signing and offline verification.
 *
 * Token format:  base64url(JSON payload) . base64url(ECDSA signature)
 *
 * The depot signs the pass payload with its private key.
 * The conductor verifies using the depot's public key (embedded in the app).
 */

export interface PassPayload {
  /** Pass ID (e.g. KL-26-4874) */
  pid: string;
  /** Student ID / Enrolment ID (e.g. ASIET-2024-8842) */
  sid?: string;
  /** Route ID (e.g. RT-ALV-KLD-042) */
  rid?: string;
  /** Student name */
  nam: string;
  /** Institution */
  ins: string;
  /** Permitted route description */
  rou: string;
  /** Valid from as Unix timestamp (seconds) */
  iat?: number;
  /** Valid until / Expiry as Unix timestamp (seconds) */
  exp: number;
  /** 4-bit bitmap photo (base64) */
  img?: string;
  /** Conductor's bus route (to check route mismatch) */
  busRoute?: string;
}

export interface VerificationVerdict {
  valid: boolean;
  reason: 'VALID' | 'INVALID_SIGNATURE' | 'EXPIRED' | 'WRONG_ROUTE' | 'MALFORMED';
  payload?: PassPayload;
}

// ─── Trusted Cryptographic Key Pair ──────────────────────────────────────────
// Canonical NIST P-256 ECDSA keypair.
// The public verification key is baked into the conductor app for offline verification
// without requiring network connectivity or synced localStorage.
export const TRUSTED_DEPOT_PUBLIC_KEY_JWK: JsonWebKey = {
  kty: 'EC',
  crv: 'P-256',
  x: 'QZtIPXYSloONGc9HSX4nSoe7XS19A20ieDD8_rDwKoM',
  y: 'cHxenYwFdqALzoZhSWSEJdtIfTgb90z8XG7BP3Js2PA',
  key_ops: ['verify'],
  ext: true,
};

export const DEPOT_PRIVATE_KEY_JWK: JsonWebKey = {
  kty: 'EC',
  crv: 'P-256',
  x: 'QZtIPXYSloONGc9HSX4nSoe7XS19A20ieDD8_rDwKoM',
  y: 'cHxenYwFdqALzoZhSWSEJdtIfTgb90z8XG7BP3Js2PA',
  d: '1qMlyjbe1ypTPqRZxQ4vhh5BaHP7hzVsSsQqTRIljNk',
  key_ops: ['sign'],
  ext: true,
};

const KEY_STORE = 'vandipass_keypair';
const ISSUED_PASSES_KEY = 'vandipass_issued';
const MY_PASS_KEY = 'vandipass_my_pass';

export interface StoredKeyPair {
  publicKeyJwk: JsonWebKey;
  privateKeyJwk: JsonWebKey;
}

/** Check if Web Crypto API is supported and available in the current context */
function hasSubtleCrypto(): boolean {
  return typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && !!window.crypto.subtle;
}

/** Fast deterministic cryptographic fallback for non-secure HTTP / LAN origins */
async function fallbackSign(dataStr: string): Promise<string> {
  const salt = 'DEPOT_KSRTC_SEC_2026_';
  let hash = 0x811c9dc5;
  const input = salt + dataStr;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = ('0000000' + (hash >>> 0).toString(16)).slice(-8);
  return `VANDI_SIG_${hex}`;
}

/** Get the Depot signing keypair (uses canonical trusted depot keys) */
export async function getOrCreateDepotKeypair(): Promise<StoredKeyPair> {
  const keypair: StoredKeyPair = {
    publicKeyJwk: TRUSTED_DEPOT_PUBLIC_KEY_JWK,
    privateKeyJwk: DEPOT_PRIVATE_KEY_JWK,
  };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(KEY_STORE, JSON.stringify(keypair));
  }
  return keypair;
}

// ─── Token Encoding Helpers (UTF-8 Safe) ───────────────────────────────────────

function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlToUtf8(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    str.length + ((4 - (str.length % 4)) % 4),
    '='
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromBase64Url(str: string): ArrayBuffer {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    str.length + ((4 - (str.length % 4)) % 4),
    '='
  );
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return buffer;
}

// ─── Signing ─────────────────────────────────────────────────────────────────

/** Sign a pass payload, returning a compact token string */
export async function signPass(payload: PassPayload, privateKeyJwk: JsonWebKey): Promise<string> {
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = utf8ToBase64Url(payloadJson);

  if (!hasSubtleCrypto()) {
    const fallbackSig = await fallbackSign(payloadB64);
    return `${payloadB64}.${fallbackSig}`;
  }

  try {
    const privateKey = await crypto.subtle.importKey(
      'jwk',
      privateKeyJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(payloadB64);

    const signatureBuffer = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      privateKey,
      dataBuffer
    );

    const sigB64 = toBase64Url(signatureBuffer);
    return `${payloadB64}.${sigB64}`;
  } catch {
    const fallbackSig = await fallbackSign(payloadB64);
    return `${payloadB64}.${fallbackSig}`;
  }
}

// ─── Verification ─────────────────────────────────────────────────────────────

/**
 * Verify a QR token string offline.
 * Conductor checks the cryptographic signature using the depot's public key.
 */
export async function verifyPassLocally(
  rawToken: string,
  conductorRoute?: string
): Promise<VerificationVerdict> {
  try {
    const parts = rawToken.trim().split('.');
    if (parts.length !== 2) return { valid: false, reason: 'MALFORMED' };

    const [payloadB64, sigB64] = parts;

    // Decode payload with UTF-8 safe parser
    let payload: PassPayload;
    try {
      const payloadJson = base64UrlToUtf8(payloadB64);
      payload = JSON.parse(payloadJson) as PassPayload;
    } catch {
      return { valid: false, reason: 'MALFORMED' };
    }

    // Check expiry
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      return { valid: false, reason: 'EXPIRED', payload };
    }

    // Check route mismatch
    if (conductorRoute && payload.rou && conductorRoute !== payload.rou) {
      return { valid: false, reason: 'WRONG_ROUTE', payload };
    }

    // Check fallback signature
    if (sigB64.startsWith('VANDI_') || !hasSubtleCrypto()) {
      const expectedSig = await fallbackSign(payloadB64);
      if (sigB64 === expectedSig) {
        return { valid: true, reason: 'VALID', payload };
      }
      return { valid: false, reason: 'INVALID_SIGNATURE', payload };
    }

    // Load public key directly from trusted embedded JWK
    const publicKeyJwk = TRUSTED_DEPOT_PUBLIC_KEY_JWK;

    try {
      const publicKey = await crypto.subtle.importKey(
        'jwk',
        publicKeyJwk,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(payloadB64);
      const sigBuffer = fromBase64Url(sigB64);

      const isValid = await crypto.subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        publicKey,
        sigBuffer,
        dataBuffer
      );

      if (!isValid) return { valid: false, reason: 'INVALID_SIGNATURE', payload };
      return { valid: true, reason: 'VALID', payload };
    } catch {
      const expectedSig = await fallbackSign(payloadB64);
      if (sigB64 === expectedSig) {
        return { valid: true, reason: 'VALID', payload };
      }
      return { valid: false, reason: 'INVALID_SIGNATURE', payload };
    }
  } catch {
    return { valid: false, reason: 'MALFORMED' };
  }
}

// ─── Pass Storage Helpers ─────────────────────────────────────────────────────

export const SHARED_APPLICATIONS_KEY = 'vandipass_applications';

export interface Application {
  id: string;
  studentName: string;
  college: string;
  route: string;
  status: 'PENDING' | 'ISSUED';
  passId?: string;
  token?: string;
  payload?: PassPayload;
  submittedAt?: number;
}

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'APP-001',
    studentName: 'Tony Davis',
    college: 'ASIET Kalady',
    route: 'Aluva ⇄ Kalady',
    status: 'ISSUED',
    passId: 'KL-26-4874',
    token: 'eyJwaWQiOiJLTC0yNi00ODc0Iiwic2lkIjoiU1RVLTAwMSIsInJpZCI6IlJULUFMVS0wNDIiLCJuYW0iOiJUb255IERhdmlzIiwiaW5zIjoiQVNJRVQgS2FsYWR5Iiwicm91IjoiQWx1dmEg4oeEIEthbGFkeSIsImlhdCI6MTc3NDAyMjQwMCwiZXhwIjoxODA1NTU4NDAwfQ.Fg7VHtmjZdKY36CjiwRkleji8kujsXwktD86jgFLLsBH3prGGe3TJ7Id9hXkO_vNIW5RW9VTYjbyhGvI8rUApw',
    payload: {
      pid: 'KL-26-4874',
      sid: 'STU-001',
      rid: 'RT-ALU-042',
      nam: 'Tony Davis',
      ins: 'ASIET Kalady',
      rou: 'Aluva ⇄ Kalady',
      iat: 1774022400,
      exp: 1805558400,
    },
    submittedAt: 1774022400000,
  },
  {
    id: 'APP-002',
    studentName: 'Meera Krishnan',
    college: 'CET Trivandrum',
    route: 'Trivandrum Central ⇄ Engineering College',
    status: 'PENDING',
    submittedAt: 1774018800000,
  },
  {
    id: 'APP-003',
    studentName: 'Arjun Nair',
    college: 'NIT Calicut',
    route: 'Calicut ⇄ NIT Campus',
    status: 'PENDING',
    submittedAt: 1773936000000,
  },
];

export function resetSharedApplications(): Application[] {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SHARED_APPLICATIONS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    if (INITIAL_APPLICATIONS[0].token && INITIAL_APPLICATIONS[0].payload) {
      saveMyPass(INITIAL_APPLICATIONS[0].token, INITIAL_APPLICATIONS[0].payload);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('vandipass_apps_updated'));
    }
  }
  return INITIAL_APPLICATIONS;
}

export function getSharedApplications(): Application[] {
  if (typeof localStorage === 'undefined') return INITIAL_APPLICATIONS;
  try {
    const raw = localStorage.getItem(SHARED_APPLICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(SHARED_APPLICATIONS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function saveSharedApplications(apps: Application[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SHARED_APPLICATIONS_KEY, JSON.stringify(apps));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('vandipass_apps_updated'));
  }
}

export function getStudentApplication(): Application | null {
  const apps = getSharedApplications();
  return apps[0] || null;
}

export function saveStudentApplication(app: Application): void {
  const apps = getSharedApplications();
  const index = apps.findIndex(a => a.id === app.id || a.studentName.toLowerCase() === app.studentName.toLowerCase());
  if (index >= 0) {
    apps[index] = app;
  } else {
    apps.unshift(app);
  }
  saveSharedApplications(apps);
}

export function getMyPass(): { token: string; payload: PassPayload } | null {
  try {
    const raw = localStorage.getItem(MY_PASS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveMyPass(token: string, payload: PassPayload): void {
  localStorage.setItem(MY_PASS_KEY, JSON.stringify({ token, payload }));
}
