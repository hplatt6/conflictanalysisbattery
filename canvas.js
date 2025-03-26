var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var isDrawing = false;
var brushColor = 'black';
var brushSize = 5;
var historyStep = 1;
var canvasHistory = [canvas.toDataURL(), canvas.toDataURL()];

// Set initial canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Function to save canvas state to history
function saveHistory() {
  canvasHistory = [canvasHistory[1], canvas.toDataURL()];
  historyStep = 1;
}

// Undo function
function undo() {
  if (historyStep > 0 && canvasHistory[0]) {
    historyStep = 0;
    var canvasPic = new Image();
    canvasPic.src = canvasHistory[historyStep];
    canvasPic.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvasPic, 0, 0);
      canvas.style.display = 'none';
      canvas.offsetHeight;
      canvas.style.display = 'block';
      setTimeout(function() {
        window.scrollTo(0, window.pageYOffset);
      }, 0);
    };
  }
}

// Redo function
function redo() {
  if (historyStep < 1 && canvasHistory[1]) {
    historyStep = 1;
    var canvasPic = new Image();
    canvasPic.src = canvasHistory[historyStep];
    canvasPic.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvasPic, 0, 0);
      canvas.style.display = 'none';
      canvas.offsetHeight;
      canvas.style.display = 'block';
      setTimeout(function() {
        window.scrollTo(0, window.pageYOffset);
      }, 0);
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

// Color button handling
document.getElementById('colorButtons').addEventListener('click', function(e) {
  if (e.target.tagName === 'BUTTON') {
    brushColor = e.target.dataset.color;
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;
    document.querySelectorAll('#colorButtons button').forEach(button => button.style.border = '1px solid #ccc');
    e.target.style.border = '3px solid gray';
  }
});

// Brush size slider handling
document.getElementById('brushSizeSlider').addEventListener('input', function() {
  brushSize = this.value;
  ctx.lineWidth = brushSize;
});

// Undo/Redo button handling
document.getElementById('undoButton').addEventListener('click', function(e) {
  e.preventDefault();
  undo();
  document.activeElement.blur();
});

document.getElementById('redoButton').addEventListener('click', function(e) {
  e.preventDefault();
  redo();
  document.activeElement.blur();
});