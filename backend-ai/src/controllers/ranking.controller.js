const rankingModel = require('../models/ranking.model');

// GET /api/ranking?limit=20
async function getRanking(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

    const [rows, totalUsers] = await Promise.all([
      rankingModel.getRankedUsers(),
      rankingModel.getTotalUsers(),
    ]);

    const ranking = rows.map((r, index) => ({
      rank: index + 1,
      user_id: r.user_id,
      full_name: r.full_name,
      major: r.major,
      points: Number(r.points),
      is_me: r.user_id === req.user.id,
    }));

    const me = ranking.find((r) => r.is_me) || null;

    return res.json({
      success: true,
      message: 'Daftar ranking',
      data: {
        total_users: totalUsers,
        my_rank: me ? me.rank : null,   // null = belum punya poin (tampilkan empty state)
        my_points: me ? me.points : 0,
        top: ranking.slice(0, limit),   // 3 pertama dipakai untuk podium
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRanking };