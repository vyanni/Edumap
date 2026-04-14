import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getAllMinors = async (res: Response) => {
    try {
        const { data, error } = await supabase
            .from('minors')
            .select('id, label');

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } 
    
    catch (error) { res.status(500).json({ message: `Error fetching minors` }); }
};

export const getMinorsByID = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('minors')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } 
    
    catch (error) { res.status(500).json({ message: "Error fetching minor." }); }
};

export const createMinor = async (req: Request, res: Response) => {
    try{
        const { data, error } = await supabase
            .from('minors')
            .insert(req.body).select();
        
        if (error) return res.status(400).json(error);
        res.status(201).json(data);
    }

    catch (error) { res.status(500).json({ message: "Error creating details" }); }
};

export const updateMinor =  async (req: Request, res: Response) => {
    try{    
        const { data, error } = await supabase
            .from('minors')
            .update(req.body)
            .eq('id', req.params.id).select();

        if (error) return res.status(400).json(error);
        res.json(data);
    }
    
    catch (error) { res.status(500).json({ message: "Error updating minor" }); }
};