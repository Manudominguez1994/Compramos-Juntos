import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

function Principal() {
  return (
    <div>

        <Navbar/>
        
        <h1>Principal</h1>
        <Link to={"/creategroup"}><button>Create group</button></Link>
        <Link to={"/categories"}><button>Join Group</button></Link>

    </div>
  )
}

export default Principal