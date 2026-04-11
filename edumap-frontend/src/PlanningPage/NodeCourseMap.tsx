import '@xyflow/react/dist/style.css'
import  {Background, 
        BackgroundVariant, 
        Controls, 
        useEdgesState,
        addEdge,
        type Edge, ReactFlow, ReactFlowProvider, type Connection, MarkerType, type Node,
        useReactFlow} from '@xyflow/react'
import { useCallback } from 'react';
import useSlotsLogic from "../Hooks/useSlotsLogic";
import { usePreReqLogic } from '../Hooks/usePreReqLogic';
import { useState } from 'react';
import '../index.css'

const initialEdges: Edge[] = []

function NodeCourseMap({setSelectedNode, allNodes, setNodes, onChangeNodes, nodeTypes}: any){
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

    const {screenToFlowPosition, getIntersectingNodes} = useReactFlow();
    const onDropCourse = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const courseData = event.dataTransfer.getData('application/reactflow');
        if(!courseData) return;
        const courseInfo = JSON.parse(courseData);

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const intersectingNodes = getIntersectingNodes({x: position.x, y: position.y, width: 1, height: 1});
        const targetTerm = intersectingNodes.find((node) => node.type === 'term');

        const COURSE_HEIGHT = 80;
        const GAP = 12;
        const HEADER_SPACE = 50;
        const SLOT_SIZE = COURSE_HEIGHT + GAP;

        setNodes((currentNodes) => {
            const newCourseID = `${courseInfo.id}-${Date.now()}`;
            let finalPosition = position;
            let finalParentID: string | undefined = targetTerm ? targetTerm.id : undefined;
            let updatedNodes = [...currentNodes]

            if(targetTerm){
                const localY = position.y - (targetTerm.position?.y || 0);

                const termSlots = (targetTerm.data.slots as (string|null)[]) || null;
                const maxSlots = Math.max(termSlots.length, 7);
                let requestedSlot = Math.round((localY - HEADER_SPACE) / SLOT_SIZE);
                requestedSlot = Math.max(0, Math.min(requestedSlot, maxSlots - 1));

                const currentSlots = termSlots.length > 0 ? termSlots : new Array(maxSlots).fill(null);
                if(currentSlots[requestedSlot] !== null){
                    const emptyIndex = currentSlots.findIndex((slot: any) => slot === null);
                    if(emptyIndex !== -1){
                        requestedSlot = emptyIndex
                    }else{
                        finalParentID = undefined;
                    }
                }

                if(finalParentID !== null){
                    finalPosition = {
                        x: 10,
                        y: HEADER_SPACE + (requestedSlot * SLOT_SIZE)
                    };

                    updatedNodes = updatedNodes.map((node) => {
                        if(node.id === targetTerm.id){
                            const newSlots = [...currentSlots];
                            newSlots[requestedSlot] = newCourseID;
                            return {...node, data: {...node.data, slots: newSlots}};
                        }
                        return node;
                    });
                }
            }

            const newCourse = {
                id: newCourseID,
                type: 'course',
                parentId: finalParentID,
                position: finalPosition,
                data: {
                    ...courseInfo.data,
                    originalId: courseInfo.data.originalId || courseInfo.id,
                    prerequisites: courseInfo.data.prerequisites || []
                },
            };

            return [...updatedNodes, newCourse];
        });
    }, [screenToFlowPosition, getIntersectingNodes, setNodes]);

    const onNodesDelete = useCallback((deleted: Node[]) => {
        const deletedCourseIDs = new Set(deleted.filter(n => n.type === 'course').map(n => n.id));
        if (deletedCourseIDs.size === 0) return;

        setNodes((nodes) => nodes.map(node => {
            if(node.type === 'term' && node.data.slots){
                const currentSlots = node.data.slots as (string | null)[];

                const newSlots = currentSlots.map(slotID => 
                    slotID && deletedCourseIDs.has(slotID) ? null : slotID
                );

                return {...node, data: {...node.data, slots: newSlots}};
            }
            return node;
        }));
    }, [setNodes]);
  
    const handleNodeDragStop = useCallback((draggedNode: Node) => {
        if (draggedNode.type !== 'course') return;
    
        const COURSE_HEIGHT = 80;
        const GAP = 12;
        const HEADER_SPACE = 50;
        const SLOT_SIZE = COURSE_HEIGHT + GAP;
    
        setNodes((currentNodes) => {
            const termNodes = currentNodes.filter((n) => n.type === 'term');
            const termIntersections = getIntersectingNodes(draggedNode, true, termNodes);

            const currentParentID = draggedNode.parentId;
            const currentParentNode = currentNodes.find(n => n.id === currentParentID);
            
            const targetTermNode = termIntersections.find(t => t.id !== currentParentID) || termIntersections[0] || currentParentNode;
            if(!targetTermNode) return currentNodes;

            const currentParentNodeSlots = (currentParentNode?.data.slots as (string | null)[]) || [];
            const originalSlotIndex = currentParentNodeSlots.indexOf(draggedNode.id);

            const worldY = currentParentNode ? currentParentNode.position.y + draggedNode.position.y : draggedNode.position.y;
            const localY = worldY - targetTermNode.position.y;
    
            let requestedSlot = Math.round((localY - HEADER_SPACE) / SLOT_SIZE);
            const targetSlot = (targetTermNode.data.slots as (string|null)[]) || []
            const maxSlots = targetSlot.length || 7;
            requestedSlot = Math.max(0, Math.min(requestedSlot, maxSlots - 1));
    
            const targetSlotOccupant = targetSlot[requestedSlot];
            const isSlotEmpty = targetSlotOccupant === null || targetSlotOccupant === draggedNode.id;
    
            if (!isSlotEmpty) {
                return currentNodes.map(node => 
                    node.id === draggedNode.id 
                        ? { ...node, position: { x: 10, y: HEADER_SPACE + (originalSlotIndex * SLOT_SIZE) } } 
                        : node
                );
            }

            const newRenderedCourse = {
                ...draggedNode,
                parentId: targetTermNode.id,
                position: { x: 10, y: HEADER_SPACE + (requestedSlot * SLOT_SIZE) },
            };
    
            
            return currentNodes.map((node) => {
                if(node.id === draggedNode.id) return newRenderedCourse;

                if (node.id === currentParentID && node.id === targetTermNode.id) {
                    const newSlots = [...((node.data.slots as string[]) || [])];
                    if(originalSlotIndex !== -1) newSlots[originalSlotIndex] = null as any;
                    newSlots[requestedSlot] = draggedNode.id;
                    return { ...node, data: { ...node.data, slots: newSlots } };
                }

                if (node.id === currentParentID) {
                    const newSlots = [...((node.data.slots as string[]) || [])];
                    if(originalSlotIndex !== -1) newSlots[originalSlotIndex] = null as any;
                    return { ...node, data: { ...node.data, slots: newSlots } };
                }

                if (node.id === targetTermNode.id) {
                    const newSlots = [...((node.data.slots as string[]) || [])];
                    newSlots[requestedSlot] = draggedNode.id;
                    return { ...node, data: { ...node.data, slots: newSlots } };
                }

                return node;
            });
        });
    }, [getIntersectingNodes, setNodes]);

    return (
        <div className={`h-full`}>
        <ReactFlow
            nodes = {allNodes}
            edges = {activeEdgeStyles}
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