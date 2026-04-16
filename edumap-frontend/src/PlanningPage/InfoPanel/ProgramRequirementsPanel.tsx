import { useMemo } from "react";
import { type Node } from "@xyflow/react";

function MajorRequirementsPanel({activeMajor, onDragStart, allNodes, newCourses}: any){
    const missingCourses = useMemo(() => {
        if (!activeMajor) return [];

        const placedCourseIds = new Set(
            allNodes
                .filter((node: Node) => node.type === 'course')
                .map((node: Node) => node.data?.originalId)
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

    if (!activeMajor) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-400 p-4 text-center">
            <p>Please select a program to see requirements.</p>
        </div>
    );
}

    return (
    <div className={`flex flex-col items-center w-full flex-1 min-h-0`}>
        <h2 className="font-bold text-lg text-black">Missing Requirements</h2>

        <div className="w-full p-4 mt-2 mb-2 bg-gray-50 dark:bg-zinc-800 border-y border-gray-200 dark:border-zinc-700 flex justify-between items-center shrink-0">
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Total Credits:</span>
            <span className={`text-sm font-bold ${currentCredits >= activeMajor.totalUnits ? 'text-green-600' : 'text-blue-600'}`}>
                {currentCredits} / {activeMajor.totalUnits}
            </span>
        </div>
        
        <div className="w-full flex flex-col items-center gap-3 overflow-y-auto scrollbar-thin">
            {missingCourses.map((course: any) => (
                <div 
                    key={course.id}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl w-[220px] p-2 opacity-90 hover:opacity-100 cursor-grab shrink-0 transition-opacity"
                    onDragStart={(event) => onDragStart(event, course)}
                    draggable
                >
                    <div className="flex flex-col pointer-events-none">
                        <span className="text-[10px] font-bold text-red-900 dark:text-red-200">{course.data?.label}</span>
                        <span className="text-[8px] text-red-700 dark:text-red-400 font-medium truncate">{course.data?.title}</span>
                    </div>
                </div>
            ))}

            {missingCourses.length === 0 && currentCredits >= activeMajor.totalUnits && (
                <span className="text-sm p-4 text-green-600 font-bold text-center">
                    All required courses placed!
                </span>
            )}
        </div>
    </div>
    );
}

export default MajorRequirementsPanel;