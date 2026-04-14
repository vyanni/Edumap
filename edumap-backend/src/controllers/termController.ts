import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getAllTerms = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('terms')
            .select('*');

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } 
    
    catch (error) { res.status(500).json({ message: "Error loading courses." });}
};
