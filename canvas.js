console.log("Canvas script loaded.");

var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var isDrawing = false;

// Set initial canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Mouse event listeners
canvas.addEventListener('mousedown', function(e) {
  console.log("mousedown");
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
  e.preventDefault();
});

canvas.addEventListener('mousemove', function(e) {
  console.log("mousemove");
  if (isDrawing) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', function(e) {
  console.log("mouseup");
  isDrawing = false;
});

canvas.addEventListener('mouseout', function(e) {
  console.log("mouseout");
  isDrawing = false;
});

// Touch event listeners
canvas.addEventListener('touchstart', function(e) {
  console.log("touchstart");
  e.preventDefault();
  isDrawing = true;
  ctx.beginPath();
  var rect = canvas.getBoundingClientRect();
  var x = e.touches[0].clientX - rect.left;
  var y = e.touches[0].clientY - rect.top;
  ctx.moveTo(x, y);
  canvas.setPointerCapture(e.pointerId); // Force capture
}, { passive: false });

canvas.addEventListener('touchmove', function(e) {
  console.log("touchmove");
  e.preventDefault();
  if (isDrawing) {
    var rect = canvas.getBoundingClientRect();
    var x = e.touches[0].clientX - rect.left;
    var y = e.touches[0].clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
  console.log("touchend");
  e.preventDefault();
  isDrawing = false;
  canvas.releasePointerCapture(e.pointerId); // Release capture
}, { passive: false });

canvas.addEventListener('touchcancel', function(e) {
  console.log("touchcancel");
  e.preventDefault();
  isDrawing = false;
  canvas.releasePointerCapture(e.pointerId); // Release capture
}, { passive: false });