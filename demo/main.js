import canvas from './draw.js';

const canvasSize = 1000;
const domainMargin = 1;

function radioValue(name) {
  return document.querySelector(`input[type=radio][name=${name}]:checked`).value;
}
function intValue(name) {
  return parseInt(document.querySelector(`input[name=${name}]`).value);
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
  cp0 = range(10).map(i => {
    let p = [
      canvasSize*margin + Math.random()*canvasSize*(1-2*margin),
      canvasSize*margin + Math.random()*canvasSize*(1-2*margin)
    ];
    p.param = i; // save parameter
    return p;
  });
  // console.log(cp0);
}

// calculate intermediate points
function runInterpolation() {
  let num = intValue('points'); // number of control points
  let int = intValue('intermediates'); // number of intermediates (between two adjacent control points)
  let method = radioValue('method');
  let clip = radioValue('clip');
  let cubicTension = radioValue('cubicTension');
  let sincFilterSize = 2;
  let sincWindow = x => Math.exp(-x * x);
  
  cp = cp0.slice(0, num);
  ip = [];
  let s = Smooth(cp, { method, clip, cubicTension, sincFilterSize, sincWindow });
  
  num += 2*domainMargin;
  let pieces = num-1; // number of curve pieces
  let total = num + pieces*int; // total number of points/values
  let step = pieces/(total-1);
  
  // console.log({
  //   points: num,
  //   intermediates: int,
  //   total
  // });
  
  for (let i=0; i<total; i++) {
    let u = i*step - domainMargin; // parameter value
    let v = s(u); // interpolated value
    v.param = u; // save parameter
    ip.push(v);
  }
  console.log(ip);
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
  let dlen = cp.length - 1 + 2*domainMargin; // length of parameter domain
  let p2x = p => canvasSize/dlen * (p+domainMargin); // parameter to x value

  let sidecp = cp.map(p => [ p2x(p.param), p[1] ]);
  let sideip = ip.map(p => [ p2x(p.param), p[1] ]);
  drawCurve(side, sidecp, sideip);
  side.lines([ [p2x(0),0], [p2x(0),canvasSize] ], 'lightgray', 1);
  side.lines([ [p2x(cp.length-1),0], [p2x(cp.length-1),canvasSize] ], 'lightgray', 1);
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
