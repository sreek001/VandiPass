// Deterministic KSRTC Pass ID Checksum Algorithm (Luhn Mod-36)
const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateCheckCharacter(baseId: string): string {
  const clean = baseId.toUpperCase().replace(/[^0-9A-Z]/g, '');
  let factor = 2;
  let sum = 0;

  for (let i = clean.length - 1; i >= 0; i--) {
    const codePoint = CHARSET.indexOf(clean[i]);
    if (codePoint === -1) continue;
    let addend = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    addend = Math.floor(addend / 36) + (addend % 36);
    sum += addend;
  }

  const remainder = sum % 36;
  const checkCodePoint = (36 - remainder) % 36;
  return CHARSET[checkCodePoint];
}

export function validatePassId(fullPassId: string): boolean {
  if (!fullPassId || typeof fullPassId !== 'string') return false;
  // Format check: KL-XX-XXXX-X or KL-XX-XXXX
  const parts = fullPassId.trim().toUpperCase().split('-');
  if (parts.length < 3) return false;
  if (parts[0] !== 'KL') return false;

  // If pass ID has check suffix: KL-26-4874-X
  if (parts.length === 4) {
    const base = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const expectedCheck = generateCheckCharacter(base);
    return parts[3] === expectedCheck;
  }

  // Basic format check for 3-part IDs (KL-26-4874)
  return /^\d{2}$/.test(parts[1]) && /^\d{4}$/.test(parts[2]);
}
