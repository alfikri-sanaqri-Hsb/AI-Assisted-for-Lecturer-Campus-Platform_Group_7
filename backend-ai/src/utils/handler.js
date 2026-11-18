// Membungkus controller async: error apa pun diteruskan ke error middleware (database error dipetakan dulu)
const { mapDbError } = require('./validators');

const handler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (err) {
    next(mapDbError(err));
  }
};

module.exports = handler;
