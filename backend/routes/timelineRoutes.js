const express = require('express');
const { getTimelinePosts } = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getTimelinePosts);

module.exports = router;
