import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getAllSpecializations = async (res: Response) => {
    try {
        const { data, error } = await supabase
            .from('specializations')
            .select('id, label');

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } 
    
    catch (error) { res.status(500).json({ message: `Error fetching specializations` }); }
};

export const geSpecializationsByID = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('specializations')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } 
    
    catch (error) { res.status(500).json({ message: "Error fetching specialization." }); }
};

export const createSpecialization = async (req: Request, res: Response) => {
    try{
        const { data, error } = await supabase
            .from('specializations')
            .insert(req.body).select();
        
        if (error) return res.status(400).json(error);
        res.status(201).json(data);
    }

    catch (error) { res.status(500).json({ message: "Error creating details" }); }
};

export const updateSpecialization =  async (req: Request, res: Response) => {
    try{    
        const { data, error } = await supabase
            .from('specializations')
            .update(req.body)
            .eq('id', req.params.id).select();

        if (error) return res.status(400).json(error);
        res.json(data);
    }
    
    catch (error) { res.status(500).json({ message: "Error updating specialization" }); }
};