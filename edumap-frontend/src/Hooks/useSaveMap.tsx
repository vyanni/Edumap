import { supabase } from '../Authentication/supabaseClient.js';
import { useEffect, useRef, useState } from 'react';

export function useAutosave(userId: string | undefined, nodes: any[], edges: any[]) {
    const isFirstRender = useRef(true);
    const [saveStatus, setSaveStatus] = useState<string>("Up to date");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // 1. Skip the very first render so we don't save a blank map immediately
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // 2. If no user is logged in, or the map is empty, do nothing
        if (!userId || nodes.length === 0) return;

        // 3. Set UI to "Saving..."
        setIsSaving(true);
        setSaveStatus("Saving...");

        // 4. Start the 1.5-second countdown timer
        const timer = setTimeout(async () => {
            try {
                await saveMapState(userId, nodes, edges);
                setSaveStatus(`Saved at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
            } catch (error) {
                setSaveStatus("Failed to save.");
            } finally {
                setIsSaving(false);
            }
        }, 1500);

        // 5. Cleanup: If the user moves a node before 1.5s is up, cancel the timer and restart it.
        return () => clearTimeout(timer);
        
    }, [nodes, edges, userId]); // <-- Watch these for changes

    // Return the status so you can display it in the UI!
    return { saveStatus, isSaving };
}

async function getAuthHeaders() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export async function saveMapState(userId: string, nodes: any[], edges: any[]) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;
        const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // This satisfies your (req as any).user.id check
            },
            body: JSON.stringify({ nodes, edges })
        });

        if (!response.ok) throw new Error('Failed to save map');
        return await response.json();
    } catch (error) {
        console.error("Save Error:", error);
    }
}

export async function saveSettings(userId: string, settings: any) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/${userId}/settings`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(settings)
        });
        return await response.json();
    } catch (error) {
        console.error("Settings Save Error:", error);
    }
}

export async function fetchUserMap(userId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) return null;

    const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) return null;
    return await response.json(); // Returns { id, email, map_nodes, map_edges, ... }
}