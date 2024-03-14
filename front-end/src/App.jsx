
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'

function App() {
  

  return (
    <>
      <p>Compramos Juntos</p>
      <Routes>

        {/*Public Pages*/}

        <Route path='/home' element={<Home/>}/>

        {/*Private Page*/}

      </Routes>
    </>
  )
}

export default App
