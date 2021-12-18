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

class CaveSystem {
  map = {};
  ways = [];
  allowTwoVisitations = false;  // Allow two visitations for one single cave

  constructor(connectionArray, allowTwoVisitations) {
    connectionArray.forEach(connection => {
      const [startPoint, endPoint] = connection.split("-");
      if (!this.map[startPoint]) {
        this.map[startPoint] = [];
      }
      this.map[startPoint].push(endPoint);
      if (startPoint !== "start") {
        if (!this.map[endPoint]) {
          this.map[endPoint] = [];
        }
        this.map[endPoint].push(startPoint);
      }
    })
    this.allowTwoVisitations = allowTwoVisitations;
  }

  getAllPossibleWays() {
    this.recursivelyTravel("start", "");
    this.getRidOfDoubleWays()
  }

  /**
   * @param string currentNode
   * @param string currentWay
   */
  recursivelyTravel(currentNode, currentWay, isOneSmallCaveAppearingTwice = false) {
    currentWay += `${currentNode},`;
    if (currentNode === "end") {
      this.ways.push(currentWay.substring(0, currentWay.length - 1));
      return;
    }
    Object.values(this.map[currentNode]).forEach(node => {
      if (node === "start") {
        return;
      }
      if (
        !this.hasLowerCase(node) ||
        this.hasLowerCase(node) && !currentWay.includes(`,${node}`)
      ) {
        this.recursivelyTravel(node, currentWay, isOneSmallCaveAppearingTwice);
      } else if (
        this.allowTwoVisitations &&
        !isOneSmallCaveAppearingTwice &&
        currentWay.includes(`,${node}`)
      ) {
        this.recursivelyTravel(node, currentWay, true);
      }
    })
  }

  hasLowerCase(string) {
    return /[a-z]/.test(string);
  }

  getRidOfDoubleWays() {
    this.ways = this.ways.filter((value, index, self) => self.indexOf(value) === index);
  }
}

const processFirstInput = (readings) => {
  const connections = readings.split("\r\n");
  const caveSystem = new CaveSystem(connections, false);
  caveSystem.getAllPossibleWays();
  document.getElementById("result").innerHTML = caveSystem.ways.length;
};

const processSecondInput = (readings) => {
  const connections = readings.split("\r\n");
  const caveSystem = new CaveSystem(connections, true);
  caveSystem.getAllPossibleWays();
  document.getElementById("result").innerHTML = caveSystem.ways.length;
};