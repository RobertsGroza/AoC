const doStuff = () => {
    const fileReader = new FileReader();
    const file = document.getElementById("input_file").files[0];

    if (!file) {
        alert("Select input file!");
        return;
    }

    fileReader.readAsText(file)

    fileReader.onload = function(){
        processSecondInput(fileReader.result, 256);
    }
}

// Brute force approach (on 256 too slow)
const processFirstInput = (readings, days) => {
    const fishes = readings.split(",").map(el => parseInt(el, 10));

    for (let i = 0; i < days; i++) {
        const fishesCount = fishes.length;
        for (let j = 0; j < fishesCount; j++) {
            if (fishes[j] === 0) {
                fishes.push(8);
                fishes[j] = 6;
            } else {
                fishes[j]--;
            }
        }
    }

    document.getElementById("result").innerHTML = fishes.length;
}

/**
 * In this approach we only need to know how many times number appears in array
 * for example [1, 0, 0, 1] means there are 2 fishes 0 & 3
 *
 * Also this uses that if we start with one fish f.e. 0 after 9 days there are 5,0,7 fishes in ocean
 * but if we start with fish 4 then the same 5,0,7 fishes will be after 13 days (9 + 4)
 *
 * So we need to calculate how many fishes there will be from fish "0" after 256 days
 * while calculating we save how many fishes are after 252 days and this is the fish count after 256 if we start with 4
 */
const processSecondInput = (readings, days) => {
    const startingFishes = readings.split(",").map(el => parseInt(el, 10));

    fishObj = [1, 0, 0, 0, 0, 0, 0, 0, 0];
    const fishReproduction = {};

    for (let i = 0; i < days; i++) {
        const newFishes = fishObj[0];

        fishObj[0] = fishObj[1];
        fishObj[1] = fishObj[2];
        fishObj[2] = fishObj[3];
        fishObj[3] = fishObj[4];
        fishObj[4] = fishObj[5];
        fishObj[5] = fishObj[6];
        fishObj[6] = fishObj[7] + newFishes;
        fishObj[7] = fishObj[8];
        fishObj[8] = newFishes;

        if (days - 7 <= i) {
            fishReproduction[i + 1] = Object.values(fishObj).reduce((a, b) => a + b, 0);
        }
    }

    let result = 0;
    for (let i = 0; i < startingFishes.length; i++) {
        result += fishReproduction[days - startingFishes[i]];
    }

    document.getElementById("result").innerHTML = result;
}
