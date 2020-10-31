/*----- constants -----*/
const WORDS = [
    'BUFFALO', 'JAWBREAKER', 'MICROWAVE', 'MATRIX',
    'JUMBO', 'JACKPOT', 'COMPUTER SCIENCE', 
    'RHYTHM', 'AWKWARD'
];
const PANEL_WIDTH = 15;
const FATAL_NUM_GUESSES = 6;

/*----- app's state (variables) -----*/
let secretWord;
let guessWord;
let gameStatus;  //null = in progress; 👎 = lose; 👍 = win
let wrongLetters;

/*----- cached element references -----*/
const guessEl = document.getElementById('guess');
const replayBtn = document.getElementById('replay');
const gallowsEl = document.getElementById('gallows');
const letterBtns = document.querySelectorAll('section > button');
const msgEl = document.getElementById('msg');

/*----- event listeners -----*/
document.querySelector('section').addEventListener('click', handleLetterClick);
document.getElementById('replay').addEventListener('click', init);

/*----- functions -----*/
init();

//in response to user interaction, update state and call render
function handleLetterClick(evt) {
    const letter = evt.target.textContent;
    //exit function if the following conditions
    if (evt.target.tagName !== 'BUTTON' || gameStatus) return;
    //if letter is in secretWord
        //update guessWord with where all occurances of that letter is in the secret
    if (secretWord.includes(letter)) {
        let newGuess = ''
        for (let i = 0; i < secretWord.length; i++) {
            newGuess += secretWord.charAt(i) === letter ? letter : guessWord.charAt(i);
        }
        guessWord = newGuess
    } else { //otherwise, add letter to wrong letters array
        wrongLetters.push(letter);
    }
    gameStatus = getGameStatus();


    render();
}

function getGameStatus() {
    if (guessWord === secretWord) return "👍";
    if (wrongLetters.length === FATAL_NUM_GUESSES) return "👎";
    return null;
}

//render transfers all state to the DOM
function render() {
    guessEl.textContent = guessWord;
    replayBtn.style.visibility = gameStatus ? 'visible' : 'hidden'
    gallowsEl.style.backgroundPositionX = `-${wrongLetters.length * PANEL_WIDTH}vmin`;
    renderButtons();
    renderMessage();
}

function renderMessage() {
    if (gameStatus === "👍") {
        msgEl.textContent = 'CONGRATULATIONS! YOU WIN!';
    } else if(gameStatus === "👎") {
        msgEl.textContent = 'RIP YOU LOSE';
    } else {
        const numRemaining = FATAL_NUM_GUESSES - wrongLetters.length
        msgEl.innerHTML = `GOOD LUCK!<br><span>YOU HAVE ${numRemaining} WRONG GUESS${numRemaining === 1 ? '' : 'ES'} REMAINING</span>`;
    }
}

function renderButtons() {
    letterBtns.forEach(function(btn) {
        const letter = btn.textContent
        btn.disabled = guessWord.includes(letter) || wrongLetters.includes(letter);
        if (guessWord.includes(letter)) {
            btn.className = 'valid-letter';
        } else if (wrongLetters.includes(letter)) {
            btn.className = 'wrong-letter';
        } else {
            btn.className = '';
        }
    })
}

function init() {
    const rndIdx = Math.floor(Math.random() * WORDS.length);
    secretWord = WORDS[rndIdx];
    guessWord = '';
    //init guessWord with underscores for each char in secretWord
    for (let char of secretWord) {
        guessWord += (char === ' ') ? ' ' : '_';
    }
    //using regular expression
    //guessWord = secretWord.replace(/[A-Z]/g, '_');
    gameStatus = null;
    wrongLetters = [];
    render(); 
}

