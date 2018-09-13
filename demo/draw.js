class SimpleCanvas {
  constructor(selector, width, height) {
    this.width = width;
    this.height = height;
    this.canvas = document.querySelector(selector);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = width/2 + 'px';
    this.canvas.style.height = height/2 + 'px';
  }
  
  points(points, color='#000', radius=1) {
    if (!points || !points.length) { return; }
    this.ctx.fillStyle = color;
    points.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc( p[0], p[1], radius, 0, 2*Math.PI );
      // this.ctx.stroke();
      this.ctx.fill();
    });
  }
  
  lines(points, color='#000', weight=1) {
    if (!points || !points.length) { return; }
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = weight;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0], points[0][1]);
    points.forEach(points => {
      this.ctx.lineTo(points[0], points[1]);
    });
    this.ctx.stroke();
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default function init(selector='canvas', width=1000, height=1000) {
  return new SimpleCanvas(selector, width, height);
}
