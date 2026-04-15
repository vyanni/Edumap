import { Router } from 'express';
import { getAllTerms } from '../controllers/termController.js';
/**
 * Term Routes:
 * The Term routes are only used for intializing the map
 * (getAllTerms): Returns terms 1A - 4B
 */

const router = Router();

router.get('/', getAllTerms);

export default router;