/*****************************************************************************
The MIT License (MIT)

Copyright (c) 2014 Andi Smithers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*****************************************************************************/

// conceptualized and written by andi smithers


// constant options
const focalDepth = 80;
const focalPoint = 256;


// variables
var centreX;
var centreY;
var mouseX;
var mouseY;
var spawnX;
var spawnY;
var frameCount=0;

// test multiple groups


// initialization

function init()
{
  // setup canvas and context
  canvas = document.getElementById('star-raiders');
  context = canvas.getContext('2d');
    
  // set canvas to be window dimensions
  resize();

  // create event listeners
  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('click', mouseClick);
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mouseup', mouseUp);
  window.addEventListener('resize', resize);
  
  // initialze variables  
  SetShipLocation(galaxyMapSize.x*0.5, galaxyMapSize.y*0.5);

  // initial ping
  shipPing.x = shipPosition.x;
  shipPing.y = shipPosition.y;
  
  // buttons
  SetupButtons();
  
  // populate map
  BoardSetup();
  
  // populate local space
  SetupAsteroids();
  
  SetupNMEs();
  
  var d = new Date();
  gameStart = d.getTime();
  
  // testing this
  PressButton("Long Range");
}


// input functions

function mouseMove(event) 
{
	var rect = canvas.getBoundingClientRect();

	mouseX = event.clientX - rect.left,
	mouseY = event.clientY - rect.top
}

function mouseClick()
{
}

function resize()
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
    // compute centre of screen
  centreX = canvas.width/2;
  centreY = canvas.height/2;
}


// rendering functions

function render()
{
 
  context.fillStyle = 'black';
  context.clearRect(0, 0, canvas.width, canvas.height); 
  
  context.globalAlpha = 1.0;
  context.font = '20pt Calibri';
  context.fillStyle = 'rgb(255,255,255)';
  context.textAlign = "center";
  context.fillText('Empty Framework', canvas.width/2, 100);

}

// movement functions

function update()
{ 
}

function updateclocks()
{ 
  // compute frequency
  frameCount++;
  // compute time between frames
  currentTime = new Date().getTime();
  if (previousTime)  freqHz = (currentTime - previousTime)/1000.0;
  previousTime = new Date().getTime();
}

// per frame tick functions

let lastFrameTime = 0;
const MIN_FRAME_TIME = 1000/60; // 60 FPS cap

// Add performance monitoring
const perfMetrics = {
  update: 0,
  render: 0,
  particles: 0,
  collisions: 0
};

function animate(currentTime) {
  if (currentTime - lastFrameTime < MIN_FRAME_TIME) {
    requestAnimationFrame(animate);
    return;
  }
  lastFrameTime = currentTime;

  const frameStart = performance.now();
  
  updateclocks();
  
  const updateStart = performance.now();
  update();
  perfMetrics.update = performance.now() - updateStart;
  
  const renderStart = performance.now();
  render(); 
  perfMetrics.render = performance.now() - renderStart;

  perfMetrics.total = performance.now() - frameStart;

  // Log if frame takes too long
  if (perfMetrics.total > 16.67) { // 60fps = 16.67ms per frame
    console.warn('Slow frame:', perfMetrics);
  }

  requestAnimationFrame(animate);
}

let lowFPSCount = 0;
const FPS_THRESHOLD = 30;
const LOW_FPS_LIMIT = 10;

function checkPerformance() {
  const fps = 1000 / perfMetrics.total;
  
  if (fps < FPS_THRESHOLD) {
    lowFPSCount++;
    if (lowFPSCount > LOW_FPS_LIMIT) {
      console.warn('Emergency cleanup triggered');
      // Clear particles
      spawnList.length = 0;
      // Reset counters
      lowFPSCount = 0;
    }
  } else {
    lowFPSCount = 0;
  }
}

// entry point
init();
animate();
