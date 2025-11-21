// Canvas and context setup
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const canvasPlaceholder = document.getElementById('canvasPlaceholder');
const sampleImages = document.querySelectorAll('.sample-image');

// State
let currentImage = null;
let isDragging = false;
let dragTarget = null;
let dragOffset = { x: 0, y: 0 };

// Text state
const textState = {
    top: {
        text: '',
        fontSize: 48,
        x: 400,
        y: 50,
        textColor: '#ffffff',
        borderColor: '#000000'
    },
    bottom: {
        text: '',
        fontSize: 48,
        x: 400,
        y: 550,
        textColor: '#ffffff',
        borderColor: '#000000'
    }
};

// Function to load image from source
function loadImage(src) {
    const img = new Image();
    img.onload = () => {
        currentImage = img;
        // Scale canvas to fit image while maintaining aspect ratio
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Update text positions to match new canvas size
        textState.top.x = width / 2;
        textState.top.y = 50;
        textState.bottom.x = width / 2;
        textState.bottom.y = height - 50;
        
        // Update range inputs max values
        updateRangeInputs(width, height);
        
        canvasPlaceholder.classList.add('hidden');
        drawMeme();
    };
    img.src = src;
}

// Load image from file upload
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            loadImage(event.target.result);
            // Remove active state from sample images
            sampleImages.forEach(img => img.classList.remove('active'));
        };
        reader.readAsDataURL(file);
    }
});

// Load sample images
sampleImages.forEach(sampleImg => {
    sampleImg.addEventListener('click', () => {
        const src = sampleImg.getAttribute('data-src');
        loadImage(src);
        
        // Update active state
        sampleImages.forEach(img => img.classList.remove('active'));
        sampleImg.classList.add('active');
    });
});

// Update range input max values
function updateRangeInputs(maxX, maxY) {
    document.getElementById('topX').max = maxX;
    document.getElementById('topY').max = maxY;
    document.getElementById('bottomX').max = maxX;
    document.getElementById('bottomY').max = maxY;
    
    // Update current values
    document.getElementById('topX').value = textState.top.x;
    document.getElementById('topY').value = textState.top.y;
    document.getElementById('bottomX').value = textState.bottom.x;
    document.getElementById('bottomY').value = textState.bottom.y;
    
    updateDisplayValues();
}

// Text input handlers
document.getElementById('topText').addEventListener('input', (e) => {
    textState.top.text = e.target.value;
    drawMeme();
});

document.getElementById('bottomText').addEventListener('input', (e) => {
    textState.bottom.text = e.target.value;
    drawMeme();
});

// Font size handlers
document.getElementById('topFontSize').addEventListener('input', (e) => {
    textState.top.fontSize = parseInt(e.target.value);
    document.getElementById('topFontSizeValue').textContent = e.target.value;
    drawMeme();
});

document.getElementById('bottomFontSize').addEventListener('input', (e) => {
    textState.bottom.fontSize = parseInt(e.target.value);
    document.getElementById('bottomFontSizeValue').textContent = e.target.value;
    drawMeme();
});

// Color handlers
document.getElementById('topTextColor').addEventListener('input', (e) => {
    textState.top.textColor = e.target.value;
    drawMeme();
});

document.getElementById('topBorderColor').addEventListener('input', (e) => {
    textState.top.borderColor = e.target.value;
    drawMeme();
});

document.getElementById('bottomTextColor').addEventListener('input', (e) => {
    textState.bottom.textColor = e.target.value;
    drawMeme();
});

document.getElementById('bottomBorderColor').addEventListener('input', (e) => {
    textState.bottom.borderColor = e.target.value;
    drawMeme();
});

// Position handlers
document.getElementById('topX').addEventListener('input', (e) => {
    textState.top.x = parseInt(e.target.value);
    document.getElementById('topXValue').textContent = e.target.value;
    drawMeme();
});

document.getElementById('topY').addEventListener('input', (e) => {
    textState.top.y = parseInt(e.target.value);
    document.getElementById('topYValue').textContent = e.target.value;
    drawMeme();
});

document.getElementById('bottomX').addEventListener('input', (e) => {
    textState.bottom.x = parseInt(e.target.value);
    document.getElementById('bottomXValue').textContent = e.target.value;
    drawMeme();
});

document.getElementById('bottomY').addEventListener('input', (e) => {
    textState.bottom.y = parseInt(e.target.value);
    document.getElementById('bottomYValue').textContent = e.target.value;
    drawMeme();
});

// Update display values
function updateDisplayValues() {
    document.getElementById('topFontSizeValue').textContent = textState.top.fontSize;
    document.getElementById('topXValue').textContent = Math.round(textState.top.x);
    document.getElementById('topYValue').textContent = Math.round(textState.top.y);
    document.getElementById('bottomFontSizeValue').textContent = textState.bottom.fontSize;
    document.getElementById('bottomXValue').textContent = Math.round(textState.bottom.x);
    document.getElementById('bottomYValue').textContent = Math.round(textState.bottom.y);
}

// Draw meme function
function drawMeme() {
    if (!currentImage) return;
    
    // Save canvas context state
    ctx.save();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    
    // Draw top text
    if (textState.top.text && textState.top.text.trim() !== '') {
        drawText(
            textState.top.text, 
            textState.top.x, 
            textState.top.y, 
            textState.top.fontSize,
            textState.top.textColor,
            textState.top.borderColor
        );
    }
    
    // Draw bottom text
    if (textState.bottom.text && textState.bottom.text.trim() !== '') {
        drawText(
            textState.bottom.text, 
            textState.bottom.x, 
            textState.bottom.y, 
            textState.bottom.fontSize,
            textState.bottom.textColor,
            textState.bottom.borderColor
        );
    }
    
    // Restore canvas context state
    ctx.restore();
}

// Draw text with customizable fill and stroke colors
function drawText(text, x, y, fontSize, textColor, borderColor) {
    // Save context state before modifying
    ctx.save();
    
    // Set text properties
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Ensure colors are valid strings
    const fillColor = textColor || '#ffffff';
    const strokeColor = borderColor || '#000000';
    
    // Draw stroke (border) first
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);
    
    // Draw fill on top
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
    
    // Restore context state
    ctx.restore();
}

// Check if point is near text
function getTextAtPoint(x, y) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;
    
    // Check top text
    if (textState.top.text) {
        ctx.font = `bold ${textState.top.fontSize}px Impact, Arial Black, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const metrics = ctx.measureText(textState.top.text);
        const textWidth = metrics.width;
        const textHeight = textState.top.fontSize;
        
        if (canvasX >= textState.top.x - textWidth / 2 - 10 &&
            canvasX <= textState.top.x + textWidth / 2 + 10 &&
            canvasY >= textState.top.y - textHeight / 2 - 10 &&
            canvasY <= textState.top.y + textHeight / 2 + 10) {
            return 'top';
        }
    }
    
    // Check bottom text
    if (textState.bottom.text) {
        ctx.font = `bold ${textState.bottom.fontSize}px Impact, Arial Black, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const metrics = ctx.measureText(textState.bottom.text);
        const textWidth = metrics.width;
        const textHeight = textState.bottom.fontSize;
        
        if (canvasX >= textState.bottom.x - textWidth / 2 - 10 &&
            canvasX <= textState.bottom.x + textWidth / 2 + 10 &&
            canvasY >= textState.bottom.y - textHeight / 2 - 10 &&
            canvasY <= textState.bottom.y + textHeight / 2 + 10) {
            return 'bottom';
        }
    }
    
    return null;
}

// Mouse event handlers for dragging
canvas.addEventListener('mousedown', (e) => {
    if (!currentImage) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    
    const target = getTextAtPoint(e.clientX, e.clientY);
    if (target) {
        isDragging = true;
        dragTarget = target;
        const state = textState[target];
        dragOffset.x = canvasX - state.x;
        dragOffset.y = canvasY - state.y;
        canvas.style.cursor = 'grabbing';
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!currentImage) return;
    
    if (isDragging && dragTarget) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;
        
        const state = textState[dragTarget];
        state.x = canvasX - dragOffset.x;
        state.y = canvasY - dragOffset.y;
        
        // Clamp to canvas bounds
        state.x = Math.max(0, Math.min(canvas.width, state.x));
        state.y = Math.max(0, Math.min(canvas.height, state.y));
        
        // Update range inputs
        document.getElementById(`${dragTarget}X`).value = Math.round(state.x);
        document.getElementById(`${dragTarget}Y`).value = Math.round(state.y);
        updateDisplayValues();
        
        drawMeme();
    } else {
        const target = getTextAtPoint(e.clientX, e.clientY);
        canvas.style.cursor = target ? 'grab' : 'crosshair';
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        dragTarget = null;
        canvas.style.cursor = 'crosshair';
    }
});

canvas.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        dragTarget = null;
        canvas.style.cursor = 'crosshair';
    }
});

// Touch event handlers for mobile
canvas.addEventListener('touchstart', (e) => {
    if (!currentImage) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (touch.clientX - rect.left) * scaleX;
    const canvasY = (touch.clientY - rect.top) * scaleY;
    
    const target = getTextAtPoint(touch.clientX, touch.clientY);
    if (target) {
        isDragging = true;
        dragTarget = target;
        const state = textState[target];
        dragOffset.x = canvasX - state.x;
        dragOffset.y = canvasY - state.y;
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (!currentImage) return;
    e.preventDefault();
    
    if (isDragging && dragTarget) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (touch.clientX - rect.left) * scaleX;
        const canvasY = (touch.clientY - rect.top) * scaleY;
        
        const state = textState[dragTarget];
        state.x = canvasX - dragOffset.x;
        state.y = canvasY - dragOffset.y;
        
        // Clamp to canvas bounds
        state.x = Math.max(0, Math.min(canvas.width, state.x));
        state.y = Math.max(0, Math.min(canvas.height, state.y));
        
        // Update range inputs
        document.getElementById(`${dragTarget}X`).value = Math.round(state.x);
        document.getElementById(`${dragTarget}Y`).value = Math.round(state.y);
        updateDisplayValues();
        
        drawMeme();
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (isDragging) {
        isDragging = false;
        dragTarget = null;
    }
});

// Download functionality
document.getElementById('downloadBtn').addEventListener('click', () => {
    if (!currentImage) {
        alert('Please select an image first!');
        return;
    }
    
    // Create download link
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = dataURL;
    link.click();
});

// Initialize colors - sync HTML inputs with state
function initializeColors() {
    // Sync state from HTML inputs (in case HTML has different defaults)
    const topTextColorInput = document.getElementById('topTextColor');
    const topBorderColorInput = document.getElementById('topBorderColor');
    const bottomTextColorInput = document.getElementById('bottomTextColor');
    const bottomBorderColorInput = document.getElementById('bottomBorderColor');
    
    if (topTextColorInput) {
        textState.top.textColor = topTextColorInput.value;
    }
    if (topBorderColorInput) {
        textState.top.borderColor = topBorderColorInput.value;
    }
    if (bottomTextColorInput) {
        textState.bottom.textColor = bottomTextColorInput.value;
    }
    if (bottomBorderColorInput) {
        textState.bottom.borderColor = bottomBorderColorInput.value;
    }
}

// Initialize display values
updateDisplayValues();
initializeColors();
