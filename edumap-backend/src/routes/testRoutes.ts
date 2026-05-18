import { Router } from 'express';
import { loadTermsData, loadCoursesData, loadProgramsData } from '../database/localDataLoader.js';

const router = Router();

router.get('/test-terms', (req, res) => {
    try {
        const data = loadTermsData();
        res.json({ count: data.length, sample: data[0] });
    } catch (err) {
        res.json({ error: String(err) });
    }
});

router.get('/test-courses', (req, res) => {
    try {
        const data = loadCoursesData();
        res.json({ count: data.length, sample: data[0] });
    } catch (err) {
        res.json({ error: String(err) });
    }
});

export default router;
