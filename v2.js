//function createV2() {
//  textSize(12);
//  rectMode(CORNER);
//  let separation = 20;
//  let barHeight = 12;
//  let axisX = canvasWidth / 2;
//  let axisY = 250;

//  if (displayMode === "comparison") {
//    // residential and office buildings comparison
//    let labels = ["1910s", "1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

//    for (let i = 0; i < table2.getRowCount(); i++) {
//      let yPos = axisY + i * separation;

//      officeWidths[i].update();
//      residentialWidths[i].update();

//      let officeHover = isMouseOverBar(axisX, yPos, officeWidths[i].value, barHeight);
//      let residentialHover = isMouseOverBar(axisX - residentialWidths[i].value, yPos, residentialWidths[i].value, barHeight);

//      if (officeHover) {
//        strokeWeight(2);
//        stroke(0);
//      } else {
//        noStroke();
//      }
//      fill(75, 192, 192);
//      rect(axisX, yPos, officeWidths[i].value, barHeight);

//      if (residentialHover) {
//        strokeWeight(2);
//        stroke(0);
//      } else {
//        noStroke();
//      }
//      fill(255, 99, 132);
//      rect(axisX, yPos, -residentialWidths[i].value, barHeight);

//      // Draw the labels
//      noStroke();
//      fill(0);
//      textAlign(CENTER);
//      text(labels[i], 25, yPos + barHeight - 2);

//      if (officeHover) {
//        let officeValue = table2.getNum(i, "office");
//        textAlign(LEFT, CENTER);
//        text(officeValue, axisX + officeWidths[i].value + 5, yPos + barHeight / 2);
//      }

//      if (residentialHover) {
//        let residentialValue = table2.getNum(i, "residential");
//        textAlign(RIGHT, CENTER);
//        text(residentialValue, axisX - residentialWidths[i].value - 5, yPos + barHeight / 2);
//      }
//    }
//  }
//  else if (displayMode === "top10") {
    
//    // top 10 tallest buildings chart code
//    let filteredData = table1.matchRows(selectedCategory, "uses");
//    filteredData.sort((a, b) => b.getNum("height") - a.getNum("height"));
//    filteredData = filteredData.slice(0, 10);

//    for (let i = 0; i < filteredData.length; i++) {
//      let yPos = axisY + i * separation;
//      let height = filteredData[i].getNum("height");

//      // Draw the bar
//      fill(75, 192, 192);
//      rect(axisX, yPos, height, barHeight);

//      // Draw the building name label
//      noStroke();
//      fill(0);
//      textAlign(RIGHT, CENTER);
//      text(filteredData[i].getString("name"), axisX - 5, yPos + barHeight / 2);

//      // Draw the building height label
//      textAlign(LEFT, CENTER);
//      text(height + "m", axisX + height + 5, yPos + barHeight / 2);
//    }
//  }
//  createDoughnutChart();
//}

//function isMouseOverBar(x, y, width, height) {
//  return (
//    mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height
//  );
//}

//function createDoughnutChart() {
//  let count_office = 0;
//  let count_residential = 0;
//  let count_hybrid = 0;

//  for (let i = 0; i < table1.getRowCount(); i++) {
//    let uses = table1.getString(i, "uses");

//    if (uses === "office") {
//      count_office++;
//    } else if (uses === "residential") {
//      count_residential++;
//    } else {
//      count_hybrid++;
//    }
//  }

//  let data = [count_office, count_residential, count_hybrid];
//  let colors = [
//    color("#d5ae40"),
//    color("#d75f14"),
//    color("#30575f"),
//  ];

//  let total = count_office + count_residential + count_hybrid;

//  let lastAngle = 0;
//  let radius = 80;
//  let innerRadius = 50;

//  let doughnutCenterY = 150;

//  for (let i = 0; i < data.length; i++) {
//    let angle = (data[i] / total) * TWO_PI;
//    let midAngle = lastAngle + angle / 2;

//    fill(colors[i]);
//    arc(width / 2, doughnutCenterY, radius * 2, radius * 2, lastAngle, lastAngle + angle);
//    fill(100);
//    arc(width / 2, doughnutCenterY, innerRadius * 2, innerRadius * 2, lastAngle, lastAngle + angle);

//    if (isMouseOverArc(width / 2, doughnutCenterY, innerRadius, radius, lastAngle, lastAngle + angle)) {
//      fill(255, 255, 0, 100);
//      arc(width / 2, doughnutCenterY, radius * 2, radius * 2, lastAngle, lastAngle + angle);
//    }

//    // Display the percentage labels
//    let percentage = (data[i] / total) * 100;
//    let labelX = width / 2 + (radius + 10) * cos(midAngle);
//    let labelY = doughnutCenterY + (radius + 10) * sin(midAngle);
//    textAlign(CENTER, CENTER);
//    textSize(12);
//    fill(0);
//    text(nf(percentage, 0, 2) + "%", labelX, labelY);

//    // if (mouseIsPressed && isMouseOverArc(width / 2, doughnutCenterY, innerRadius, radius, lastAngle, lastAngle + angle)) {
//    //   displayMode = "top10";
//    //   if (i === 0) {
//    //     selectedCategory = "office";
//    //   } else if (i === 1) {
//    //     selectedCategory = "residential";
//    //   } else {
//    //     selectedCategory = "hybrid";
//    //   }
//    // } else if (mouseIsPressed && !isMouseOverAnyArc(width / 2, doughnutCenterY, innerRadius, radius, data, total)) {
//    //   displayMode = "comparison";
//    // }
    
//    lastAngle += angle;
//  }
//}

//function updateDisplayMode() {
//  let count_office = 0;
//  let count_residential = 0;
//  let count_hybrid = 0;

//  for (let i = 0; i < table1.getRowCount(); i++) {
//    let uses = table1.getString(i, "uses");

//    if (uses === "office") {
//      count_office++;
//    } else if (uses === "residential") {
//      count_residential++;
//    } else {
//      count_hybrid++;
//    }
//  }

//  let data = [count_office, count_residential, count_hybrid];
//  let total = count_office + count_residential + count_hybrid;

//  let innerRadius = 50;
//  let outerRadius = 80;
//  let doughnutCenterY = 150;

//  if (isMouseOverAnyArc(width / 2, doughnutCenterY, innerRadius, outerRadius, data, total)) {
//    let index = 0;
//    let startAngle = 0;
//    let endAngle = data[index] / total * TWO_PI;

//    while (!isMouseOverArc(width / 2, doughnutCenterY, innerRadius, outerRadius, startAngle, endAngle)) {
//      index++;
//      startAngle = endAngle;
//      endAngle += data[index] / total * TWO_PI;
//    }

//    if (mouseIsPressed) {
//      displayMode = "top10";
//      if (index === 0) {
//        selectedCategory = "office";
//      } else if (index === 1) {
//        selectedCategory = "residential";
//      } else {
//        selectedCategory = "hybrid";
//      }
//    }
//  } else if (mouseIsPressed) {
//    displayMode = "comparison";
//  }
//}

//function isMouseOverAnyArc(cx, cy, innerRadius, outerRadius, data, total) {
//  let overAnyArc = false;

//  for (let i = 0; i < data.length; i++) {
//    let startAngle = (i === 0) ? 0 : data.slice(0, i).reduce((a, b) => a + b) / total * TWO_PI;
//    let endAngle = startAngle + data[i] / total * TWO_PI;

//    if (isMouseOverArc(cx, cy, innerRadius, outerRadius, startAngle, endAngle)) {
//      overAnyArc = true;
//      break;
//    }
//  }

//  return overAnyArc;
//}

//function isMouseOverArc(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
//  let dx = mouseX - cx;
//  let dy = mouseY - cy;
//  let mouseDist = sqrt(dx * dx + dy * dy);
//  let mouseAngle = atan2(dy, dx);

//  if (mouseAngle < 0) {
//    mouseAngle += TWO_PI;
//  }

//  return (
//    mouseDist >= innerRadius &&
//    mouseDist <= outerRadius &&
//    mouseAngle >= startAngle &&
//    mouseAngle <= endAngle
//  );
//}
