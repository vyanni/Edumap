import { Router } from 'express';
import { getAllOptions, getOptionsByID, createOption, updateOption } from '../controllers/optionsController.js';

const router = Router();

//Options
router.get('/', getAllOptions);
router.get('/:id', getOptionsByID);
router.post('/', createOption);
router.put('/:id', updateOption);

export default router;