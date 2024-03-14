import express from 'express';
const router = express.Router();
import bookingController from'../controllers/bookingController.js';

// Define routes
router.post('/:userId/:packageId', bookingController.bookPackage);

module.exports = router;