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

// Good old brute force
const processFirstInput = (readings) => {
    const positions = readings.split(",").map(el => parseInt(el, 10));
    const minPosition = Math.min.apply(null, positions);
    const maxPosition = Math.max.apply(null, positions);

    let minSum = Number.MAX_VALUE;

    for (let i = minPosition; i <= maxPosition; i++) {
        let sum = 0;
        for (let j = 0; j < positions.length; j++) {
            sum += Math.abs(positions[j] - i);
        }
        if (sum < minSum) {
            minSum = sum;
        }
    }

    document.getElementById("result").innerHTML = minSum;
}

// Also good old brute force
const processSecondInput = (readings) => {
    const positions = readings.split(",").map(el => parseInt(el, 10));
    const minPosition = Math.min.apply(null, positions);
    const maxPosition = Math.max.apply(null, positions);

    let minSum = Number.MAX_VALUE;

    for (let i = minPosition; i <= maxPosition; i++) {
        let sum = 0;
        for (let j = 0; j < positions.length; j++) {
            for (let k = 0; k < Math.abs(positions[j] - i); k++) {
                sum += (k + 1);
            }
        }
        if (sum < minSum) {
            minSum = sum;
        }
    }

    document.getElementById("result").innerHTML = minSum;
}
