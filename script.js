import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

console.log(rightGuessString);

function initBoard() {
  let board = document.getElementById("game-board");

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

document.addEventListener('keyup', (e) => {
  if (guessesRemaining === 0){
    return 
  }

  let pressedKey = String(e.key)
  if (pressedKey === "Backspace" && nextLetter !== 0){
    deleteLetter()
    return
  }

  if (pressedKey === 'Enter'){
    checkGuess()
    return
  }

  let found = pressedKey.match(/[a-z]/gi)
  if (!found || found.length > 1){
    return
  }else{
    insertLetter(pressedKey)
  }

})

function insertLetter(pressedKey){
  if(nextLetter === 5){
    return
  }
  pressedKey = pressedKey.toLowerCase()

  let row = document.getElementsByClassName('letter-row')[6-guessesRemaining]
  let box = row.children[nextLetter]
  box.textContent = pressedKey
  box.classList.add("filled-box")
  currentGuess.push(pressedKey)
  nextLetter += 1
}

function deleteLetter(){
  let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
  let box = row.children[nextLetter - 1]
  box.textContent = ''
  box.classList.remove('filled-box')
  currentGuess.pop()
  nextLetter -= 1
}

function checkGuess (){
  let row = document.getElementsByClassName('letter-row')[6-guessesRemaining]
  let guessString = validateGuess()

  if (guessString == '') {
    return
  } 

  shadeGameBoard(row)
  processGuess(guessString)
}

function shadeGameBoard(row){
  let rightGuess = Array.from(rightGuessString)

  for(let i = 0; i < 5; i++){
    let letterColor = ''
    let box = row.children[i]
    let letter = currentGuess[i]

    let letterPosition = rightGuess.indexOf(currentGuess[i])

    if (letterPosition == -1){
      letterColor = 'grey'
    } else {
      if (currentGuess[i] === rightGuess[i]){
        letterColor = 'green'
      }else{
        letterColor = 'yellow'
      }
    rightGuess[letterPosition] = '#'
    }

    let delay = 250 * i
    setTimeout(() => {
      box.style.backgroundColor = letterColor
      shadeKeyBoard(letter,letterColor)
    }, delay)
  }
}

function processGuess(guessString){
  if (guessString === rightGuessString){
      alert('You guessed right! Game over!')
      guessesRemaining = 0
      return
  } else {
      guessesRemaining -= 1;
      currentGuess = [];
      nextLetter = 0

    if(guessesRemaining === 0){
      alert("You've run out of guesses! Game over!")
      alert(`The right word was: ${rightGuessString}`)
    }
  }
}

function validateGuess() {
  let guessString = ''
  for(const val of currentGuess){
    guessString += val
  }

  if(guessString.length != 5){
    alert('Not enough letters!')
    return ''
  }

  if (!WORDS.includes(guessString)){
    alert('Word not in list!')
    return ''
  }

  return guessString
}

function shadeKeyBoard(letter, color){
  for (const elem of document.getElementsByClassName('keyboard-button')){
    if (elem.textContent === letter){
      let oldColor = elem.style.backgroundColor
      if (oldColor === 'green'){
        return
      }
      if (oldColor === 'yellow' && color !== 'green'){
        return
      }
      elem.style.backgroundColor = color
      break
    }
  }
}

document.getElementById('keyboard-cont').addEventListener('click', (e) => {
  const target = e.target
  
  if (!target.classList.contains('keyboard-button')){
    return
  }
  let key = target.textContent
  
  if (key === 'Del'){
    key = 'Backspace'
  }

  document.dispatchEvent(new KeyboardEvent('keyup', {'key':key}))

})

initBoard();
