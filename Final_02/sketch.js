var data = [];
var dataCount;
var dataMin = 150;
var dataMax = 550;

var dataTable;
var xAxisMode = "year";

var bounds = {};
var buildingsPerYear = {};

let officeWidths = [];
let residentialWidths = [];

let myFont_01;
let myFont_02;
var hoveredYear = null;

var canvasWidth;
var canvasHeight;

let displayMode = "comparison";
let selectedCategory = "office";

// set current canvas as v1
var cv = "v1";

function preload() {
    dataTable = loadJSON("data/nyc-150.geojson");
    myFont_01 = loadFont('font/PxGrotesk-Regular.otf');
    myFont_02 = loadFont('font/PxGrotesk-Bold.otf');
    table1 = loadTable("data/nyc-150.csv", "csv", "header");
    table2 = loadTable("data/uses-timeline.csv", "csv", "header");
}

function windowResized() {
    print(width, height);
}

function setup() {

    // usesChart = createButton('USES');
    // usesChart.mousePressed(sv);
    // usesChart.parent('sketch');
    // usesChart.class('canvasButton');
    // usesChart.position(bounds.right - 230, bounds.top + 40);


    // // Get the container element
    // const container = document.getElementById('sketch');

    // // Calculate the width and height of the container
    // canvasWidth = container.offsetWidth;
    // canvasHeight = container.offsetHeight;

    // // Set up the canvas
    // const cnv = createCanvas(canvasWidth, canvasHeight);
    // cnv.parent("sketch");


    // // create year button and ranking button to switch
    // yearButton = createButton('YEAR');
    // yearButton.mousePressed(showYear);

    // rankingButton = createButton('HEIGHTS');
    // rankingButton.mousePressed(showRanking);

    // yearButton.parent('sketch');
    // rankingButton.parent('sketch');
    // yearButton.class('canvasButton');
    // rankingButton.class('canvasButton');

    // // set up the bounds for the chart
    // bounds.left = 40;
    // bounds.right = canvasWidth - 40;
    // bounds.top = 60;
    // bounds.bottom = canvasHeight - 60;

    // yearButton.position(bounds.right - 105, bounds.top + 33);
    // rankingButton.position(bounds.right - 45, bounds.top + 33);

    let canvasButtons = createElement('div');
    canvasButtons.id('canvas-buttons');

    // Get the container element
    let container = document.getElementById('sketch');

    // Calculate the width and height of the container
    canvasWidth = container.offsetWidth;
    canvasHeight = container.offsetHeight;

    // create year button and ranking button to switch
    let yearButton = createButton('YEAR');
    yearButton.mousePressed(showYear);

    let rankingButton = createButton('HEIGHTS');
    rankingButton.mousePressed(showRanking);

    yearButton.class('canvas-button');
    rankingButton.class('canvas-button');
    
    yearButton.parent(canvasButtons);
    rankingButton.parent(canvasButtons);
    canvasButtons.parent('sketch');

    // Set up the canvas
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent("sketch");

    // set up the bounds for the chart
    bounds.left = 32;
    bounds.right = canvasWidth - 32;
    bounds.top = 50;
    bounds.bottom = canvasHeight - 50;

    // set the data points
    dataCount = dataTable.features.length; // Number of features in the GeoJSON

    // use for loop to get the property and coordinates of the geojson
    for (var i = 0; i < dataCount; i++) {
        var feature = dataTable.features[i];
        var heights = feature.properties.heights;
        var endYear = feature.properties.end_year;
        var names = feature.properties.name;
        var coordinates = feature.geometry.coordinates;
        var uses = feature.properties.uses;
        var neighbors = feature.properties.neighborhoods;
        data.push(new DataPoint(endYear, heights, names, coordinates, uses, neighbors));

        if (buildingsPerYear[endYear]) {
            buildingsPerYear[endYear]++;
        } else {
            buildingsPerYear[endYear] = 1;
        }
    }

    // push element from table2
    for (let i = 0; i < table2.getRowCount(); i++) {
        let office = table2.getNum(i, "office");
        let residential = table2.getNum(i, "residential");
    
        let officeWidth = new SoftNum(map(office, 0, 40, 0, canvasWidth / 2 - 50), 0.1, 0.5);
        let residentialWidth = new SoftNum(map(residential, 0, 40, 0, canvasWidth / 2 - 50), 0.1, 0.5);
    
        officeWidths.push(officeWidth);
        residentialWidths.push(residentialWidth);
    }
}

function draw() {
    background("#F0ECE8");

    if (cv === "v1") {
        createV1();
    } else if (cv === "v2") {
        createV2();
    }

    
}

function sv() {
    cv = "v2"
}
