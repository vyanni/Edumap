import '@xyflow/react/dist/style.css'
import  {Background, 
        BackgroundVariant, 
        Controls, 
        useEdgesState,
        addEdge,
        type Edge, ReactFlow, ReactFlowProvider, type Connection, MarkerType,
        useReactFlow} from '@xyflow/react'
import { useCallback } from 'react';
import useSlotsLogic from "../Hooks/useSlotsLogic";
import { usePreReqLogic } from '../Hooks/usePreReqLogic';
import { useState } from 'react';
import '../index.css'

const initialEdges: Edge[] = []

function NodeCourseMap(){
    const {allNodes, nodeTypes, setNodes, onChangeNodes, handleNodeDragStop} = useSlotsLogic();
    const [allEdges, setEdges, onChangeEdges] = useEdgesState(initialEdges);
   
    const connectNodes = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const [activeNodeID, setActiveNodeID] = useState<string | null>(null);
    const activeEdgeStyles = allEdges.map((edge: Edge) =>{
        const isRelated: boolean = (edge.source === activeNodeID) || (edge.target === activeNodeID);
        
        return {
            ...edge,
            animated: isRelated,
            style: {
                ...edge.style,
                stroke: isRelated ? '#ec4899' : '#3b82f6',
                strokeWidth: isRelated ? 3 : 1,
                opacity: activeNodeID ? (isRelated ? 1 : 0.15) : 0.6,
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: isRelated ? '#ec4899' : '#3b82f6',
            },
        };
    });

    usePreReqLogic(allNodes, allEdges, setEdges);

    const {screenToFlowPosition} = useReactFlow();
    const onDropCourse = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const courseData = event.dataTransfer.getData('application/reactflow');
        if(!courseData) return;

        const courseInfo = JSON.parse(courseData);

        const coursePos = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newCourse = {
            id: courseInfo.id,
            type: 'course',
            coursePos,
            data: {
                label: courseInfo.label,
                prerequisites: courseInfo.prerequisites || []
            },
        };

        setNodes((newNode) => newNode.concat(newCourse));
    }, [screenToFlowPosition, setNodes]);

    return (
        <div className={`h-full`}>
        <ReactFlow
            nodes = {allNodes}
            edges = {activeEdgeStyles}
            onDrop={onDropCourse}
            onNodesChange={onChangeNodes}
            onNodeDragStart={(_, node) => setActiveNodeID(node.id)}
            onNodeDragStop={handleNodeDragStop}
            onEdgesChange={onChangeEdges}
            onConnect={connectNodes}
            nodeTypes={nodeTypes}

            onNodeClick={(_, node) => setActiveNodeID(node.id)}
            onPaneClick={() => setActiveNodeID(null)}

            fitView
            proOptions={{ hideAttribution: true }}

            zoomOnPinch = {true}
            preventScrolling = {true}

            minZoom={0.5}
            maxZoom={1}
            translateExtent={[[-2000, -1000], [4500, 1000]]}

            snapGrid={[0.5, 0.5]}
            snapToGrid={true}
        >
            <Background 
                variant={BackgroundVariant.Cross}
                gap={20}
                size={5} 
            />
            <Controls position="bottom-left" className={`z-50`}/>
        </ReactFlow>
        </div>
    )
}

//export default NodeCourseMap

export default function WrappedMap(){
    return (
        <ReactFlowProvider>
            <NodeCourseMap></NodeCourseMap>
        </ReactFlowProvider>
    )
}