//initializing global variables
var board;
var score = 0;
const rows = 4;
const columns = 4;
//starting function
window.onload = function() {
    startGame();
}
//initializes the board
function startGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let number = board[r][c];
            updateTile(tile, number);
            //returns board logic to HTML file
            document.getElementById("game").append(tile);
        }
    }
    //places 2 2's on the board to begin
    spawnTwo();
    spawnTwo();
}
//places a 2 on the board randomly
function spawnTwo() {
    if (boardFull()) {
        gameLost();
        return; //do nothing
    }
  
    let empty = true;
    while (empty) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        //if that spot is empty
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let number = board[r][c];
            updateTile(tile, number);
            
            empty = false;
        }
    }
}
//checks if game is lost
function gameLost() {
    if (!possibleMovesCheck()) {//if no more moves, must be lost
        coverScreen.classList.remove("hide");
        result.innerText = "Score: " + score.toString();
    }
}

//checks if the board is fully occupied
function boardFull() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return false;
            }
        }
    }
    return true;
}
//updates text and stlying of the tile
function updateTile(tile, number) {
    tile.innerText = "";
    tile.classList.value = ""; //clears the class assigned
    tile.classList.add("tile");

    if (number > 0) {
        tile.innerText = number;
        
        if (number <= 4096) {
            tile.classList.add("t" + number.toString());
        }
        else {
            tile.classList.add("t8192");
        }
    }
}

/*keyboard inputs for moving tiles around*/

document.addEventListener("keydown", (a) => {
    if ((a.code == "ArrowLeft") || (a.code == "KeyA")) {
        moveLeft();
        spawnTwo();
    }
    else if ((a.code == "ArrowRight") || (a.code == "KeyD")) {
        moveRight();
        spawnTwo();
    }
    else if ((a.code == "ArrowUp") || (a.code == "KeyW")) {
        moveUp();
        spawnTwo();
    }
    else if ((a.code == "ArrowDown") || (a.code == "KeyS")) {
        moveDown();
        spawnTwo();
    }
    updateScore();
});

function moveLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = shift(row);
        board[r] = row;
        //updates value at the tile
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let number = board[r][c];
            updateTile(tile, number);
        }
    }
}

function moveRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = shift(row.reverse());
        board[r] = row.reverse();
        //updates value at the tile
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let number = board[r][c];
            updateTile(tile, number);
        }
    }
}

function moveUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = shift(row);
        //updates value at the tile
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r]; //assigning array to be a column
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let number = board[r][c];
            updateTile(tile, number);
        }
    }
}

function moveDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = shift(row.reverse());
        row = row.reverse(); //reverse back
        //updates value at the tile
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r]; //assigning array to be a column
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let number = board[r][c];
            updateTile(tile, number);
        }
    }
}

function shift(row) {
    row = row.filter(number => number != 0); //removes 0 from array
    //shifts values over
    for (let i = 0; i < row.length-1; i++) {
        if (row[i] == row[i+1]) {//if adjacent values are the same
            row[i] *= 2; //one gets doubled
            row[i+1] = 0; //other turns into 0, or empty
            score += row[i]; //increase score
        }
    }
    row = row.filter(number => number != 0); //removes 0 from array again

    //re-add 0's
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

//updates the score
function updateScore() {
    document.getElementById("score").innerText = score;
}

/*cover screen stuff*/

let replayButton = document.getElementById("replayButton");
let coverScreen = document.getElementById("coverScreen");
let result = document.getElementById("result");
//checks adjacent tiles for matches
function adjacentCheck(arr) {
    for (let i = 0; i < arr.length-1; i++) {
        if (arr[i] == arr[i+1]) {
            return true;
        }
    }
    return false;
}
//checks for possible moves
function possibleMovesCheck() {
    //checks in rows
    for (let r in board) {
        if (adjacentCheck(board[r])) {
            return true;
        }
    }
    //checks in columns
    for (let c = 0; c < columns; c++) {
        let columarray = [];
        for (let r = 0; r < rows; r++) {
            columarray.push(board[r][c]);
        }
        if (adjacentCheck(columarray)) {
            return true;
        }
    }
    return false;
}
//button function
replayButton.addEventListener("click", () => {
    coverScreen.classList.add("hide");
    score = 0;//resets score
    updateScore();//resets score being shown

    board = [//resets board
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    //resets the classes and text of the tiles to default
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let number = board[r][c];
            updateTile(tile, number);
        }
    }
    //spawn 2 tiles to begin game
    spawnTwo();
    spawnTwo();
});
