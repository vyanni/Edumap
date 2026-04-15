import { Router } from 'express';
import { createSpecialization, getAllSpecializations, getSpecializationsByID, updateSpecialization } from '../controllers/specializationsController.js';

const router = Router();

//Specializations
router.get('/', getAllSpecializations);
router.get('/:id', getSpecializationsByID);
router.post('/', createSpecialization);
router.put('/:id', updateSpecialization);

export default router;