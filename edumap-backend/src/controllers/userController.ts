import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getUserData = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error loading user map" });
    }
};

export const saveUserProgress = async (req: Request, res: Response) => {
    try {
        const { userId, nodes, edges, settings } = req.body;
        // Upsert allows saving new or updating existing
        const { error } = await supabase
            .from('user_profiles')
            .upsert({ 
                id: userId, 
                map_nodes: nodes, 
                map_edges: edges, 
                user_settings: settings,
                updated_at: new Date() 
            });

        if (error) throw error;
        res.status(200).json({ message: "Progress saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Save failed" });
    }
};