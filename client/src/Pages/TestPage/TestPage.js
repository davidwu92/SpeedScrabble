import React, {useState} from 'react'

const TestPage = () => {

  const [grid, setGrid] = useState(
    [[1,2,3], [4,5,6], [7,8,9]]
    // [[null,null,3], [null,null,6], [null,null,9]]
  )

  const changeGrid = ()=>{
    setGrid(grid=>{
      // let newGrid = [[10,20,30],[40,50,60],[70,80,90]]
      let newGrid=grid
      newGrid[0] = [5,5,5]
      let parseGrid = JSON.parse(JSON.stringify(newGrid))
      return(parseGrid)
      // let newGrid = grid
      // newGrid[0][0] = 5
      // return(newGrid)
    })
  }

  return(
    <>
      <div className="container">
        <h1>Testing Page</h1>
        <button onClick={changeGrid}>Change Grid</button>
        <div className="green">
          {grid.map(array=>(array.map(number=><h5>{number}</h5>)))}
        </div>
      </div>
    </>
  )
}

export default TestPage