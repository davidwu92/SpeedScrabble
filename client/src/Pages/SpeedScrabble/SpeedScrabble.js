import React, {useState, useEffect} from 'react'
import moment from 'moment'
import './speedScrabble.css'

const SpeedScrabble = () => {
  // const [gameState, setGameState] = useState({
    
  // })

  //GAME TIMER
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  useEffect(()=> {
    if(isRunning) {
      const id = window.setInterval(()=>{
        setSeconds(seconds => seconds+1)
      },1000)
      return ()=>window.clearInterval(id)
      //WHEN we start this running, useEffect is given this CLEANUP function.
      //this function is called whenever the useEffect happens again (whenever isRunning changes!)
    }
  },[isRunning])

  //GAME GRID STATE; change "null" to a letter upon drag and drop.
  const [grid, setGrid] = useState(
    [ ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
    ]
  )
  // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_ondragstart
  const allowDrop = e=>e.preventDefault()
  const dropTile = e => {
    // e.preventDefault()
    console.log("col "+e.target.id[0])
    console.log("row " +e.target.id[1])
    let data = e.dataTransfer.getData("tile")
    let newGrid = grid
    newGrid[e.target.id[1]][e.target.id[0]] = data[0]
    let parseGrid = JSON.parse(JSON.stringify(newGrid))
    setGrid(parseGrid)
  }

//MY HAND FUNCTION
  const [hand, setHand] = useState(
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J","K","L"]
  )
  const [dragState, setDragState] = useState({tileNum: "",value: ""})
  
  const dragStart = (e) => {
    console.log(""+e.target.id[1]+e.target.id[2]) //tileNum: position in hand
    console.log(e.target.id[0]) //letter
    e.dataTransfer.setData("tile", e.target.id)
    // setDragState({tileNum: e.target.id[0], value:"no"})
  }

  const dragOver = (e) => {
    e.stopPropagation()
  }
  const dragEnd = e => {
    // console.log(e)
  }

  const testButton = () => {
    setGrid(grid=>{
      let newGrid = grid
      newGrid[0][0]="A"
      let parseGrid = JSON.parse(JSON.stringify(newGrid))
      return(parseGrid)
    })
  }
  const seeGrid = ()=>{
    console.log(grid)
  }
  return(
    <>
      <div className="container">
        <h1 className="center">Speed Scrabble</h1>
      </div>
      <button onClick={testButton}>TEST</button>
      <button onClick={seeGrid}>SEE GRID</button>
          {/* GAME */}
          <div className="row white" style={{width: "100%", margin:"0px"}}>
            {/* MY HAND */}
            <div className="col s12 m4 l4">
              <h6 className="center">My Hand</h6>
              <button className="btn">Shuffle All Tiles</button>
              <br></br>
              <br></br>
              {hand.map((tile, index)=>
              <div 
                draggable="true"
                onDragStart={dragStart}
                onDragOver={dragOver}
                onDragEnd={dragEnd}
                id={tile+index}
                className="center" 
                style={{backgroundColor: "red", margin:"2px", 
                width:"4vw", height:"4vw", display:"inline-block", borderStyle:"outset"}}>
                <h5 className="white-text">{tile}</h5>
              </div>)}
            </div>

            {/* GRID BOARD */}
            <div className="col s12 m7 l7">
              {grid.map((row, rowNum)=>(
                <div id="gridRow" 
                  // className="center"
                >
                  {row.map((square, colNum)=>
                    (<div className="gridSquare" 
                          onDrop={dropTile}
                          onDragOver={allowDrop}
                          id={""+colNum+rowNum}
                          style={{backgroundColor: square=="Null"? "floralwhite":"red", width:"4vw", height:"4vw",
                                display:"inline-block", borderStyle: square=="Null"?"dashed":"outset", borderWidth:"1px"}}>
                        <h5 className="center white-text" style={square=="Null"? {visibility:"hidden"}:{visibility:"visible"}}>{square}</h5>
                      </div>))}
                </div>
              ))}
            </div>

            {/* TIMER */}
            <div className="col s6 m1 l1">
              <h3>{seconds}</h3>
              <button className="btn" onClick={()=>setIsRunning(true)}>Start Clock</button>
              <button className="btn" onClick={()=>setIsRunning(false)}>Pause Clock</button>
            </div>

          </div>
        

    </>
  )
}

export default SpeedScrabble