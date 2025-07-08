///Global variables
let currentGuess = 0;
let maxGuesses = 6;
let word = "";
let guess_skeleton = [0,0,0,0,0];
let allowed_guesses = loadAllowedGuesses();

function open_mode_menu() {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('settings-menu').style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('mode-menu').style.display = 'block';
  resetGame();
}

function close_mode_menu() {
  document.getElementById('mode-menu').style.display = 'none';
  document.getElementById('settings-menu').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
}

function open_settings_menu() {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('mode-menu').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('settings-menu').style.display = 'block';
}

function open_win_menu() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('win?').innerText = "YOU WIN";
  document.getElementById('job-review').innerText = "GOOD BOY!";
  document.getElementById('win_message').innerText = `The word was ${word}`;
}

function open_lose_menu() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('win?').innerText = "YOU DIED";
  document.getElementById('job-review').innerText = "";
  document.getElementById('win_message').innerText = `The word was ${word}`;
}

// When closing the popup, also hide the overlay
function close_game_over() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('game-over').style.display = 'none';
}



async function open_json_file(mode) {
    let file_name = mode + ".json";
    console.log("Opening JSON file:", file_name);
    try {
        const response = await fetch(file_name);
        const words = await response.json();
        let random_word = words[Math.floor(Math.random() * words.length)];
        return random_word;
    } catch (error) {
        console.error("Error loading JSON:", error);
        return "error";
    }
}

async function loadAllowedGuesses() {
  const response = await fetch('official_allowed_guesses.txt');
  allowed_guesses = await response.json();
  return allowed_guesses;
}

async function start_game(mode) {
  document.getElementById('mode-menu').style.display = 'none';
  document.getElementById('settings-menu').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  
  //// set initial ID's
  
  const inputID = document.getElementById('guess-input');
  const guess_listID = document.getElementById('guesses');

  ///open the JSON file based on the mode
  word = await open_json_file(mode);
  console.log("Selected word:", word);
  
}

function submitGuess() {
  const inputID = document.getElementById('guess-input');
  const guess_listID = document.getElementById('guesses');
  const guess_text = inputID.value.trim().toLowerCase();

  if (!allowed_guesses.includes(guess_text)) {
    alert("Invalid guess. Please enter a valid word.");
    return; 
  }

  if (guess_text.length === 0) {
    alert("Please enter a guess.");
    return;
  }

  if (guess_text.length !== 5) {
    alert("Guess must be exactly 5 letters.");
    return;
  }

  if (guess_text === "") {
     alert("Please enter a guess.");
    return;
  }

  currentGuess++;

    let guessID_txt = "guess " + currentGuess;
    let guessID = document.getElementById(guessID_txt);
    ///guessID.innerHTML = `<span>${guess_text}</span>`;
    inputID.value = ""; // Clear input field
    console.log(word + " vs " + guess_text);


  if (guess_text === word) {
    open_win_menu()
    resetGame();
    return;
  }
  else if (currentGuess >= maxGuesses) {
    open_lose_menu()
    resetGame();
    return;
  }

  else {
    // First, create arrays to track used letters
    let answerArr = word.split('');
    let guessArr = guess_text.split('');
    let used = [false, false, false, false, false];
    guess_skeleton = [0, 0, 0, 0, 0];

    // First pass: check for greens
    for (let i = 0; i < 5; i++) {
      if (guessArr[i] === answerArr[i]) {
        guess_skeleton[i] = 2; // Green
        used[i] = true;
        guessArr[i] = null; // Mark as used in guess
      }
    }

    // Second pass: check for yellows
    for (let i = 0; i < 5; i++) {
      if (guess_skeleton[i] === 0 && guessArr[i]) {
        for (let j = 0; j < 5; j++) {
          if (!used[j] && guessArr[i] === answerArr[j]) {
            guess_skeleton[i] = 1; // Yellow
            used[j] = true;
            break;
          }
        }
      }
    }

  for (let i = 0; i < guess_skeleton.length; i++) {
    if (guess_skeleton[i] === 0) {
      guessID.innerHTML += `<span style="color: gray;">${guess_text[i]}</span>`;
    } else if (guess_skeleton[i] === 1) {
      guessID.innerHTML += `<span style="color: yellow;">${guess_text[i]}</span>`;
    } else if (guess_skeleton[i] === 2) {
      guessID.innerHTML += `<span style="color: green;">${guess_text[i]}</span>`;
    }
  }
  console.log("Guess skeleton:", guess_skeleton);
}
}

// Add event listener for Enter key to submit guess
window.onload = function() {
  const input = document.getElementById('guess-input');
  input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      submitGuess();
    }
  });
};

function resetGame() {
  currentGuess = 0;
  guess_skeleton = [0, 0, 0, 0, 0];

  for (let i = 1; i <= maxGuesses; i++) {
    let guessID_txt = "guess " + i;
    let guessID = document.getElementById(guessID_txt);
    if (guessID) {
        guessID.innerText = '';
    }
}
}