
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IsPrivate from './components/IsPrivate'

import Home from './pages/Home'
import Principal from './pages/Principal'
import MyProfile from './pages/MyProfile'
import NotFound from './pages/NotFound'
import Error from './pages/Error'


function App() {
  

  return (
    <>
      
      <Routes>

        {/*Public Pages*/}

        <Route path='/' element={<Home/>}/>

        {/*Private Page*/}

        <Route path='/home' element={<IsPrivate><Principal/></IsPrivate>}/>
        <Route path='/myprofile' element={<IsPrivate><MyProfile/></IsPrivate>}/>


        {/*Gestion de errores*/}

        <Route path='/error' element={<Error/>}/>
        <Route path='/*' element={<NotFound/>}/>

      </Routes>
    </>
  )
}

export default App
