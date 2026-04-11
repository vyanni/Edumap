function RightDescriptionPanel({selectedCourse}: Node){
    return(
        <div className={`absolute w-1/6 h-2/3 bg-white dark:bg-black rounded-xl right-8 border border-zinc-100 z-45 flex flex-col mt-36 items-center gap-3`}>
            <h2 className={`text-lg p-4 text-black`}>{courseData.label as string}</h2>
        </div>
    )
}

export default RightDescriptionPanel