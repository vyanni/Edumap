import { type Request, type Response } from 'express';

export const getUserData = async (req: Request, res: Response) => {
    const supabase = (req as any).supabase;
    try {
        const { id } = req.params;
        const authenticatedUserId = (req as any).user?.id;

        if (!authenticatedUserId) {
            return res.status(401).json({ message: "Missing or invalid auth token" });
        }
        if (id !== authenticatedUserId) {
            return res.status(403).json({ message: "Unauthorized access to profile." });
        }

        let { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        console.log("User ID:", (req as any).user?.id);
        console.log("Supabase exists:", !!(req as any).supabase);
        
        if (error) throw error;

        if (!data) {
            const { data: newUser, error: createError } = await supabase
                .from('user_profiles')
                .insert({ 
                    id: id, 
                    map_nodes: [], 
                    map_edges: [] 
                })
                .select()
                .single();

            if (createError) return res.status(500).json({ message: "Init failed" });
            data = newUser;
        }
        res.status(200).json(data);
    } catch(error) {
        console.error("GET USER ERROR:", error);
        res.status(500).json({ message: "Error loading user data" });
    }
};

function cleanNodes(nodes: any[] = []) {
    return nodes.map(n => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,

        draggable: n.draggable,
        selectable: n.selectable,
        parentNode: n.parentNode,
        extent: n.extent
    }));
}

function cleanEdges(edges: any[]) {
    return edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type
    }));
}

export const saveUserData = async (req: Request, res: Response) => {
    const supabase = (req as any).supabase;
    try {
        const { id } = req.params;
        const { nodes, edges } = req.body;

        const authenticatedUserId = (req as any).user.id;
        if (id !== authenticatedUserId) {
            return res.status(403).json({ message: "Unauthorized access to profile." });
        }

        const cleanN = cleanNodes(nodes);
        const cleanE = cleanEdges(edges);

        await supabase.from('user_profiles').upsert({
            id,
            map_nodes: cleanN,
            map_edges: cleanE,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        console.log("Saving:", {
            id,
            nodesType: typeof nodes,
            edgesType: typeof edges,
            nodesSample: nodes?.[0],
        });

        res.status(200).json({ message: "Saved successfully" });
    } catch (error){
        console.error("INIT ERROR:", error);
        res.status(500).json({ message: "Error saving user data" });
    }
};

export const saveUserSettings = async (req: Request, res: Response) => {
    const supabase = (req as any).supabase;
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
                major: majorId,
                minor: minorId,  
                option: optionId,
                specialization: specId,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updateError) {
            return res.status(400).json({ error: updateError.message });
        }

        const [majorRes, minorRes, optionRes, specRes] = await Promise.all([
            supabase.from('programs').select('*').eq('id', majorId).single(),
            minorId ? supabase.from('minors').select('*').eq('id', minorId).single() : null,
            optionId ? supabase.from('options').select('*').eq('id', optionId).single() : null,
            specId ? supabase.from('specializations').select('*').eq('id', specId).single() : null,
        ]);

        const compiledRequirements = {
            major: majorId, 
            minor: minorId,  
            option: optionId,
            specialization: specId,
            updated_at: new Date().toISOString()
        };

        await supabase
            .from('user_profiles')
            .update({ degree_requirements: compiledRequirements })
            .eq('id', id);

        // 4. Return to frontend
        res.status(200).json({ requirements: compiledRequirements });

    } catch(err) {
        console.error("GET USER ERROR:", err);
        res.status(500).json({ message: "Error saving user settings" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const supabase = (req as any).supabase;
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
    } catch (error){
        console.error("CREATE USER ERROR:", error);
        res.status(500).json({ message: "Error creating user." });
    }
};