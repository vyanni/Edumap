import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

/**
 * GET ALL COURSES (search + filters)
 */
export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const { list, fields} = req.query;

        let query = supabase.from('courses');

        // Field selection
        if (fields === 'basic') {
            query = query.select('id, label');
        } else {
            query = query.select('*');
        }

        // Filter by elective list
        if (list) {
            query = query.contains('eligibleLists', [list]);
        }

        const { data, error } = await query;

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: "Error loading courses." });
    }
};

export const getCourseByID = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return res.status(404).json({ error: error.message });

        res.status(200).json(data);
    } catch {
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