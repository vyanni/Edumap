import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function LandingPage() {
  return (
    <div className={`flex flex row w-auto mt-64`}>
        <div className={`flex flex-col w-1/2 gap-4`}>
            <h1 className={`text-6xl`}> Edumap </h1>
            <p className={`text-sm`}> Visualize your future degree in one place </p>
        </div>
        <div className={`flex flex-row w-1/2 justify-center`}>
            <button className={`text-sm bg-violet-300 rounded-full text-black`}
            ={() => navigate("/planning")

            }
            > Plan Your Degree </button>
        </div>
    </div>
  )
}

export default LandingPage
