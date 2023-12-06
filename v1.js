function createV1() {
    //put a black rectangle behind the plot
    fill(235, 230, 224);
    rectMode(CORNERS);
    noStroke();
    rect(bounds.left, bounds.top, bounds.right, bounds.bottom);

    // //put a black rectangle behind the plot
    // fill(230, 223, 215);
    // rectMode(CORNERS);
    // noStroke();
    // rect(bounds.left, bounds.top + 421, bounds.right, bounds.bottom);

    fill(219, 58, 46);
    noStroke();
    ellipse (canvasWidth/2 - 100, bounds.top - 25, 5, 5);
    fill(131, 123, 174);
    noStroke();
    ellipse (canvasWidth/2 - 10, bounds.top - 25, 5, 5);
    fill(144, 92, 150);
    noStroke();
    ellipse (canvasWidth/2 + 50, bounds.top - 25, 5, 5);

    textSize(12);
    textAlign(LEFT, CENTER);
    textFont(myFont_01);
    text("Residential", canvasWidth/2 - 90, bounds.top - 26 );
    textSize(12);
    textAlign(LEFT, CENTER);
    text("Office", canvasWidth/2, bounds.top - 26 );
    textSize(12);
    textAlign(LEFT, CENTER);
    text("Hybrid", canvasWidth/2 +60, bounds.top - 26 )

    // Draw x-axis
    stroke(0);
    strokeWeight(1);
    line(bounds.left, bounds.bottom, bounds.right, bounds.bottom);

    // draw x-axis labels
    textSize(12);
    textFont(myFont_01);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    if (xAxisMode == "year") {
        for (let year = 1900; year <= 2030; year += 30) {
            let x = map(year, 1900, 2030, bounds.left, bounds.right);
            text(year, x, bounds.bottom + 15);
        }
    } else if (xAxisMode == "ranking") {
        for (let rank = dataCount - 1; rank >= 0; rank -= 20) {
            let x = map(rank, dataCount, 1, bounds.left, bounds.right);
            text(rank, x, bounds.bottom + 15);
        }
    }

    // draw y-axis labels
    textSize(12);
    fill(100);
    noStroke();
    textAlign(RIGHT, CENTER);
    for (let height = 200; height <= 500; height += 100) {
        let y = map(height, dataMin, dataMax, bounds.bottom - 170, bounds.top);
        noStroke();
        fill(100);
        text(height, bounds.left - 10, y);

        stroke(184, 178, 175);
        strokeWeight(0.7);
        line(bounds.left, y, bounds.right, y);

        if (height == 200) {
            stroke(184, 178, 175);
            strokeWeight(0.7);
            line(bounds.left, y + 55, bounds.right, y + 55);
            noStroke();
            text(150, bounds.left - 10, y + 55);

            fill(230, 223, 215);
            rectMode(CORNERS);
            noStroke();
            rect(bounds.left, y + 55, bounds.right, bounds.bottom);
        }
    }

    // textSize(18);
    // textFont(myFont_01);
    // fill(0);
    // text("150+ METERS", bounds.left + 110, bounds.top - 40);


    data.forEach(function (entry) {
        entry.update();
        entry.display();

        if (xAxisMode === "year") {
            if (mouseIsPressed) {
                entry.mousePressed(handleBuildingClick);
            }
        }

        // handle the case in ranking chart, the mouse pressed, fly to the building location
        if (xAxisMode === "ranking") {
            if (mouseIsPressed && nearestDataPoint && isMouseInBounds()) {
                handleBuildingClick(nearestDataPoint.coordinates);
            }
        }
    });


    var maxBuildingsPerYear = 0;

    for (const i in buildingsPerYear) {
        if (buildingsPerYear[i] > maxBuildingsPerYear) {
            maxBuildingsPerYear = buildingsPerYear[i];
        }
    }

    let closestYear = null;
    let minDist = Number.MAX_VALUE;

    for (let i = 1900; i <= 2030; i++) {
        // calculate x position for each year
        let x = map(i, 1900, 2030, bounds.left, bounds.right);

        // draw a vertical line for each year, number of tall buildings built
        if (xAxisMode !== "ranking") {
            let length = map(buildingsPerYear[i], 0, maxBuildingsPerYear, 0, 150);
            stroke(147, 142, 145);
            strokeWeight(1.2);
            noFill();
            line(x, bounds.bottom, x, bounds.bottom - length);
        }

        let distToMouse = abs(mouseX - x);
        if (distToMouse < minDist) {
            minDist = distToMouse;
            closestYear = i;
        }
    }

    if (xAxisMode === "year") {
        if (minDist <= 3) {
            let x = map(closestYear, 1900, 2030, bounds.left, bounds.right);
    
            let yearText = "Year: " + closestYear;
            let builtText;
    
            if (buildingsPerYear[closestYear] == null) {
                builtText = "Built: 0";
            } else {
                builtText = "Built: " + buildingsPerYear[closestYear];
            }
    
            let yearTextWidth = textWidth(yearText);
            let builtTextWidth = textWidth(builtText);
    
            let isTextOnLeft = x + 10 + yearTextWidth > bounds.right;
    
            let yearTextX = isTextOnLeft ? x - 10 : x + 10;
            let builtTextX = isTextOnLeft ? x - 10 : x + 10;
    
            fill(0);
            noStroke();
            textSize(13);
            textAlign(isTextOnLeft ? RIGHT : LEFT, CENTER);
            textFont(myFont_01);
            text(builtText, builtTextX, bounds.top + 55);
    
            fill(0);
            noStroke();
            textSize(16);
            textAlign(isTextOnLeft ? RIGHT : LEFT, CENTER);
            textFont(myFont_01);
            text(yearText, yearTextX, bounds.top + 35);
    
            // update hover
            hoveredYear = closestYear;
    
            highlightDotsForYear(closestYear);
    
            // draw hovered year
            stroke(216, 57, 46);
            strokeWeight(1);
            line(x, bounds.top, x, bounds.bottom);
        } else {
            // reset the hovered year if the mouse is no longer hovering over it
            hoveredYear = null;
        }
    } else if (xAxisMode === "ranking") {
        highlightNearestDot();
    }
    
}

function DataPoint(idx, amt, names, coordinates, uses, neighbors) {
    var index = idx;
    var amount = amt;

    this.originalYear = idx;
    this.buildingName = names;
    this.coordinates = coordinates;

    // set x and y
    var x = null;
    var y = null;

    // updating any animated variables
    this.update = function () {
        x.update();
        y.update();
    }
    this.getX = function () {
        return x.value;
    }

    this.getY = function () {
        return y.value;
    };

    this.getUses = function () {
        return this.uses;
    };

    this.highlight = function () {
        let fillColor = color(107, 130, 125);

        if (uses === "residential") {
            fillColor = color(219, 58, 46);
        } else if (uses === "office") {
            fillColor = color(131, 123, 174);
        } else if (uses === "hotel") {
            fillColor = color(182, 151, 188);
        } else if (uses === "hybrid") {
            fillColor = color(144, 92, 150);
        }

        let fillColor2 = color(158, 166, 161, 90);

        if (uses === "residential") {
            fillColor2 = color(225, 134, 108, 90);
        } else if (uses === "office") {
            fillColor2 = color(174, 166, 199, 90);
        } else if (uses === "hotel") {
            fillColor2 = color(182, 151, 188, 90);
        } else if (uses === "hybrid") {
            fillColor2 = color(158, 166, 161, 90);
        }

        fill(fillColor);
        stroke(fillColor2);
        strokeWeight(6.5);
        ellipse(x.value, y.value, 6.5, 6.5);
    };

    // create a function to assign point's color
    this.getColorByUse = function () {
        const colors = {
            'Residential': color(223, 112, 56, 70),
            'Office': color(131, 123, 174, 70),
            'Hybrid': color(107, 130, 125, 70),
        };

        // return the color for the current use
        return colors[uses] || color(107, 130, 125, 70);
    };

    this.display = function () {
        let fillColor = color(158, 166, 161);

        if (uses === "residential") {
            fillColor = color(225, 134, 108);
        } else if (uses === "office") {
            fillColor = color(174, 166, 199);
        } else if (uses === "hotel") {
            fillColor = color(182, 151, 188);
        } else if (uses === "hybrid") {
            fillColor = color(158, 166, 161);
        }

        let fillColor2 = color(158, 166, 161);

        if (uses === "residential") {
            fillColor2 = color(225, 134, 108, 50);
        } else if (uses === "office") {
            fillColor2 = color(174, 166, 199, 50);
        } else if (uses === "hotel") {
            fillColor2 = color(182, 151, 188, 50);
        } else if (uses === "hybrid") {
            fillColor2 = color(158, 166, 161, 50);
        }

        let fillColor3 = color(158, 166, 161);

        if (uses === "residential") {
            fillColor3 = color(216, 57, 46);
        } else if (uses === "office") {
            fillColor3 = color(129, 120, 169);
        } else if (uses === "hotel") {
            fillColor3 = color(144, 92, 150);
        } else if (uses === "hybrid") {
            fillColor3 = color(107, 130, 125);
        }
        
        // fill color to points
        fill(fillColor);
        noStroke();
        ellipse(x.value, y.value, 4.2, 4.2);

        cursor(HAND);
        // if the distance from the mouse to the data point is within 10 pixels
        if (nearestDataYear === this && dist(mouseX, mouseY, x.value, y.value) <= 4) {
            textAlign(LEFT);
            noStroke();
            textSize(12);
            fill(0);
            // draw the value of this data point (using 1 decimal point)
            text(nf(amount, 0, 1), x.value, y.value - 30);

            // display building info
            fill(fillColor3);
            
            textSize(16);
            textFont(myFont_02);
            noStroke();
            text(this.buildingName, bounds.left+10, bounds.top + 15);

            fill(255);
            noStroke();
            ellipse(x.value, y.value, 19, 19);

            // draw a gray line pointing to the x-coordinate
            // stroke("red");
            // strokeWeight(0.7);
            // line(x.value, bounds.bottom, x.value, y.value);
        }

        if (xAxisMode === "ranking") {
            stroke(216, 208, 192, 150);
            strokeWeight(1);
            line(x.value, y.value, x.value, bounds.bottom);
        }
    }

    // a function to set the 'index' (where it is in the array)
    // which we can use to determine the x-position
    this.setIndex = function (idx) {
        index = idx;
        var newX;
        if (xAxisMode == "year") {
            // use setTarget() instead of x= so that it will animate
            newX = map(this.originalYear, 1900, 2030, bounds.left, bounds.right);
        } else if (xAxisMode == "ranking") {
            newX = map(idx, 0, dataCount - 1, bounds.left, bounds.right);
        }

        // if this is the first time it's being set, create the SoftNum
        if (x == null) {
            x = new SoftNum(newX);
            x.easing = 0.05;
        } else {
            x.setTarget(newX);
        }
    };

    // this sets the actual value for this data point
    this.setAmount = function (amt) {
        amount = amt;
        // use setTarget() instead of y= so that it will animate
        var newY = map(amt, dataMin, dataMax, bounds.bottom - 170, bounds.top);
        if (y == null) {
            y = new SoftNum(newY);
            y.easing = 0.05;
        } else {
            y.setTarget(newY);
        }
    }

    // function to get the data point's value so it can be sorted
    this.getAmount = function () {
        return amount;
    }

    // because these are inside DataPoint, not inside another function,
    // this code will run when "new DataPoint(idx, amt)" is called,
    // setting the initial index and amount to the numbers passed in.
    this.setIndex(idx);
    this.setAmount(amt);

    this.mousePressed = function (callback) {
        if (dist(mouseX, mouseY, x.value, y.value) < 10) {
            // Use this.coordinates instead of feature.geometry.coordinates
            callback(this.coordinates);
        }
    };


}

function showYear() {
    xAxisMode = "year";
    for (var i = 0; i < dataCount; i++) {
        data[i].setIndex(data[i].originalYear);
    }
}

function showRanking() {
    xAxisMode = "ranking";

    // sort the data in descending order
    data.sort((a, b) => a.getAmount() - b.getAmount());

    // update the index of each data point
    for (var i = 0; i < dataCount; i++) {
        data[i].setIndex(i);
    }

    resetMap();
}

function handleBuildingClick(coordinates) {
    // send coordinates to Mapbox JS code
    window.postMessage({ type: 'buildingClick', coordinates: coordinates }, '*');
}

function resetMap() {
    // reset mapbox map
    window.postMessage({ type: 'resetMap' }, '*');
}

let nearestDataYear = null;

function highlightDotsForYear(year) {
    if (year === null) {
        return;
    }

    let minDist = Number.MAX_VALUE;

    for (const dataPoint of data) {
        if (dataPoint.originalYear == year) {
            dataPoint.highlight();
        }
    }

    for (const dataPoint of data) {
        if (dataPoint.originalYear == year) {
            let distToMouse = dist(mouseX, mouseY, dataPoint.getX(), dataPoint.getY());
            if (distToMouse < minDist) {
                minDist = distToMouse;
                nearestDataYear = dataPoint;
            }
        }
    }
}

let nearestDataPoint = null;

function highlightNearestDot() {
    let minDist = Number.MAX_VALUE;

    for (const dataPoint of data) {
        let xDist = abs(mouseX - dataPoint.getX());
        if (xDist < minDist && mouseY > bounds.top + 10) {
            minDist = xDist;
            nearestDataPoint = dataPoint;
        }
    }

    if (nearestDataPoint) {
        let x = nearestDataPoint.getX();
        let y = nearestDataPoint.getY();
        let uses = nearestDataPoint.getUses();
        let rank = dataCount - data.indexOf(nearestDataPoint);

        let fillColor = color(107, 130, 125);

        if (uses === "residential") {
            fillColor = color(219, 58, 46);
        } else if (uses === "office") {
            fillColor = color(131, 123, 174);
        } else if (uses === "hotel") {
            fillColor = color(182, 151, 188);
        } else if (uses === "hybrid") {
            fillColor = color(144, 92, 150);
        }

        let fillColor2 = color(158, 166, 161, 90);

        if (uses === "residential") {
            fillColor2 = color(225, 134, 108, 90);
        } else if (uses === "office") {
            fillColor2 = color(174, 166, 199, 90);
        } else if (uses === "hotel") {
            fillColor2 = color(182, 151, 188, 90);
        } else if (uses === "hybrid") {
            fillColor2 = color(158, 166, 161, 90);
        }

        let fillColor3 = color(158, 166, 161);

        if (uses === "residential") {
            fillColor3 = color(216, 57, 46);
        } else if (uses === "office") {
            fillColor3 = color(129, 120, 169);
        } else if (uses === "hotel") {
            fillColor3 = color(144, 92, 150);
        } else if (uses === "hybrid") {
            fillColor3 = color(107, 130, 125);
        }

        fill(fillColor);
        stroke(fillColor2);
        strokeWeight(6.5);
        ellipse(x, y, 6.5, 6.5);

        // highlight the dot and line
        // fill(255);
        // stroke(255, 255, 255, 40);
        // strokeWeight(8);
        // ellipse(x, y, 6, 6);

        // connect dot to the bottom
        stroke(227, 115, 57);
        strokeWeight(1.2);
        line(x, bounds.top, x, bounds.bottom);

        // show building information
        fill(fillColor3);
        textAlign(LEFT);
        noStroke();
        textSize(16);
        textFont(myFont_02);
        text(nearestDataPoint.buildingName, bounds.left+10, bounds.top + 15);
    
        let rankText = "Rank: " + rank;
        let rankTextWidth = textWidth(rankText);
        let isRankTextOnLeft = x + rankTextWidth + 10 > bounds.right;
    
        let rankTextOffset = isRankTextOnLeft ? -10 - rankTextWidth / 2 : 10 + rankTextWidth / 2;
    
        fill(0);
        noStroke();
        textSize(16);
        textFont(myFont_01);
        textAlign(CENTER, CENTER);
        text(rankText, x + rankTextOffset, bounds.top + 35);
    }
}

function isMouseInBounds() {
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
}