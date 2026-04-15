import { Router } from 'express';
import { createCourse, getAllCourses, getCourseByID, updateCourse} from '../controllers/courseController.js';

/**
 * Course Routes:
 * The Course Routes routes and controller files are ONLY meant for retrieving specific courses
 * These routes are defined as:
 * (getAllCourses): All courses in general for user searching | GET Request OR a Query for lists Courses which are part of specific elective lists (CSE-A, ECE-TE, SOCIAL-SCIENCES, etc) GET Request
 * (getCourseByID): One specific course by its ID/Course code | GET Request
 */

const router = Router();

router.get('/', getAllCourses);        
// ?list= ?fields=
router.get('/:id', getCourseByID);
router.post('/create', createCourse);
router.put('/:id', updateCourse);

export default router;