import { useState } from 'react'
import './index.css'
import './GlobalStyles/App.css'
import LandingPage from './LandingPage/LandingPage.tsx'
import { Background, Panel } from 'reactflow'
import { BrowserRouter, Routes } from 'react-router-dom'

function App() {

  return (
    <div>
      {/* <BrowserRouter>
        <Routes>


        </Routes>
      </BrowserRouter> */}
        <LandingPage>
        </LandingPage>
    </div>
  )
}

export default App
