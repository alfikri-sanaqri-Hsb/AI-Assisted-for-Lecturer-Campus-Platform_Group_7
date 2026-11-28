/**
 * Cek "tanda tangan" (byte awal) file. Tipe file yang dikirim klien (mimetype/ekstensi) bisa dipalsukan,
 * jadi isi file dicocokkan dengan byte aslinya sebelum diunggah.
 */
const KINDS = {
  jpeg: { resource: 'image', ext: ['.jpg', '.jpeg'], test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  png: { resource: 'image', ext: ['.png'], test: (b) => b.length > 7 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  webp: { resource: 'image', ext: ['.webp'], test: (b) => b.length > 11 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
  pdf: { resource: 'raw', ext: ['.pdf'], test: (b) => b.subarray(0, 5).toString() === '%PDF-' },
  docx: { resource: 'raw', ext: ['.docx', '.pptx'], test: (b) => b.length > 3 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04 },
  doc: { resource: 'raw', ext: ['.doc'], test: (b) => b.length > 7 && b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) },
};

const IMAGE_ONLY = ['jpeg', 'png', 'webp'];

// Mengembalikan { kind, resource, ext } atau null kalau isi file bukan tipe yang diizinkan
function detect(buffer, originalName = '') {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return null;
  const name = String(originalName).toLowerCase();
  const dot = name.lastIndexOf('.');
  const ext = dot >= 0 ? name.slice(dot) : '';
  for (const [kind, def] of Object.entries(KINDS)) {
    if (def.test(buffer) && def.ext.includes(ext)) return { kind, resource: def.resource, ext };
  }
  return null;
}

module.exports = { detect, IMAGE_ONLY, KINDS };
