const doStuff = () => {
  const fileReader = new FileReader();
  const file = document.getElementById("input_file").files[0];

  if (!file) {
    alert("Select input file!");
    return;
  }

  fileReader.readAsText(file);

  fileReader.onload = function () {
    processSecondInput(fileReader.result, 40);
  };
};

// Brute force
const processFirstInput = (readings) => {
  const [template, ruleString] = readings.split("\r\n\r\n");
  const rules = ruleString.split("\r\n").map(el => el.split(" -> "));
  const ruleObj = {};
  for (let i = 0; i < rules.length; i++) {
    ruleObj[rules[i][0]] = rules[i][1];
  }
  // Do steps
  let resultString = template;
  for (let i = 0; i < 10; i++) {
    resultString = processStep(resultString, ruleObj);
  }
  // Sum chars & get result
  let charCounts = {};
  for (let i = 0; i < resultString.length; i++) {
    if (charCounts[resultString[i]] === undefined) {
      charCounts[resultString[i]] = 0;
    }
    charCounts[resultString[i]] += 1;
  }
  let biggestFrequency = 0;
  let smallestFrequency = Number.MAX_VALUE;
  Object.values(charCounts).forEach(count => {
    if (count > biggestFrequency) {
      biggestFrequency = count;
    }
    if (count < smallestFrequency) {
      smallestFrequency = count;
    }
  });
  document.getElementById("result").innerHTML = biggestFrequency - smallestFrequency;
}

const processStep = (input, ruleObj) => {
  let newString = "";
  for (let i = 0; i < input.length - 1; i++) {
    newString += input[i];
    newString += ruleObj[`${input[i]}${input[i + 1]}`];
  }
  newString += input[input.length - 1];
  return newString;
}

/**
 * Lets coun't just pair frequencies because after some steps the RAM will be full
 * if we will store current string etc
 */
const processSecondInput = (readings, steps) => {
  const [template, ruleString] = readings.split("\r\n\r\n");
  const rules = ruleString.split("\r\n").map(el => el.split(" -> "));
  const ruleObj = {};
  for (let i = 0; i < rules.length; i++) {
    ruleObj[rules[i][0]] = rules[i][1];
  }

  // Setup pair frequencies
  let pairFrequencies = {};
  for (let i = 0; i < rules.length; i++) {
    pairFrequencies[`${rules[i][0][0]}${rules[i][1]}`] = 0;
    pairFrequencies[`${rules[i][1]}${rules[i][0][1]}`] = 0;
  }
  for (let i = 0; i < template.length - 1; i++) {
    const index = `${template[i]}${template[i + 1]}`;
    if (pairFrequencies[index] === undefined) {
      pairFrequencies[index] = 0;
    }
    pairFrequencies[index] += 1;
  }

  for (let i = 0; i < steps; i++) {
    let tempObj = {...pairFrequencies};
    Object.keys(pairFrequencies).forEach(el => {
      if (pairFrequencies[el] > 0) {
        const temp = pairFrequencies[el];
        const newPair1 = `${el[0]}${ruleObj[el]}`;
        const newPair2 = `${ruleObj[el]}${el[1]}`;
        tempObj[newPair1] += temp;
        tempObj[newPair2] += temp;
        tempObj[el] -= temp;
      }
    })
    pairFrequencies = { ...tempObj };
  }

  // Sum chars & get result
  let charCounts = {};
  Object.keys(pairFrequencies).forEach(el => {
    if (charCounts[el[0]] === undefined) {
      charCounts[el[0]] = 0;
    }
    if (charCounts[el[1]] === undefined) {
      charCounts[el[1]] = 0;
    }
    charCounts[el[0]] += pairFrequencies[el];
    charCounts[el[1]] += pairFrequencies[el];
  });

  /**
   * Because we count pairs.. char count is 2x more than it should be
   * F.e. ...NBAN... B in NB and BA is counted 2 times
   */
  Object.keys(charCounts).forEach(char => {
    charCounts[char] /= 2;
  })
  /**
   * First char and last char is counted only one times and we already divided them by 2
   * (add 0.5 which would mean 1 before division)
  */
  charCounts[template[0]] += 0.5;
  charCounts[template[template.length - 1]] += 0.5;

  // Get result
  let biggestFrequency = 0;
  let smallestFrequency = Number.MAX_VALUE;
  Object.values(charCounts).forEach(count => {
    if (count > biggestFrequency) {
      biggestFrequency = count;
    }
    if (count < smallestFrequency) {
      smallestFrequency = count;
    }
  });

  document.getElementById("result").innerHTML = biggestFrequency - smallestFrequency;
}

const processStepOptimized = (input, ruleObj) => {
  let newString = "";
  for (let i = 0; i < input.length - 1; i++) {
    newString += input[i];
    newString += ruleObj[`${input[i]}${input[i + 1]}`];
  }
  newString += input[input.length - 1];
  return newString;
}
