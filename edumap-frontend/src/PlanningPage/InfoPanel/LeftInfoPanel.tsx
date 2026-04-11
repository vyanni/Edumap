import { useMemo, useState } from "react";
import majorData from '../Major&Programs.json';
import MajorRequirementsPanel from "./MajorRequirementsPanel";
import SearchCoursesPanel from "./SearchCoursesPanel";

type PanelType = 'courseSearch' | 'majorRequirements';

function LeftInfoPanel({newCourses, allNodes}: any){
    const [activeView, setActiveView] = useState<PanelType>('courseSearch');

    const onDragStart = (event: React.DragEvent, courseData: any) =>{
        event.dataTransfer.setData('application/reactflow', JSON.stringify(courseData));
        event.dataTransfer.effectAllowed = 'move';
    };

    const activeMajor = majorData?.[0];

    const missingCourses = useMemo(() => {
        if (!activeMajor) return [];

        const placedCourseIds = new Set(
            allNodes
                .filter(node => node.type === 'course')
                .map(node => node.data?.originalId)
        );

        return newCourses.filter((course: any) => {
            const isRequired = activeMajor.requiredCourses?.includes(course.id);
            const isPlaced = placedCourseIds.has(course.id);
            
            return isRequired && !isPlaced;
        });
    }, [newCourses, allNodes, activeMajor]);

    const currentCredits = useMemo(() => {
        return allNodes
            .filter((node: any) => node.type === 'course')
            .reduce((total: number, node: any) => {
                return total + (Number(node.data?.credits) || 0); 
            }, 0);
    }, [allNodes]);

    return(
        <div className={`absolute w-1/5 h-full bg-white dark:bg-black rounded-xl border-4 border-zinc-200 z-45 flex flex-col items-center gap-3`}>
            <div className={`flex border-b z-50 w-full `}>
                <button
                    onClick={() => setActiveView('courseSearch')}
                    className={`flex-1 py-2 text-sm font-medium ${activeView === 'courseSearch' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >Search</button>

                <button
                    onClick={() => setActiveView('majorRequirements')}
                    className={`flex-1 py-2 text-sm font-medium ${activeView === 'majorRequirements' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >Major</button>
            </div>

            {activeView === 'courseSearch' && 
            <SearchCoursesPanel
                newCourses={newCourses}
                onDragStart={onDragStart}
            />}

            {activeView === 'majorRequirements' && 
            <MajorRequirementsPanel 
                currentCredits={currentCredits}
                activeMajor={activeMajor}
                missingCourses={missingCourses}
                onDragStart={onDragStart}
            />}

        </div>
    )
}

export default LeftInfoPanel