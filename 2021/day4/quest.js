const doStuff = () => {
    const fileReader = new FileReader();
    const file = document.getElementById("input_file").files[0];

    if (!file) {
        alert("Select input file!");
        return;
    }

    fileReader.readAsText(file)

    fileReader.onload = function(){
        processSecondInput(fileReader.result);
    }
}

class Board {
    grid = new Array(25);
    isMarked = new Array(25).fill(false);

    // numberString would for example be "22 13 17 11 0"
    setupGrid(lineNumber, numberString) {
        const numberArray = numberString.trim().split(/\s+/);
        numberArray.forEach((el, i) => {
            this.grid[lineNumber * 5 + i] = parseInt(el, 10);
        })
    }

    printBoard() {
        console.log(this.grid);
    }

    // Return false by default. If the board wins return true
    markNumber(number) {
        const index = this.grid.indexOf(number);
        if (index !== -1) {
            this.isMarked[index] = true;
            return this.isRowFilled(Math.floor(index / 5)) || this.isColumnFilled(index % 5);
        }
        return false;
    }

    isRowFilled(rowNumber) {
        let isFilled = true;
        for (let i = 0; i < 5; i++) {
            if (this.isMarked[rowNumber * 5 + i] === false) {
                isFilled = false;
                break;
            }
        }
        return isFilled;
    }

    isColumnFilled(columnNumber) {
        let isFilled = true;
        for (let i = 0; i < 5; i++) {
            if (this.isMarked[i * 5 + columnNumber] === false) {
                isFilled = false;
                break;
            }
        }
        return isFilled;
    }

    sumOfUnmarkedNumbers() {
        let sum = 0;
        for (let i = 0; i < 25; i++) {
            if (!this.isMarked[i]) {
                sum += this.grid[i];
            }
        }
        return sum;
    }
}

// First input
const processFirstInput = (input) => {
    const readings = input.split("\r\n");
    const bingoNumberOrder = readings[0].split(",");

    // Initialization
    let lineNumberOfBoard = 0;
    let boards = [];
    for (let index = 1; index < readings.length; index++) {
        if (readings[index] === "") {
            lineNumberOfBoard = 0;
            boards.push(new Board());
            continue;
        }

        boards[boards.length - 1].setupGrid(lineNumberOfBoard, readings[index]);
        lineNumberOfBoard++;
    }

    let winningBoard = -1;
    let lastCalledNumber = undefined;
    // Fill the board
    for (let i = 0; i < bingoNumberOrder.length; i++) {
        let number = parseInt(bingoNumberOrder[i], 10);
        for (let j = 0; j < boards.length; j++) {
            if (boards[j].markNumber(number)) {
                winningBoard = j;
            }
        }
        if (winningBoard !== -1) {
            lastCalledNumber = number;
            break;
        }
    }

    document.getElementById("result").innerHTML = boards[winningBoard].sumOfUnmarkedNumbers() * lastCalledNumber;
}

// Second input
const processSecondInput = (input) => {
    const readings = input.split("\r\n");
    const bingoNumberOrder = readings[0].split(",");

    // Initialization
    let lineNumberOfBoard = 0;
    let boards = [];
    for (let index = 1; index < readings.length; index++) {
        if (readings[index] === "") {
            lineNumberOfBoard = 0;
            boards.push(new Board());
            continue;
        }

        boards[boards.length - 1].setupGrid(lineNumberOfBoard, readings[index]);
        lineNumberOfBoard++;
    }

    let boardWinningOrder = [];
    let lastCalledNumber = undefined;
    // Fill the board
    for (let i = 0; i < bingoNumberOrder.length; i++) {
        let number = parseInt(bingoNumberOrder[i], 10);
        for (let j = 0; j < boards.length; j++) {
            if (boardWinningOrder.includes(j)) {
                continue;
            }
            if (boards[j].markNumber(number)) {
                boardWinningOrder.push(j);
            }
        }
        // All boards won
        if (boardWinningOrder.length === boards.length) {
            lastCalledNumber = number;
            break;
        }
    }

    document.getElementById("result").innerHTML = boards[boardWinningOrder[boardWinningOrder.length - 1]].sumOfUnmarkedNumbers() * lastCalledNumber;
}