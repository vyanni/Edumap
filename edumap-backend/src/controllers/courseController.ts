import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*');

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } 
    
    catch (error) { res.status(500).json({ message: "Error loading courses." });}
};

export const getCourseByID = async (req: Request, res: Response) => {
    try {
        const courseID = req.params.id;
            const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseID)
            .single();

        if(error)res.status(400).json({error: error.message});
        res.status(200).json({data});
    } 
    
    catch (error) { res.status(500).json({ message: "Error fetching course." }); }
};

export const getElectives = async(req: Request, res: Response) => {
    try{
        const courseList = req.params.electiveList;

        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('list', courseList);

        if(error) res.status(400).json({error: error.message});
        res.status(200).json({data});
    } 
    
    catch(error){ res.status(500).json({ message: "Error fetching course list." }); }
}