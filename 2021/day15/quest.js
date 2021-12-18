const doStuff = () => {
  const fileReader = new FileReader();
  const file = document.getElementById("input_file").files[0];

  if (!file) {
    alert("Select input file!");
    return;
  }

  fileReader.readAsText(file);

  fileReader.onload = function () {
    processSecondInput(fileReader.result, 0);
  };
};

const processFirstInput = (readings, start) => {
  const map = readings
    .split("\r\n")
    .map((line) => line.split("").map((el) => parseInt(el, 10)));

  processDijkstra(map, start);
};

/**
 * Same Dijkstras algorythm but this executes very long time because 25x field
 */
const processSecondInput = (readings, start) => {
  const map = readings
    .split("\r\n")
    .map((line) => line.split("").map((el) => parseInt(el, 10)));

  let fullMap = [
    ...map,
    ...map.map((row) =>
      row.map((col) => (col + 1 > 9 ? (col + 2) % 10 : col + 1))
    ),
    ...map.map((row) =>
      row.map((col) => (col + 2 > 9 ? (col + 3) % 10 : col + 2))
    ),
    ...map.map((row) =>
      row.map((col) => (col + 3 > 9 ? (col + 4) % 10 : col + 3))
    ),
    ...map.map((row) =>
      row.map((col) => (col + 4 > 9 ? (col + 5) % 10 : col + 4))
    ),
  ];

  fullMap = fullMap.map((row) => [
    ...row,
    ...row.map((col) => (col + 1 > 9 ? (col + 2) % 10 : col + 1)),
    ...row.map((col) => (col + 2 > 9 ? (col + 3) % 10 : col + 2)),
    ...row.map((col) => (col + 3 > 9 ? (col + 4) % 10 : col + 3)),
    ...row.map((col) => (col + 4 > 9 ? (col + 5) % 10 : col + 4)),
  ]);

  processDijkstra(fullMap, start);
};

/**
 * This uses Dijkstra's algorhytm
 */
const processDijkstra = (map, start) => {
  const vertexCount = map.length * map[0].length;
  const height = map.length;
  const width = map[0].length;

  // Distance from starting verticle
  const distances = new Array(vertexCount).fill(Number.MAX_VALUE);
  // If index with number i is true, then it means that that verticle is visited
  const visitedVerticles = new Array(vertexCount).fill(false);

  // Distance of source vertex to itself is 0
  distances[start] = 0;

  for (let i = 0; i < vertexCount; i++) {
    // Pick the minimum distance vertex from set of verticles not yet processed
    let verticle = minDistance(vertexCount, distances, visitedVerticles);
    // Mark the picked verticle as processed
    visitedVerticles[verticle] = true;

    // Update dist value of the adjacent verticles of the picked vertex
    // Update distances[end] only if is not in visitedVerticles
    // there is an edge from i to end
    // and total weigth of path from start to end through i is smaller than current value of dist[end]
    let column = verticle % width;
    let row = Math.floor(verticle / width);

    // Check verticle on top
    if (
      row > 0 &&
      !visitedVerticles[verticle - width] &&
      distances[verticle] !== Number.MAX_VALUE &&
      distances[verticle] + map[row - 1][column] < distances[verticle - width]
    ) {
      distances[verticle - width] = distances[verticle] + map[row - 1][column];
    }

    // Check verticle on left
    if (
      column > 0 &&
      !visitedVerticles[verticle - 1] &&
      distances[verticle] !== Number.MAX_VALUE &&
      distances[verticle] + map[row][column - 1] < distances[verticle - 1]
    ) {
      distances[verticle - 1] = distances[verticle] + map[row][column - 1];
    }

    // Check verticle on bottom
    if (
      row < height - 1 &&
      !visitedVerticles[verticle + width] &&
      distances[verticle] !== Number.MAX_VALUE &&
      distances[verticle] + map[row + 1][column] < distances[verticle + width]
    ) {
      distances[verticle + width] = distances[verticle] + map[row + 1][column];
    }

    // Check verticle on right
    if (
      column < width - 1 &&
      !visitedVerticles[verticle + 1] &&
      distances[verticle] !== Number.MAX_VALUE &&
      distances[verticle] + map[row][column + 1] < distances[verticle + 1]
    ) {
      distances[verticle + 1] = distances[verticle] + map[row][column + 1];
    }
  }

  document.getElementById("result").innerHTML = distances[vertexCount - 1];
};

/**
 * Finds the vertex with minimum distance value, from the set of verticles not yet included
 * in visitedVerticles (shortest path tree)
 */
const minDistance = (vertextCount, distances, visitedVerticles) => {
  let min = Number.MAX_VALUE;
  let min_index = -1;

  for (let verticle = 0; verticle < vertextCount; verticle++) {
    if (visitedVerticles[verticle] == false && distances[verticle] <= min) {
      min = distances[verticle];
      min_index = verticle;
    }
  }

  return min_index;
};
