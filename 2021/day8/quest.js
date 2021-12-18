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

const processFirstInput = (readings) => {
    const lines = readings.split("\r\n");
    const digits = lines.map(el => el.split(" | ")[1]);
    let result = 0;

    // Every odd line has digits in this
    for (let i = 0; i < digits.length; i++) {
        const lineDigits = digits[i].split(" ");

        for (let j = 0; j < lineDigits.length; j++) {
            if (lineDigits[j].length === 2) {
                // This is 1
                result++;
            } else if (lineDigits[j].length === 7) {
                // This is 8
                result++;
            } else if (lineDigits[j].length === 4) {
                // This is 4
                result++;
            } else if (lineDigits[j].length === 3) {
                // This is 7
                result++;
            }
        }
    }

    document.getElementById("result").innerHTML = result;
}

class Alphabet {
    numberMap = {};

    constructor(alphabet) {
        const fiveCharElements = [];
        const sixCharElements = [];

        // Group numbers
        for (let i = 0; i < alphabet.length; i++) {
            if (alphabet[i].length === 2) {
                this.numberMap[1] = alphabet[i];
            } else if (alphabet[i].length === 3) {
                this.numberMap[7] = alphabet[i];
            } else if (alphabet[i].length === 4) {
                this.numberMap[4] = alphabet[i];
            } else if (alphabet[i].length === 7) {
                this.numberMap[8] = alphabet[i];
            } else if (alphabet[i].length === 5) {
                fiveCharElements.push(alphabet[i]);
            } else {
                sixCharElements.push(alphabet[i]);
            }
        }

        // If 5 chars in digit and 2 of them are in 1, then it is 3 (only 5 chars with right side filled)
        this.numberMap[3] = fiveCharElements.find(el =>
            el.includes(this.numberMap[1][0]) && el.includes(this.numberMap[1][1])
        );
        fiveCharElements.splice(fiveCharElements.indexOf(this.numberMap[3]), 1)

        // If 6 chars in digit and 4 of them are in 4, then it is 9 (0 and 6 doesnt overlap with 4)
        this.numberMap[9] = sixCharElements.find(el =>
            el.includes(this.numberMap[4][0]) &&
            el.includes(this.numberMap[4][1]) &&
            el.includes(this.numberMap[4][2]) &&
            el.includes(this.numberMap[4][3])
        );
        sixCharElements.splice(sixCharElements.indexOf(this.numberMap[9]), 1)

        // If 5 chars in digit and it overlaps with 9 then it is 5 (3 is already out)
        this.numberMap[5] = fiveCharElements.find(el =>
            this.numberMap[9].includes(el[0]) &&
            this.numberMap[9].includes(el[1]) &&
            this.numberMap[9].includes(el[2]) &&
            this.numberMap[9].includes(el[3]) &&
            this.numberMap[9].includes(el[4])
        );
        fiveCharElements.splice(fiveCharElements.indexOf(this.numberMap[5]), 1)

        // Last 5 char element is 2 then
        this.numberMap[2] = fiveCharElements[0];

        // Six chars and 5 fully overlaps it then it is 6, because 0 don't have middle element
        this.numberMap[6] = sixCharElements.find(el =>
            el.includes(this.numberMap[5][0]) &&
            el.includes(this.numberMap[5][1]) &&
            el.includes(this.numberMap[5][2]) &&
            el.includes(this.numberMap[5][3]) &&
            el.includes(this.numberMap[5][4])
        );
        sixCharElements.splice(sixCharElements.indexOf(this.numberMap[6]), 1)

        // Last 6 char element is 0 then
        this.numberMap[0] = sixCharElements[0];

        Object.keys(this.numberMap).forEach(key => {
            this.numberMap[key] = this.sortAlphabetically(this.numberMap[key]);
        })
    }

    getDigit(digitChars) {
        return Object.keys(this.numberMap).find(key =>
            this.numberMap[key] === this.sortAlphabetically(digitChars)
        );
    }

    sortAlphabetically(text) {
       return text.split('').sort().join('');
    }
}

const processSecondInput = (readings) => {
    const lines = readings.split("\r\n");
    const alphabets = lines.map(el => el.split(" | ")[0]);
    const digits = lines.map(el => el.split(" | ")[1].split(" "));
    const resultNumbers = [];

    for (let i = 0; i < alphabets.length; i++) {
        const numberMap = new Alphabet(alphabets[i].split(" "));
        let resultNumber = "";
        for (let j = 0; j < digits[i].length; j++) {
            resultNumber += numberMap.getDigit(digits[i][j]);
        }
        resultNumbers.push(parseInt(resultNumber, 10))
    }

    const sum = resultNumbers.reduce((partial_sum, a) => partial_sum + a, 0);

    document.getElementById("result").innerHTML = sum;
}