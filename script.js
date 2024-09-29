let wordToGuess = "";  // Initialize an empty word
let currentRow = 0;
let currentCol = 0;
const maxRows = 6;
const maxCols = 5;
let isGameOver = false;

const rows = document.querySelectorAll(".row");
const keys = document.querySelectorAll(".key");
const keyz = document.querySelectorAll(".keyS");

// Fetch the word list and select a random word
fetch('samplewords.txt')
    .then(response => response.text())
    .then(data => {
        const wordList = data.split('\n').map(word => word.trim().toUpperCase());
        wordToGuess = wordList[Math.floor(Math.random() * wordList.length)]; // Randomly select a word
        console.log("Selected Word: ", wordToGuess); // Debugging purpose
    })
    .catch(error => {
        console.error("Error fetching word list:", error);
    });

// Enable the first row
enableCurrentRow();

function enableCurrentRow() {
    const currentRowCells = rows[currentRow].querySelectorAll(".cell");
    currentRowCells.forEach(cell => {
        cell.disabled = false;
    });
}

// Function to capture both physical and on-screen keyboard input
document.addEventListener("keydown", (e) => {
    if (!isGameOver) {
        handleKeyPress(e.key.toUpperCase());
    }
});

keyz.forEach(keyS => {
    keyS.addEventListener("click", () => {
        if (!isGameOver) {
            handleKeyPress(keyS.innerText.toUpperCase());
        }
    });
});
keys.forEach(key => {
    key.addEventListener("click", () => {
        if (!isGameOver) {
            handleKeyPress(key.innerText.toUpperCase());
        }
    });
});

function handleKeyPress(keyS) {
    const currentRowCells = rows[currentRow].querySelectorAll(".cell");
    
    if (keyS === "ENTER") {
        if (currentCol === maxCols) {
            checkGuess();
        } else {
            alert("Please fill all letters before submitting.");
        }
    } else if (keyS === "DEL" || keyS === "BACKSPACE") {
        if (currentCol > 0) {
            currentCol--;
            currentRowCells[currentCol].value = "";
        }
    } else if (keyS.match(/^[A-Z]$/) && currentCol < maxCols) {
        currentRowCells[currentCol].value = keyS;
        currentCol++;
    }
}

// Check the current guess
function checkGuess() {
    const currentRowCells = rows[currentRow].querySelectorAll(".cell");
    let guess = "";
    currentRowCells.forEach(cell => {
        guess += cell.value.toUpperCase();
    });

    if (guess.length === maxCols) {
        // Color the grid based on the guess
        for (let i = 0; i < maxCols; i++) {
            const cell = currentRowCells[i];
            const letter = guess[i];
            const keyButton = Array.from(keys).find(k => k.innerText === letter);
            
            if (wordToGuess[i] === letter) {
                cell.style.backgroundColor = "green";
                keyButton.style.backgroundColor = "green";
            } else if (wordToGuess.includes(letter)) {
                cell.style.backgroundColor = "yellow";
                keyButton.style.backgroundColor = keyButton.style.backgroundColor !== "green" ? "yellow" : "green";
            } else {
                cell.style.backgroundColor = "gray";
                keyButton.style.backgroundColor = "gray";
            }
        }

        if (guess === wordToGuess) {
            alert("Congratulations! You guessed the word.");
            isGameOver = true;
        } else if (currentRow < maxRows - 1) {
            currentRow++;
            currentCol = 0;
            enableCurrentRow();
        } else {
            alert("Game over! The word was " + wordToGuess);
            isGameOver = true;
        }
    }
}

// Get modal element
const modal = document.getElementById("howToPlayModal");
// Get the button that opens the modal
const btn = document.getElementById("howToPlayBtn");
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
