import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getAllOptions = async (req: Request, res: Response) => {
    try {
        const { faculty } = req.query;

        let query = supabase
            .from('options')
            .select('id, label, faculty');

        if (faculty) {
            query = query.eq('faculty', faculty);
        }

        const { data, error } = await query;

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: "Error fetching options" });
    }
};

export const getOptionsByID = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('options')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } 
    
    catch (error) { res.status(500).json({ message: "Error fetching option." }); }
};

export const createOption = async (req: Request, res: Response) => {
    try{
        const { data, error } = await supabase
            .from('options')
            .insert(req.body).select();
        
        if (error) return res.status(400).json(error);
        res.status(201).json(data);
    }

    catch (error) { res.status(500).json({ message: "Error creating details" }); }
};

export const updateOption =  async (req: Request, res: Response) => {
    try{    
        const { data, error } = await supabase
            .from('options')
            .update(req.body)
            .eq('id', req.params.id).select();

        if (error) return res.status(400).json(error);
        res.json(data);
    }
    
    catch (error) { res.status(500).json({ message: "Error updating option" }); }
};