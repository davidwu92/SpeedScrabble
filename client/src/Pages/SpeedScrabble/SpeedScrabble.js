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
    [ [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null],
    ]
  )
//MY HAND
  const [hand, setHand] = useState(
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
  )

  const tileClick = (e) => {
    console.log(e)
  }
  return(
    <>
      <div className="container">
        <h1 className="center">Speed Scrabble</h1>
      </div>

          {/* GAME */}
          <div className="row red lighten-1" style={{width: "100%", margin:"0px"}}>
            {/* MY HAND */}
            <div className="col s12 m4 l4">
              {hand.map(tile=>
              <div 
                className="center" 
                onClick={tileClick}
                style={{backgroundColor: "green", margin:"2px", 
                width:"4vw", height:"4vw", display:"inline-block"}}>
                <h5>{tile}</h5>
              </div>)}
            </div>

            {/* GRID BOARD */}
            <div className="col s12 m6 l6">
              {grid.map((row, rowNum)=>(
                <div id="gridRow" 
                  // className="center"
                >
                  {row.map((square, colNum)=>(<div className="gridSquare" id={"square"+colNum+rowNum} style={{backgroundColor: "blue", width:"4vw", height:"4vw", display:"inline-block", borderStyle:"solid", borderWidth:"1px"}}><h5>{square}({colNum},{rowNum})</h5></div>))}
                </div>
              ))}
            </div>

            {/* TIMER */}
            <div className="col s6 m2 l2">
              <h3>{seconds}</h3>
              <button className="btn" onClick={()=>setIsRunning(true)}>Start Clock</button>
              <button className="btn" onClick={()=>setIsRunning(false)}>Pause Clock</button>
            </div>

          </div>
        

    </>
  )
}

export default SpeedScrabble