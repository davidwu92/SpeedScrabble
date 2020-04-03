import React, {useState, useEffect} from 'react'
// import moment from 'moment'
import '../SpeedScrabble/speedScrabble.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAPI from '../../utils/UserAPI'
import WordAPI from '../../utils/WordAPI'
import ScoreAPI from '../../utils/ScoreAPI'
import Axios from 'axios';
import moment from 'moment'

const { getUser } = UserAPI
const { getWord } = WordAPI
const { addScore, getScores } = ScoreAPI

const TestPage = () => {
  toast.configure()
  //on pageload, get user info for My past scores.
  const [username, setUsername]=useState("scrabbler")
  const [myScores, setMyScores]=useState({scores: []})
  let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
  let userId = JSON.parse(JSON.stringify(localStorage.getItem("userId")))
//get username
  useEffect(()=>{
    getUser(token)
      .then(({data})=>{
        setUsername(data.username)
      })
      .catch(e=>console.error(e))
  },[])
// show score history
  useEffect(()=>{
    getScores(userId)
      .then(({data})=>{
        let pastScores = []
        data.forEach(scoreObj=>{
          let object = {
            time: scoreObj.time,
            formationScore: scoreObj.formationScore,
            score: scoreObj.score,
            words: scoreObj.words,
            date: moment(scoreObj.createdAt).format('MMMM D, YYYY'),
          }
          pastScores.push(object)
        })
        setMyScores({scores: pastScores})
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
  const dragStart = (e) => { //MOUSE EVENTS
    //Tiles in hand have dataset.tile for LETTER + Hand Num
    //Tiles placed on board have dataset.tile AND dataset.coordinates
    e.dataTransfer.setData("tile", e.target.dataset.tile)
    e.dataTransfer.setData("coordinates", e.target.dataset.coordinates)
  }

  //HAND or GRID: Allow things to drag over.
  const dragOver = e => e.stopPropagation()

  //GRID: dropping tiles onto grid (from anywhere)
  const dropTile = e => { //e represents the grid's mouse event of DROPPING A TILE.
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
      {autoClose: 5000,hideProgressBar: true,type: "error"})
    }
  }

  //GRID: onClick check grid space info. Not used atm.
  const seeData = (e)=>{
    // console.log(e.nativeEvent)
    // console.log("dataset.tile: " +e.target.dataset.tile)
    // console.log("dataset.coordinates: "+e.target.dataset.coordinates)
  }

  //SWAP BOX: dropping a tile into the swap-tile area.
  const [swapCount, setSwapCount] = useState(3)
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
      if(startPosition!="undefined"){ //if a GRID tile is swapped.
        let newGrid = grid
        newGrid[startPosition[1]][startPosition[0]] = bagLetters[newLetterIndex]+handNum
        setGrid(JSON.parse(JSON.stringify(newGrid)))
      }
      toast(<>{tileData[0]==bagLetters[newLetterIndex]? 
        <>You swapped your "{tileData[0]}" for another "{bagLetters[newLetterIndex]}".<br/>No time penalty applied.</>
        :<>You swapped your "{tileData[0]}" for {"AEFHILMNORSX".includes(bagLetters[newLetterIndex])? <>an "{bagLetters[newLetterIndex]}".</>:<>a "{bagLetters[newLetterIndex]}".</>}<br/>3 second penalty applied.</>}</>,
      {autoClose: 5000,hideProgressBar: true,type: "success"})
    }
    else { //you're out of swaps.
      toast("You ran out of swaps!", {autoClose:3000, hideProgressBar: true, type:"error"})
    }
  }
  const touchSwapTile = () =>{
    if(swapCount>0){
      setSwapCount(swapCount=>swapCount-1)
      let handNum = selectedTile[2] ? parseInt(""+selectedTile[1]+selectedTile[2]):parseInt(selectedTile[1])
      let bagLetters = "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ"
      //take out my hand's letters from the bag.
      handLetters.forEach(letter=> bagLetters = bagLetters.replace(letter, ""))
      //pick a letter from the remaining letters to replace the swapped tile.
      let newLetterIndex = Math.floor(Math.random()*(98-handLetters.length))
      let newHand = handLetters
      newHand[handNum] = bagLetters[newLetterIndex] //this is new letter.
      setHandLetters(JSON.parse(JSON.stringify(newHand)))

      //time penalty
      if(selectedTile[0]==bagLetters[newLetterIndex]){setSeconds(seconds=>seconds+3)}

      if(selectedSpace){ //if a GRID tile is swapped.
        let newGrid = grid
        newGrid[selectedSpace[1]][selectedSpace[0]] = bagLetters[newLetterIndex]+handNum
        setGrid(JSON.parse(JSON.stringify(newGrid)))
      }
      toast(<>{selectedTile[0]==bagLetters[newLetterIndex]? 
        <>You swapped your "{selectedTile[0]}" for another "{bagLetters[newLetterIndex]}".<br/>No time penalty applied.</>
        :<>You swapped your "{selectedTile[0]}" for {"AEFHILMNORSX".includes(bagLetters[newLetterIndex])? <>an "{bagLetters[newLetterIndex]}".</>:<>a "{bagLetters[newLetterIndex]}".</>}<br/>3 second penalty applied.</>}</>,
      {autoClose: 5000,hideProgressBar: true,type: "success"})
      setSelectedTile("")
      setSelectedSpace("")
    } else { //you're out of swaps.
      toast("You ran out of swaps!", {autoClose:3000, hideProgressBar: true, type:"error"})
      setSelectedTile("")
      setSelectedSpace("")
    }
  }
//TOUCH FUNCTIONS~~~
  const [selectedTile, setSelectedTile]= useState("")
  const [selectedSpace, setSelectedSpace]=useState("")
  const touchStart = (e) =>{ //TOUCH EVENTS
    e.stopPropagation()
    let swapDataSet = e.currentTarget.dataset.swap
    let tileDataSet = e.currentTarget.dataset.tile
    let gridDataSet = e.currentTarget.dataset.coordinates
    if(!selectedTile){ //No tile is currently selected.
      if(tileDataSet && tileDataSet!="Null"){ //You are SELECTING A TILE...
        if(!gridDataSet){ //...from your hand...
          let handNum = tileDataSet[2] ? parseInt(""+tileDataSet[1]+tileDataSet[2]):parseInt(tileDataSet[1])
          if (!handUsed[handNum]){ //...that is unused.
            // console.log("You are selecting an unused tile from your hand.")
            setSelectedTile(tileDataSet)
            setSelectedSpace(gridDataSet)
          } else { //...that HAS been used; can't be selected.
            // console.log("You can't select a tile from your hand that's already been placed on the board.")
          }
        } else {//...that's on the grid.
          // console.log("You are selecting a tile on the board.")
          setSelectedTile(tileDataSet)
          setSelectedSpace(gridDataSet)
        }
      } else { //You just clicked something w/o selecting a tile.
        // console.log("You touched a space without selecting a tile.")
      }
    }
    else { //a tile is currently selected.
      if(!selectedSpace){ //if the already-selected tile is in my hand...
          if(tileDataSet && !gridDataSet){ //...and we click another hand tile (reselect from hand)
            setSelectedTile(tileDataSet)
            setSelectedSpace(gridDataSet)
          }
          else if(tileDataSet=="Null"){ //...and we select an empty grid space.
            // console.log("You are moving a hand tile to an empty space.")
            let handNum = selectedTile[2] ? parseInt(""+selectedTile[1]+selectedTile[2]):parseInt(selectedTile[1])
            let updateHand = handUsed
            updateHand[handNum] = true //show that the selected tile is USED.
            setHandUsed(JSON.parse(JSON.stringify(updateHand)))
            let newGrid = grid
            newGrid[gridDataSet[1]][gridDataSet[0]] = selectedTile //set grid string to selected tile.
            setGrid(JSON.parse(JSON.stringify(newGrid)))
            setSelectedTile("")
            setSelectedSpace("")
          }
          else if(swapDataSet=="tileSwap"){ //...and we select tile swap.
            // console.log(`You want to swap out ${selectedTile}`)
            touchSwapTile()
          } else { //...and we tap any other space.
            // console.log(`Deselecting ${selectedTile}`)
            setSelectedTile("")
            setSelectedSpace("")
          }
      }
      else { //if the already-selected tile is on the board...
        if(tileDataSet=="Null"){ //...and we tap an empty space.
          // console.log("You are moving a grid tile to an empty space.")
          let newGrid = grid
          newGrid[gridDataSet[1]][gridDataSet[0]] = selectedTile
          newGrid[selectedSpace[1]][selectedSpace[0]]="Null"
          setGrid(JSON.parse(JSON.stringify(newGrid)))
          setSelectedTile("")
          setSelectedSpace("")
        } else if (gridDataSet){ //...and we tap another grid tile.
          // console.log("You are swapping two grid tile positions.")
          let newGrid = grid
          newGrid[gridDataSet[1]][gridDataSet[0]] = selectedTile
          newGrid[selectedSpace[1]][selectedSpace[0]]=tileDataSet
          setGrid(JSON.parse(JSON.stringify(newGrid)))
          setSelectedTile("")
          setSelectedSpace("")
        } else if (swapDataSet){ //...and we tap on swap space.
          // console.log("You want to swap a grid tile out.")
          touchSwapTile()
          setSelectedTile("")
          setSelectedSpace("")
        } else { //...and we tap any other space.
          // console.log(`Deselecting ${selectedTile}`)
          setSelectedTile("")
          setSelectedSpace("")
        }
      }
      
    }
  }

  // const seeSelected = () =>{
  //   console.log("Selected Tile: "+selectedTile)
  //   console.log("Selected Space: "+selectedSpace)
  // }

//MY HAND
  //Letters in my hand.
  const [handLetters, setHandLetters] = useState(["~","P", "R", "E", "S", "S", "~", "S", "T", "A", "R", "T"])
  //Used Letters from my hand.
  const [handUsed, setHandUsed] = useState([true,true,true,true,true,true,true,true,true,true,true,true,])

  //currently not using this.
  // const shuffleHand = () =>{
  //   console.log("SHUFFLE HAND")
  //   //time penalty: 3 seconds.
  //   setSeconds(seconds=>seconds+3)
  // }

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
    setHandUsed([false,false,false,false,false,false,false,false,false,false,false,false])
  }

//SUBMIT BUTTON: Check if board placement is legal, read words off, pass to checkWords.
  const readWords = () =>{

    //INITIAL CHECKS: timer must be running, hand must be entirely used.
    if(!isRunning){
      toast("You can't be done before you hit 'Start'.", {autoClose: 5000,hideProgressBar: true,type: "error"})
      return(false) //stop readWords program.
    }
    if (handUsed.includes(false)){
      toast("You need to use your entire hand.",{autoClose: 5000,hideProgressBar: true,type: "error"})
      return(false) //stop readWords program.
    }

    let tilePositions = [] //["rowNum+colNum", ...]

    //GET ALL HORIZONTAL WORDS
    let xWordsFound = [] //xWordsFound = [["rowNum+colNum+letter+handNum", ],[],[]]
    grid.forEach((row, rowNum)=>{
      let nullIndex = -1
      let tilesInRow = []
      row.forEach((tile, colNum)=>{
        if (tile=="Null"){
          nullIndex = colNum
        } else{ //TILE FOUND.
          if(colNum == nullIndex+1){ //check if NO TILE on its left, add Space.
            tilesInRow.push("space")
            tilesInRow.push(rowNum + ""+colNum + tile)
              if(!tilePositions.includes(rowNum +""+colNum)){tilePositions.push(rowNum+""+colNum)}
          }
          else{ //if LETTER on left, don't add space.
            tilesInRow.push(rowNum + ""+colNum + tile)
              if(!tilePositions.includes(rowNum +""+colNum)){tilePositions.push(rowNum+""+colNum)}
          }
        }
      })
      while (tilesInRow.indexOf("space")!=-1){ //while tilesInRow contains "space"...
        let piece = tilesInRow.slice(0,tilesInRow.indexOf("space"))
        if(piece.length>1) {xWordsFound.push(piece)}
        let rest = tilesInRow.slice(tilesInRow.indexOf("space")+1)
        tilesInRow = rest
      }
      if (tilesInRow.length>1){xWordsFound.push(tilesInRow)}
    })
    
    //GETTING VERTICAL WORDS
    let yWordsFound = []
    for (let colNum=0; colNum<10; colNum++){
      let tilesInColumn = []
      let nullIndex = -1
      grid.forEach((row, rowNum) => {
        if (row[colNum]=="Null"){ //NO TILE
          nullIndex = rowNum
        } else { 
          if(rowNum == nullIndex+1){ //Tile is under a Null Space
            tilesInColumn.push("space")
            tilesInColumn.push(rowNum + "" + colNum + row[colNum])
              if(!tilePositions.includes(rowNum +""+colNum)){tilePositions.push(rowNum+""+colNum)}
          }
          else{ //Tile is under another tile
            tilesInColumn.push(rowNum + "" + colNum + row[colNum])
              if(!tilePositions.includes(rowNum +""+colNum)){tilePositions.push(rowNum+""+colNum)}
          }
        }
      })
      while (tilesInColumn.indexOf("space")!=-1){ //while tilesInColumn contains "space"...
        let piece = tilesInColumn.slice(0,tilesInColumn.indexOf("space"))
        if(piece.length>1) {yWordsFound.push(piece)}
        let rest = tilesInColumn.slice(tilesInColumn.indexOf("space")+1)
        tilesInColumn = rest
      }
      if (tilesInColumn.length>1){yWordsFound.push(tilesInColumn)}
    }

    //CHECKING LEGALITY OF TILE PLACEMENT
    let legalTiles = [tilePositions[0]] //stores legally-placed tiles' positions.
    let neighborPositions = [] //stores all legal positions to put tiles in.
    const getNeighbors = (position) => { //pushes all neighboring positions into neighborPositions array.
      let rowNum = parseInt(position[0])
      let colNum = parseInt(position[1])
      if(rowNum != 0) {neighborPositions.push((rowNum-1) +""+colNum)}
      if(rowNum != 9){neighborPositions.push((rowNum+1) +""+colNum)}
      if(colNum !=0){neighborPositions.push(rowNum + "" + (colNum -1))}
      if(colNum !=9){neighborPositions.push(rowNum + "" + (colNum +1))}
    }
    getNeighbors(tilePositions[0]) //get neighbor positions of FIRST tile.
    let uncheckedPositions = tilePositions.slice(1) //uncheckedPositions has all tiles not-yet checked.

    const findLegalTiles = () =>{ //finds LEGAL TILES in uncheckedPositions.
      let remainingPositions = []
      uncheckedPositions.forEach(position=>{
        if (neighborPositions.includes(position)){ //if the position is in neighborPosition...
          if(!legalTiles.includes(position)){legalTiles.push(position)} // push to legalTiles.
          getNeighbors(position)
        } else { //position NOT present in neighborPosition.
          remainingPositions.push(position)
        }
      })
      uncheckedPositions = remainingPositions
    }
    let whileLimit = 0
    while (uncheckedPositions.length && whileLimit<20){
      findLegalTiles()
      whileLimit++
    }
    if(uncheckedPositions.length){ //positions here still not found to be legally placed...
      toast(`All the words on your board must be connected in a single crossword formation.`, 
      {autoClose: 5000,hideProgressBar: true,type: "error"})
      return(false) //stop readWords program.
    } else {
      console.log("LEGAL TILE PLACEMENT.") //Tiles placed legally; good to check word legality.
    }

    // GET ALL WORDS (simple array of strings, to pass to dictionary for final check.)
    let pureWordStrings = []
    xWordsFound.forEach(xWord=>{
      let extractString = ''
      xWord.forEach(tile=>{
        extractString += tile[2]
      })
      pureWordStrings.push(extractString)
    })
    yWordsFound.forEach(yWord=>{
      let extractString = ''
      yWord.forEach(tile=>{
        extractString += tile[2]
      })
      pureWordStrings.push(extractString)
    })
    console.log("pureWordStrings:")
    console.log(pureWordStrings) //this is the array of words submitted. All words have length >= 2.
    checkWords(pureWordStrings)
    return(pureWordStrings)
  } //end of readWords()

  const checkWords = (pureWordStrings) => {
    let lowerCase = pureWordStrings.map(v => v.toLowerCase())
    let subWord = {
      word: lowerCase
    }
    // console.log(subWord)
    getWord(subWord)
      .then(({ data }) => {
        let checkedWords = []
        let subArr = data.forEach((arr) => {
          checkedWords.push(arr.word)
        })
        // array of non words
        let notWord = subWord.word.filter(val => !checkedWords.includes(val))
        // array of correct words
        let yesWord = subWord.word.filter(val => checkedWords.includes(val))
        // console.log("Array of illegal words:")
        // console.log(notWord)
        // console.log("Array of legal words:")
        // console.log(yesWord)
        if(notWord.length==1){ //if any words are illegal...
          setSeconds(seconds=>seconds+5)
          toast(<>You submitted an illegal word: {notWord[0]}.<br/>
                  5 second penalty added.</>, 
          {autoClose: 5000,hideProgressBar: true,type: "error"})
        } else if (notWord.length ==2){
          setSeconds(seconds=>5*notWord.length+seconds)
          toast(<>You submitted {notWord.length} illegal words: {notWord.join(" and ")}.<br/>
                  {5*notWord.length} second penalty added.</>, 
          {autoClose: 5000,hideProgressBar: true,type: "error"})
        } else if (notWord.length > 2){
          setSeconds(seconds=>5*notWord.length+seconds)
          toast(<>You submitted {notWord.length} illegal words: {notWord.slice(0, notWord.length-1).join(", ")}, and {notWord[notWord.length-1]}.<br/>
                  {5*notWord.length} second penalty added.</>, 
          {autoClose: 5000,hideProgressBar: true,type: "error"})
        } else { //ALL WORDS ARE LEGAL.
          scoreWords(yesWord)
        }
      })
      .catch(e => console.error(e))
  } //end of checkWords()
  
  //FINAL STEP IN GAME SUBMISSION: SCORE WORDS. All are legal.
  const scoreWords = (yesWord) => {
    setIsRunning(false)
    let word = yesWord.join('')
    // console.log(word)
    // const scrabble = {
    //   a: 1,    b: 3,    c: 3,    d: 2,    e: 1,    f: 4,    g: 2,    h: 4,    i: 1,
    //   j: 8,    k: 5,    l: 1,    m: 3,    n: 1,    o: 1,    p: 3,    q: 10,   r: 1,
    //   s: 1,    t: 1,    u: 1,    v: 4,    w: 4,    x: 8,    y: 4,    z: 10    }
    const newLetterValues = { //no points worth more than 8.
      a: 5,    b: 6,    c: 6,    d: 5,    e: 5,    f: 6,    g: 5,    h: 6,    i: 5,
      j: 8,    k: 7,    l: 5,    m: 6,    n: 5,    o: 5,    p: 6,    q: 8,   r: 5,
      s: 5,    t: 5,    u: 5,    v: 6,    w: 6,    x: 8,    y: 6,    z: 8    }

    let letterSum = [...word].reduce((accu, letter) => {
      return accu + newLetterValues[letter.toLowerCase()]
    }, 0)

    let wordBonus = 0
    yesWord.forEach(word=>wordBonus = wordBonus + word.length*word.length)
    document.getElementById("gameDone").innerText="RESULTS"
    // console.log("Your Words:")
    // console.log(yesWord.join(", "))
    document.getElementById("wordsSubmitted").innerText="Words Submitted: " + yesWord.join(", ")
    // console.log("Letter Value Total: ")
    // console.log(letterSum)
    document.getElementById("letterScore").innerText="Letter Score: "+letterSum
    // console.log("Word Length Bonus: ")
    // console.log(wordBonus)
    document.getElementById("wordBonus").innerText="Word Length Bonus: "+wordBonus
    let formationScore = letterSum + wordBonus
    // console.log("Formation Score: ")
    // console.log(letterSum + wordBonus)
    document.getElementById("formationScore").innerText="Formation Score: "+formationScore
    // console.log("Time:")
    // console.log(seconds)
    document.getElementById("timeTaken").innerText="Time: "+seconds + " seconds"
    
    let score = Math.floor(10*((letterSum + wordBonus)-(5*Math.sqrt(seconds))))/10
    console.log("Final Score: ")
    console.log(score)
    document.getElementById("finalScore").innerText="Final Score: " + score
    let scores = {
      formationScore: formationScore,
      score: score,
      time: seconds,
      words: yesWord.join(", "),
      userLink: userId
    }
    addScore(scores)
      .then(() => {
        getScores(userId)
          .then(({ data }) => {
            let pastScores = []
            data.forEach(scoreObj=>{
              let object = {
                time: scoreObj.time,
                formationScore: scoreObj.formationScore,
                score: scoreObj.score,
                words: scoreObj.words,
                date: moment(scoreObj.createdAt).format('MMMM D, YYYY'),
              }
              pastScores.push(object)
            })
            setMyScores({scores: pastScores})
          })
          .catch(e => console.error(e))
        })
        .catch(e => console.error(e))
  } //end of scoreWords()
  
  // const seeScores = () =>{
  //   console.log(myScores)
  // }
  
  return(<>Test Page</>)
  // return(
  //   <>
  //     <div onTouchStart={selectedTile ? touchStart : null}> {/* ENTIRE PAGE IN THIS DIV; allows for deselect. */}
  //       <div className="container">
  //         <h3 className="center">Speed Scrabble TESTPAGE</h3>

  //       </div>
  //         {/* <button onClick={seeSelected}>SEE SELECTED</button> */}
  //         {/* <button onClick={checkWords}>checkWords Test</button> */}
  //         {/* <button onClick={seeScores}>SEE SCORES TEST</button> */}
  //         <br></br>
          
  //         {/* GAME */}
  //         <div className="row white" id="gameRow">
            
  //           {/* MY HAND + TILESWAP */}
  //           <div className="col s12 m12 l5" style={{padding:"0px 4px 0px 4px", marginBottom:"10px"}}>
  //             <div className="col s12 m12 l12 center">
  //               <button className="btn-large pink left" onClick={newGame}>START GAME</button>
  //               <h4 style={{display: "inline"}}>Game Time: {seconds}</h4>
  //               <button className="btn-large black right" onClick={readWords}>DONE</button>
  //             </div>
  //             <br/>
  //             <br/>
  //             <br/>
  //             <br/>
  //             <div className="col s4 m4 l4 center" style={{padding:"0px 0px 0px 0px"}}>
  //               <h5>TILE SWAP</h5>
  //               <div id="swapTile" className="valign-wrapper"
  //                 data-swap="tileSwap"
  //                 onDrop={swapOneTile}
  //                 onDragOver={allowDrop}
  //                 onTouchStart={touchStart}
  //               ><h5 className="white-text center">{swapCount ? `TILE SWAP (${swapCount})` : "OUT OF SWAPS"}</h5>
  //               </div>
  //             </div>
  //             <div className="col s8 m8 l8 center" style={{padding:"0px 0px 0px 0px"}}>
  //               <h5>{username.toUpperCase()}'S HAND</h5>
  //               {handLetters.map((tile, index)=>
  //                 <div 
  //                   draggable={!handUsed[index]}
  //                   onDragStart={dragStart}
  //                   onDragOver={dragOver}
  //                   onTouchStart={touchStart} //touching a tile SELECTS it.
  //                   data-tile={tile+index} //dataset.tile = LETTER+HAND NUMBER
  //                   id="handTile"
  //                   className="center" 
  //                   style={!handUsed[index] ? {backgroundColor: (selectedTile==tile+index && !selectedSpace) ? "green":"red", margin:"2px", padding:"1vw",
  //                           width:"4vw", height:"4vw",display:"inline-block", borderStyle:"outset", touchAction: "none"}
  //                         :{backgroundColor: "grey", margin:"2px",padding:"1vw",
  //                           width:"4vw", height:"4vw", display:"inline-block", borderStyle:"inset", touchAction: "none"}}>
  //                   <h5 className="white-text">{tile}</h5>
  //                 </div>)}
  //             </div>

  //             <div className="center">
  //               <h5 id="gameDone"></h5>
  //               <h6 id="wordsSubmitted"></h6>
  //               <h6 id="letterScore"></h6>
  //               <h6 id="wordBonus"></h6>
  //               <h6 id="formationScore"></h6>
  //               <h6 id="timeTaken"></h6>
  //               <h6 id="finalScore"></h6>
  //             </div>
  //           </div>

  //           {/* GRID BOARD */}
  //           <div className="col s12 m12 l7 center" id="gridBoardRow">
  //             {grid.map((row, rowNum)=>(
  //               <div id="gridRow" 
  //                 // className="center"
  //               >
  //                 {row.map((square, colNum)=>
  //                   (<div className="gridSquare" 
  //                         draggable={square=="Null"? false : true}
  //                         onDragStart={dragStart}
  //                         onDrop={dropTile}
  //                         onDragOver={allowDrop}
  //                         onTouchStart={touchStart}
  //                         onClick={seeData}
  //                         id="gridSquare"
  //                         data-tile={square} //dataset.tile = LETTER+HAND NUMBER or "NULL"
  //                         data-coordinates={""+colNum+rowNum}
  //                         style={{backgroundColor: square=="Null"? "floralwhite": (selectedTile==square && selectedSpace) ? "green":"red",
  //                               width:"4vw", height:"4vw", padding:"1vw", display:"inline-block", 
  //                               borderStyle: square=="Null"?"dashed":"outset", borderWidth:"1px", borderColor: square=="Null"?"goldenrod":null,touchAction: "none"}}>
  //                       <h5 data-tile={square} data-coordinates={""+colNum+rowNum} className="center white-text"
  //                           style={square=="Null"? {visibility:"hidden"}:{visibility:"visible"}}>
  //                           {square[0]}</h5>
  //                     </div>))}
  //               </div>
  //             ))}
  //           </div>
            
  //         </div> {/* END GAME CONTAINER */}
          
  //         {/* SCORE HISTORY TABLE */}
  //         <div className="row center">
  //             <table className="centered responsive-table">
  //               <thead>
  //                 <tr className="blue lighten-4 blue-grey-text text-darken-4">
  //                   {/* <th>Game #</th> */}
  //                   <th>Date</th>
  //                   <th>Formation Score</th>
  //                   <th>Time</th>
  //                   <th>Final Score</th>
  //                   <th>Words</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                   {
  //                     myScores.scores.length ? myScores.scores.map((object, index)=>
  //                       <tr>
  //                         {/* <td>{index+1}</td> */}
  //                         <td>{object.date}</td>
  //                         <td>{object.formationScore}</td>
  //                         <td>{object.time} seconds</td>
  //                         <td>{object.score}</td>
  //                         <td>{object.words}</td>
  //                       </tr>) : null
  //                   }
  //               </tbody>
  //             </table>
  //         </div>
  //     </div>
  //   </>
  // )
}

export default TestPage