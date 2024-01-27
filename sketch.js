const roomColors = ["#E6E6FA", "#F0FFF0", "#AFEEEE"];
const specialism = ["Lung", "Internal", "Oncology"];
const capacities = [18, 12, 6]; // Capacities for each specialism
const demand = []; // Demand for beds for each specialism
const specialismMeans = [14, 10, 5]; // Example mean values for each specialism
let chartData = {
    labels: [],
    datasets: [{
        label: 'Difference between Capacity and Demand',
        data: [],
        borderColor: 'tomato',
        backgroundColor: 'tomato',
    }]
};

function setup() {
  let canvas = createCanvas(1200, 800);
  canvas.parent('canvas-container');
  textSize(24); // Set text size globally

  // Sample demand from Poisson distribution
  for (let i = 0; i < specialism.length; i++) {
    demand[i] = poissonRandom(specialismMeans[i]);
  }

  updateSpecialismTable();
  initializeChart();
}

function draw() {
  background('LightCyan');

  // Dimensions for each room
  let wallThickness = 10;
  let corridorWidth = 60;
  let roomWidth = (width - wallThickness * 4) / 3;
  let roomHeight = (height - corridorWidth * 3) / 2;

  let roomIndex = 0;
  let bedsInRoom = 6;
  let specialismIndex = 0;
  let roomsForSpecialism = Math.ceil(capacities[specialismIndex] / bedsInRoom);
  let demandForSpecialism = demand[specialismIndex];

  // Draw 6 rooms: 3 on top, 3 on bottom
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 3; x++) {
      if (roomIndex >= roomsForSpecialism) {
        specialismIndex++;
        roomsForSpecialism += Math.ceil(capacities[specialismIndex] / bedsInRoom);
        demandForSpecialism = demand[specialismIndex];
      }

      let posX = x * roomWidth + wallThickness * (x + 1);
      let posY = y * roomHeight + corridorWidth * (y + 1);

      // Draw room
      fill(roomColors[specialismIndex]);
      stroke(0);
      rect(posX, posY, roomWidth, roomHeight);

      // Draw room label
      drawLabel(posX, posY, roomWidth, roomHeight, specialism[specialismIndex]);

      // Add beds
      drawBeds(posX, posY, roomWidth, roomHeight, demandForSpecialism);
      demandForSpecialism -= bedsInRoom;

      roomIndex++;
    }
  }
}

function drawLabel(x, y, w, h, label) {
  push();
  fill('DimGray');
  stroke('DimGray');
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h - 30);
  pop();
}

function drawBeds(x, y, w, h, demand) {
  let bedWidth = w / 4;
  let bedHeight = h / 5;
  let bedPadding = bedWidth / 4;

  for (let i = 0; i < 3; i++) {
    // Left side beds
    drawBed(x + bedPadding, y + i * bedHeight + bedPadding, bedWidth, bedHeight, demand > 0);
    drawPillow(x + bedPadding, y + i * bedHeight + bedPadding, bedWidth, bedHeight);
    demand--;

    // Right side beds
    drawBed(x + w - bedWidth - bedPadding, y + i * bedHeight + bedPadding, bedWidth, bedHeight, demand > 0);
    drawPillow(x + w - bedWidth / 4 - bedPadding, y + i * bedHeight + bedPadding, bedWidth, bedHeight);
    demand--;
  }
}

function drawBed(x, y, w, h, inDemand) {
  push();
  stroke(0);
  fill(inDemand ? 'Grey' : 'Cornsilk');
  rect(x, y, w, h - w / 4, 5);
  pop();
}

function drawPillow(x, y, w, h) {
  push();
  fill('White');
  rect(x, y, w / 4, h - w / 4, 5);
  pop();
}

function startSimulation() {
    const simulationCount = parseInt(document.getElementById('simulation-count').value);
    for (let i = 0; i < simulationCount; i++) {
      setTimeout(function() {
        runSimulation();
      }, 1000 * i); // Delay of 1000ms (1 second) * i
    }
  }
  
  function runSimulation() {
    // Resample demand for each specialism
    for (let i = 0; i < specialism.length; i++) {
      demand[i] = poissonRandom(specialismMeans[i]);
    }
  
    let totalDifference = 0;
    for (let i = 0; i < specialism.length; i++) {
        let difference = capacities[i] - demand[i];
        totalDifference += difference;
    }

    // Add data to chartData
    chartData.labels.push(chartData.labels.length + 1);
    chartData.datasets[0].data.push(totalDifference);

    updateSpecialismTable();
    updateChart();
  }

function updateSpecialismTable() {
    const tableBody = document.getElementById('specialism-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows
  
    specialism.forEach((spec, index) => {
      const row = tableBody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
  
      cell1.innerHTML = spec;
      cell2.innerHTML = demand[index];
      cell3.innerHTML = capacities[index];
      cell4.innerHTML = capacities[index] - demand[index];

      // Apply the class to align numbers to the right
      cell2.classList.add('number-cell');
      cell3.classList.add('number-cell');
      cell4.classList.add('number-cell');
    });
  }

  function poissonRandom(mean) {
    let L = Math.exp(-mean);
    let p = 1.0;
    let k = 0;
  
    do {
      k++;
      p *= Math.random();
    } while (p > L);
  
    return k - 1;
  }

  let myChart;

function initializeChart() {
    const ctx = document.getElementById('demandChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart() {
    myChart.update();
}
  
