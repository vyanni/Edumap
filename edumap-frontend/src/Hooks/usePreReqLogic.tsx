import { useEffect } from "react"
import {type Node, type Edge, MarkerType} from '@xyflow/react'

export function usePreReqLogic(allNodes: Node[], allEdges: Edge[], setEdges: React.Dispatch<React.SetStateAction<Edge[]>>){
    useEffect(() => {
        const newEdges = [...allEdges];
        let newPreReq = false;

        const currentNodes = new Set(allNodes.map((node) => node.id));
        const currentEdges = new Set(allEdges.map((edge) => `${edge.source}->${edge.target}`));

        allNodes.forEach((node) => {
            const prerequisites = node.data?.prerequisites || [];

            prerequisites.forEach((preReqID: string) => {
                if(currentNodes.has(preReqID) && !currentEdges.has(`${preReqID}->${node.id}`)){
                    newEdges.push({
                        id: `${preReqID}-${node.id}`,
                        source: preReqID,
                        target: node.id,
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

                    newPreReq = true;
                    currentEdges.add(`${preReqID}->${node.id}`);
                }
            });
        });

        if(newPreReq){
            setEdges(newEdges);
        }
    }, [allNodes])
}