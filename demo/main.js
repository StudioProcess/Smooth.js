import canvas from './draw.js';

const canvasSize = 1000;

function radioValue(name) {
  return document.querySelector(`input[type=radio][name=${name}]:checked`).value;
}
function value(name) {
  return document.querySelector(`input[name=${name}]`).value;
}

function range(stop) {
  let out = [];
  for (let i=0; i<stop; i++) { out.push(i); }
  return out;
}

const main = canvas('#_2d', canvasSize, canvasSize);
const side = canvas('#_1d', canvasSize, canvasSize);

let cp0 = []; // pre-generated control points
let cp = []; // control points
let ip = []; // interpolated points

// randomly generate control points
function runGeneration() {
  const margin = 0.2;
  cp0 = range(10).map(i => [
    canvasSize*margin + Math.random()*canvasSize*(1-2*margin),
    canvasSize*margin + Math.random()*canvasSize*(1-2*margin)
  ]);
  // console.log(cp);
}

// calculate intermediate points
function runInterpolation() {
  let num = value('points');
  let res = value('intermediates');
  let method = radioValue('method');
  let clip = radioValue('clip');
  let cubicTension = radioValue('cubicTension');
  let sincFilterSize = 2;
  let sincWindow = x => Math.exp(-x * x);
  
  cp = cp0.slice(0, num);
  ip = [];
  let s = Smooth(cp, { method, clip, cubicTension, sincFilterSize, sincWindow });
  
  let pcs = cp.length-1; // number of curve pieces
  for (let p=-1; p<cp.length; p++) {
    for (let i=0; i<res; i++) {
      let u = p + i/res;
      ip.push( s(u) );
    }
  }
  // console.log(ip);
}

function drawCurve(scanvas, cp, ip) {
  scanvas.clear();
  scanvas.lines (ip, '#000', 1 );
  scanvas.points(cp, '#000', 6);
  scanvas.points(ip, '#f00', 3);
}

function drawMain() {
  drawCurve(main, cp, ip);
}

function drawSide() {
  let du = cp.length - 1 + 2; // length of parameter domain
  let sidecp = cp.map((p, i) => [
    (canvasSize/du) * (i + 1),
    p[1]
  ]);
  let sideip = ip.map((p, i) => [
    canvasSize/(ip.length-1) * i,
    p[1]
  ]);
  drawCurve(side, sidecp, sideip);
  side.lines([ [canvasSize/du,0], [canvasSize/du,canvasSize] ], 'lightgray', 1);
  side.lines([ [canvasSize/du*(sidecp.length),0], [canvasSize/du*(sidecp.length),canvasSize] ], 'lightgray', 1);
}

function generate() {
  runGeneration();
  interpolate();
}

function interpolate() {
  runInterpolation();
  drawMain();
  drawSide();
}

document.querySelector('button').addEventListener('click', generate);

document.querySelectorAll('input[type=radio], input[type=range]').forEach(e => {
  e.addEventListener('change', interpolate);
});

document.addEventListener('keydown', (e) => {
  if (e.key == ' ') { generate(); e.preventDefault(); }
});

generate();
