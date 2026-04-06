import { NavLink } from "react-router-dom";
import CourseSelector from "./CourseSelector";
import WrappedMap from "./NodeCourseMap";

function PlanningPage() {
  return (
    <div className={`w-auto h-screen justify-center relative`}>

      <div className={`w-full h-full`}>
        <WrappedMap/>
      </div>
      
       <CourseSelector/>
    </div>
  );
};

export default PlanningPage
