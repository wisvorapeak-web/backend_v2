const express = require('express');
const router = express.Router();
const controller = require('../controllers/sitecontent.controller');

router.get('/:section', controller.getBySection);
router.put('/:section', controller.updateBySection);

module.exports = router;
