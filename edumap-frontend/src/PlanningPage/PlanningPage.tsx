import { NavLink } from "react-router-dom";
import CourseSelector from "./CourseSelector";
import WrappedMap from "./NodeCourseMap";
import LeftInfoPanel from "./LeftInfoPanel";

function PlanningPage() {
  return (
    <div className={`w-auto h-screen justify-center relative`}>

      <div className={`w-full h-full`}>
        <LeftInfoPanel/>
        <div className={`w-4/5 h-full right-0 absolute`}>
          <WrappedMap/>
        </div>
      </div>
      
       <CourseSelector/>
    </div>
  );
};

export default PlanningPage
