const rankingModel = require('../models/ranking.model');

// GET /api/ranking?mode=practice|tryout&limit=20
// mode kosong = gabungan latihan + tryout (perilaku lama)
async function getRanking(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const mode = req.query.mode === undefined || req.query.mode === '' ? 'all' : String(req.query.mode);

    if (!rankingModel.MODES.includes(mode)) {
      const err = new Error("Parameter mode harus 'practice' atau 'tryout'");
      err.statusCode = 400;
      throw err;
    }

    const [rows, totalUsers] = await Promise.all([
      rankingModel.getRankedUsers(mode),
      rankingModel.getTotalUsers(),
    ]);

    const ranking = rows.map((r, index) => ({
      rank: index + 1,
      user_id: r.user_id,
      full_name: r.full_name,
      major: r.major,
      points: Number(r.points),
      average_score: Number(r.average_score),
      is_me: r.user_id === req.user.id,
    }));

    const me = ranking.find((r) => r.is_me) || null;

    return res.json({
      success: true,
      message: 'Daftar ranking',
      data: {
        mode,
        total_users: totalUsers,
        my_rank: me ? me.rank : null,   // null = belum punya poin (tampilkan empty state)
        my_points: me ? me.points : 0,
        my_average_score: me ? me.average_score : 0,
        top: ranking.slice(0, limit),   // 3 pertama dipakai untuk podium
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRanking };
