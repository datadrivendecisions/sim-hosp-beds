function setup() {
    let canvas = createCanvas(1200, 800);
    canvas.parent('canvas-container');
  }
  
  function draw() {
    background('LightCyan');
  
    // Dimensions for each room
    let walls = 10; // walls of rooms
    let corridor = 60; // corridor between rooms
    let roomWidth = (width - walls * 4) / 3;  // Adjusted width for padding
    let roomHeight = (height - corridor * 3) / 2; // Adjusted height for padding

  
    // Draw 6 rooms: 3 on top, 3 on bottom
    for (let y = 0; y < 2; y++) { // Two rows
        for (let x = 0; x < 3; x++) { // Three columns
          let posX = x * roomWidth + walls * (x + 1);
          let posY = y * roomHeight + corridor * (y + 1);
          stroke(0); // Black color for the borders
          fill('white'); // White color for the rooms
          rect(posX, posY, roomWidth, roomHeight);
          fill('deepskyblue'); // Color for label text fill
          stroke('deepskyblue') // Color for label text border
          textSize(24); // Label font size
          let s = 'Room'; // Text for label
          text(s, posX + roomWidth / 2.3, posY + 3.5 * roomHeight / 4);

          // Add beds
          drawBeds(posX, posY, roomWidth, roomHeight);
        }
      }
  }

  function drawBeds(roomX, roomY, roomWidth, roomHeight) {
    let bedWidth = roomWidth / 4; // Width of each bed
    let bedHeight = roomHeight / 5; // Height of each bed
    let bedPadding = bedWidth / 4; // Space between beds
  
    // Draw 6 beds: 3 on each side
    for (let i = 0; i < 3; i++) {
      // Left side beds
      stroke(0) // Color for label text border
      fill('Cornsilk'); // Color for the beds
      rect(roomX + bedPadding, roomY + i * bedHeight + bedPadding, bedWidth, bedHeight - bedPadding, 5);
      fill('White'); // Color for the pillows
      rect(roomX + bedPadding, roomY + i * bedHeight + bedPadding, bedWidth / 4, bedHeight - bedPadding, 5);
  
      // Right side beds
      fill('Cornsilk'); // Color for the beds
      rect(roomX + roomWidth - bedWidth - bedPadding, roomY + i * bedHeight + bedPadding, bedWidth, bedHeight - bedPadding, 5);
      fill('White'); // Color for the pillows
      rect(roomX + roomWidth - bedWidth / 4 - bedPadding, roomY + i * bedHeight + bedPadding, bedWidth / 4, bedHeight - bedPadding, 5);
    }
  }