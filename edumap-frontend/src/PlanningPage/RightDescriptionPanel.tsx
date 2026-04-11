import { type Node } from "@xyflow/react";

function RightDescriptionPanel({selectedNode}: {selectedNode: Node | null}){
    if(!selectedNode) return null;
    if(selectedNode.type === 'term') return null;

    return(
        <div className={`absolute w-1/6 h-2/3 bg-white dark:bg-black rounded-xl right-8 border border-zinc-300 z-45 flex flex-col mt-28 gap-3`}>
            <h2 className={`text-xl p-4 text-black`}>{selectedNode.data.label as string}</h2>
                <br/>
            <h3 className={`text-sm -mt-8`}>{selectedNode.data.title as string}</h3>
            <p className={`text-xs -mt-2`}>{selectedNode.data.credits as number} Credits</p>

            <div className="mt-4 w-full justify-start right-0 flex flex-col">
                <div className={`m-4 flex flex-col justify-start`}>
                    <p className="text-sm font-semibold text-gray-500">Prerequisites:</p>
                    <p className="text-xs">
                        {Array.isArray(selectedNode.data.prerequisiteLabels) && selectedNode.data.prerequisiteLabels.length > 0 
                            ? selectedNode.data.prerequisiteLabels.join(', ') 
                            : 'None'}
                    </p>
                </div>

                <br/>

                <div className={`m-4`}>
                    <p className="text-sm font-semibold text-gray-500">Antirequisites:</p>
                    <p className="text-xs">
                        {Array.isArray(selectedNode.data.antirequisiteLabels) && selectedNode.data.antirequisiteLabels.length > 0 
                            ? selectedNode.data.antirequisiteLabels.join(', ') 
                            : 'None'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RightDescriptionPanel