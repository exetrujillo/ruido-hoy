const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', categoryController.getAll);

router.post('/', authenticateToken, isAdmin, categoryController.create);

module.exports = router;

module.exports = router;
