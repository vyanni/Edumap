import { type Request, type Response } from 'express';
import { supabase } from '../database/dbClient.js';
import { loadTermsData } from '../database/localDataLoader.js';

export const getAllTerms = async (req: Request, res: Response) => {
    try {
        try {
            const { data, error } = await supabase
                .from('terms')
                .select('*');

            if (error) {
                console.warn('Supabase error, falling back to local data:', error.message);
                const localData = loadTermsData();
                return res.status(200).json(localData);
            }
            
            return res.status(200).json(data);
        } catch (supabaseError) {
            console.warn('Supabase fetch error, falling back to local data:', supabaseError);
            const localData = loadTermsData();
            return res.status(200).json(localData);
        }
    } 
    catch (error) { 
        console.error('Terms controller error:', error);
        const localData = loadTermsData();
        res.status(200).json(localData);
    }
};
