import { Request, Response } from 'express';

// If you have a separate DB file, import by:
// import { supabase } from '../db/supabaseClient'; 

export const getCourses = async (req: Request, res: Response) => {
    try {
        // 1. Talk to your Database
        // const { data, error } = await supabase.from('courses').select('*');
        // if (error) throw error;

        // Mock data for this example
        const data = [
            { id: 'SYDE 101', name: 'Communications in Systems Design' },
            { id: 'SYDE 111', name: 'Calculus 1' }
        ];

        // 2. Send the successful response back to the frontend
        res.status(200).json(data);

    } catch (error) {
        // 3. Handle any errors so your server doesn't crash
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error fetching courses." });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        // Access URL parameters (e.g., /api/courses/SYDE-101)
        const courseId = req.params.id; 

        await supabase.from('courses').select('*').eq('id', courseId).single();
        
        res.status(200).json({ id: courseId, name: "Mock Course Details" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching course." });
    }
};