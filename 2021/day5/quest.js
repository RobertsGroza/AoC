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

class line {
    coordinates = {};

    constructor(start, end) {
        this.coordinates = { start, end };
    }

    isHorizontal() {
        return this.coordinates.start.y === this.coordinates.end.y;
    }

    isVertical() {
        return this.coordinates.start.x === this.coordinates.end.x;
    }

    isDiagonal() {
        return Math.abs(this.coordinates.start.x - this.coordinates.end.x)
            === Math.abs(this.coordinates.start.y - this.coordinates.end.y)
    }

    getPointsForHorVerLine() {
        let result = [];
        if (this.isHorizontal()) {
            if (this.coordinates.start.x >= this.coordinates.end.x) {
                for (let i = 0; i <= this.coordinates.start.x - this.coordinates.end.x; i++) {
                    result.push({
                        x: this.coordinates.start.x - i,
                        y: this.coordinates.start.y
                    });
                }
            } else {
                for (let i = 0; i <= this.coordinates.end.x - this.coordinates.start.x; i++) {
                    result.push({
                        x: this.coordinates.start.x + i,
                        y: this.coordinates.start.y
                    });
                }
            }
        } else if (this.isVertical()) {
            if (this.coordinates.start.y >= this.coordinates.end.y) {
                for (let i = 0; i <= this.coordinates.start.y - this.coordinates.end.y; i++) {
                    result.push({
                        x: this.coordinates.start.x,
                        y: this.coordinates.start.y - i
                    });
                }
            } else {
                for (let i = 0; i <= this.coordinates.end.y - this.coordinates.start.y; i++) {
                    result.push({
                        x: this.coordinates.start.x,
                        y: this.coordinates.start.y + i
                    });
                }
            }
        }
        return result;
    }

    getPointsForHorVerDiagLine() {
        let result = [];

        if (this.isDiagonal()) {
            const deltaX = this.coordinates.end.x - this.coordinates.start.x;
            const deltaY = this.coordinates.end.y - this.coordinates.start.y;

            for (let i = 0; i <= Math.abs(deltaX); i++) {
                result.push({
                    x: deltaX < 0 ? this.coordinates.start.x - i : this.coordinates.start.x + i,
                    y: deltaY < 0 ? this.coordinates.start.y - i : this.coordinates.start.y + i
                })
            }
        } else {
            return this.getPointsForHorVerLine();
        }

        return result;
    }
}


// First input
const processFirstInput = (input) => {
    const readings = input.split("\r\n");
    const lines = [];
    let matrix = [];
    let biggestX = 0;
    let biggestY = 0;

    readings.forEach(reading => {
        const coordinates = reading.split(" -> ");
        const point1Coordinates = coordinates[0].split(",");
        const point2Coordinates = coordinates[1].split(",");
        const start = {
            x: parseInt(point1Coordinates[0], 10),
            y: parseInt(point1Coordinates[1], 10),
        };
        const end = {
            x: parseInt(point2Coordinates[0], 10),
            y: parseInt(point2Coordinates[1], 10),
        };
        if (Math.max(start.x, end.x) > biggestX) {
            biggestX = Math.max(start.x, end.x);
        }
        if (Math.max(start.y, end.y) > biggestY) {
            biggestY = Math.max(start.y, end.y);
        }

        lines.push(new line(start, end));
    });

    matrix = new Array(biggestX + 1);
    for (let i = 0; i < biggestX + 1; i++) {
        matrix[i] = new Array(biggestY + 1).fill(0);
    }



    lines.forEach(line => {
        line.getPointsForHorVerLine().forEach(point => {
            matrix[point.x][point.y]++;
        })
    })

    let result = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > 1) {
                result++;
            }
        }
    }

    document.getElementById("result").innerHTML = result;
}

// Second input
const processSecondInput = (input) => {
    const readings = input.split("\r\n");
    const lines = [];
    let matrix = [];
    let biggestX = 0;
    let biggestY = 0;

    readings.forEach(reading => {
        const coordinates = reading.split(" -> ");
        const point1Coordinates = coordinates[0].split(",");
        const point2Coordinates = coordinates[1].split(",");
        const start = {
            x: parseInt(point1Coordinates[0], 10),
            y: parseInt(point1Coordinates[1], 10),
        };
        const end = {
            x: parseInt(point2Coordinates[0], 10),
            y: parseInt(point2Coordinates[1], 10),
        };
        if (Math.max(start.x, end.x) > biggestX) {
            biggestX = Math.max(start.x, end.x);
        }
        if (Math.max(start.y, end.y) > biggestY) {
            biggestY = Math.max(start.y, end.y);
        }

        lines.push(new line(start, end));
    });

    matrix = new Array(biggestX + 1);
    for (let i = 0; i < biggestX + 1; i++) {
        matrix[i] = new Array(biggestY + 1).fill(0);
    }

    lines.forEach(line => {
        line.getPointsForHorVerDiagLine().forEach(point => {
            matrix[point.x][point.y]++;
        })
    })

    let result = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > 1) {
                result++;
            }
        }
    }

    document.getElementById("result").innerHTML = result;
}
