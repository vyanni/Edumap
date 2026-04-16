import { Router } from 'express';
import { createUser, getUserData, saveUserData, saveUserSettings } from '../controllers/userController.js';

/**
 * User Routes:
 * 
 * The User Routes routes and controller files are meant for saving user's progress on their map, adding new user, deleting an account, etc
 * These routes are defined as:
 * (getUserData): Obtaining the data on login
 * (saveUserData): Saving the nodes/edges for the map every time it changes
 * (saveUserSettings): Saving the major/minor/option/specialization for those changes, and compiling degree requirements
 */

const router = Router();

router.get('/:id', getUserData);
router.post('/', createUser);
router.put('/:id', saveUserData);
router.put('/:id/settings', saveUserSettings);

export default router;