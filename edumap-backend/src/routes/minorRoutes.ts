import { Router } from 'express';
import { getAllMinors, getMinorsByID, createMinor, updateMinor } from '../controllers/minorsController.js';

const router = Router();

// Minors
router.get('/', getAllMinors);
router.get('/:id', getMinorsByID);
router.post('/', createMinor);
router.put('/:id', updateMinor);


export default router;