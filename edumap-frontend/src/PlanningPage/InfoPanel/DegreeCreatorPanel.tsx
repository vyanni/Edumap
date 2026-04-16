
import { useState, useMemo, useRef, useEffect, type ChangeEvent } from "react";
import { saveProgramSettings } from "../../Hooks/useSaveMap";

function DegreeCreatorPanel({allPrograms, selectedProgram, setSelectedProgram, isLoading}: any){
    const [isDropDownOpen, setDropDownOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const dropDownReference = useRef<HTMLDivElement>(null);

    const filteredPrograms = useMemo(() => {
        return allPrograms.filter((programName: any) => 
            programName?.label?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allPrograms]);

    useEffect(() => {
        const clickOutside = (event: MouseEvent) => {
            if(dropDownReference.current && !dropDownReference.current.contains(event.target as Node)){
                setDropDownOpen(false);
            }
        };

        document.addEventListener('mousedown', clickOutside);

        return () => document.removeEventListener('mousedown', clickOutside);
    }, []);

    const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setDropDownOpen(true);
    };

    const handleSelection = (program: string)  => {
        setSelectedProgram(program);
        setSearchQuery(program);
        setDropDownOpen(false);
    };

    // function handleMajorChange(newMajor: string) {
    //     setMajor(newMajor); // Update your local UI state
    //     saveProgramSettings({ major: newMajor, minor: currentMinor, etc }); // Save immediately
    // }

    return (
    <div className={`flex flex-col items-center w-full flex-1 min-h-0 gap-2`} ref={dropDownReference}>
            <p className={`mt-1`}>Select your Program</p>  
            <br/> 

            <div className={`relative mx-4 w-2/3 flex flex-row mt-0`} ref={dropDownReference}>
                <input
                type="text"
                className={`w-full p-2 bg-white border border-gray-300 rounded-xl shadow-sm 
                    focus:outline-none focus:shadow-lg transition-all text-xs`}
                placeholder={isLoading ? "Loading programs..." : "Look for a program..."}
                value={searchQuery}
                onChange={inputChange}
                onFocus={() => setDropDownOpen(true)}
                />
            
                {isDropDownOpen && (
                    <div className={`absolute z-10 w-full left-0 top-full mt-2 bg-white border border-gray-100 flex flex-col
                        shadow-lg max-h-60 overflow-y-auto animate-in rounded-lg fade-in slide-in-from-top-1`}>
                    
                        {filteredPrograms.length > 0 ? (
                            filteredPrograms.map((program: any) => (
                                <button 
                                    key={program.label}
                                    className={`w-full text-center text-sm transition-colors
                                        ${selectedProgram === program.label ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}
                                        cursor-pointer`}
                                    onClick={() => handleSelection(program.label)}
                                > {program.label} 
                                </button>
                            ))
                        ) : (
                        <div className={`text-xs text-gray-400 text-center`}> No Programs Found </div>
                        )}
                    </div>
                )}
            </div>
    </div>
  );
}

export default DegreeCreatorPanel