import express from 'express';
const router = express.Router();
import packageController from '../controllers/packageController.js';

// Define routes
router.get('/', packageController.getAllPackages);
router.post('/', packageController.createPackage);
router.put('/:packageId', packageController.updatePackage);
router.delete('/:packageId', packageController.deletePackage);

module.exports = router;