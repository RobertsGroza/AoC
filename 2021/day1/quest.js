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

// First input
const processFirstInput = (input) => {
    const readings = input.split("\n");
    readings.pop();

    let counter = 0;
    let lastLine = null;

    for (const reading of readings) {
        const parsedReading = parseInt(reading, 10);
        console.log(parsedReading);
        if (lastLine === null) {
            lastLine = parsedReading;
            continue;
        }

        if (parsedReading > lastLine) {
            counter++;
        }

        lastLine = parsedReading;
    }

    document.getElementById("result").innerHTML = counter;
}

// Second input
const processSecondInput = (input) => {
    const readings = input.split("\n");
    readings.pop();

    const readingCount = readings.length;
    const sumArray = [];

    for (let i = 0; i < readingCount - 2; i++) {
        sumArray.push(
            parseInt(readings[i], 10) +
            parseInt(readings[i + 1], 10) +
            parseInt(readings[i + 2], 10)
        );
    }

    let lastLine = null;
    let counter = 0;

    for (const sum of sumArray) {
        if (lastLine === null) {
            lastLine = sum;
            continue;
        }

        if (sum > lastLine) {
            counter++;
        }

        lastLine = sum;
    }

    document.getElementById("result").innerHTML = counter;
}
