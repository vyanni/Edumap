import '@xyflow/react/dist/style.css'
import  {Background, 
        BackgroundVariant, 
        Controls, 
        ReactFlow, 
        ReactFlowProvider} from '@xyflow/react'
import { useEdgeLogic} from '../Hooks/useEdgeLogic';
import { useState } from 'react';
import '../index.css'

import { useOnDropCourse, useOnHandleNodeDragStop, useOnNodesDelete } from './ReactFlowNodeLogic';

function NodeCourseMap({setSelectedNode, allNodes, setNodes, onChangeNodes, nodeTypes}: any){
    const [activeNodeID, setActiveNodeID] = useState<string | null>(null);

    const onNodesDelete = useOnNodesDelete(setNodes);
    const onDropCourse = useOnDropCourse(setNodes);
    const handleNodeDragStop = useOnHandleNodeDragStop(setNodes);

    const{ styledEdges, onChangeEdges, connectNodes } = useEdgeLogic(allNodes, activeNodeID);

    return (
        <div className={`h-full`}>
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

export default function WrappedMap({setSelectedNode, allNodes, setNodes, onChangeNodes, nodeTypes}: any){
    return (
        <ReactFlowProvider>
            <NodeCourseMap 
                setSelectedNode={setSelectedNode} 
                allNodes={allNodes}
                setNodes={setNodes} 
                onChangeNodes={onChangeNodes} 
                nodeTypes={nodeTypes}
            ></NodeCourseMap>
        </ReactFlowProvider>
    )
}