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

// module
(function()
{

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
var spawnZ;
var frameCount=0;

// test multiple groups
var spawnList = [];
var explodeEmitter;
var torpedoEmiiter;
var dustEmitter;
var plasmaEmitter;

// Add object pooling
const particlePool = [];
const MAX_PARTICLES = 1000;

function getParticle() {
  return particlePool.pop() || new Particle();
}

function returnParticle(particle) {
  if (particlePool.length < MAX_PARTICLES) {
    particlePool.push(particle);
  }
}

function ExplodeParticleEmitter()
{
  this.series();
}

ExplodeParticleEmitter.prototype.create = function()
{
  spawnList.push(new ParticleGroup(this));
  spawnList.push(new ParticleGroup(this));  
}

// define series constants here
ExplodeParticleEmitter.prototype.series = function()
{
  this.plane = RandomNormal();

  this.iteration = 0;
  this.particleCount = 256;
  this.sx = centreX;
  this.sy = centreY;
  this.size = 6.0;
  this.time = 0;
  this.life = 5;
}

// each iteration will change a property
ExplodeParticleEmitter.prototype.generate = function()
{

  this.pos = {x:spawnX, y:spawnY, z:spawnZ};
  this.vel = new RandomNormal();
  this.velsize = Math.random()*-1.0;
  this.life = Math.random()*5.0;
  this.color = 'rgb('+64+this.iteration/4+','+this.iteration/16+','+this.iteration/32+')';
  this.iteration++;
}

function PhotonTorpedoEmitter()
{
  this.series();
}

PhotonTorpedoEmitter.prototype.create = function()
{
    spawnList.push(new ParticleGroup(this));
   // spawnList.push(new ParticleGroup(this));
   // spawnList.push(new ParticleGroup(this));
    //spawnList.push(new ParticleGroup(this));
}

// define series constants here
PhotonTorpedoEmitter.prototype.series = function()
{
  this.plane = {x:1,y:1,z:1};
  this.iteration = 0;
  this.particleCount = 64;
  this.sx = centreX;
  this.sy = centreY;
  this.time = 0;
  this.life = 2;
  this.plane = {x:0, y:0, z:-1};
}

// each iteration will change a property
PhotonTorpedoEmitter.prototype.generate = function()
{
  
  this.pos = {x:(spawnX-centreX)-(cX-centreX), y:(spawnY-centreY)-(cY-centreY), z:-100};

  this.vel = {x:0, y:0, z:-5-(this.iteration*0.1)}
  this.velsize = -0.01 - (Math.random());
  this.size = 5.0 *this.iteration*0.1;
  this.life = 6;
  this.color = 'rgb(255, 64, 10)';
  if (this.iteration==63)
  {
    this.velsize = -0.06;
  }
  this.iteration++;
}

function PlasmaEmitter()
{
  this.series();
}

PlasmaEmitter.prototype.create = function()
{
    spawnList.push(new ParticleGroup(this));
   // spawnList.push(new ParticleGroup(this));
   // spawnList.push(new ParticleGroup(this));
    //spawnList.push(new ParticleGroup(this));
}

// define series constants here
PlasmaEmitter.prototype.series = function()
{
  this.plane = {x:1,y:1,z:-1};
  this.iteration = 0;
  this.particleCount = 64;
  this.sx = centreX;
  this.sy = centreY;
  this.time = 0;
  this.life = 3;

}

// each iteration will change a property
PlasmaEmitter.prototype.generate = function()
{
  
  this.pos ={x:(spawnX-centreX), y:(spawnY-centreY), z:spawnZ};

  this.vel = {x:0, y:0, z:2+(this.iteration*0.0005)}
  this.velsize = -0.01 - (Math.random()*0.2);
  this.size = 3.0 *this.iteration*0.02;
  this.life = 4;
  this.color = 'rgb(0, 64, 200)';
  this.iteration++;
}

function DustParticleEmitter()
{
  this.series();
}

DustParticleEmitter.prototype.create = function()
{
  spawnList.push(new ParticleGroup(this));
}

// define series constants here
DustParticleEmitter.prototype.series = function()
{
  this.plane = new RandomNormal();

  this.iteration = 0;
  this.particleCount = 64;
  this.sx = centreX;
  this.sy = centreY;
  this.size = 6.0;
  this.time = 0;
  this.life = 5;
}
// each iteration will change a property
DustParticleEmitter.prototype.generate = function()
{
  this.pos = {x:spawnX, y:spawnY, z:spawnZ};
  this.vel = new RandomNormal();//RandomOnPlane(this.plane);
  var speed = Math.random()*2+2;
  this.vel.x*=speed;
    this.vel.y*=speed;
    this.vel.z*=speed;
  this.velsize = Math.random()*0.1;
  this.life = Math.random()*2.0;
  var grey = 255 - this.iteration*4;
  this.color = 'rgb('+grey+','+grey+','+grey+')';
  this.iteration++;
}


// uniform distribution of a normal 
function RandomNormal()
{
  var theta = Math.random() * Math.PI * 2;
  var nz = 1 - 2*Math.random();
  var phi = Math.acos(nz);
  var nx = Math.sin(theta)*Math.sin(phi);
  var ny = Math.cos(theta)*Math.sin(phi);
  
  return {x:nx, y:ny, z:nz};
}

function RandomOnPlane(B)
{
  
  var theta = Math.random() * Math.PI * 2;
  var nx = Math.sin(theta)+Math.cos(theta);
  var ny = Math.cos(theta)-Math.sin(theta);
  var A = {x:nx, y:ny, z:1};
  return {x: A.y*B.z - A.z*B.y, y: A.z*B.x - A.x*B.z, z:A.x*B.y-A.y*B.x};
}

// prototype classes

// particle group container
function ParticleGroup(emitter)
{
  this.create(emitter);
}

ParticleGroup.prototype.create = function(emitter)
{
  this.emitter = emitter;
  this.emitter.series();

  this.time = 0;
  this.life = emitter.life;
  this.particles = [];
  this.plane = this.emitter.plane;
  
  this.spawn();
}

ParticleGroup.prototype.spawn = function()
{
  // initiate an emitter series
  for (var i=0; i<this.emitter.particleCount; i++)
  {
     // generate next in series
     this.emitter.generate();
     this.particles[i] = new Particle(this.emitter);
  }
}

ParticleGroup.prototype.update = function()
{
  for (var i=0; i<this.particles.length; i++)
  {
    this.particles[i].move(this.plane);
  }
  this.time+=0.016;
  return this.time<this.life;
}

ParticleGroup.prototype.draw = function()
{
  for (var i=0; i<this.particles.length; i++)
  {
    this.particles[i].draw();
  }
}

// particle item
function Particle(time)
{
    this.create(time); 
}

Particle.prototype.create = function(emitter)
{
  this.sx = emitter.sx;
  this.sy = emitter.sy;
  this.pos = emitter.pos;
  this.vel = emitter.vel;
  this.size = emitter.size;
  this.velsize = emitter.velsize;
  this.time = emitter.time;
  this.life = emitter.life;
  this.color = emitter.color;
  this.offset = emitter instanceof PhotonTorpedoEmitter;
}

Particle.prototype.move = function(plane)
{
  this.pos.x += this.vel.x* plane.x*3;
  this.pos.y += this.vel.y* plane.y;
  this.pos.z += this.vel.z* plane.z*1.5;
  this.size += this.velsize;
  this.time+=0.016;
  if (this.size<=0) this.size=0.001;
}

Particle.prototype.draw = function() 
{
  if (this.pos.z + focalDepth > 0 && this.time < this.life)
  {
    var depth = focalPoint / (this.pos.z + focalDepth );
    if (depth<=0) return;
    var offX = 0, offY = 0;
    if (this.offset)
    {
      offX = cX - centreX;
      offY = cY - centreY;
    }
    var x = this.pos.x * depth + this.sx + offX;
    var y = this.pos.y * depth + this.sy + offY;
    var sz = this.size * depth;

    // fill a rect
    context.globalAlpha = 1.0 - this.time/this.life;
    context.beginPath();
    context.arc(x, y, sz, 0, 2*Math.PI);
    context.fillStyle = this.color;
    context.fill();
  }
}


// initialization

function init()
{
  // setup canvas and context
  canvas = document.getElementById('star-raiders');
  context = canvas.getContext('2d');
  
  // set canvas to be window dimensions
  resize();

  // create event listeners
//  canvas.addEventListener('mousemove', mouseMove);
//  canvas.addEventListener('click', mouseClick);
  window.addEventListener('resize', resize);

  // initialze variables
  spawnX = centreX;
  spawnY = centreY;

  cX=centreX;
  cY=centreY;
 
  explodeEmitter = new ExplodeParticleEmitter();
  torpedoEmitter = new PhotonTorpedoEmitter();
  dustEmitter    = new DustParticleEmitter();
  plasmaEmitter  = new PlasmaEmitter();

  spawnList = spawnList;
}

function initDemo()
{
  explodeEmitter.create();
  torpedoEmitter.create();
  dustEmitter.create();
  
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
  spawnX = mouseX;
  spawnY = mouseY;
  spawn();
}

var cycle = 0;
function spawn()
{
  cycle++;
  if ((cycle & 15) == 0)
    explodeEmitter.create();
  if ((cycle & 3) == 0)
    dustEmitter.create();

  torpedoEmitter.create();
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
function RenderParticles()
{
  // set additive mode
  context.globalCompositeOperation = 'lighter';

  for (var i = 0; i< spawnList.length; i++) spawnList[i].draw();
    // restore
  context.globalCompositeOperation = 'source-over';
  context.globalAlpha = 1.0;
}

function render()
{
 
  context.fillStyle = 'black';
  context.clearRect(0, 0, canvas.width, canvas.height);    
  
  RenderParticles();
  
  context.globalAlpha = 1.0;
  context.font = '20pt Calibri';
  context.fillStyle = 'rgb(255,255,255)';
  context.textAlign = "center";
  context.fillText('First step in particle explosions', canvas.width/2, 100);
  context.fillText('Second step particle groups and basic emitter', canvas.width/2, 130);   context.fillText('(clicking spawns more explosions)', canvas.width/2, 160);

}

// movement functions

function update()
{
  UpdateParticles();
  if ((frameCount&255)==0) spawn();
}

function UpdateParticles() {
  const start = performance.now();
  
  var i = spawnList.length;
  while (i) {
    --i;
    if (spawnList[i].update()==false) spawnList.splice(i,1);
  }

  perfMetrics.particles = performance.now() - start;
  
  // Log if too many particles
  if (spawnList.length > 1000) {
    console.warn('High particle count:', spawnList.length);
  }
}

// per frame tick functions

function animate()
{
  frameCount++;
  // movement update
  update();
  // render update
  render();
  // trigger next frame
  requestAnimationFrame(animate);
}


// entry point
init();
//initDemo();
//animate();

window.RenderParticles = RenderParticles;
window.UpdateParticles = UpdateParticles;
window.PhotonTorpedoEmitter = PhotonTorpedoEmitter;
window.PlasmaEmitter = PlasmaEmitter;
window.ExplodeParticleEmitter = ExplodeParticleEmitter;
window.DustParticleEmitter = DustParticleEmitter;

window.getDustEmitter = function() { return dustEmitter;}
window.getTorpedoEmitter = function() { return torpedoEmitter;}
window.getPlasmaEmitter = function() { return plasmaEmitter;}
window.getExplodeEmitter = function() { return explodeEmitter; }
window.setSpawn = function(x,y,z)  { spawnX = x; spawnY =y; spawnZ = z;}

window.spawnList = spawnList;

})();
