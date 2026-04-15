import { type Request, type Response, type NextFunction } from 'express';
import { supabase } from '../database/dbClient.js';

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "No authorization header provided" });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        (req as any).user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: "Authentication server error" });
    }
};