import { useEffect } from "react"
import { type Node, type Edge, MarkerType } from '@xyflow/react'

export function usePreReqLogic(
    allNodes: Node[], 
    allEdges: Edge[], 
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) {
    useEffect(() => {
        const newEdges: Edge[] = [];

        // 1. Create a map of originalId -> current dynamic ID for quick lookup
        const idMap = new Map();
        allNodes.forEach(node => {
            if (node.data?.originalId) {
                idMap.set(node.data.originalId.toString(), node.id);
            }
        });

        // 2. Determine what the edges SHOULD be based on current nodes
        allNodes.forEach((targetNode) => {
            if (targetNode.type !== 'course') return;

            const prerequisites = targetNode.data?.prerequisites || [];

            prerequisites.forEach((preReqOriginalId: string) => {
                // Find if the prerequisite node actually exists in the graph right now
                const sourceDynamicId = idMap.get(preReqOriginalId.toString());

                if (sourceDynamicId) {
                    const edgeId = `edge-${sourceDynamicId}-${targetNode.id}`;
                    
                    newEdges.push({
                        id: edgeId,
                        source: sourceDynamicId, // Use the DYNAMIC ID, not the static one
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

    }, [allNodes, setEdges]);
}