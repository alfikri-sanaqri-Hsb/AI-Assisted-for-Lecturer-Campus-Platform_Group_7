/**
 * ALUR STATUS KONTEN (materi)
 *
 *   draft --submit--> pending_review --approve--> approved --publish--> published
 *     ^                    |                                              |
 *     +------reject--------+                    <------unpublish---------+ (kembali ke draft)
 *
 * - Mentor : membuat draft, mengajukan (submit)
 * - Admin  : approve / reject (wajib catatan) / publish / unpublish
 * Status "published" membuat is_published = 1 (itu yang dibaca aplikasi siswa).
 */
const { bad } = require('./validators');

const STATUSES = ['draft', 'pending_review', 'approved', 'published'];

const ACTIONS = {
  submit:    { from: ['draft'],          to: 'pending_review' },
  approve:   { from: ['pending_review'], to: 'approved' },
  reject:    { from: ['pending_review'], to: 'draft', needNote: true },
  publish:   { from: ['approved'],       to: 'published' },
  unpublish: { from: ['published'],      to: 'draft' },
};

/** Mengembalikan nilai baru yang harus ditulis, atau melempar 400/409 */
function transition(current, action, note) {
  const rule = ACTIONS[action];
  if (!rule) throw bad(`aksi tidak dikenal: ${action}`);
  if (!rule.from.includes(current)) {
    throw bad(`Materi berstatus "${current}" tidak bisa di-${action}`, 409);
  }
  const reviewNote = note === undefined || note === null ? '' : String(note).trim();
  if (rule.needNote && reviewNote === '') throw bad('review_note wajib diisi saat menolak');
  return {
    status: rule.to,
    isPublished: rule.to === 'published' ? 1 : 0,
    // reject menyimpan catatan; submit membersihkan catatan lama; aksi lain tidak mengubah
    reviewNote: action === 'reject' ? reviewNote : action === 'submit' ? null : undefined,
    markReviewed: ['approve', 'reject', 'publish'].includes(action),
  };
}

module.exports = { STATUSES, ACTIONS, transition };
