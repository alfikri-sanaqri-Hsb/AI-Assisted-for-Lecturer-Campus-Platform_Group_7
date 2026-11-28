const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { uploadSingle } = require('../middleware/upload.middleware');
const { uploadFile } = require('../controllers/upload.controller');

const router = express.Router();

router.use(authMiddleware);
router.post('/', uploadSingle, uploadFile); // POST /api/uploads?purpose=profile|material|question|tryout

module.exports = router;
