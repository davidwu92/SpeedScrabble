import React, { useState } from 'react'

const MultiPlayer = () => {

  const [multiState, setMultiState] = useState({
    result: []
  })

  

const testFunc = () => {
 
let obj 

 let result = obj.map(e =>  e.word) 

 setMultiState({ ...multiState, result })
 
}



  return(
    <>
    <div>
      <h1>Multiplayer Page</h1>
      <button onClick={testFunc}>TEST</button>
      <p>{JSON.stringify(multiState.result)}</p>
    </div>
    </>
  )
}

export default MultiPlayer