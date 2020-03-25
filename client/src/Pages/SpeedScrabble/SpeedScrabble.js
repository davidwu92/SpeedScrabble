import React, {useState, useEffect} from 'react'
import moment from 'moment'
import './speedScrabble.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SpeedScrabble = () => {
  toast.configure()

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

  //GAME GRID STATE; change "Null" to letter+handNum upon tile drop. 
  //Only display first char of string in grid, as long as it isn't Null.
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
  
  //HAND or GRID: Starting to drag a tile.
  const dragStart = (e) => {
    //Tiles in hand have dataset.tile for LETTER + Hand Num
    //Tiles placed on board have dataset.tile AND dataset.coordinates
    e.dataTransfer.setData("tile", e.target.dataset.tile)
    e.dataTransfer.setData("coordinates", e.target.dataset.coordinates)
  }
  //HAND or GRID: Allow things to drag over.
  const dragOver = e => e.stopPropagation()
  
  
  //GRID: dropping tiles onto grid (from anywhere)
  const dropTile = e => { //e represents the grid event of DROPPING A TILE.
    e.preventDefault()
    let tileData = e.dataTransfer.getData("tile") //LETTER+HANDNUM of dragged tile.
    let dropPosition = e.target.dataset.coordinates
    // console.log("col: "+dropPosition[0] + "row: " +dropPosition[1])
    // console.log("Tile Info: "+e.dataTransfer.getData("tile"))
    // console.log("Original Coordinates: " + e.dataTransfer.getData("coordinates"))

    if (grid[dropPosition[1]][dropPosition[0]] =="Null"){//IF dropped position has no tiles...
      //update hand to reflect that a tile was used.
      let handNum = tileData[2] ? parseInt(""+tileData[1]+tileData[2]):parseInt(tileData[1])
      let updateHand = handUsed
      updateHand[handNum] = true
      setHandUsed(JSON.parse(JSON.stringify(updateHand)))
      let newGrid = grid
      
      //set grid string to tileData (LETTER+HANDNUM).
      newGrid[dropPosition[1]][dropPosition[0]] = tileData
      
      if (e.dataTransfer.getData("coordinates")!="undefined"){ 
        //if the tile came from board, put "Null" @ startPosition
        let startPosition = e.dataTransfer.getData("coordinates")
        newGrid[startPosition[1]][startPosition[0]] = "Null"
      }
      setGrid(JSON.parse(JSON.stringify(newGrid)))
    }
    else if (e.dataTransfer.getData("coordinates")!="undefined"){
      //IF you're trying to swap grid tile positions...
      let startPosition = e.dataTransfer.getData("coordinates")
      let swapTargetTile = grid[dropPosition[1]][dropPosition[0]]
      let newGrid = grid
      //put swapTargetTile @ startPosition and tileData @ dropPosition.
      newGrid[startPosition[1]][startPosition[0]] = swapTargetTile
      newGrid[dropPosition[1]][dropPosition[0]] = tileData
      setGrid(JSON.parse(JSON.stringify(newGrid)))
    }
    else {
      toast(`You can't drop tiles from your hand onto occupied spaces.`,
      {autoClose: 9000,hideProgressBar: true,type: "error"})
    }
  }

//MY HAND
  const [handLetters, setHandLetters] = useState( //Letters in my hand.
    ["_", "Y", "O", "U", "R", "_", "_", "H", "A", "N", "D","_"]
  )
  const [handUsed, setHandUsed] = useState( //Used Letters from my hand.
    [false,false,false,false,false,false,false,false,false,false,false,false,]
  )
  
  const shuffleHand = () =>{
    console.log("SHUFFLE HAND")
  }
  const newGame = () =>{
    //Start Timer, reset grid, deal tiles for hand.
    setIsRunning(true)
    setGrid([ ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
      ["Null","Null","Null","Null","Null","Null","Null","Null","Null","Null"],
    ])
    let scrabbleLetters = "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ"
    let numbers = []
    let newHand = []
    for (let i = 0; i<12;i++){
      let randomNumber = Math.floor(Math.random()*98)
      while (numbers.includes(randomNumber))
      {randomNumber = Math.floor(Math.random()*98)}
      numbers.push(randomNumber)
      newHand.push(scrabbleLetters[randomNumber])
    }
    setHandLetters(newHand)
    setHandUsed([false,false,false,false,false,false,false,false,false,false,false,false])
  }
  const testButton = () => {
    console.log(handUsed)
  }
  const seeData = (e)=>{
    console.log("dataset.tile: " +e.target.dataset.tile)
    console.log("dataset.coordinates: "+e.target.dataset.coordinates)
  }
  return(
    <>
      <div className="container">
        <h1 className="center">Speed Scrabble</h1>
        <button className="btn black" onClick={newGame}>NEW GAME</button>
      </div>
        <button onClick={testButton}>TEST</button>
        <button onClick={seeData}>SEE GRID</button>
      {/* <div className="row"> */}
      {/* </div> */}
        {/* GAME */}
        <div className="row white" style={{width: "100%", margin:"0px"}}>
          
          {/* MY HAND */}
          <div className="col s12 m4 l4 center">
            <h6 className="center">Your Hand</h6>
            <button className="btn" onClick={shuffleHand}>Shuffle All Tiles</button>
            <br></br>
            <br></br>
            {handLetters.map((tile, index)=>
              <div 
                draggable="true"
                onDragStart={dragStart}
                onDragOver={dragOver}
                // onDragEnd={dragEnd}
                data-tile={tile+index} //dataset.tile = LETTER+HAND NUMBER
                id="handTile"
                className="center" 
                style={!handUsed[index] ? {backgroundColor: "red", margin:"2px", 
                        width:"4vw", height:"4vw",display:"inline-block", borderStyle:"outset"}
                      :{backgroundColor: "grey", margin:"2px",
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
                        draggable={square=="Null"? false : true}
                        onDragStart={dragStart}
                        // onDragEnd={dragEnd}
                        onDrop={dropTile}
                        onDragOver={allowDrop}
                        onClick={seeData}
                        id="gridSquare"
                        data-tile={square} //dataset.tile = LETTER+HAND NUMBER or "NULL"
                        data-coordinates={""+colNum+rowNum}
                        style={{backgroundColor: square=="Null"? "floralwhite":"red", width:"4vw", height:"4vw",
                              display:"inline-block", borderStyle: square=="Null"?"dashed":"outset", borderWidth:"1px"}}>
                      <h5 data-tile={square} data-coordinates={""+colNum+rowNum} className="center white-text"
                          style={square=="Null"? {visibility:"hidden"}:{visibility:"visible"}}>
                          {square[0]}</h5>
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

        </div> {/* END GAME CONTAINER */}
        
        <div className="row">
          EMPTY PADDING/FOOTER?
        </div>

    </>
  )
}

export default SpeedScrabble