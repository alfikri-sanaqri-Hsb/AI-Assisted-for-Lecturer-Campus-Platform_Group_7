/** Membaca dan memvalidasi body untuk materi dan video (berbasis LINK). */
const v = require('./validators');

function parseMaterialBody(body = {}) {
  return {
    subject: v.str(body.subject, 'subject', { max: 100, required: true }),
    title: v.str(body.title, 'title', { max: 255, required: true }),
    description: v.str(body.description, 'description', { max: 5000 }),
    content_url: v.url(body.content_url, 'content_url', { required: true }),
    image_url: v.url(body.image_url, 'image_url'),
    estimated_minutes: v.int(body.estimated_minutes, 'estimated_minutes', { min: 0, max: 1000 }),
    sort_order: v.int(body.sort_order, 'sort_order', { min: 0, max: 100000 }),
  };
}

function parseVideoBody(body = {}) {
  return {
    subject: v.str(body.subject, 'subject', { max: 100, required: true }),
    title: v.str(body.title, 'title', { max: 255, required: true }),
    url: v.url(body.url, 'url', { required: true }),
    duration_minutes: v.int(body.duration_minutes, 'duration_minutes', { min: 0, max: 1000 }),
    sort_order: v.int(body.sort_order, 'sort_order', { min: 0, max: 100000 }),
    is_published: v.bool(body.is_published, 'is_published', 0),
  };
}

function parseMentorBody(body = {}) {
  return {
    name: v.str(body.name, 'name', { max: 100, required: true }),
    photo_url: v.url(body.photo_url, 'photo_url'),
    university: v.str(body.university, 'university', { max: 100 }),
    major: v.str(body.major, 'major', { max: 100 }),
    bio: v.str(body.bio, 'bio', { max: 5000 }),
    subjects: v.str(body.subjects, 'subjects', { max: 255 }),
    group_url: v.url(body.group_url, 'group_url'),
    is_featured: v.bool(body.is_featured, 'is_featured', 0),
    is_active: v.bool(body.is_active, 'is_active', 1),
    user_id: body.user_id === undefined || body.user_id === null || body.user_id === ''
      ? null : v.int(body.user_id, 'user_id', { min: 1, required: true }),
  };
}

function parseSessionBody(body = {}) {
  return {
    mentor_id: v.int(body.mentor_id, 'mentor_id', { min: 1, required: true }),
    title: v.str(body.title, 'title', { max: 150, required: true }),
    starts_at: v.dateTime(body.starts_at, 'starts_at'),
    duration_minutes: v.int(body.duration_minutes, 'duration_minutes', { min: 1, max: 600, fallback: 60 }),
    meeting_url: v.url(body.meeting_url, 'meeting_url'),
    is_active: v.bool(body.is_active, 'is_active', 1),
  };
}

module.exports = { parseMaterialBody, parseVideoBody, parseMentorBody, parseSessionBody };
