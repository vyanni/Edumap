import { useState, useEffect } from 'react'
import './index.css'
import './GlobalStyles/App.css'
import LandingPage from './LandingPage/LandingPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ThemeToggle from './Components/ThemeToggle.tsx'
import useToggleLogic from './Hooks/useToggleLogic.tsx'
import BackgroundNorm from './Components/BackgroundNorm.tsx'
import PlanningPage from './PlanningPage/PlanningPage.tsx'
import PageWrapper from './PageWrapper.tsx'
import useWakeDB from './Hooks/useWakeDB.tsx'
import AuthCallback from './Components/AuthCallback.tsx'

function App() {
    const {currentTheme, setCurrentTheme} = useToggleLogic();
    useWakeDB();

  return (
    <PageWrapper>
      <BackgroundNorm Theme={currentTheme} />
      {/* <ThemeToggle  
      Theme = {currentTheme}
      setTheme = {setCurrentTheme}
      /> */}

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/planning' element={<PlanningPage/>}/>
          <Route path='/auth/callback' element={<AuthCallback/>}/>
        </Routes>
      </BrowserRouter>
    </PageWrapper>
  )
}

export default App
