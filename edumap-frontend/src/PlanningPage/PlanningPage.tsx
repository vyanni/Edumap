import WrappedMap from "./NodeCourseMap";
import LeftInfoPanel from "./InfoPanel/LeftInfoPanel";
import RightDescriptionPanel from "./RightDescriptionPanel";
import { useEffect, useState} from "react";
import useSlotsLogic from "../Hooks/useSlotsLogic";
import { type Node } from "@xyflow/react";
import { useGetNewProgram, useGetPrograms } from "../Hooks/useDBCalls";
import { supabase } from "../Authentication/supabaseClient";
import { fetchUserMap } from "../Hooks/useSaveMap";
import { useEdgeLogic } from "../Hooks/useEdgeLogic";

function PlanningPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isMapDataLoading, setIsMapDataLoading] = useState<boolean>(true);

  const {allNodes, nodeTypes, setNodes, onChangeNodes, allCourses} = useSlotsLogic(user?.id);
  const { styledEdges, onChangeEdges, connectNodes, setEdges } = useEdgeLogic(allNodes, selectedNode?.id);

  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProgramLoading, setIsProgramLoading] = useState<boolean>(false);

  useGetPrograms({setAllPrograms, setIsLoading});
  useGetNewProgram({
    selectedProgramLabel: selectedLabel,
    setActiveProgram: setSelectedProgram, 
    setIsLoading: setIsProgramLoading
  });

  useEffect(() => {
    const initializeUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setIsMapDataLoading(false);
        return;
      }

      try {
        const userData = await fetchUserMap(user.id);
        
        if (userData) {
          if (userData.map_nodes && userData.map_nodes.length > 0) {
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

          if (userData.map_edges && userData.map_edges.length > 0) {
            setEdges(userData.map_edges);
          }

          if (userData.major) setSelectedLabel(userData.major); 
        }
      } catch (error) {
        console.error("Failed to fetch user's saved map data", error);
      } finally {
        setIsMapDataLoading(false);
      }
    };

    initializeUserAndData();
  }, []);

  return (
    <div className={`w-auto h-screen justify-center relative`}>

      <div className={`w-full h-full`}>
        <LeftInfoPanel 
          newCourses={allCourses} 
          allNodes={allNodes} 
          activeMajor={selectedProgram}
          allPrograms={allPrograms}
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          isLoading={isLoading}
        />

        <div className={`w-3/4 h-full right-0 absolute`}>
          <WrappedMap 
            userId={user?.id}
            allNodes={allNodes} 
            setNodes={setNodes} 
            onChangeNodes={onChangeNodes} 
            allEdges={styledEdges}
            onChangeEdges={onChangeEdges}
            onConnect={connectNodes}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            nodeTypes={nodeTypes}
            isLoading={isMapDataLoading}
          />
        </div>
        <RightDescriptionPanel selectedNode={selectedNode}/>
      </div>
    </div>
  );
};

export default PlanningPage
