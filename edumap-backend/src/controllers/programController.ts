import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';

export const getAllPrograms = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('programs')
            .select('*');

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: "Error fetching programs." });
    }
};

export const getProgramByID = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // This will be the label (e.g., "Software Engineering")
        const decodedLabel = decodeURIComponent(id);

        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .eq('label', decodedLabel) // Querying the 'label' column specifically
            .single();

        if (error) return res.status(404).json({ error: error.message });
        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: "Error fetching program." });
    }
};

export const createProgram = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('programs')
            .insert(req.body)
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.status(201).json(data);
    } catch {
        res.status(500).json({ message: "Error creating program." });
    }
};

export const updateProgram = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('programs')
            .update(req.body)
            .eq('id', id)
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: "Error updating program." });
    }
};

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