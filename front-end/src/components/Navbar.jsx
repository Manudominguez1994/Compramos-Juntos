import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div>

        <Link to="/home">Home</Link>
        <Link to="/myprofile">My Profile</Link>


    </div>
  )
}

export default Navbar