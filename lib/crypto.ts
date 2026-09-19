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
  /** Student name */
  nam: string;
  /** Institution */
  ins: string;
  /** Permitted route */
  rou: string;
  /** Pass ID */
  pid: string;
  /** Expiry as Unix timestamp (seconds) */
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

// ─── Key Pair Management ──────────────────────────────────────────────────────

const KEY_STORE = 'vandipass_keypair';
const ISSUED_PASSES_KEY = 'vandipass_issued';
const MY_PASS_KEY = 'vandipass_my_pass';

export interface StoredKeyPair {
  publicKeyJwk: JsonWebKey;
  privateKeyJwk: JsonWebKey;
}

/** Generate a new ECDSA P-256 key pair for the depot */
export async function generateDepotKeypair(): Promise<StoredKeyPair> {
  const keypair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keypair.publicKey);
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', keypair.privateKey);
  const stored: StoredKeyPair = { publicKeyJwk, privateKeyJwk };
  localStorage.setItem(KEY_STORE, JSON.stringify(stored));
  return stored;
}

/** Get the stored keypair, generating a new one if needed */
export async function getOrCreateDepotKeypair(): Promise<StoredKeyPair> {
  const raw = localStorage.getItem(KEY_STORE);
  if (raw) {
    try {
      return JSON.parse(raw) as StoredKeyPair;
    } catch {}
  }
  return generateDepotKeypair();
}

// ─── Token Encoding Helpers ───────────────────────────────────────────────────

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
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = btoa(payloadJson).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(payloadB64);

  const signatureBuffer = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    dataBuffer
  );

  const sigB64 = toBase64Url(signatureBuffer);
  return `${payloadB64}.${sigB64}`;
}

// ─── Verification ─────────────────────────────────────────────────────────────

/**
 * Verify a QR token string offline.
 * The conductor's copy of the depot public key is loaded from localStorage
 * (set when depot issued the pass). In production this would be baked in.
 */
export async function verifyPassLocally(
  rawToken: string,
  conductorRoute?: string
): Promise<VerificationVerdict> {
  try {
    const parts = rawToken.trim().split('.');
    if (parts.length !== 2) return { valid: false, reason: 'MALFORMED' };

    const [payloadB64, sigB64] = parts;

    // Decode payload
    let payload: PassPayload;
    try {
      const paddedPayload = payloadB64.replace(/-/g, '+').replace(/_/g, '/').padEnd(
        payloadB64.length + ((4 - (payloadB64.length % 4)) % 4), '='
      );
      payload = JSON.parse(atob(paddedPayload)) as PassPayload;
    } catch {
      return { valid: false, reason: 'MALFORMED' };
    }

    // Load public key from localStorage (synced from depot)
    const raw = localStorage.getItem(KEY_STORE);
    if (!raw) return { valid: false, reason: 'INVALID_SIGNATURE' };
    const { publicKeyJwk } = JSON.parse(raw) as StoredKeyPair;

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

    // Check expiry
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp < nowSec) return { valid: false, reason: 'EXPIRED', payload };

    // Check route mismatch
    if (conductorRoute && payload.rou && conductorRoute !== payload.rou) {
      return { valid: false, reason: 'WRONG_ROUTE', payload };
    }

    return { valid: true, reason: 'VALID', payload };
  } catch {
    return { valid: false, reason: 'MALFORMED' };
  }
}

// ─── Pass Storage Helpers ─────────────────────────────────────────────────────

export interface ApplicationRecord {
  id: string;
  studentName: string;
  institution: string;
  route: string;
  photoBase64?: string;
  submittedAt: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  token?: string;
}

export function getApplications(): ApplicationRecord[] {
  try {
    return JSON.parse(localStorage.getItem(ISSUED_PASSES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveApplications(apps: ApplicationRecord[]): void {
  localStorage.setItem(ISSUED_PASSES_KEY, JSON.stringify(apps));
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

/** Seed some demo data if localStorage is empty */
export async function seedDemoDataIfNeeded(): Promise<void> {
  const apps = getApplications();
  if (apps.length > 0) return;

  // Generate a depot keypair
  await getOrCreateDepotKeypair();

  const now = Math.floor(Date.now() / 1000);

  const demoApps: ApplicationRecord[] = [
    {
      id: 'APP-001',
      studentName: 'Tony Davis',
      institution: 'ASIET Kalady',
      route: 'Aluva ⇄ Kalady',
      submittedAt: now - 3600,
      status: 'PENDING',
    },
    {
      id: 'APP-002',
      studentName: 'Meera Krishnan',
      institution: 'CET Trivandrum',
      route: 'Trivandrum Central ⇄ Engineering College',
      submittedAt: now - 7200,
      status: 'PENDING',
    },
    {
      id: 'APP-003',
      studentName: 'Arjun Nair',
      institution: 'NIT Calicut',
      route: 'Calicut ⇄ NIT Campus',
      submittedAt: now - 86400,
      status: 'PENDING',
    },
  ];

  saveApplications(demoApps);
}
