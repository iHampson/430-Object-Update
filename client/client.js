var socket;
var user = 'user' + (Math.floor((Math.random()*1000)) + 1);
var draws = {};
var canvas;
var ctx;

function draw()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var keys = Object.keys(draws);

  for(var i = 0; i < keys.length; i++)
  {
    var drawCall = draws[ keys[i] ];
    ctx.fillStyle = drawCall.style;
    ctx.fillRect(drawCall.x, drawCall.y, drawCall.width, drawCall.height);
  }
}

function setup()
{
  var time = new Date().getTime();
  var x = Math.floor(Math.random()*(300-10)+10); //random x position
  var y = Math.floor(Math.random()*(300-10)+10); //random y position
  draws[user] = {lastUpdate: time, x: x, y: y, width: 100, height: 100, style:'black'};
}

function handleMessage(data)
{
  if( !draws[data.name] )
  {
    draws[data.name] = data.coords;
  }
  else if( data.coords.lastUpdate > draws[data.name].lastUpdate )
  {
    draws[data.name] = data.coords;
  }
  draws[data.name].coords.style = 'red';
  draw(); //redraw after updates
}

function setupSockets(){
  socket.on('drawThis', handleMessage);
}

function init(){
  socket = io.connect();
  canvas = document.querySelector('#workSpace');
  ctx = canvas.getContext('2d');
  setup();
  setupSockets();
}

window.onload = init;
setInterval(function (){
  var time = new Date().getTime();

  draws[user].lastUpdate = time;
  draws[user].x += 5;

  socket.emit('draw', { name: user, coords: draws[user] });
  draw();
}, 3000);
