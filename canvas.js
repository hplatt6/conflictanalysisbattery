console.log("Canvas script loaded.");

if (typeof canvasHistory === 'undefined' || !Array.isArray(canvasHistory)) {
  var canvasHistory = []; // Force canvasHistory to be an array
}

var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var isDrawing = false;
var brushColor = 'black';
var brushSize = 5;
var historyStep = -1;

// Set initial brush
ctx.strokeStyle = brushColor;
ctx.fillStyle = brushColor;
ctx.lineWidth = brushSize;

// Set initial canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Function to save canvas state to history
function saveHistory() {
  console.log("saveHistory called, canvasHistory:", canvasHistory);
  if (!Array.isArray(canvasHistory)) {
    console.error("canvasHistory is not an array, re-initializing");
    canvasHistory = []; // Force re-initialization
  }
  canvasHistory.push(canvas.toDataURL());
  historyStep++;
  if (canvasHistory.length > 10) {
    canvasHistory.shift();
    historyStep--;
  }
  console.log("saveHistory completed, canvasHistory:", canvasHistory);
}

// Function to undo
function undo() {
  console.log("undo called, canvasHistory:", canvasHistory);
  if (!Array.isArray(canvasHistory)) {
    console.error("canvasHistory is not an array, cannot undo");
    return;
  }
  if (historyStep > 0) {
    historyStep--;
    if (canvasHistory[historyStep]) { // Check if image source is valid
      var canvasPic = new Image();
      canvasPic.src = canvasHistory[historyStep];
      canvasPic.onload = function() {
        ctx.drawImage(canvasPic, 0, 0);
        console.log("Image loaded and drawn for undo");
      };
      canvasPic.onerror = function() {
        console.error("Error loading image for undo");
      };
    } else {
      console.error("Invalid canvasHistory or historyStep, cannot undo");
    }
  }
  console.log("undo completed, canvasHistory:", canvasHistory);
}

// Function to redo
function redo() {
  console.log("redo called, canvasHistory:", canvasHistory);
  if (!Array.isArray(canvasHistory)) {
    console.error("canvasHistory is not an array, cannot redo");
    return;
  }
  if (historyStep < canvasHistory.length - 1) {
    historyStep++;
    if (canvasHistory[historyStep]) { // Check if image source is valid
      var canvasPic = new Image();
      canvasPic.src = canvasHistory[historyStep];
      canvasPic.onload = function() {
        ctx.drawImage(canvasPic, 0, 0);
        console.log("Image loaded and drawn for redo");
      };
      canvasPic.onerror = function() {
        console.error("Error loading image for redo");
      };
    } else {
      console.error("Invalid canvasHistory or historyStep, cannot redo");
    }
  }
  console.log("redo completed, canvasHistory:", canvasHistory);
}

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
  saveHistory(); // Save state after drawing
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
  canvas.setPointerCapture(e.pointerId);
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
  canvas.releasePointerCapture(e.pointerId);
  saveHistory(); // Save state after drawing
}, { passive: false });

canvas.addEventListener('touchcancel', function(e) {
  console.log("touchcancel");
  e.preventDefault();
  isDrawing = false;
  canvas.releasePointerCapture(e.pointerId);
}, { passive: false });

// Color button click handling
document.getElementById('colorButtons').addEventListener('click', function(e) {
  if (e.target.tagName === 'BUTTON') {
    brushColor = e.target.dataset.color;
    console.log("Color changed to:", brushColor);
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;
    ctx.stroke(); // Force redraw
    // Highlight the selected color button
    document.querySelectorAll('#colorButtons button').forEach(button => button.style.border = '1px solid #ccc');
    e.target.style.border = '3px solid gray';
  }
});

// Brush size slider handling
document.getElementById('brushSizeSlider').addEventListener('input', function() {
  brushSize = this.value;
  ctx.lineWidth = brushSize;
  ctx.stroke(); // Force redraw
});

// Undo/redo button handling
document.getElementById('undoButton').addEventListener('click', undo);
document.getElementById('redoButton').addEventListener('click', redo);