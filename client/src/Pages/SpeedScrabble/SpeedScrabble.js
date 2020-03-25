import React, {useState, useEffect} from 'react'
// import moment from 'moment'
import './speedScrabble.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAPI from '../../utils/UserAPI'

const { getUser } = UserAPI

const SpeedScrabble = () => {
  toast.configure()
  //on pageload, get user info for My past scores.
  const [username, setUsername]=useState("scrabbler")
  const [myScores, setMyScores]=useState([])
  let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
  useEffect(()=>{
    getUser(token)
      .then(({data})=>{
        setUsername(data.username)
        setMyScores(data.scores)
      })
      .catch(e=>console.error(e))
  },[])


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
  //DRAG-DROP EXAMPLES https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_ondragstart
  
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
  
  const [swapCount, setSwapCount] = useState(3)
  //SWAP BOX: dropping a tile into the swap-tile area.
  const swapOneTile = e =>{
    if(swapCount>0){
      e.preventDefault()
      setSwapCount(swapCount=>swapCount-1)
      let tileData=e.dataTransfer.getData("tile")
      let startPosition = e.dataTransfer.getData("coordinates") //"undefined" if tile grabbed from hand.

      let handNum = tileData[2] ? parseInt(""+tileData[1]+tileData[2]):parseInt(tileData[1])
      let bagLetters = "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ"
      //take out my hand's letters from the bag.
      handLetters.forEach(letter=> bagLetters = bagLetters.replace(letter, ""))
      //pick a letter from the remaining letters to replace the swapped tile.
      let newLetterIndex = Math.floor(Math.random()*(98-handLetters.length))
      let newHand = handLetters
      newHand[handNum] = bagLetters[newLetterIndex] //this is new letter.
      setHandLetters(JSON.parse(JSON.stringify(newHand)))

      //time penalty
      if(tileData[0]==bagLetters[newLetterIndex]){setSeconds(seconds=>seconds+3)}

      // console.log(bagLetters[newLetterIndex]+handNum)
      if(startPosition!="undefined"){
        let newGrid = grid
        newGrid[startPosition[1]][startPosition[0]] = bagLetters[newLetterIndex]+handNum
        setGrid(JSON.parse(JSON.stringify(newGrid)))
      }
      toast(<>{tileData[0]==bagLetters[newLetterIndex]? 
        <>You swapped your "{tileData[0]}" for another "{bagLetters[newLetterIndex]}".<br/>No time penalty applied.</>
        :<>You swapped your "{tileData[0]}" for {"AEFHILMNORSX".includes(bagLetters[newLetterIndex])? <>an "{bagLetters[newLetterIndex]}".</>:<>a "{bagLetters[newLetterIndex]}".</>}<br/>3 second penalty applied.</>}</>,
      {autoClose: 5000,hideProgressBar: true,type: "success"})
    }
  }


//MY HAND
  //Letters in my hand.
  const [handLetters, setHandLetters] = useState(["~","P", "R", "E", "S", "S", "S", "T", "A", "R", "T","!"])
  //Used Letters from my hand.
  const [handUsed, setHandUsed] = useState([true,true,true,true,true,true,true,true,true,true,true,true,])
  //Starting Hand tracked for final score?
  const [startingHand, setStartingHand] = useState("")

  //currently not using this.
  const shuffleHand = () =>{
    console.log("SHUFFLE HAND")
    //time penalty: 3 seconds.
    setSeconds(seconds=>seconds+3)
  }

//NEW GAME BUTTON
  const newGame = () =>{
    //Start Timer from zero, reset grid, deal tiles for hand.
    setSwapCount(3)
    setSeconds(0)
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
    for (let i = 0; i<handLetters.length;i++){
      let letterNumber = Math.floor(Math.random()*98) //scrabbleLetters has length 98
      //if letterNumber was already chosen, randomize again.
      while (numbers.includes(letterNumber)){letterNumber = Math.floor(Math.random()*98)}
      numbers.push(letterNumber)
      newHand.push(scrabbleLetters[letterNumber])
    }
    setHandLetters(newHand)
    setStartingHand(newHand.join(''))
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
        <h3 className="center">Speed Scrabble</h3>
        <button className="btn pink" onClick={newGame}>START GAME</button>
        <h5 className="right">Game Time: {seconds}</h5>
      </div>
        <button onClick={testButton}>TEST</button>
        <button onClick={seeData}>SEE GRID</button>
        <br></br>
        {/* GAME */}
        <div className="row white" style={{width: "100%", padding:"1vw 0px 1vw 0px",margin:"0px"}}>
          
          {/* MY HAND + TILESWAP */}
          <div className="col s12 m5 l5" style={{padding:"0px 4px 0px 4px", marginBottom:"10px"}}>
            <div className="col s4 m4 l4 center" style={{padding:"0px 0px 0px 0px"}}>
              <h5>{swapCount} swaps left.</h5>
              <div id="swapTile" className="valign-wrapper"
                onDrop={swapOneTile}
                onDragOver={allowDrop}
              ><h5 className="white-text center">{swapCount ? "TILE SWAP" : "OUT OF SWAPS"}</h5>
              </div>
            </div>
            <div className="col s8 m8 l8 center" style={{padding:"0px 0px 0px 0px"}}>
              <h5>{username}'s hand</h5>
              {handLetters.map((tile, index)=>
                <div 
                  draggable={!handUsed[index]}
                  onDragStart={dragStart}
                  onDragOver={dragOver}
                  data-tile={tile+index} //dataset.tile = LETTER+HAND NUMBER
                  id="handTile"
                  className="center" 
                  style={!handUsed[index] ? {backgroundColor: "red", margin:"2px", padding:"1vw",
                          width:"4vw", height:"4vw",display:"inline-block", borderStyle:"outset"}
                        :{backgroundColor: "grey", margin:"2px",padding:"1vw",
                          width:"4vw", height:"4vw", display:"inline-block", borderStyle:"inset"}}>
                  <h5 className="white-text">{tile}</h5>
                </div>)}
            </div>
          </div>

          {/* GRID BOARD */}
          <div className="col s12 m6 l6 center">
            {grid.map((row, rowNum)=>(
              <div id="gridRow" 
                // className="center"
              >
                {row.map((square, colNum)=>
                  (<div className="gridSquare" 
                        draggable={square=="Null"? false : true}
                        onDragStart={dragStart}
                        onDrop={dropTile}
                        onDragOver={allowDrop}
                        onClick={seeData}
                        id="gridSquare"
                        data-tile={square} //dataset.tile = LETTER+HAND NUMBER or "NULL"
                        data-coordinates={""+colNum+rowNum}
                        style={{backgroundColor: square=="Null"? "floralwhite":"red", width:"4vw", height:"4vw", padding:"1vw",
                              display:"inline-block", borderStyle: square=="Null"?"dashed":"outset", borderWidth:"1px"}}>
                      <h5 data-tile={square} data-coordinates={""+colNum+rowNum} className="center white-text"
                          style={square=="Null"? {visibility:"hidden"}:{visibility:"visible"}}>
                          {square[0]}</h5>
                    </div>))}
              </div>
            ))}
          </div>
          
          <div className="col s12 m1 l1 center">
            <h5>{username}</h5>
            <h6>Score History</h6>
            {myScores.length ? myScores.map(score=>(
              <>
                <ul>{score}</ul>
              </>
              ))
              :null}
          </div>
        </div> {/* END GAME CONTAINER */}
        
        <div className="row">
          EMPTY PADDING/FOOTER?
        </div>

    </>
  )
}

export default SpeedScrabble