import { useState, useEffect } from 'react'
import './index.css'
import './GlobalStyles/App.css'
import LandingPage from './LandingPage/LandingPage.tsx'
import { Background, Panel } from 'reactflow'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ThemeToggle from './Components/ThemeToggle.tsx'
import BackgroundNorm from './Components/BackgroundNorm.tsx'

function App() {
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() =>{
       const cachedTheme = localStorage.getItem('theme')
       if(cachedTheme === 'light' || cachedTheme === 'dark') return cachedTheme
       
       const darkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
       return darkPreference ? 'dark' : 'light'; 
    });

    useEffect(() => {
      localStorage.setItem('theme', currentTheme);
      
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [currentTheme]);

  return (
    <div>
      <BackgroundNorm Theme={currentTheme} />
      <ThemeToggle  
      Theme = {currentTheme}
      setTheme = {setCurrentTheme}
      />

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
