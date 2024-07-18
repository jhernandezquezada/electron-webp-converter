const { ipcRenderer } = require('electron');

const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');
const imagePreview = document.getElementById('imagePreview');

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

convertBtn.addEventListener('click', () => {
    if (fileInput.files.length > 0) {
        const filePath = fileInput.files[0].path;
        ipcRenderer.send('convert-to-webp', filePath);
        result.textContent = 'Convirtiendo...';
    }
});

ipcRenderer.on('conversion-complete', (event, outputPath) => {
    result.textContent = `Conversion completa. La imagen se guardo en: ${outputPath}`;
});

ipcRenderer.on('conversion-error', (event, errorMessage) => {
    result.textContent = `Error: ${errorMessage}`;
});