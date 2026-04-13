import { Router } from 'express';
import { getAllModifications, getModByID } from '../controllers/modController.ts';

const router = Router();

// Options
router.get('/options', getAllModifications('options'));
router.get('/options/:id', getModByID('options'));

// Minors
router.get('/minors', getAllModifications('minors'));
router.get('/minors/:id', getModByID('minors'));

// Specializations
router.get('/specializations', getAllModifications('specializations'));
router.get('/specializations/:id', getModByID('specializations'));

export default router;