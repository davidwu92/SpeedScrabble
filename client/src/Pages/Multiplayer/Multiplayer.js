import React, { useState } from 'react'

const MultiPlayer = () => {
  const [multiState, setMultiState] = useState({

  })

const testFunc = () => {
  let obj = ([{"word":"aa"},{"word":"ab"},{"word":"ad"},{"word":"ae"},{"word":"ag"},{"word":"ah"},{"word":"ai"},{"word":"al"},{"word":"am"},{"word":"an"},{"word":"ar"},{"word":"as"},{"word":"at"},{"word":"aw"},{"word":"ax"},{"word":"ay"},{"word":"ba"},{"word":"be"},{"word":"bi"},{"word":"bo"},{"word":"by"},{"word":"da"},{"word":"de"},{"word":"do"},{"word":"ed"},{"word":"ef"},{"word":"eh"},{"word":"el"},{"word":"em"},{"word":"en"},{"word":"er"},{"word":"es"},{"word":"et"},{"word":"ew"},{"word":"ex"},{"word":"fa"},{"word":"fe"},{"word":"gi"},{"word":"go"},{"word":"ha"},{"word":"he"},{"word":"hi"},{"word":"hm"},{"word":"ho"},{"word":"id"},{"word":"if"},{"word":"in"},{"word":"is"},{"word":"it"},{"word":"jo"},{"word":"ka"},{"word":"ki"},{"word":"la"},{"word":"li"},{"word":"lo"},{"word":"ma"},{"word":"me"},{"word":"mi"},{"word":"mm"},{"word":"mo"},{"word":"mu"},{"word":"my"},{"word":"na"},{"word":"ne"},{"word":"no"},{"word":"nu"},{"word":"od"},{"word":"oe"},{"word":"of"},{"word":"oh"},{"word":"oi"},{"word":"ok"},{"word":"om"},{"word":"on"},{"word":"op"},{"word":"or"},{"word":"os"},{"word":"ow"},{"word":"ox"},{"word":"oy"},{"word":"pa"},{"word":"pe"},{"word":"pi"},{"word":"po"},{"word":"qi"},{"word":"re"},{"word":"sh"},{"word":"si"},{"word":"so"},{"word":"ta"},{"word":"te"},{"word":"ti"},{"word":"to"},{"word":"uh"},{"word":"um"},{"word":"un"},{"word":"up"},{"word":"us"},{"word":"ut"},{"word":"we"},{"word":"wo"},{"word":"xi"},{"word":"xu"},{"word":"ya"},{"word":"ye"},{"word":"yo"},{"word":"za"}])

 let result = obj.map(e => e.word)
 console.log(result)
}
  


  return(
    <div>
      <h1>Multiplayer Page</h1>
      <button onClick={testFunc}>TEST</button>
    </div>
  )
}

export default MultiPlayer