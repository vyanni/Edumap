import { NavLink } from "react-router-dom";
import CourseSelector from "./CourseSelector";
import WrappedMap from "./NodeCourseMap";
import LeftInfoPanel from "./InfoPanel/LeftInfoPanel";

import courseData from '../PlanningPage/CourseNodes.json'
import RightDescriptionPanel from "./RightDescriptionPanel";
import { useState } from "react";
import useSlotsLogic from "../Hooks/useSlotsLogic";
import { type Node } from "@xyflow/react";

function PlanningPage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const {allNodes, nodeTypes, setNodes, onChangeNodes} = useSlotsLogic();

  return (
    <div className={`w-auto h-screen justify-center relative`}>

      <div className={`w-full h-full`}>
        <LeftInfoPanel newCourses={courseData} allNodes={allNodes}/>
        <div className={`w-4/5 h-full right-0 absolute`}>
          <WrappedMap 
            allNodes={allNodes} 
            setNodes={setNodes} 
            onChangeNodes={onChangeNodes} 
            nodeTypes={nodeTypes}
            setSelectedNode={setSelectedNode}
          />
        </div>
        <RightDescriptionPanel selectedNode={selectedNode}/>
      </div>
      
       <CourseSelector/>
    </div>
  );
};

export default PlanningPage
