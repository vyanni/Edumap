import { type Request, type Response, type NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "No authorization header provided" });
        }

        const token = authHeader.split(' ')[1];

        // 🔑 Create a request-scoped Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
            console.error("AUTH ERROR:", error);
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Attach BOTH user and client
        (req as any).user = data.user;
        (req as any).supabase = supabase;

        next();
    } catch (error) {
        console.error("AUTH MIDDLEWARE CRASH:", error);
        res.status(500).json({ error: "Authentication server error" });
    }
};