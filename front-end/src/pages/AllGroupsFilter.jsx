import React, { useState } from 'react'
import Navbar from '../components/Navbar'

function AllGroupsFilter() {

  const [changeComponent, setChangeComponent] = useState(1)
  const [thisCategory, setThisCategory] = useState("")

  const handleSetComponent2 = () => {
    setChangeComponent(2)
  }
  const handleSetComponent3 = () => {
    setChangeComponent(3)
  }
  const handleSetComponent1 = () => {
    setChangeComponent(1)
  }
  const handleCategorieSelection = (selectedCategorie) => {
    setThisCategory(selectedCategorie);
  };

console.log(changeComponent, "valor de mi cahngecomponent");

  return (
    <div>
      <Navbar />
      <h1>Groups</h1>
      {/*Categories*/}
      <div>
        <button onClick={handleSetComponent2}>Food</button>
        <button onClick={handleSetComponent2}>Home</button>
        <button onClick={handleSetComponent2}>Medicine</button>
      </div>
      {/*Product*/}
      <div>
        <h3>Products of the category  </h3>
      </div>
      {/*Groups*/}
    </div>
  )
}

export default AllGroupsFilter