import { useState, type ChangeEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { handleSignIn, handleSignUp } from "../Authentication/AuthLogic";

function LandingMain() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false); // Toggle between Login/Signup
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const submitAuth = async () => {
    setIsLoading(true);
    setErrorMessage(''); // Clear old errors

    try {
      if (isLogin) {
        await handleSignIn(userEmail, userPassword);
      } else {
        await handleSignUp(userEmail, userPassword);
      }

      navigate('/planning');
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-row w-auto my-48`}>
        <div className={`flex flex-col w-1/2 gap-4 mt-20`}>
          <h1 className={`text-6xl text-black dark:text-white`}> Edumap </h1>
          <p className={`text-sm text-gray-500 tracking-tight dark:text-gray-100`}> Visualize your future degree in one place </p>

          <br/>

          <div className={`w-full flex flex-row justify-center`}>
            <NavLink 
              className={`text-sm bg-violet-300 p-4 m-2 rounded-full text-black justify-center flex w-48`}
              to={'/planning'}
            >
              <p>Skip to Planning</p> 
            </NavLink>
          </div>
        </div>

        <div className={`flex flex-row w-1/2 justify-center`}>
          <div className={`flex flex-col w-2/3 gap-3 p-16 rounded-xl border border-zinc-300`}>
              
              {/* Error Message Display */}
              {errorMessage && <p className="text-red-500 text-xs text-center">{errorMessage}</p>}

              <input 
                type="email"
                className={`w-full p-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:shadow-lg transition-all text-sm`}
                placeholder={"Enter your email..."}
                value={userEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value)}
              />

              <input 
                type="password" 
                placeholder="Enter your password..." 
                className={`w-full p-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:shadow-lg transition-all text-sm`}
                value={userPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)}
              />

              <button 
                onClick={submitAuth}
                disabled={isLoading}
                className={`text-sm w-full bg-violet-300 p-3 rounded-full text-black justify-center items-center flex font-semibold ${isLoading ? 'opacity-50' : 'hover:bg-violet-400'} transition-colors`}
              > 
                {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
              </button>

              <div className={`flex flex-row mt-4 gap-1 justify-center`}>
                <p className={`text-xs text-gray-500`}>{isLogin ? "Need an account?" : "Already have an account?"}</p>
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs text-gray-500 hover:text-violet-500 hover:underline transition-colors text-center"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </div>
          </div>
        </div>
    </div>
  )
}

export default LandingMain
