import { useCallback, useMemo } from "react";
import CourseCard from "../Components/CourseCard";
import TermParentCard from "../Components/TermParentCard";
import '@xyflow/react/dist/style.css'
import  {Background, 
        BackgroundVariant, 
        Controls, 
        type Node, 
        type Edge, 
        type Connection, 
        useNodesState, 
        useEdgesState,
        addEdge,
        ReactFlow, useReactFlow, ReactFlowProvider} from '@xyflow/react'

const practiceCourseNodes: Node[] = [
    {
        id: '1A',
        type: 'term',
        position: {x: 0, y: 0},
        data: { 
            label: '1A',
            slots: new Array(7).fill(0)
        },
        style: {width: 300, height: 800},
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -1
    },
    {
        id: '1',
        type: 'course',
        parentId: '1A',
        position: {x: 50, y:50},
        data: {label: 'SYDE101L'},
    },
    {
        id: '1B',
        type: 'term',
        position: {x: 450, y: 0},
        data: { 
            label: '1B',
            slots: new Array(7).fill(0)
        },
        style: {width: 300, height: 800},
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -1
    },
    {
        id: '2',
        type: 'course',
        parentId: '1B',
        position: {x: 250, y: 250},
        data: {label: 'SYDE181'},
    },
    {
        id: '2A',
        type: 'term',
        position: {x: 900, y: 0},
        data: { 
            label: '2A',
            slots: new Array(7).fill(0)
        },
        style: {width: 300, height: 800},
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -1
    },
    {
        id: '2B',
        type: 'term',
        position: {x: 1350, y: 0},
        data: { label: '2B'},
        style: {width: 300, height: 800},
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -1
    },
    {
        id: '3A',
        type: 'term',
        position: {x: 1800, y: 0},
        data: { label: '3A'},
        style: {width: 300, height: 800},
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -1
    },
    {
        id: '3B',
        type: 'term',
        position: {x: 2250, y: 0},
        data: { label: '3B'},
        style: {width: 300, height: 800},
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -1
    },
    {
        id: '4A',
        type: 'term',
        position: {x: 2700, y: 0},
        data: { label: '4A'},
        style: {width: 300, height: 800},
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -1
    },
    {
        id: '4B',
        type: 'term',
        position: {x: 3150, y: 0},
        data: { label: '4B'},
        style: {width: 300, height: 800},
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -1
    }
]

const practicesCourseEdges: Edge[] = [
    //{id: 'e1-2', source: '1', target: '2', animated: true}
]

function NodeCourseMap(){
    const [allNodes, setNodes, onChangeNodes] = useNodesState(practiceCourseNodes);
    const [allEdges, setEdges, onChangeEdges] = useEdgesState(practicesCourseEdges);

    const connectNodes = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const nodeTypes = useMemo(() => ({
        course: CourseCard,
        term: TermParentCard,
    }), []);

    const { getIntersectingNodes } = useReactFlow();
    const courseNodes = practiceCourseNodes.map((n) => n.type === 'course');
    const termNodes = practiceCourseNodes.map((n) => n.type === 'term');

const handleNodeDragStop = useCallback((event: any, draggedNode: Node) => {
    if (draggedNode.type !== 'course') return;

    // 1. FIXED: Get the actual Term nodes for intersection
    const termNodes = allNodes.filter((n) => n.type === 'term');
    const termIntersections = getIntersectingNodes(draggedNode, undefined, termNodes);
    const targetTerm = termIntersections[0];

    setNodes((currentNodes) => {
        // Fallback to current parent if dropped in outer space
        const finalParentId = targetTerm ? targetTerm.id : draggedNode.parentId;
        const targetTermNode = currentNodes.find(n => n.id === finalParentId);
        
        if (!targetTermNode) return currentNodes;

        // Configuration
        const COURSE_HEIGHT = 80;
        const GAP = 12;
        const HEADER_SPACE = 50;
        const SLOT_SIZE = COURSE_HEIGHT + GAP;

        // 2. MATH: Translate World Y to the Target Parent's Local Y
        const currentParent = currentNodes.find(n => n.id === draggedNode.parentId);
        const worldY = (currentParent?.position.y || 0) + draggedNode.position.y;
        const localY = worldY - targetTermNode.position.y;

        // 3. MATH: Find which slot range it resides in
        // (localY - 50) / 92 gives us a clean float. Math.round snaps it to the nearest index.
        let requestedSlot = Math.round((localY - HEADER_SPACE) / SLOT_SIZE);
        
        // Safety bounds so it doesn't try to look for negative slots or exceed array size
        const maxSlots = targetTermNode.data.slots?.length || 7;
        requestedSlot = Math.max(0, Math.min(requestedSlot, maxSlots - 1));

        const isSlotEmpty = targetTermNode.data.slots[requestedSlot] === 0;

        // ABORT: If slot is filled (1) and it's a DIFFERENT slot or parent, reject the move
        const isSameSlotAndParent = draggedNode.parentId === finalParentId && 
            Math.round((draggedNode.position.y - HEADER_SPACE) / SLOT_SIZE) === requestedSlot;

        if (!isSlotEmpty && !isSameSlotAndParent) {
            // Revert back to perfectly snapped position in the ORIGINAL parent
            return currentNodes.map(node => {
                if (node.id === draggedNode.id) {
                    const originalSlot = Math.round((node.position.y - HEADER_SPACE) / SLOT_SIZE);
                    return {
                        ...node,
                        position: { x: 10, y: HEADER_SPACE + (originalSlot * SLOT_SIZE) }
                    };
                }
                return node;
            });
        }

        // 4. APPROVED: Run the state update!
        return currentNodes.map((node) => {
            // Update the Course Card
            if (node.id === draggedNode.id) {
                return {
                    ...node,
                    parentId: finalParentId,
                    position: { x: 10, y: HEADER_SPACE + (requestedSlot * SLOT_SIZE) },
                };
            }

            // Update the PREVIOUS Term (clear its slot to 0)
            if (node.id === draggedNode.parentId) {
                const originalSlot = Math.round((draggedNode.position.y - HEADER_SPACE) / SLOT_SIZE);
                const updatedSlots = [...(node.data.slots || [])];
                updatedSlots[originalSlot] = 0;
                return { ...node, data: { ...node.data, slots: updatedSlots } };
            }

            // Update the TARGET Term (fill its slot with 1)
            if (node.id === finalParentId) {
                const updatedSlots = [...(node.data.slots || [])];
                updatedSlots[requestedSlot] = 1;
                return { ...node, data: { ...node.data, slots: updatedSlots } };
            }

            return node;
        });
    });
}, [getIntersectingNodes, setNodes, allNodes]);

    return (
        <div className={`h-full`}>
        <ReactFlow
            nodes = {allNodes}
            edges = {allEdges}
            onNodesChange={onChangeNodes}
            onNodeDragStop={handleNodeDragStop}
            onEdgesChange={onChangeEdges}
            onConnect={connectNodes}
            nodeTypes={nodeTypes}

            fitView
            proOptions={{ hideAttribution: true }}

            zoomOnPinch = {true}
            preventScrolling = {true}

            minZoom={0.5}
            maxZoom={1}
            translateExtent={[[-2000, -2000], [5000, 2000]]}

            snapGrid={[1, 1]}
            snapToGrid={true}
        >
            <Background 
                variant={BackgroundVariant.Cross}
                gap={16}
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