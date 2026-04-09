function LeftInfoPanel({newCourses}: any){
    const onDragStart = (event: React.DragEvent, courseData: any) =>{
        event.dataTransfer.setData('application/reactflow', JSON.stringify(courseData));
        event.dataTransfer.effectAllowed = 'move';
    };

    return(
        <div className={`absolute w-1/5 h-full overflow-y-auto scrollbar-thin bg-white dark:bg-black rounded-xl border-4 border-zinc-200 z-45 flex flex-col items-center gap-3`}>
            <h2 className={`text-bold text-lg p-4 pt-16 text-black`}> Search your Courses</h2>
            {newCourses.map((course: any) => (
            <div 
                key={course.id}
                className={`bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-[220px] group cursor-grab`}
                onDragStart={(event) => onDragStart(event, course)}
                draggable
            >
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">{course.data?.label}</span>
                    <span className="text-[8px] text-zinc-500">Course description or credits</span>
                </div>
            </div>
            ))};
        </div>
    )
}

export default LeftInfoPanel