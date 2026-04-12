import {type Node, 
        useNodesState, 
         useReactFlow} from '@xyflow/react'
import CourseCard from "../Components/CourseCard";
import TermParentCard from "../Components/TermParentCard";
import { useMemo } from 'react';

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

            // const courses: Node[] = courseData.map(course => {
            //     const parent = terms.find(t => t.id === course.parentId);
            //     const slotIndex = course.slot - 1;
            
            //     if (parent) {
            //         (parent.data.slots as (string | null)[])[slotIndex] = course.id;
            //     }

            //     return {
            //         id: course.id,
            //         type: 'course',
            //         parentId: course.parentId,
            //         position: { 
            //             x: 10, 
            //             y: HEADER_SPACE + (slotIndex * SLOT_SIZE) 
            //         },
            //         data: {
            //             ...course.data,
            //             originalId: course.data.originalId || course.id 
            //         }
            //     };
            // });

            return [...terms];
            
        }, []);

       const [allNodes, setNodes, onChangeNodes] = useNodesState(initialNodes);
   
        const nodeTypes = useMemo(() => ({
            course: CourseCard,
            term: TermParentCard,
        }), []);

   return {
    allNodes,
    nodeTypes,
    setNodes,
    onChangeNodes
   };
}

export default useSlotsLogic;