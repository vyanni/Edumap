import '@xyflow/react/dist/style.css'
import  {Background, 
        BackgroundVariant, 
        Controls, 
        ReactFlow, 
        ReactFlowProvider} from '@xyflow/react'
import { useEdgeLogic} from '../Hooks/useEdgeLogic.tsx';
import { useState } from 'react';
import '../index.css'

import { useOnDropCourse, useOnHandleNodeDragStop, useOnNodesDelete } from './ReactFlowNodeLogic';
import { useAutosave } from '../Hooks/useSaveMap.tsx';

function NodeCourseMap({setSelectedNode, allNodes, setNodes, onChangeNodes, nodeTypes, userId}: any){
    const [activeNodeID, setActiveNodeID] = useState<string | null>(null);

    const onNodesDelete = useOnNodesDelete(setNodes);
    const onDropCourse = useOnDropCourse(setNodes);
    const handleNodeDragStop = useOnHandleNodeDragStop(setNodes);

    const{ styledEdges, onChangeEdges, connectNodes } = useEdgeLogic(allNodes, activeNodeID);

    const { saveStatus, isSaving } = useAutosave(userId, allNodes, styledEdges);

    return (
        <div className={`h-full`}>

            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 text-xs text-gray-500 font-medium">
                 {isSaving && <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />}
                 {saveStatus}
            </div>

            <ReactFlow
                nodes = {allNodes}
                edges = {styledEdges}
                deleteKeyCode={["Backspace", "Delete"]}
                onNodesDelete={onNodesDelete}
                onDragOver={(event) => event.preventDefault()}
                onDrop={onDropCourse}
                onNodesChange={onChangeNodes}
                onNodeDragStart={(_, node) => setActiveNodeID(node.id)}
                onNodeDragStop={(_, node) => handleNodeDragStop(node)}
                onEdgesChange={onChangeEdges}
                onConnect={connectNodes}
                nodeTypes={nodeTypes}

                onNodeClick={(_, node) => {setActiveNodeID(node.id); setSelectedNode(node)}}
                onPaneClick={() => {setActiveNodeID(null); setSelectedNode(null)}}

                fitView
                proOptions={{ hideAttribution: true }}

                zoomOnPinch = {true}
                preventScrolling = {true}

                minZoom={0.5}
                maxZoom={1}
                translateExtent={[[-500, -550], [4000, 1300]]}

                snapGrid={[0.5, 0.5]}
                snapToGrid={true}
            >
                <Background 
                    variant={BackgroundVariant.Cross}
                    gap={20}
                    size={5} 
                />
                <Controls position="bottom-left" className={`z-50`} showInteractive={false} showFitView={false}/>
            </ReactFlow>
        </div>
    )
}

//export default NodeCourseMap

export default function WrappedMap({setSelectedNode, allNodes, setNodes, onChangeNodes, nodeTypes, isLoading, userId}: any){
    if(isLoading){
        return(
            <div className={`w-full h-full bg-white text-4xl text-zinc-200 flex items-center justify-center`}>
                Loading Courses...
            </div>
        )
    }
    
    return (
        <ReactFlowProvider>
            <NodeCourseMap 
                setSelectedNode={setSelectedNode} 
                allNodes={allNodes}
                setNodes={setNodes} 
                onChangeNodes={onChangeNodes} 
                nodeTypes={nodeTypes}
                userId={userId}
            ></NodeCourseMap>
        </ReactFlowProvider>
    )
}