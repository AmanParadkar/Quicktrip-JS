import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';

// Define routes
router.get('/', userController.getAllUsers);
router.post('/', userController.registerUser);
router.put('/:packageId', userController.updateUser);
router.delete('/:packageId', userController.deleteUser);

module.exports = router;