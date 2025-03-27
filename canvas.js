var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var isDrawing = false;
var brushColor = 'black';
var brushSize = 5;
var imageData; // Variable to store canvas data

// Function to set canvas size
function setCanvasSize() {
  imageData = canvas.toDataURL(); // Store current canvas data
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  var img = new Image();
  img.onload = function() {
    ctx.drawImage(img, 0, 0); // Redraw stored image
  };
  img.src = imageData;
}

// Set initial canvas size
setCanvasSize();

// Add resize event listener
window.addEventListener('resize', setCanvasSize);

// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveCanvasData(); // Save cleared state
}

// Function to save canvas data to Qualtrics
function saveCanvasData() {
  Qualtrics.SurveyEngine.setEmbeddedData('canvasData', canvas.toDataURL());
}

// Function to load canvas data from Qualtrics
function loadCanvasData() {
  var savedData = Qualtrics.SurveyEngine.getEmbeddedData('canvasData');
  if (savedData) {
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    };
    img.src = savedData;
  }
}

// Load saved canvas data on page load
window.onload = function() {
  loadCanvasData();
};

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
  saveCanvasData(); // Save on mouse up
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
  saveCanvasData(); // Save on touch end
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

// Clear button handling
document.getElementById('clearButton').addEventListener('click', function(e) {
  e.preventDefault();
  clearCanvas();
  document.activeElement.blur();
});