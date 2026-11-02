const feedbackModel = require('../models/feedback.model');

const TOPICS = ['materi', 'tryout', 'progress', 'kesalahan', 'lainnya'];

async function createFeedback(req, res, next) {
  try {
    const topic = req.body.topic;
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

    if (!TOPICS.includes(topic)) {
      return res.status(400).json({ success: false, message: 'Topik saran tidak valid' });
    }
    if (message.length < 5 || message.length > 1000) {
      return res.status(400).json({ success: false, message: 'Saran harus 5 sampai 1000 karakter' });
    }

    const id = await feedbackModel.insertFeedback(req.user.id, topic, message);
    return res.status(201).json({
      success: true,
      message: 'Terima kasih, saran kamu sudah terkirim',
      data: { id, topic, message },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createFeedback };