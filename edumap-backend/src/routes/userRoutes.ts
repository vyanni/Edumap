import { Router } from 'express';
import { getAllCourses, getCourseByID, getElectives} from '../controllers/courseController.ts';

/**
 * User Routes:
 * 
 * The User Routes routes and controller files are meant for saving user's progress on their map, adding new user, deleting an account, etc
 * These routes are defined as:
 * (getElectives): Courses which are part of specific elective lists (CSE-A, ECE-TE, SOCIAL-SCIENCES, etc) GET Request
 * (getAllCourses): All courses in general for user searching | GET Request
 * (getCourseByID): One specific course by its ID/Course code | GET Request
 */

const router = Router();

// When a GET request hits the base path (defined in server.ts), run getCourses
router.get('/', getAllCourses);
router.get('/:id', getCourseByID);
router.get('/:electives', getElectives);
//router.post('/:create', createCourse);
//router.put('/update', updateCourse);

export default router;