// Initialize verification handler
const verificationHandler = {
    currentStep: 0,
    steps: ['documentStep', 'biometricStep', 'livenessStep', 'reviewStep'],
    
    showLoading(message = 'Processing...') {
        console.log('Showing loading:', message);
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay visible';
        loadingEl.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p class="loading-text">${message}</p>
            </div>
        `;
        document.body.appendChild(loadingEl);
    },

    hideLoading() {
        console.log('Hiding loading');
        const loadingEl = document.querySelector('.loading-overlay');
        if (loadingEl) {
            loadingEl.remove();
        }
    },

    showError(message) {
        console.error('Error:', message);
        const toastEl = document.createElement('div');
        toastEl.className = 'toast error';
        toastEl.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 5000);
    },

    showSuccess(message) {
        console.log('Success:', message);
        const toastEl = document.createElement('div');
        toastEl.className = 'toast success';
        toastEl.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 5000);
    },

    updateProgress(step) {
        console.log('Updating progress:', step);
        const progressBar = document.getElementById('progressBar');
        const currentStep = document.getElementById('currentStep');
        const percentage = [0, 33, 66, 100][step];
        
        progressBar.style.width = `${percentage}%`;
        currentStep.textContent = `Step ${step + 1} of 4`;
        
        // Update step indicators
        document.querySelectorAll('.step-indicator .step').forEach((stepEl, index) => {
            if (index === step) {
                stepEl.classList.add('active');
                stepEl.classList.remove('completed');
            } else if (index < step) {
                stepEl.classList.add('completed');
                stepEl.classList.remove('active');
            } else {
                stepEl.classList.remove('active', 'completed');
            }
        });
    }
};

// Document Upload Handlers
function initializeUploadHandlers() {
    console.log('Initializing upload handlers');
    
    // Get elements
    const dropZone = document.getElementById('dropZone');
    const documentUpload = document.getElementById('documentUpload');
    const uploadButton = document.querySelector('.upload-zone button');

    if (!dropZone || !documentUpload) {
        console.error('Required elements not found:', { dropZone, documentUpload });
        return;
    }

    console.log('Setting up event listeners');

    // Make the entire drop zone clickable
    dropZone.addEventListener('click', function(e) {
        console.log('Drop zone clicked');
        e.preventDefault();
        e.stopPropagation();
        // For testing purposes, simulate a file upload
        simulateFileUpload();
    });

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function(e) {
            console.log('Drag event:', eventName);
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            console.log('Adding dragging class');
            dropZone.classList.add('dragging');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            console.log('Removing dragging class');
            dropZone.classList.remove('dragging');
        });
    });

    // Handle dropped files
    dropZone.addEventListener('drop', function(e) {
        console.log('File dropped');
        simulateFileUpload();
    });

    // Handle file input change
    documentUpload.addEventListener('change', function(e) {
        console.log('File input changed');
        simulateFileUpload();
    });

    // Handle upload button click
    if (uploadButton) {
        uploadButton.addEventListener('click', function(e) {
            console.log('Upload button clicked');
            e.preventDefault();
            e.stopPropagation();
            simulateFileUpload();
        });
    }
}

// Function to simulate file upload for testing
async function simulateFileUpload() {
    console.log('Simulating file upload');
    try {
        verificationHandler.showLoading('Uploading document...');

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create a sample image data URL (a blue square)
        const sampleImageData = createSampleImage();

        console.log('Showing document preview');
        const documentPreview = document.getElementById('documentPreview');
        const documentImage = document.getElementById('documentImage');
        
        documentImage.src = sampleImageData;
        documentPreview.classList.remove('hidden');
        verificationHandler.hideLoading();
        verificationHandler.showSuccess('Document uploaded successfully');
        verificationHandler.updateProgress(0);

    } catch (error) {
        console.error('File handling error:', error);
        verificationHandler.hideLoading();
        verificationHandler.showError('Failed to upload document: ' + error.message);
    }
}

// Helper function to create a sample image data URL
function createSampleImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw a blue rectangle with some text
    ctx.fillStyle = '#f0f4ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Sample ID Document', canvas.width/2, canvas.height/2);
    
    return canvas.toDataURL();
}

function removeDocument() {
    console.log('Removing document');
    const documentPreview = document.getElementById('documentPreview');
    const documentUpload = document.getElementById('documentUpload');
    
    documentPreview.classList.add('hidden');
    documentUpload.value = '';
}

function nextStep() {
    console.log('Moving to next step');
    const currentStep = verificationHandler.currentStep;
    if (currentStep < verificationHandler.steps.length - 1) {
        document.getElementById(verificationHandler.steps[currentStep]).classList.remove('active');
        document.getElementById(verificationHandler.steps[currentStep + 1]).classList.add('active');
        verificationHandler.currentStep++;
        verificationHandler.updateProgress(verificationHandler.currentStep);
    }
}

function previousStep() {
    console.log('Moving to previous step');
    const currentStep = verificationHandler.currentStep;
    if (currentStep > 0) {
        document.getElementById(verificationHandler.steps[currentStep]).classList.remove('active');
        document.getElementById(verificationHandler.steps[currentStep - 1]).classList.add('active');
        verificationHandler.currentStep--;
        verificationHandler.updateProgress(verificationHandler.currentStep);
    }
}

async function startBiometricCapture() {
    console.log('Starting biometric capture');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('cameraFeed');
        video.srcObject = stream;
    } catch (error) {
        console.error('Camera access error:', error);
        verificationHandler.showError('Failed to access camera: ' + error.message);
    }
}

function retakeBiometric() {
    console.log('Retaking biometric');
    const video = document.getElementById('cameraFeed');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    startBiometricCapture();
}

async function submitVerification() {
    console.log('Submitting verification');
    try {
        verificationHandler.showLoading('Submitting verification...');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        verificationHandler.hideLoading();
        verificationHandler.showSuccess('Verification submitted successfully!');
        
        // Redirect to success page
        setTimeout(() => {
            window.location.href = '/verification-success.html';
        }, 1500);
    } catch (error) {
        console.error('Submission error:', error);
        verificationHandler.hideLoading();
        verificationHandler.showError('Failed to submit verification: ' + error.message);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    initializeUploadHandlers();
    verificationHandler.updateProgress(0);
});
