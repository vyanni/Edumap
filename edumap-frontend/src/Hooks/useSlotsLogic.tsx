import {type Node, 
        useNodesState, 
         useReactFlow} from '@xyflow/react'
import CourseCard from "../Components/CourseCard";
import TermParentCard from "../Components/TermParentCard";
import { useCallback, useMemo } from 'react';

import termData from '../PlanningPage/TermNodes.json'
import courseData from '../PlanningPage/CourseNodes.json'

function useSlotsLogic(){
        const HEADER_SPACE = 50;
        const SLOT_SIZE = 92;

        const initialNodes: Node[] = useMemo(() => {
            const terms: Node[] = termData.map(term => ({
                ...term,
                type: 'term',
                data: {
                    ...term.data,
                    slots: new Array(7).fill(null)
                }
            }));

            const courses: Node[] = courseData.map(course => {
                const parent = terms.find(t => t.id === course.parentId);

                const slotIndex = course.slot - 1;
                if (parent) {
                    parent.data.slots[slotIndex] = course.id;
                }

                return {
                    id: course.id,
                    type: 'course',
                    parentId: course.parentId,
                    position: { 
                        x: 10, 
                        y: HEADER_SPACE + (slotIndex * SLOT_SIZE) 
                    },
                    data: course.data
                };
            });

            return [...terms, ...courses];
            
        }, []);

       const [allNodes, setNodes, onChangeNodes] = useNodesState(initialNodes);
   
        const nodeTypes = useMemo(() => ({
            course: CourseCard,
            term: TermParentCard,
        }), []);
   
        const { getIntersectingNodes } = useReactFlow();
   
        const handleNodeDragStop = useCallback((event: any, draggedNode: Node) => {
            if (draggedNode.type !== 'course') return;
        
            const COURSE_HEIGHT = 80;
            const GAP = 12;
            const HEADER_SPACE = 50;
            const SLOT_SIZE = COURSE_HEIGHT + GAP;
        
            const termNodes = allNodes.filter((n) => n.type === 'term');
            const termIntersections = getIntersectingNodes(draggedNode, true, termNodes);
        
            setNodes((currentNodes) => {
                const currentParentID = draggedNode.parentId;
                const currentParentNode = currentNodes.find(n => n.id === currentParentID);
                
                if (!currentParentNode) return currentNodes;
                const originalSlotIndex = currentParentNode.data.slots.indexOf(draggedNode.id);
        
                const targetTermNode = termIntersections.find(t => t.id !== currentParentID) || termIntersections[0] || currentParentNode;
        
                const worldY = (currentParentNode.position.y || 0) + draggedNode.position.y;
                const localY = worldY - targetTermNode.position.y;
        
                let requestedSlot = Math.round((localY - HEADER_SPACE) / SLOT_SIZE);
                const maxSlots = targetTermNode.data.slots?.length || 7;
                requestedSlot = Math.max(0, Math.min(requestedSlot, maxSlots - 1));
        
                const targetSlotOccupant = targetTermNode.data.slots[requestedSlot];
                const isSlotEmpty = targetSlotOccupant === null || targetSlotOccupant === draggedNode.id;
        
                if (!isSlotEmpty) {
                    return currentNodes.map(node => 
                        node.id === draggedNode.id 
                            ? { ...node, position: { x: 10, y: HEADER_SPACE + (originalSlotIndex * SLOT_SIZE) } } 
                            : node
                    );
                }
        
                const allOtherNodes = currentNodes.filter(n => n.id !== draggedNode.id);
                const newRenderedCourse = {
                    ...draggedNode,
                    parentId: targetTermNode.id,
                    position: { x: 10, y: HEADER_SPACE + (requestedSlot * SLOT_SIZE) },
                };
        
                
                const finalNodes = allOtherNodes.map((node) => {
                    if (node.id === currentParentID && node.id === targetTermNode.id) {
                        const newSlots = [...(node.data.slots || [])];
                        newSlots[originalSlotIndex] = null;
                        newSlots[requestedSlot] = draggedNode.id;
                        return { ...node, data: { ...node.data, slots: newSlots } };
                    }
                    if (node.id === currentParentID) {
                        const newSlots = [...(node.data.slots || [])];
                        newSlots[originalSlotIndex] = null;
                        return { ...node, data: { ...node.data, slots: newSlots } };
                    }
                    if (node.id === targetTermNode.id) {
                        const newSlots = [...(node.data.slots || [])];
                        newSlots[requestedSlot] = draggedNode.id;
                        return { ...node, data: { ...node.data, slots: newSlots } };
                    }
                    return node;
                });
        
                // 4. Push the new course node to the very end of the array
                return [...finalNodes, newRenderedCourse];
            });
        }, [getIntersectingNodes, setNodes, allNodes]);

   return {
    allNodes,
    nodeTypes,
    setNodes,
    onChangeNodes,
    handleNodeDragStop
   };
}

export default useSlotsLogic;