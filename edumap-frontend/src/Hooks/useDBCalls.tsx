import { useEffect } from "react";

export function useGetCourses({setAllCourses, setIsLoading}: any){
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/courses');
                if (!response.ok) throw new Error('Failed to fetch');
                
                const data = await response.json();
                setAllCourses(data);
            } catch (error) {
                // console.error("Error fetching programs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, []);
}

export function useGetPrograms({setAllPrograms, setIsLoading}: any){
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/programs');
                if (!response.ok) throw new Error('Failed to fetch');
                
                const data = await response.json();
                setAllPrograms(data);
            } catch (error) {
                // console.error("Error fetching programs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, []);
}

export function useGetNewProgram({selectedProgramLabel, setActiveProgram, setIsLoading}: any){
    useEffect(() => {
        // Only fetch if we actually have a selection
        if (!selectedProgramLabel) return;

        const fetchProgramDetails = async () => {
            setIsLoading(true);
            try {
                // Use the label as the ID in the URL
                const response = await fetch(`http://localhost:8000/api/programs/${encodeURIComponent(selectedProgramLabel)}`);
                if (!response.ok) throw new Error('Failed to fetch details');
                
                const data = await response.json();
                
                // Update the OBJECT state, not the label state
                setActiveProgram(data);
            } catch (error) {
                console.error("Error fetching program details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgramDetails();
    }, [selectedProgramLabel]); // Fires whenever the selection changes
}

export function useGetTerms({setAllTerms, setIsLoading}: any){
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/terms');
                if (!response.ok) throw new Error('Failed to fetch');
                
                const data = await response.json();
                setAllTerms(data);
            } catch (error) {
                // console.error("Error fetching programs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, []);
}