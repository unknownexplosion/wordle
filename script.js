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
            showWinPopup(wordToGuess);
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
document.addEventListener('DOMContentLoaded', (event) => {
    const keyboard = document.querySelector('.keyboard');
    let isDragging = false;
    let isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;

    keyboard.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    // Touch events for mobile devices
    keyboard.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDragging);

    function startDragging(e) {
        if (e.target === keyboard) {
            isDragging = true;
            isResizing = false;
        } else if (e.offsetX > keyboard.offsetWidth - 15 && e.offsetY > keyboard.offsetHeight - 15) {
            isResizing = true;
            isDragging = false;
        } else {
            return;
        }

        keyboard.classList.add('dragging');
        
        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
        }

        startLeft = keyboard.offsetLeft;
        startTop = keyboard.offsetTop;
        startWidth = keyboard.offsetWidth;
        startHeight = keyboard.offsetHeight;

        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging && !isResizing) return;

        let clientX, clientY;

        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        if (isDragging) {
            keyboard.style.left = startLeft + deltaX + 'px';
            keyboard.style.top = startTop + deltaY + 'px';
            keyboard.style.transform = 'none';
            keyboard.style.bottom = 'auto';
        } else if (isResizing) {
            const newWidth = Math.max(300, startWidth + deltaX);
            const newHeight = Math.max(150, startHeight + deltaY);
            keyboard.style.width = newWidth + 'px';
            keyboard.style.height = newHeight + 'px';
            adjustKeySize();
        }
    }

    function stopDragging() {
        isDragging = false;
        isResizing = false;
        keyboard.classList.remove('dragging');
    }

    function adjustKeySize() {
        const keys = keyboard.querySelectorAll('.key, .keyS');
        const keyboardWidth = keyboard.offsetWidth;
        const keySize = Math.max(30, Math.min(60, keyboardWidth / 12));
        keys.forEach(key => {
            key.style.width = `${keySize}px`;
            key.style.height = `${keySize}px`;
            key.style.fontSize = `${keySize / 2.5}px`;
        });
    }

    // Initial key size adjustment
    adjustKeySize();

    // Adjust key size on window resize
    window.addEventListener('resize', adjustKeySize);
});
function checkWord() {
    // Your existing code to check the word

    if (wordIsCorrect) {
        // Show the modal
        const modal = document.getElementById('winModal');
        const correctWordSpan = document.getElementById('correctWord');
        correctWordSpan.textContent = currentWord; // Replace 'currentWord' with your variable that holds the correct word
        modal.style.display = 'block';

        // Close the modal when clicking on <span> (x)
        const span = document.getElementsByClassName('close')[0];
        span.onclick = function() {
            modal.style.display = 'none';
        }

        // Close the modal when clicking outside of it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
}
function showModal() {
    document.getElementById('modal').style.display = 'block';
  }
  
  function closeModal() {
    document.getElementById('modal').style.display = 'none';
  }

function showWinPopup(correctWord) {
    const popup = document.getElementById('win-popup');
    const correctWordSpan = document.getElementById('correct-word');
    correctWordSpan.textContent = correctWord;
    popup.style.display = 'block';

    // Trigger confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    });

    // Add more confetti for a more dramatic effect
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 250);

    // Close the popup when the close button is clicked
    document.getElementById('close-popup').onclick = function() {
        popup.style.display = 'none';
    }
}
