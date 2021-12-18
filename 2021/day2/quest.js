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

    let depth = 0;
    let forwardness = 0;

    for (const reading of readings) {
        const temp = reading.split(' ');
        const command = temp[0];

        switch(temp[0]) {
            case 'up':
                depth -= parseInt(temp[1], 10);
                break;
            case 'down':
                depth += parseInt(temp[1], 10);
                break;
            default:
                forwardness += parseInt(temp[1], 10);
        }
    }

    document.getElementById("result").innerHTML = depth * forwardness;
}

// Second input
const processSecondInput = (input) => {
    const readings = input.split("\r\n");

    let depth = 0;
    let forwardness = 0;
    let aim = 0;

    for (const reading of readings) {
        console.log("reading: ", reading);
        const temp = reading.split(' ');

        switch(temp[0]) {
            case 'up':
                aim -= parseInt(temp[1], 10);
                break;
            case 'down':
                aim += parseInt(temp[1], 10);
                break;
            default:
                forwardness += parseInt(temp[1], 10);
                depth += aim * parseInt(temp[1], 10);
        }
    }

    document.getElementById("result").innerHTML = depth * forwardness;
}