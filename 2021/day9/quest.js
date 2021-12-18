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
    const map = new Array(lines.length);

    for (let i = 0; i < lines.length; i++) {
        map[i] = lines[i].split("").map(el => parseInt(el, 10));
    }

    const mapLength = map.length;
    const mapWLength = map[0].length;
    const lowPoints = [];

    // Find local low points
    for (let i = 0; i < mapLength; i++) {
        for (let j = 0; j < mapWLength; j++) {
            if (
                map[i][j] <
                Math.min(
                    i > 0 ? map[i - 1][j] : 10,
                    i < mapLength - 1 ? map[i + 1][j] : 10,
                    j > 0 ? map[i][j - 1] : 10,
                    j < mapWLength - 1 ? map[i][j + 1] : 10
                )
            ) {
                lowPoints.push(map[i][j]);
            }
        }
    }

    // calculate risk
    let result = lowPoints.map(el => el + 1).reduce((partial_sum, a) => partial_sum + a, 0);;

    document.getElementById("result").innerHTML = result;
}

const processSecondInput = (readings) => {
    const lines = readings.split("\r\n");
    const map = new Array(lines.length);

    for (let i = 0; i < lines.length; i++) {
        map[i] = lines[i].split("").map(el => parseInt(el, 10));
    }

    const mapLength = map.length;
    const mapWLength = map[0].length;
    const basins = [];
    const biggest3Basins = [0, 0, 0];

    console.log("map: ", map);

    // Find basins
    for (let i = 0; i < mapLength; i++) {
        for (let j = 0; j < mapWLength; j++) {
            // Check if point not in basin already
            if (!basins.find(el => el.find(el2 => el2.i === i && el2.j === j)) && map[i][j] !== 9) {
                const currentBasin = recursiveBasinDrawer(map, i, j, []);
                basins.push(recursiveBasinDrawer(map, i, j, []));

                const smallerBasin = Math.min.apply(Math, biggest3Basins);
                if (currentBasin.length > smallerBasin) {
                    biggest3Basins[biggest3Basins.indexOf(smallerBasin)] = currentBasin.length;
                }
            }
        }
    }

    document.getElementById("result").innerHTML = biggest3Basins[0] * biggest3Basins[1] * biggest3Basins[2];
}

const recursiveBasinDrawer = (map, i, j, basin) => {
    if (map[i][j] !== 9) {
        basin.push({ i, j });

        if (i < map.length - 1 && map[i + 1][j] !== 9 && !basin.find(el => el.i === i + 1 && el.j === j)) {
            recursiveBasinDrawer(map, i + 1, j, basin);
        }
        if (j < map[0].length - 1 && map[i][j + 1] !== 9 && !basin.find(el => el.i === i && el.j === j + 1)) {
            recursiveBasinDrawer(map, i, j + 1, basin);
        }
        if (i > 0 && map[i - 1][j] !== 9 && !basin.find(el => el.i === i - 1 && el.j === j)) {
            recursiveBasinDrawer(map, i - 1, j, basin);
        }
        if (j > 0 && map[i][j -1 ] !== 9 && !basin.find(el => el.i === i && el.j === j - 1)) {
            recursiveBasinDrawer(map, i, j - 1, basin);
        }
    }

    return basin;
}
