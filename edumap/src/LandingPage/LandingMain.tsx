import { NavLink } from "react-router-dom";

function LandingMain() {
  return (
    <div className={`flex flex-row w-auto mb-56 mt-64`}>
        <div className={`flex flex-col w-1/2 gap-4`}>
            <h1 className={`text-6xl text-black dark:text-white`}> Edumap </h1>
            <p className={`text-sm text-gray-500 tracking-tight dark:text-gray-100`}> Visualize your future degree in one place </p>
        </div>
        <div className={`flex flex-row w-1/2 justify-center`}>
            <NavLink 
            className={`text-sm bg-violet-300 p-4 m-2 rounded-full text-black justify-center inline-block items-center flex`}
            to={'/planning'}
            >
            <p>Plan Your Degree</p> 
            </NavLink>
        </div>
    </div>
  )
}

export default LandingMain
