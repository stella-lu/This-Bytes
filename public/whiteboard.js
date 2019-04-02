var $canvas = d3.select("#wbCanvas");
var cwidth = $canvas.attr("width");
var cheight = $canvas.attr("height");
var c = $canvas.node().getContext("2d");

var $picker = d3.select("#colorPicker");
var cpwidth = $picker.attr("width");
var cpheight = $picker.attr("height");
var cp = $picker.node().getContext("2d");

var screenRect = [0,0,cwidth,cheight];
var mousePos=[0,0];
var oldMouse = [0,0];
var lag = .4;

var shrinkTimeout = 0;
var shrinkInterval = 0;

var t0 = Date.now();

var offsetR = 5;
var offsetA = 0;
var offsetXY = [0,0];

setInterval(()=>{
  offsetR += Math.random()*2-1;
  offsetR *= .998;
  offsetA += Math.random()*.5-.24;
  offsetXY = [offsetR*Math.cos(offsetA),offsetR*Math.sin(offsetA)];
},20)

var currentColor = 'black';

var colorList = ['black', 'red','orange','blue','green','purple'];
var clY = [];

c.fillStyle = 'rgb(250,250,250)';
c.fillRect(...screenRect);

cp.fillStyle = 'blue';
cp.fillRect(...screenRect);

for (var i = 0; i < colorList.length; i++){
  const l=colorList.length;
  const dy = cpheight/l;
  cp.fillStyle = colorList[i];
  cp.fillRect(0, dy*i, cpwidth, dy*(i+1));
  clY.push(cp);
}

function draw(e){
  mousePos=d3.mouse(this);
  oldMouse = mousePos;
  // console.log(oldMouse);
  c.fillStyle = currentColor;
  c.fillRect(...mousePos,1,1);
}

function drawSmaller(){
  var image = new Image();
	image.src = $canvas.node().toDataURL("image/png");
  c.save();
  c.scale(.995,1.0015);
  // c.rotate(.001);
  c.drawImage(image,1,0);
  c.restore();
  console.log(Date.now()-t0);
  t0=Date.now();
}

/*
function drawLineBad(e){
  let oldMouse = mousePos;
  mousePos=d3.mouse(this);
  setTimeout(()=>{
    c.strokeStyle = currentColor;
    c.beginPath();
    c.moveTo(...oldMouse);
    c.lineTo(...mousePos);
    c.stroke();
  },lag*1000);
  // console.log('hi')
}
*/

function makeLine(oldM, newM){
  c.strokeStyle = currentColor;
    c.beginPath();
    c.moveTo(...oldM);
    c.lineTo(...newM);
    c.stroke();
}
function drawLine(e){
  oldMouse = mousePos;
  mousePos=d3.mouse(this);
  mousePos = [mousePos[0]+offsetXY[0],mousePos[1]+offsetXY[1]]
  let mousePos1 = mousePos;
  let oldMouse1 = oldMouse;
  // console.log(oldMouse);
  setTimeout(()=>{makeLine(oldMouse1,mousePos1)},lag*1000);
}

// $canvas.on("mousedown",draw);
d3.select("body").on("mouseup",()=>{console.log('moseup')});
$canvas.on("mousedown",function(e){
  mousePos=d3.mouse(this);
  oldMouse = mousePos;
  clearInterval(shrinkInterval);
  clearTimeout(shrinkTimeout);
  lag=Math.random()*.2+.1
});
// $canvas.on("mousedown",function(){oldMouse=d3.mouse(this);});
$canvas.call(d3.drag()
    .on('drag',drawLine)
    .on('end',()=>{
      console.log('moueup');
      shrinkTimeout = setTimeout(()=>{shrinkInterval = setInterval(drawSmaller,60)},1500);
}));

// $canvas.call(d3.drag().on("end",()=>{
//   console.log('moueup');
//   shrinkTimeout = setTimeout(()=>{shrinkInterval = setInterval(drawSmaller,5)},5000);
// }));

$picker.on("click", function(e){
  let [x,y] = d3.mouse(this);
  let yIndex = Math.floor(y/cpheight*colorList.length);
  currentColor = colorList[yIndex];
  // console.log(cpheight, y, yIndex);
})