import { useState, useEffect } from 'react'
import './index.css'
import './GlobalStyles/App.css'
import LandingPage from './LandingPage/LandingPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ThemeToggle from './Components/ThemeToggle.tsx'
import ToggleLogic from './Hooks/ToggleLogic.tsx'
import BackgroundNorm from './Components/BackgroundNorm.tsx'
import PlanningPage from './PlanningPage/PlanningPage.tsx'
import PageWrapper from './PageWrapper.tsx'

function App() {
    const {currentTheme, setCurrentTheme} = ToggleLogic();

  return (
    <PageWrapper>
      <BackgroundNorm Theme={currentTheme} />
      <ThemeToggle  
      Theme = {currentTheme}
      setTheme = {setCurrentTheme}
      />

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/planning' element={<PlanningPage/>}/>
        </Routes>
      </BrowserRouter>
    </PageWrapper>
  )
}

export default App
