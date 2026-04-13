import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getAllPrograms = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('programs')
            .select('*');

        if(error){
            console.error("DB Error:", error);
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json(data);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add this to your programController.ts or a new requirementsController.ts
export const getDegreeRequirements = async (req: Request, res: Response) => {
    try {
        const { majorId, optionId, minorId, specId } = req.query;

        // Run all queries in parallel for speed
        const [majorRes, optionRes, minorRes, specRes] = await Promise.all([
            supabase.from('programs').select('*').eq('id', majorId).single(),
            optionId ? supabase.from('options').select('*').eq('id', optionId).single() : null,
            minorId ? supabase.from('minors').select('*').eq('id', minorId).single() : null,
            specId ? supabase.from('specializations').select('*').eq('id', specId).single() : null,
        ]);

        // Combine into one master requirement object
        const compiledRequirements = {
            major: majorRes.data,
            option: optionRes?.data || null,
            minor: minorRes?.data || null,
            specialization: specRes?.data || null,
            lastCalculated: new Date().toISOString()
        };

        res.status(200).json(compiledRequirements);
    } catch (error) {
        res.status(500).json({ message: "Failed to compile requirements" });
    }
};