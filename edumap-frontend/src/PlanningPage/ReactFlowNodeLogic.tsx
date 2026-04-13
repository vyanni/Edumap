import { useReactFlow, type Node } from "@xyflow/react";
import { useCallback } from "react";

export function useOnNodesDelete(setNodes: any){
    return useCallback((deleted: Node[]) => {
        const deletedCourseIDs = new Set(deleted.filter(n => n.type === 'course').map(n => n.id));
        if (deletedCourseIDs.size === 0) return;

        setNodes((nodes: Node[]) => nodes.map(node => {
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
}

export function useOnDropCourse(setNodes: any){
    const {screenToFlowPosition, getIntersectingNodes} = useReactFlow();

    return useCallback((event: React.DragEvent) => {
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

        setNodes((currentNodes: Node[]) => {
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
}

export function useOnHandleNodeDragStop(setNodes: any){
    const {getIntersectingNodes} = useReactFlow();

    return useCallback((draggedNode: Node) => {
        if (draggedNode.type !== 'course') return;
    
        const COURSE_HEIGHT = 80;
        const GAP = 12;
        const HEADER_SPACE = 50;
        const SLOT_SIZE = COURSE_HEIGHT + GAP;
    
        setNodes((currentNodes: Node[]) => {
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
}