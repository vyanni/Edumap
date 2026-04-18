import {type Node, useNodesState} from '@xyflow/react'
import CourseCard from "../Components/CourseCard";
import TermParentCard from "../Components/TermParentCard";
import { useEffect, useMemo, useState } from 'react';
import { useGetCourses, useGetTerms } from './useDBCalls';
import { fetchUserMap } from './useSaveMap';

function useSlotsLogic(userId?: string){
        // const HEADER_SPACE = 50;
        // const SLOT_SIZE = 92;

        const [allCourses, setAllCourses] = useState<any[]>([]);
        const [allTerms, setAllTerms] = useState<any[]>([]);
        const [allNodes, setNodes, onChangeNodes] = useNodesState([]);
        const [isLoading, setIsLoading] = useState<boolean>(true);

        const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);

        useGetCourses({setAllCourses, setIsLoading});
        useGetTerms({setAllTerms, setIsLoading});

        useEffect(() => {
            const loadUserData = async () => {
                if (!userId) {
                    setIsProfileLoaded(true);
                    return;
                }

                const userData = await fetchUserMap(userId);
                
                if (userData && userData.map_nodes && userData.map_nodes.length > 0) {
                    setNodes(
                    userData.map_nodes.map((node: any) => ({
                        ...node,
                        draggable: node.type === 'term' ? false : true,
                        selectable: node.type === 'term' ? false : true,
                        connectable: node.type === 'term' ? false : true,
                        focusable: node.type === 'term' ? false : true,
                    }))
                    );
                }
                
                setIsProfileLoaded(true);
            };

            loadUserData();
        }, [userId, setNodes]);

        const initialNodes: Node[] = useMemo(() => {
            if (allTerms.length === 0) return [];

            const terms: Node[] = allTerms.map(term => ({
                ...term,
                type: 'term',
                draggable: false,
                selectable: false,
                connectable: false,
                focusable: false,
                data: {
                    ...term.data,
                    slots: new Array(7).fill(null)
                }
            }));

            // const courses: Node[] = allCourses.map(course => {
            //     const parent = terms.find(t => t.id === course.parentId);
            //     const slotIndex = (course.data?.slot || 1) - 1;
            
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
            
        }, [allTerms, allCourses]);

       useEffect(() => {
            if (isProfileLoaded && allNodes.length === 0 && initialNodes.length > 0) {
                setNodes(initialNodes);
            }
        }, [initialNodes, isProfileLoaded, allNodes.length, setNodes]);
   
        const nodeTypes = useMemo(() => ({
            course: CourseCard,
            term: TermParentCard,
        }), []);

   return {
    allNodes,
    nodeTypes,
    setNodes,
    onChangeNodes,
    allCourses
   };
}

export default useSlotsLogic;