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
    const readings = input.split("\r\n");

    let gammaRate = "";
    let epsilonRate = "";

    console.log(readings);

    for (let i = 0; i < readings[0].length; i++) {
        let countOfOnes = 0;
        for (const reading of readings) {
            if (reading[i] === "1") {
                countOfOnes++;
            }
        }
        if (countOfOnes > readings.length / 2) {
            gammaRate += "1";
            epsilonRate += "0";
        } else {
            gammaRate += "0";
            epsilonRate += "1";
        }
    }

    document.getElementById("result").innerHTML = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);
}

// Second input
const processSecondInput = (input) => {
    let readings = input.split("\r\n");

    let countOfOnes = 0;
    let countOfZeros = 0;
    let readings1 = readings;

    // get first
    for (let i = 0; i < readings[0].length; i++) {
        for (let reading of readings) {
            if (reading[i] === "1") {
                countOfOnes++;
            } else {
                countOfZeros++;
            }

        }
        if (countOfZeros > countOfOnes) {
            readings = readings.filter(el => el[i] === "0")
        } else {
            readings = readings.filter(el => el[i] === "1")
        }
        countOfOnes = 0;
        countOfZeros = 0;
    }

    //get second
    for (let i = 0; i < readings1[0].length && readings1.length !== 1; i++) {
        for (let reading of readings1) {
            if (reading[i] === "1") {
                countOfOnes++;
            } else {
                countOfZeros++;
            }
        }
        if (countOfZeros < countOfOnes || countOfZeros === countOfOnes) {
            readings1 = readings1.filter(el => el[i] === "0")
        } else {
            readings1 = readings1.filter(el => el[i] === "1")
        }
        countOfOnes = 0;
        countOfZeros = 0;
    }

    document.getElementById("result").innerHTML = parseInt(readings[0], 2) * parseInt(readings1[0], 2);
}
