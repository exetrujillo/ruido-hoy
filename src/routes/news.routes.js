const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth');
router.get('/', newsController.getAll);

router.get('/:id', newsController.getById);
router.post('/', authenticateToken, isAdmin, newsController.create);

module.exports = router;

module.exports = router;
