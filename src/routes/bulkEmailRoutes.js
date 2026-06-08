const express = require('express');
const router = express.Router();
const bulkEmailController = require('../controllers/bulkEmailController');
const authMiddleware = require('../middleware/auth.middleware');

// Protect route with auth middleware (admin only)
router.post('/', authMiddleware, bulkEmailController.sendBulkEmails);

module.exports = router;
