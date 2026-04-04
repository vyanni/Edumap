import { NavLink } from "react-router-dom";

function LandingFooter() {

  return (
    <div className={`flex flex-row m-8`}>
        <NavLink to={'/about'}> About </NavLink>
    </div>
  )
}

export default LandingFooter
