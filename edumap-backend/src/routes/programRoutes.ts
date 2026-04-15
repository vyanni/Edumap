import { Router } from 'express';
import {
    getAllPrograms,
    getProgramByID,
    createProgram,
    updateProgram
} from '../controllers/programController.js';

const router = Router();

router.get('/', getAllPrograms);
router.get('/:id', getProgramByID);
router.post('/create', createProgram);
router.put('/:id', updateProgram);

export default router;