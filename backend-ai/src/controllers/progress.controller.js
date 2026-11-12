const progressModel = require('../models/progress.model');
const { toWibDate, calculateStreak } = require('../utils/streak');

// Menggabungkan progres materi dan akurasi per subtes
function buildSubjects(progressRows, accuracyRows) {
  const accuracyMap = new Map(accuracyRows.map((r) => [r.subject, r]));

  return progressRows.map((r) => {
    const total = Number(r.materials_total);
    const completed = Number(r.materials_completed);
    const acc = accuracyMap.get(r.subject);
    const answered = acc ? Number(acc.answered) : 0;
    const correct = acc ? Number(acc.correct) : 0;

    return {
      subject: r.subject,
      materials_total: total,
      materials_completed: completed,
      progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      questions_answered: answered,
      questions_correct: correct,
      accuracy_percent: answered > 0 ? Math.round((correct / answered) * 100) : null,
    };
  });
}

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

// GET /api/progress/overview
async function getOverview(req, res, next) {
  try {
    const userId = req.user.id;

    const [totalPoints, activityDates, subjectProgress, subjectAccuracy, tryouts] =
      await Promise.all([
        progressModel.getTotalPoints(userId),
        progressModel.getActivityDates(userId),
        progressModel.getSubjectProgress(userId),
        progressModel.getSubjectAccuracy(userId),
        progressModel.getTryoutHistory(userId),
      ]);

    const streakDays = calculateStreak(activityDates, toWibDate());
    const lastActivity = activityDates.length > 0 ? activityDates[activityDates.length - 1] : null;

    const subjects = buildSubjects(subjectProgress, subjectAccuracy);

    // Kekuatan: 2 subtes dengan akurasi tertinggi
    // Perlu ditingkatkan: 2 subtes dengan akurasi terendah (tidak boleh sama dengan kekuatan)
    const ranked = subjects
      .filter((s) => s.accuracy_percent !== null)
      .sort((a, b) => b.accuracy_percent - a.accuracy_percent);
    const strengths = ranked.slice(0, 2).map((s) => s.subject);
    const improvements = ranked
      .slice()
      .reverse()
      .filter((s) => !strengths.includes(s.subject))
      .slice(0, 2)
      .map((s) => s.subject);

    return res.json({
      success: true,
      message: 'Ringkasan halaman progres',
      data: {
        summary: {
          total_points: totalPoints,
          streak_days: streakDays,
          last_activity_date: lastActivity,
        },
        tryouts: tryouts.map((t) => ({
          attempt_id: t.attempt_id,
          tryout_id: t.tryout_id,
          title: t.title,
          score: Number(t.score),
          correct_count: t.correct_count,
          total_questions: t.total_questions,
          submitted_at: t.submitted_at,
        })),
        subjects,
        strengths,
        improvements,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary, getOverview, buildSubjects };