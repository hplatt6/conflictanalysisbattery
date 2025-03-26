var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var isDrawing = false;
var brushColor = 'black';
var brushSize = 5;
var historyStep = 0; // Changed initial value to 0
var canvasHistory = [];

// Set initial canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Function to save canvas state to history
function saveHistory() {
  canvasHistory.push(canvas.toDataURL());
  historyStep++;
  if (canvasHistory.length > 10) {
    canvasHistory.shift();
    historyStep--;
  }
}

// Undo function
function undo() {
  if (historyStep > 0) {
    historyStep--;
    var canvasPic = new Image();
    canvasPic.src = canvasHistory[historyStep];
    canvasPic.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvasPic, 0, 0);
      canvas.style.display = 'none';
      canvas.offsetHeight;
      canvas.style.display = 'block';
    };
  }
}

// Redo function
function redo() {
  if (historyStep < canvasHistory.length - 1) {
    historyStep++;
    var canvasPic = new Image();
    canvasPic.src = canvasHistory[historyStep];
    canvasPic.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvasPic, 0, 0);
      canvas.style.display = 'none';
      canvas.offsetHeight;
      canvas.style.display = 'block';
    };
  }
}

// Mouse event listeners
canvas.addEventListener('mousedown', function(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', function(e) {
  if (isDrawing) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', function(e) {
  isDrawing = false;
  saveHistory();
});

// Touch event listeners
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  isDrawing = true;
  ctx.beginPath();
  var rect = canvas.getBoundingClientRect();
  var x = e.touches[0].clientX - rect.left;
  var y = e.touches[0].clientY - rect.top;
  ctx.moveTo(x, y);
}, { passive: false });

canvas.addEventListener('touchmove', function(e) {
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
  e.preventDefault();
  isDrawing = false;
  saveHistory();
}, { passive: false });

canvas.addEventListener('touchcancel', function(e) {
  e.preventDefault();
  isDrawing = false;
}, { passive: false });

// Undo/Redo button handling
document.getElementById('undoButton').addEventListener('click', function(e) {
  e.preventDefault();
  undo();
});

document.getElementById('redoButton').addEventListener('click', function(e) {
  e.preventDefault();
  redo();
});