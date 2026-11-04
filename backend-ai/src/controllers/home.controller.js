const homeModel = require('../models/home.model');
const progressModel = require('../models/progress.model');
const practiceModel = require('../models/practice.model');
const videoModel = require('../models/video.model');
const { toWibDate, calculateStreak } = require('../utils/streak');

const DAILY_QUESTION_TARGET = 10;
const DAILY_VIDEO_TARGET = 3;

const PROMO = {
  title: 'SNBT 2026 Terbaru',
  headline: 'Kuasai Materi dengan Mentoring Live Interaktif',
  price: 65000,
  features: [
    'Mentoring live 2x per minggu',
    'Pembahasan soal dan review materi',
    'Strategi dan tips tembus kampus impian',
  ],
};

// Mengubah jadwal menjadi label seperti di desain: "Besok, 10:00 WIB" atau "Sisa 3 Hari Lagi"
function formatSchedule(row, today) {
  const startsAt = new Date(row.starts_at);
  const startDate = toWibDate(startsAt);
  const daysLeft = Math.round(
    (new Date(startDate + 'T00:00:00Z') - new Date(today + 'T00:00:00Z')) / 86400000
  );
  const time = startsAt
    .toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
    .replace('.', ':');

  let label;
  if (daysLeft <= 0) label = `Hari ini, ${time} WIB`;
  else if (daysLeft === 1) label = `Besok, ${time} WIB`;
  else label = `Sisa ${daysLeft} Hari Lagi`;

  return {
    id: row.id,
    type: row.type,
    title: row.title,
    starts_at: startsAt.toISOString(),
    label,
  };
}

// GET /api/home
async function getHome(req, res, next) {
  try {
    const userId = req.user.id;
    const today = toWibDate();

    const [
      user,
      totalPoints,
      activityDates,
      subjectProgress,
      lastMaterial,
      recentAttempts,
      schedules,
      testimonials,
      practiceToday,
      videosToday,
    ] = await Promise.all([
      homeModel.getUserSummary(userId),
      progressModel.getTotalPoints(userId),
      progressModel.getActivityDates(userId),
      progressModel.getSubjectProgress(userId),
      homeModel.getLastCompletedMaterial(userId),
      homeModel.getRecentAttempts(userId),
      homeModel.getUpcomingSchedules(),
      homeModel.getTestimonials(),
      practiceModel.countPracticeOn(userId, today),
      videoModel.countWatchedOn(userId, today),
    ]);

    const streakDays = calculateStreak(activityDates, today);

    // Lanjutkan Belajar: subtes dari materi terakhir yang diselesaikan
    let continueLearning = null;
    if (lastMaterial) {
      const subject = subjectProgress.find((s) => s.subject === lastMaterial.subject);
      if (subject) {
        const total = Number(subject.materials_total);
        const completed = Number(subject.materials_completed);
        continueLearning = {
          subject: subject.subject,
          last_material_title: lastMaterial.title,
          progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      }
    }

    // Jawaban tryout hari ini ditambah latihan hari ini
    const tryoutAnsweredToday = recentAttempts
      .filter((a) => toWibDate(new Date(a.submitted_at)) === today)
      .reduce((sum, a) => sum + Number(a.answered), 0);
    const questionsToday = tryoutAnsweredToday + practiceToday;

    const dailyMissions = [
      {
        id: 'latihan_soal',
        title: 'Kerjakan 10 Soal Latihan',
        progress: Math.min(questionsToday, DAILY_QUESTION_TARGET),
        target: DAILY_QUESTION_TARGET,
        is_done: questionsToday >= DAILY_QUESTION_TARGET,
      },
      {
        id: 'tonton_video',
        title: 'Tonton 3 Video Materi',
        progress: Math.min(videosToday, DAILY_VIDEO_TARGET),
        target: DAILY_VIDEO_TARGET,
        is_done: videosToday >= DAILY_VIDEO_TARGET,
      },
    ];

    return res.json({
      success: true,
      message: 'Data halaman home',
      data: {
        user: {
          full_name: user ? user.full_name : null,
          email: user ? user.email : null,
          major: user ? user.major : null,
          university: user ? user.university : null,
          profile_picture: user ? user.profile_picture : null,
          is_premium: user ? Boolean(user.is_premium) : false,
        },
        points: totalPoints,
        streak_days: streakDays,
        continue_learning: continueLearning,
        daily_missions: dailyMissions,
        promo: PROMO,
        schedules: schedules.map((s) => formatSchedule(s, today)),
        testimonials: testimonials.map((t) => ({
          id: t.id,
          name: t.name,
          university: t.university,
          message: t.message,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHome };