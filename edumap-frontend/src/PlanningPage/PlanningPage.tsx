import { NavLink } from "react-router-dom";
import CourseSelector from "./CourseSelector";
import WrappedMap from "./NodeCourseMap";
import LeftInfoPanel from "./LeftInfoPanel";

import courseData from '../PlanningPage/CourseNodes.json'
import RightDescriptionPanel from "./RightDescriptionPanel";

function PlanningPage() {
  return (
    <div className={`w-auto h-screen justify-center relative`}>

      <div className={`w-full h-full`}>
        <LeftInfoPanel newCourses={courseData}/>
        <div className={`w-4/5 h-full right-0 absolute`}>
          <WrappedMap/>
        </div>
        {/* <RightDescriptionPanel courseData={courseData}/> */}
      </div>
      
       <CourseSelector/>
    </div>
  );
};

export default PlanningPage
