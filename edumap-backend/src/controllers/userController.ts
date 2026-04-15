import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getUserData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const authenticatedUserId = (req as any).user.id;
        if (id !== authenticatedUserId) {
            return res.status(403).json({ message: "Unauthorized access to profile." });
        }

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: "Error loading user data" });
    }
};

export const saveUserData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nodes, edges } = req.body;

        const authenticatedUserId = (req as any).user.id;
        if (id !== authenticatedUserId) {
            return res.status(403).json({ message: "Unauthorized access to profile." });
        }

        const { error } = await supabase
            .from('user_profiles')
            .update({
                map_nodes: nodes,
                map_edges: edges,
                updated_at: new Date()
            })
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Saved successfully" });
    } catch {
        res.status(500).json({ message: "Error saving user data" });
    }
};

export const saveUserSettings = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { majorId, minorId, optionId, specId } = req.body;

        const authenticatedUserId = (req as any).user.id;
        if (id !== authenticatedUserId) {
            return res.status(403).json({ message: "Unauthorized access to profile." });
        }

        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
                majorId,
                minorId,
                optionId,
                specId,
                updated_at: new Date()
            })
            .eq('id', id);

        if (updateError) {
            return res.status(400).json({ error: updateError.message });
        }

        // 2. Fetch all requirement objects in parallel
        const [majorRes, minorRes, optionRes, specRes] = await Promise.all([
            supabase.from('programs').select('*').eq('id', majorId).single(),
            minorId ? supabase.from('minors').select('*').eq('id', minorId).single() : null,
            optionId ? supabase.from('options').select('*').eq('id', optionId).single() : null,
            specId ? supabase.from('specializations').select('*').eq('id', specId).single() : null,
        ]);

        // 3. Compile requirements
        const compiledRequirements = {
            major: majorRes.data,
            minor: minorRes?.data || null,
            option: optionRes?.data || null,
            specialization: specRes?.data || null,
            lastCalculated: new Date().toISOString()
        };

        // (optional but smart) save compiled version
        await supabase
            .from('user_profiles')
            .update({ degreeReq: compiledRequirements })
            .eq('id', id);

        // 4. Return to frontend
        res.status(200).json({ requirements: compiledRequirements });

    } catch {
        res.status(500).json({ message: "Error saving user settings" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = (req as any).user.id;

        const { data, error } = await supabase
            .from('user_profiles')
            .upsert({
                id: authenticatedUserId, 
                email: req.body.email 
            }, { onConflict: 'id' })
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.status(201).json(data);
    } catch {
        res.status(500).json({ message: "Error creating user." });
    }
};