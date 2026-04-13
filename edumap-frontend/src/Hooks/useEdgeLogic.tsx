import { useCallback, useEffect, useMemo } from "react"
import { type Node, type Edge, MarkerType, useEdgesState, type Connection, addEdge } from '@xyflow/react'

export function useEdgeLogic(
    allNodes: Node[],
    activeNodeID: string | null
) {
    const [allEdges, setEdges, onChangeEdges] = useEdgesState([]);

    const connectNodes = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds))
    ,[setEdges]);

    const styledEdges = useMemo(() => {
        return allEdges.map((edge: Edge) =>{
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
    }, [allEdges, activeNodeID]);

    useEffect(() => {
        const newEdges: Edge[] = [];

        const idMap = new Map();
        allNodes.forEach(node => {
            if (node.data?.originalId) {
                idMap.set(node.data.originalId.toString(), node.id);
            }
        });

        allNodes.forEach((targetNode) => {
            if (targetNode.type !== 'course') return;

            const prerequisites = targetNode.data?.prerequisites || [];

            prerequisites.forEach((preReqOriginalId: string) => {
                const sourceDynamicId = idMap.get(preReqOriginalId.toString());

                if (sourceDynamicId) {
                    const edgeId = `edge-${sourceDynamicId}-${targetNode.id}`;
                    
                    newEdges.push({
                        id: edgeId,
                        source: sourceDynamicId,
                        target: targetNode.id,
                        animated: true,
                        style: { 
                            stroke: '#3b82f6',
                            strokeWidth: 2,
                            opacity: 0.6 
                        },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            width: 20,
                            height: 20,
                            color: '#3b82f6',
                        },
                    });
                }
            });
        });
        const currentEdgeIds = allEdges.map(e => e.id).sort().join(',');
        const newEdgeIds = newEdges.map(e => e.id).sort().join(',');

        if (currentEdgeIds !== newEdgeIds) {
            setEdges(newEdges);
        }

    }, [allNodes, setEdges, allEdges]);

    return {
        styledEdges,
        onChangeEdges,
        connectNodes
    };
}