import React from 'react'

const Help = () => {
  return(
    <div className="container">
      <h1 className="center white-text">Help Section</h1>
      <div className="row green white-text">
        <h4 className="center">Speed Scrabble Rules</h4>
        <li>Objective: Use all the tiles in your hand to create a single crossword formation of English words!</li>
        <li>Once START is clicked, the timer begins and you are dealt a new hand of 12 letter tiles. Drag and drop those tiles into the grid to make your crossword.</li>
        <li>You can also drag tiles into the green SWAP square to swap unwanted tiles out for new ones up to three times.</li>
        <li>All words in your crossword will read from left to right AND up to down; no diagonals.</li>
        <li>All your words must be legal in the Scrabble English Dictionary!</li>
        <li>Once you've finished your crossword, hit "DONE" to finish the game.</li>
      </div>

      <div className="row red white-text">
        <h4 className="center">Scoring Factors</h4>
        <h6 className="center">Your score is calculated from three factors: your Letter Score, Word Length Bonus, and time taken.</h6>
        <br/>
        <br/>
        <h5 className="center">Letter Score</h5>
        <h6 className="center">For each letter in each word submitted, the LETTER SCORE is increased by that letter's point value.</h6>
        <div className="center">
          <h6>5-Point Letters: A, D, E, G, I, L, N, O, R, S, T, and U.</h6>
          <h6>6-Point Letters: B, C, F, H, M, P, V, W, Y</h6>
          <h6>7-Point Letter: K</h6>
          <h6>8-Point Letters: Q, J, X, and Z.</h6>
        <h6>Since the Letter Score counts every letter in every word, higher scores can be achieved by using more letters in multiple words!</h6>
        </div>
        <br/>
        <br/>
        <h5 className="center">Word Length Bonus</h5>
        <h6 className="center">Each word in your formation also adds to your word length bonus!</h6>
          <li>The Word Length Bonus of a formation with one 10-letter word and one 3-letter word is 100 + 9: 109.</li>
          <li>But the Word Length Bonus of a formation with one 7-letter word and one 6-letter word is 49 + 36: 85.</li>
          <li>And the Word Length Bonus of a formation with ELEVEN 2-letter words would be 11 times 4: 44.</li>
          <li>Thusly, having longer words and having more words will correlate to a greater Word Length Bonus!</li>
        <br/>
        <h5 className="center">Your Board Score is the sum of your Letter Score and Word Length Bonus.</h5>
        <br/>
        <br/>
        <h5 className="center">Time Deduction</h5>
        <h6 className="center">Your final score takes your Board Score and subtracts 5x the square root of the seconds elapsed.</h6>
        <li>In other words, completing and submitting a 100-point formation in 81 seconds would result in a final score of 100 - 9x5: 55.</li>
        <li>If the same 100-point formation were submitted in 400 seconds, the final score would be 100 - 20x5: 0 points!</li>
        <li>Minimize the time deduction by working quickly and minimizing the number of time penalties applied!</li>
        <li></li>
      </div>

      <div className="row blue white-text">
        <h4 className="center">Time Penalties</h4>
        <h6 className="center">Time Penalties will be applied for the following actions:</h6>
        <h6>1. Using a letter swap and getting a new letter (3-second penalty).
            If you use a letter swap and get another copy of the same letter, NO time penalty will be applied.    
        </h6>
        <h6>2. Submitting illegal words (words that aren't in the Scrabble Dictionary).
            Upon hitting "Done", you will receive a 5-second penalty for EACH illegal word submitted; be sure that all the words in your formation are legal before hitting "Done"!
        </h6>
      </div>

    </div>
  )
}

export default Help