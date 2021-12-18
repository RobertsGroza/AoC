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
    const corruptedChars = [];

    for (let i = 0; i < lines.length; i++) {
        const syntaxStack = [];
        const chars = lines[i].split("");
        for (let j = 0; j < chars.length; j++) {
            if (["<", "[", "(", "{"].includes(chars[j])) {
                syntaxStack.push(chars[j]);
            } else if (chars[j] === ">") {
                if (syntaxStack[syntaxStack.length - 1] === "<") {
                    syntaxStack.pop();
                    continue;
                } else {
                    corruptedChars.push(chars[j]);
                    break;
                }
            } else if (chars[j] === ")") {
                if (syntaxStack[syntaxStack.length - 1] === "(") {
                    syntaxStack.pop();
                    continue;
                } else {
                    corruptedChars.push(chars[j]);
                    break;
                }
            } else if (chars[j] === "}") {
                if (syntaxStack[syntaxStack.length - 1] === "{") {
                    syntaxStack.pop();
                    continue;
                } else {
                    corruptedChars.push(chars[j]);
                    break;
                }
            } else if (chars[j] === "]") {
                if (syntaxStack[syntaxStack.length - 1] === "[") {
                    syntaxStack.pop();
                    continue;
                } else {
                    corruptedChars.push(chars[j]);
                    break;
                }
            }
        }
    }

    let result = 0;

    for (const char of corruptedChars) {
        if (char === ")") {
            result += 3;
        } else if (char === "]") {
            result += 57;
        } else if (char === "}") {
            result += 1197;
        } else {
            result += 25137;
        }
    }

    document.getElementById("result").innerHTML = result;
}

const processSecondInput = (readings) => {
    const lines = readings.split("\r\n");
    const missingChars = [];

    for (let i = 0; i < lines.length; i++) {
        const syntaxStack = [];
        const chars = lines[i].split("");
        let isCorrupted = false;
        for (let j = 0; j < chars.length; j++) {
            if (["<", "[", "(", "{"].includes(chars[j])) {
                syntaxStack.push(chars[j]);
            } else if (chars[j] === ">") {
                if (syntaxStack[syntaxStack.length - 1] === "<") {
                    syntaxStack.pop();
                } else {
                    isCorrupted = true;
                    continue
                }
            } else if (chars[j] === ")") {
                if (syntaxStack[syntaxStack.length - 1] === "(") {
                    syntaxStack.pop();
                } else {
                    isCorrupted = true;
                    continue
                }
            } else if (chars[j] === "}") {
                if (syntaxStack[syntaxStack.length - 1] === "{") {
                    syntaxStack.pop();
                } else {
                    isCorrupted = true;
                    continue;
                }
            } else if (chars[j] === "]") {
                if (syntaxStack[syntaxStack.length - 1] === "[") {
                    syntaxStack.pop();
                } else {
                    isCorrupted = true;
                    continue;
                }
            }
        }

        if (!isCorrupted) {
            missingChars.push(syntaxStack.reverse().map(el => {
                if (el === "(") {
                    return ")";
                } else if (el === "[") {
                    return "]";
                } else if (el === "{") {
                    return "}";
                } else {
                    return ">";
                }
            }))
        }
    }

    const scores = [];

    for (const missingCharLine of missingChars) {
        let lineScore = 0;
        for (const missingChar of missingCharLine) {
            lineScore *= 5;
            if (missingChar === ")") {
                lineScore += 1;
            } else if (missingChar === "]") {
                lineScore += 2;
            } else if (missingChar === "}") {
                lineScore += 3;
            } else {
                lineScore += 4;
            }
        }
        scores.push(lineScore);
    }

    console.log("scores: ", scores.sort((a, b) => a -b));

    document.getElementById("result").innerHTML = scores.sort((a, b) => a -b)[Math.floor(scores.length / 2)];
}
