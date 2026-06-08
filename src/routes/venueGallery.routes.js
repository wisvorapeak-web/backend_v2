const express = require('express');
const router = express.Router();
const controller = require('../controllers/venueGallery.controller');

router.get('/', controller.getAll);
router.get('/venue/:venueId', controller.getByVenueId);
router.post('/', controller.create);
router.delete('/:id', controller.delete);

module.exports = router;
