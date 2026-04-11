import { useMemo, useState } from "react";

function LeftInfoPanel({newCourses}: any){
    const [searchTerm, setSearchTerm] = useState('');

    const onDragStart = (event: React.DragEvent, courseData: any) =>{
        event.dataTransfer.setData('application/reactflow', JSON.stringify(courseData));
        event.dataTransfer.effectAllowed = 'move';
    };

    const filteredCourses = useMemo(() => {
        if(!searchTerm) return newCourses;

        return newCourses.filter((course: any) => {
            const label = course.data?.label?.toLowerCase() || '';
            const name = course.data?.name?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();

            return label.includes(search) || name.includes(search);
        });
    }, [searchTerm, newCourses]);

    return(
        <div className={`absolute w-1/5 h-full bg-white dark:bg-black rounded-xl border-4 border-zinc-200 z-45 flex flex-col items-center gap-3`}>
            <h2 className={`text-bold text-lg p-4 pt-16 text-black`}> Search your Courses</h2>

            <input 
            type='text'
            placeholder='Search a course...'
            className={`w-3/4 p-2 bg-white border border-gray-300 rounded-xl shadow-sm 
                    focus:outline-none focus:shadow-lg transition-all text-xs`}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            />

            <div className={`w-full flex flex-col items-center gap-3 overflow-y-auto scrollbar-thin`}>
                {filteredCourses.map((course: any) => (
                <div 
                    key={course.id}
                    className={`bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-[220px] group cursor-grab`}
                    onDragStart={(event) => onDragStart(event, course)}
                    draggable
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">{course.data?.label}</span>
                        <span className="text-[8px] text-zinc-500">Drag to add to schedule</span>
                    </div>
                </div>
                ))}

                {filteredCourses.length === 0 && (
                    <span className={`text-baseline p-4 pt-16`}> No Courses Found </span>
                )}
            </div>
        </div>
    )
}

export default LeftInfoPanel