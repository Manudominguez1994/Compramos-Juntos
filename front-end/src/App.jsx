
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IsPrivate from './components/IsPrivate'

import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import NotFound from './pages/NotFound'
import Error from './pages/Error'
import CreateGroup from './pages/CreateGroup'
import GroupDetails from './pages/GroupDetails'
import AllGroupsFilter from './pages/AllGroupsFilter'


function App() {
  

  return (
    <>
      
      <Routes>

        {/*Public Pages*/}

        <Route path='/' element={<Home/>}/>

        {/*Private Page*/}

        <Route path='/home' element={<IsPrivate><AllGroupsFilter/></IsPrivate>}/>
        <Route path='/myprofile' element={<IsPrivate><MyProfile/></IsPrivate>}/>
        <Route path='/creategroup' element={<IsPrivate><CreateGroup/></IsPrivate>}/>
        <Route path='/groupdetails/:groupid' element={<IsPrivate><GroupDetails/></IsPrivate>}/>


        {/*Gestion de errores*/}

        <Route path='/error' element={<Error/>}/>
        <Route path='/*' element={<NotFound/>}/>

      </Routes>
    </>
  )
}

export default App
