
import { useState, useMemo, useRef, useEffect, type ChangeEvent } from "react";
import allMajors from '../PlanningPage/Major&Programs.json'

function CourseSelector(){
    const [isDropDownOpen, setDropDownOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedProgram, setSelectedProgram] = useState<string>('');

    const dropDownReference = useRef<HTMLDivElement>(null);
    const allPrograms = Object.values(allMajors)

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

    return (
    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 w-full justify-center flex`}>
        <div 
            className={`relative bg-white dark:bg-[#394345] dark:border-none w-1/2 h-30 rounded-xl 
                        border-gray-300 shadow-sm p-4 border flex flex-row`}
            ref={dropDownReference}
        >
            <p className={`mt-1`}>Select your Program</p>  
            <br/> 

            <div className={`relative ml-8 w-2/3 flex flex-row mt-0`}>
                <input
                type="text"
                className={`w-full p-2 bg-white border border-gray-300 rounded-xl shadow-sm 
                    focus:outline-none focus:shadow-lg transition-all text-xs`}
                placeholder="Look for a program..."
                value={searchQuery}
                onChange={inputChange}
                onFocus={() => setDropDownOpen(true)}
                />
            
                {isDropDownOpen && (
                    <div className={`absolute z-10 w-full left-0 bottom-full mb-2 bg-white border border-gray-100 flex flex-col
                        shadow-lg max-h-60 overflow-y-auto animate-in rounded-lg fade-in slide-in-from-top-1`}>
                    
                        {filteredPrograms.length > 0 ? (
                            filteredPrograms.map((program) => (
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
    </div>
  );
}

export default CourseSelector