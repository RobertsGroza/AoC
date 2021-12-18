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

const processFirstInput = (readings) => {
  const parts = readings.split("\r\n\r\n");
  const points = parts[0]
    .split("\r\n")
    .map((el) => el.split(",").map((number) => parseInt(number, 10)));
  const folds = parts[1]
    .split("\r\n")
    .map((el) => el.replace("fold along ", ""));

  let maxX = 0;
  let maxY = 0;

  points.forEach((point) => {
    if (point[0] > maxX) {
      maxX = point[0];
    }
    if (point[1] > maxY) {
      maxY = point[1];
    }
  });

  // Create layout
  let layout = new Array(maxY + 1);
  for (let i = 0; i < maxY + 1; i++) {
    layout[i] = new Array(maxX + 1).fill(0);
  }

  // Fill layout
  points.forEach(([x, y]) => {
    layout[y][x] = 1;
  });

  // Do the first fold
  const [foldAxis, foldSize] = folds[0].split("=");
  foldPaper(foldAxis, parseInt(foldSize, 10), layout);

  let result = 0;
  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < layout[i].length; j++) {
      if (layout[i][j] === 1) {
        result += 1;
      }
    }
  }

  document.getElementById("result").innerHTML = result;
};

const processSecondInput = (readings) => {
  const parts = readings.split("\r\n\r\n");
  const points = parts[0]
    .split("\r\n")
    .map((el) => el.split(",").map((number) => parseInt(number, 10)));
  const folds = parts[1]
    .split("\r\n")
    .map((el) => el.replace("fold along ", ""));

  let maxX = 0;
  let maxY = 0;

  points.forEach((point) => {
    if (point[0] > maxX) {
      maxX = point[0];
    }
    if (point[1] > maxY) {
      maxY = point[1];
    }
  });

  // Create layout
  let layout = new Array(maxY + 1);
  for (let i = 0; i < maxY + 1; i++) {
    layout[i] = new Array(maxX + 1).fill(0);
  }

  // Fill layout
  points.forEach(([x, y]) => {
    layout[y][x] = 1;
  });

  // Do all the folds
  for (let i = 0; i < folds.length; i++) {
    const [foldAxis, foldSize] = folds[i].split("=");
    layout = foldPaper(foldAxis, parseInt(foldSize, 10), layout);
  }


  let result = "";
  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < layout[i].length; j++) {
      if (layout[i][j] === 1) {
        result += " # ";
      } else {
        result += " _ ";
      }
    }
    result += "\n";
  }

  let html = "";

  result.split("\n").forEach(el => {
    html += `<p>${el}</p>`;
  })

  document.getElementById("result").innerHTML = html;
};

const foldPaper = (foldAxis, size, layout) => {
  if (foldAxis === "y") {
    const original = layout.slice(0, size).reverse();
    const foldOver = layout.slice(size + 1);

    if (original.length > foldOver.length) {
      for (let i = 0; i < foldOver.length; i++) {
        for (let j = 0; j < foldOver[i].length; j++) {
          original[i][j] = original[i][j] || foldOver[i][j];
        }
      }
      layout = original.reverse();
    } else {
      for (let i = 0; i < original.length; i++) {
        for (let j = 0; j < original[i].length; j++) {
          foldOver[i][j] = original[i][j] || foldOver[i][j];
        }
      }
      layout = foldOver.reverse();
    }
  } else {
    for (let i = 0; i < layout.length; i++) {
      const original = layout[i].slice(0, size).reverse();
      const foldOver = layout[i].slice(size + 1);

      if (original.length > foldOver.length) {
        for (let j = 0; j < foldOver.length; j++) {
          original[j] = original[j] || foldOver[j];
        }
        layout[i] = original.reverse();
      } else {
        for (let j = 0; j < original.length; j++) {
          foldOver[j] = original[j] || foldOver[j];
        }
        layout[i] = foldOver.reverse();
      }
    }
  }

  return layout;
}
