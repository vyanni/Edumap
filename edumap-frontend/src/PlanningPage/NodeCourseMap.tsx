import { useCallback, useMemo } from "react";
import '@xyflow/react/dist/style.css'
import ReactFlow, 
    {Background, 
    BackgroundVariant, 
    Controls, 
    type Node, 
    type Edge, 
    type Connection, 
    type NodeProps, 
    useNodesState, 
    useEdgesState, 
    Handle,
    Position,
    addEdge} from '@xyflow/react'

const practiceCourseNodes: Node[] = [
    {
        id: '1A',
        type: 'term',
        position: {x: 0, y: 0},
        data: { label: '1A'},
        style: {width: 300, height: 500},
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
        extent: 'parent'
    },
    {
        id: '1B',
        type: 'term',
        position: {x: 450, y: 0},
        data: { label: '1B'},
        style: {width: 300, height: 500},
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
        extent: 'parent'
    }
]

const practicesCourseEdges: Edge[] = [
    {id: 'e1-2', source: '1', target: '2', animated: true}
]

const TempCourseNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-slate-800 p-2 rounded shadow-md min-w-[100px] text-center">
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      <div className="text-xs font-bold">{data.label}</div>
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
};

function NodeCourseMap(){
    const [allNodes, setNodes, onChangeNodes] = useNodesState(practiceCourseNodes);
    const [allEdges, setEdges, onChangeEdges] = useEdgesState(practicesCourseEdges);

    const connectNodes = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const nodeTypes = useMemo(() => ({
        course: TempCourseNode,
        term: TempTermNode,
    }), []);

    return (
        <div className={`h-full`}>
        <ReactFlow
            nodes = {allNodes}
            edges = {allEdges}
            onNodesChange={onChangeNodes}
            onEdgesChange={onChangeEdges}
            onConnect={connectNodes}
            nodeTypes={nodeTypes}

            fitView
            proOptions={{ hideAttribution: true }}

            zoomOnPinch = {true}
            preventScrolling = {true}

            minZoom={0.5}
            maxZoom={1}
            translateExtent={[[-2000, -2000], [2000, 2000]]}
        >
            <Background 
                variant={BackgroundVariant.Lines}
                gap={16}
                size={5}    
            />
            <Controls position="bottom-left" className={`z-50`}/>
        </ReactFlow>
        </div>
    )
}

export default NodeCourseMap