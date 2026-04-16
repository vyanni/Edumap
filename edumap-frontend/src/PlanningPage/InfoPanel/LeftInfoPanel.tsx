import {useState } from "react";
import MajorRequirementsPanel from "./ProgramRequirementsPanel";
import SearchCoursesPanel from "./SearchCoursesPanel";
import DegreeCreatorPanel from "./DegreeCreatorPanel";

type PanelType = 'courseSearch' | 'majorRequirements' | 'degreePanel';

function LeftInfoPanel({newCourses, allNodes, activeMajor, allPrograms, selectedLabel, setSelectedLabel, isLoading}: any){
    const [activeView, setActiveView] = useState<PanelType>('courseSearch');

    const onDragStart = (event: React.DragEvent, courseData: any) =>{
        event.dataTransfer.setData('application/reactflow', JSON.stringify(courseData));
        event.dataTransfer.effectAllowed = 'move';
    };

    return(
        <div className={`absolute w-1/4 h-full bg-white dark:bg-black rounded-xl border-4 border-zinc-200 z-45 flex flex-col items-center gap-3`}>
            <div className={`flex border-b z-50 w-full `}>
                <button
                    onClick={() => setActiveView('courseSearch')}
                    className={`flex-1 py-2 text-xs font-medium ${activeView === 'courseSearch' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >Search</button>

                <button
                    onClick={() => setActiveView('degreePanel')}
                    className={`flex-1 py-2 text-xs font-medium ${activeView === 'degreePanel' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >Degree</button>

                <button
                    onClick={() => setActiveView('majorRequirements')}
                    className={`flex-1 py-2 text-xs font-medium ${activeView === 'majorRequirements' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >Requirements</button>
            </div>

            {activeView === 'courseSearch' && 
            <SearchCoursesPanel
                newCourses={newCourses}
                onDragStart={onDragStart}
            />}

            {activeView === 'majorRequirements' && 
            <MajorRequirementsPanel 
                activeMajor={activeMajor}
                allNodes={allNodes}
                newCourses={newCourses}
                onDragStart={onDragStart}
            />}

            {activeView === 'degreePanel' && 
            <DegreeCreatorPanel
                allPrograms={allPrograms} 
                selectedProgram={selectedLabel} 
                setSelectedProgram={setSelectedLabel} 
                isLoading={isLoading}
            />}

        </div>
    )
}

export default LeftInfoPanel