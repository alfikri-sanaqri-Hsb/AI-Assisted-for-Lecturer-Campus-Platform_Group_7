const mentorModel = require('../models/mentor.model');

const TZ = 'Asia/Jakarta';

function toWibDate(date) {
  return date.toLocaleDateString('en-CA', { timeZone: TZ });
}

function toWibTime(date) {
  return date.toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
}

function formatSession(row) {
  const start = new Date(row.starts_at);
  const today = toWibDate(new Date());
  const startDay = toWibDate(start);
  const diffDays = Math.round((new Date(startDay) - new Date(today)) / 86400000);

  let label;
  if (diffDays === 0) label = `Hari ini, ${toWibTime(start)} WIB`;
  else if (diffDays === 1) label = `Besok, ${toWibTime(start)} WIB`;
  else label = `Sisa ${diffDays} Hari Lagi`;

  return {
    id: row.id,
    title: row.title,
    starts_at: row.starts_at,
    duration_minutes: row.duration_minutes,
    label,
    meeting_url: row.meeting_url,
    mentor_id: row.mentor_id,
    mentor_name: row.mentor_name,
    mentor_photo: row.mentor_photo,
    group_url: row.group_url,
  };
}

function formatMentor(row) {
  return {
    id: row.id,
    name: row.name,
    photo_url: row.photo_url,
    university: row.university,
    major: row.major,
    bio: row.bio,
    subjects: row.subjects ? row.subjects.split(',').map((s) => s.trim()) : [],
    group_url: row.group_url,
    is_featured: Boolean(row.is_featured),
  };
}

async function getMentors(req, res, next) {
  try {
    const featuredOnly = req.query.featured === '1' || req.query.featured === 'true';
    const rows = await mentorModel.getMentors(featuredOnly);
    return res.status(200).json({
      success: true,
      message: 'Daftar mentor berhasil diambil',
      data: rows.map(formatMentor),
    });
  } catch (err) {
    next(err);
  }
}

async function getMentorById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'ID mentor tidak valid' });
    }

    const mentor = await mentorModel.findMentorById(id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor tidak ditemukan' });
    }

    const sessions = await mentorModel.getUpcomingSessions(10, id);
    return res.status(200).json({
      success: true,
      message: 'Detail mentor berhasil diambil',
      data: { ...formatMentor(mentor), upcoming_sessions: sessions.map(formatSession) },
    });
  } catch (err) {
    next(err);
  }
}

async function getNextSession(req, res, next) {
  try {
    const rows = await mentorModel.getUpcomingSessions(1);
    return res.status(200).json({
      success: true,
      message: 'Sesi berikutnya berhasil diambil',
      data: rows.length ? formatSession(rows[0]) : null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMentors, getMentorById, getNextSession };