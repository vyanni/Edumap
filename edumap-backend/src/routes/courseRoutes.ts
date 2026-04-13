import { Router } from 'express';
import { getCourses, getCourseById } from '../controllers/courseController';

/**
 * Course Routes:
 * 
 * The Course Routes routes and controller files are ONLY meant for retrieving specific courses
 * These routes are defined as:
 * (getElective): Courses which are part of specific elective lists (CSE-A, ECE-TE, SOCIAL-SCIENCES, etc)
 * (getAllCourses): All courses in general for user searching
 * (getCourseByID): One specific course by its ID/Course code
 *  
 * 
 */

const router = Router();

// When a GET request hits the base path (defined in server.ts), run getCourses
router.get('/', getCourses);

// When a GET request hits /:id (e.g., /SYDE-101), run getCourseById
router.get('/:id', getCourseById);

// You would add POST, PUT, DELETE here later
// router.post('/', createCourse);

export default router;