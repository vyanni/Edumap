import WrappedMap from "./NodeCourseMap";
import LeftInfoPanel from "./InfoPanel/LeftInfoPanel";
import RightDescriptionPanel from "./RightDescriptionPanel";
import { useEffect, useState} from "react";
import useSlotsLogic from "../Hooks/useSlotsLogic";
import { type Node } from "@xyflow/react";
import { useGetNewProgram, useGetPrograms } from "../Hooks/useDBCalls";
import { supabase } from "../Authentication/supabaseClient";

function PlanningPage() {
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const {allNodes, nodeTypes, setNodes, onChangeNodes, allCourses} = useSlotsLogic(user?.id);

  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProgramLoading, setIsProgramLoading] = useState<boolean>(false);

  const [user, setUser] = useState<any>(null);

  useGetPrograms({setAllPrograms, setIsLoading});
  useGetNewProgram({
    selectedProgramLabel: selectedLabel,
    setActiveProgram: setSelectedProgram, 
    setIsLoading: setIsProgramLoading
  });

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
            nodeTypes={nodeTypes}
            setSelectedNode={setSelectedNode}
            isLoading={isLoading}
          />
        </div>
        <RightDescriptionPanel selectedNode={selectedNode}/>
      </div>
    </div>
  );
};

export default PlanningPage
