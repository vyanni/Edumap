function LeftInfoPanel(){
    const onDragStart = (event: React.DragEvent, nodeType: string) =>{
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return(
        <div className={`absolute w-1/5 h-full bg-white dark:bg-black rounded-xl border-4 border-zinc-200 z-45`}>
            <div 
                className={`w-24 border-2 border-green-500 rounded-xl p-4 mt-24`}
                onDragStart={(event) => onDragStart(event, 'course')}
                draggable
            >Add a new course</div>
        </div>
    )
}

export default LeftInfoPanel