const adminModel = require('../models/admin.model');

async function getDashboard(req, res, next) {
  try {
    const data = await adminModel.getDashboardSummary();
    return res.json({ success: true, message: 'Ringkasan dashboard admin', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
