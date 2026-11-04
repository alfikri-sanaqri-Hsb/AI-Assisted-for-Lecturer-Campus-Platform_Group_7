const STREAK_GRACE_DAYS = Number(process.env.STREAK_GRACE_DAYS) || 2; // boleh bolong maksimal 2 hari

// Tanggal hari ini dalam WIB, format YYYY-MM-DD
function toWibDate(date = new Date()) {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

// Selisih hari antara dua tanggal YYYY-MM-DD (b - a)
function diffDays(a, b) {
  const ms = new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z');
  return Math.round(ms / 86400000);
}

// dates: array tanggal aktivitas YYYY-MM-DD, urut dari yang paling lama
// today: tanggal hari ini (WIB)
function calculateStreak(dates, today) {
  if (dates.length === 0) return 0;

  const maxGap = STREAK_GRACE_DAYS + 1; // contoh: 2 hari bolong = selisih 3
  const last = dates[dates.length - 1];

  // Sudah lewat terlalu lama dari aktivitas terakhir -> streak habis
  if (diffDays(last, today) > maxGap) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const gap = diffDays(dates[i - 1], dates[i]);
    if (gap <= maxGap) {
      streak++;
    } else {
      streak = 1; // bolongnya terlalu lama, mulai dari awal
    }
  }
  return streak;
}

module.exports = { toWibDate, calculateStreak };