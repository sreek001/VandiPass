/**
 * VandiPass Bitmap Encoder/Decoder
 * Encodes a student photo as a 32×32 4-bit grayscale bitmap (~512 bytes)
 * so it can be embedded directly inside the QR code payload.
 */

const W = 32;
const H = 32;

/** Encode an HTMLImageElement or ImageData into a base64 4-bit bitmap string */
export function encodePhotoToBase64(source: HTMLImageElement | HTMLCanvasElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0, W, H);
  const imageData = ctx.getImageData(0, 0, W, H);
  return encodeImageDataTo4Bit(imageData);
}

function encodeImageDataTo4Bit(imageData: ImageData): string {
  const { data } = imageData; // RGBA flat array
  const pixels = W * H; // 1024 pixels
  const nibbles = new Uint8Array(pixels / 2); // 2 nibbles per byte → 512 bytes

  for (let i = 0; i < pixels; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    // Luminance → 4-bit value (0–15)
    const luma = Math.round((0.299 * r + 0.587 * g + 0.114 * b) / 16);
    const clamped = Math.min(15, Math.max(0, luma));
    if (i % 2 === 0) {
      nibbles[i >> 1] = clamped << 4;
    } else {
      nibbles[i >> 1] |= clamped;
    }
  }

  // Convert to base64
  let binary = '';
  for (let i = 0; i < nibbles.length; i++) {
    binary += String.fromCharCode(nibbles[i]);
  }
  return btoa(binary);
}

/** Render a base64 4-bit bitmap onto a canvas element */
export function render4BitBitmapToCanvas(base64: string, canvas: HTMLCanvasElement): void {
  try {
    const binary = atob(base64);
    const nibbles = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      nibbles[i] = binary.charCodeAt(i);
    }

    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(W, H);

    for (let i = 0; i < W * H; i++) {
      const byte = nibbles[i >> 1];
      const nibble = i % 2 === 0 ? (byte >> 4) & 0xf : byte & 0xf;
      const val = Math.round((nibble / 15) * 255);
      imgData.data[i * 4] = val;
      imgData.data[i * 4 + 1] = val;
      imgData.data[i * 4 + 2] = val;
      imgData.data[i * 4 + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // silently ignore if bitmap is malformed
  }
}
