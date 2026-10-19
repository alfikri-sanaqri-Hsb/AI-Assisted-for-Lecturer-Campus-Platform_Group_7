const progressModel = require('../models/progress.model');
const { toWibDate, calculateStreak } = require('../utils/streak');

// GET /api/progress/summary
async function getSummary(req, res, next) {
  try {
    const userId = req.user.id;

    const [totalPoints, activityDates] = await Promise.all([
      progressModel.getTotalPoints(userId),
      progressModel.getActivityDates(userId),
    ]);

    const streakDays = calculateStreak(activityDates, toWibDate());
    const lastActivity = activityDates.length > 0 ? activityDates[activityDates.length - 1] : null;

    return res.json({
      success: true,
      message: 'Ringkasan progres',
      data: {
        total_points: totalPoints,
        streak_days: streakDays,
        last_activity_date: lastActivity,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };