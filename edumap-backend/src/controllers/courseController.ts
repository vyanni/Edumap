import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';
import { loadCoursesData, getCourseById, filterCoursesByList } from '../database/localDataLoader.js';

/**
 * GET ALL COURSES (search + filters)
 */
export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const { list, fields} = req.query;

        try {
            let query = supabase.from('courses').select('*');

            // Filter by elective list
            if (list) {
                query = query.filter('eligibleLists', 'cs', `["${list}"]`) as any;
            }

            const { data, error } = await query;

            if (error) throw error;
            
            // Apply field selection to response
            let result = data;
            if (fields === 'basic' && result) {
                result = result.map(c => ({ id: c.id, label: c.label }));
            }
            
            return res.status(200).json(result);
        } catch (supabaseError) {
            console.warn('Supabase error, falling back to local data:', supabaseError);
            let courses = loadCoursesData();
            
            // Apply filters from local data
            if (list) {
                courses = filterCoursesByList(list as string);
            }
            
            if (fields === 'basic') {
                courses = courses.map(c => ({ id: c.id, label: c.data?.label }));
            }
            
            return res.status(200).json(courses);
        }
    } catch (error) {
        console.error('getAllCourses error:', error);
        const localData = loadCoursesData();
        res.status(200).json(localData);
    }
};

export const getCourseByID = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return res.status(200).json(data);
        } catch (supabaseError) {
            console.warn('Supabase error, falling back to local data:', supabaseError);
            const course = getCourseById(id as string);
            if (course) {
                return res.status(200).json(course);
            }
            return res.status(404).json({ error: `Course ${id} not found` });
        }
    } catch (error) {
        console.error('getCourseByID error:', error);
        res.status(500).json({ message: "Error fetching course." });
    }
};


/**
 * CREATE COURSE
 */
export const createCourse = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .insert(req.body)
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.status(201).json(data);
    } catch {
        res.status(500).json({ message: "Error creating course." });
    }
};


/**
 * UPDATE COURSE
 */
export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('courses')
            .update(req.body)
            .eq('id', id)
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: "Error updating course." });
    }
};