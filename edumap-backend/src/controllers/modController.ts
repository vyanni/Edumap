import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

// Reusable getter for all modification types
export const getAllModifications = (table: 'options' | 'minors' | 'specializations') => 
    async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('id, label, department'); // Only fields needed for your localstorage search
        
        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: `Error fetching ${table}` });
    }
};

export const getModByID = (table: 'options' | 'minors' | 'specializations') => 
    async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching details" });
    }
};