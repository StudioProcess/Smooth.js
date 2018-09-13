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

const main = canvas('#main', canvasSize, canvasSize);

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
    
  for (let p=-1; p<cp.length; p++) {
    for (let i=0; i<=res; i++) {
      let u = p + i/res;
      ip.push( s(u) );
    }
  }
  // console.log(ip);
}

function generate() {
  runGeneration();
  interpolate();
}

function interpolate() {
  runInterpolation();
  main.clear();
  main.lines (ip, '#000', 1 );
  main.points(cp, '#000', 6);
  main.points(ip, '#f00', 3);
}

document.querySelector('button').addEventListener('click', generate);

// console.log(document.querySelector('input[type=radio]'));
document.querySelectorAll('input[type=radio], input[type=range]').forEach(e => {
  e.addEventListener('change', interpolate);
});

generate();
