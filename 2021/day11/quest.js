const doStuff = () => {
  const fileReader = new FileReader();
  const file = document.getElementById("input_file").files[0];

  if (!file) {
    alert("Select input file!");
    return;
  }

  fileReader.readAsText(file);

  fileReader.onload = function () {
    processSecondInput(fileReader.result);
  };
};

class OctoMap {
  map = [];
  rowCount = 0;
  colCount = 0;
  flashCount = 0;
  areAllSynced = false;

  constructor(readings) {
    this.map = readings
      .split("\r\n")
      .map((el) => el.split("").map((number) => parseInt(number, 10)));
    this.rowCount = this.map.length;
    this.colCount = this.map.length ? this.map[0].length : 0;
  }

  simulateStep() {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        this.increment(i, j);
      }
    }
    this.sumUpFlashes()
  }

  increment(row, col) {
    // If out of bounds
    if (row < 0 || row > this.rowCount - 1 || col < 0 || col > this.colCount - 1) {
      return;
    }
    // Octopie which are flashed has -1 at this stage, so we don't increment them again
    if (this.map[row][col] === -1) {
      return;
    }

    this.map[row][col] += 1;

    if (this.map[row][col] > 9) {
      this.flash(row, col);
    }
  }

  flash(row, col) {
    this.map[row][col] = -1;  // Set to -1 so that octopus don't flash again
    this.increment(row - 1, col - 1);
    this.increment(row - 1, col);
    this.increment(row - 1, col + 1);
    this.increment(row, col - 1);
    this.increment(row, col + 1);
    this.increment(row + 1, col - 1);
    this.increment(row + 1, col);
    this.increment(row + 1, col + 1);
  }

  sumUpFlashes() {
    let flashes = 0;

    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        if (this.map[i][j] === -1) {
          flashes++;
          this.map[i][j]++;
        }
      }
    }

    this.flashCount += flashes;

    if (flashes === this.rowCount * this.colCount) {
      this.areAllSynced = true;
    }
  }
}

const processFirstInput = (readings) => {
  const octo = new OctoMap(readings);
  for (let i = 0; i < 100; i++) {
    octo.simulateStep();
  }
  document.getElementById("result").innerHTML = octo.flashCount;
};


const processSecondInput = (readings) => {
  const octo = new OctoMap(readings);
  let stepCount = 0;
  while (!octo.areAllSynced) {
    stepCount++;
    octo.simulateStep();
  }
  document.getElementById("result").innerHTML = stepCount;
};
