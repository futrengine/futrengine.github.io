// script.js - Jachu Test Internet Speed Test Logic (Updated with Enhanced Error Logging)

// Get DOM elements
const startButton = document.getElementById('startButton');
const pingResult = document.getElementById('pingResult');
const downloadResult = document.getElementById('downloadResult');
const uploadResult = document.getElementById('uploadResult');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const detailedResults = document.getElementById('detailedResults');
const downloadMBps = document.getElementById('downloadMBps');
const downloadKbps = document.getElementById('downloadKbps');
const uploadMBps = document.getElementById('uploadMBps');
const uploadKbps = document.getElementById('uploadKbps');

// Test file URLs and sizes (approximate for simulation)
// For a real test, these would be dedicated files on your server.
const PING_TEST_URL = 'https://www.google.com/images/phd/retina_logo_2x.png?nocache=' + Date.now(); // Small image for ping
const DOWNLOAD_TEST_URL = 'https://placehold.co/5000x5000/000000/FFFFFF/png?text=DownloadTest'; // Large dummy image for download (approx 25MB)
const DOWNLOAD_FILE_SIZE_BYTES = 25 * 1024 * 1024; // Approximate size of the dummy download file in bytes (25 MB)
const UPLOAD_TEST_URL = 'https://httpbin.org/post'; // Public echo service for upload test
const UPLOAD_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Size of the dummy upload file in bytes (5 MB)

// Function to reset results display
function resetResults() {
    pingResult.textContent = '-- ms';
    downloadResult.textContent = '-- Mbps';
    uploadResult.textContent = '-- Mbps';
    downloadMBps.textContent = '-- MBps';
    downloadKbps.textContent = '-- Kbps';
    uploadMBps.textContent = '-- MBps';
    uploadKbps.textContent = '-- Kbps';
    errorMessage.classList.add('hidden');
    detailedResults.classList.add('hidden');
}

// Function to show loading state
function showLoading() {
    startButton.disabled = true;
    startButton.textContent = 'Testing...';
    loadingIndicator.classList.remove('hidden');
    resetResults();
}

// Function to hide loading state
function hideLoading() {
    startButton.disabled = false;
    startButton.textContent = 'Start Test';
    loadingIndicator.classList.add('hidden');
}

// Function to display error
function showError(message = 'An error occurred during the test. Please try again.') {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    hideLoading();
}

// Function to calculate and display ping
async function testPing() {
    try {
        console.log('Starting ping test...');
        const startTime = performance.now();
        await fetch(PING_TEST_URL, { cache: 'no-store' }); // Prevent caching
        const endTime = performance.now();
        const ping = (endTime - startTime).toFixed(2); // Round to 2 decimal places
        pingResult.textContent = `${ping} ms`;
        console.log(`Ping test completed: ${ping} ms`);
        return parseFloat(ping);
    } catch (error) {
        console.error('Ping test failed:', error);
        pingResult.textContent = 'Error';
        throw new Error('Ping test failed: ' + error.message);
    }
}

// Function to calculate and display download speed
async function testDownload() {
    try {
        console.log('Starting download test...');
        const startTime = performance.now();
        const response = await fetch(DOWNLOAD_TEST_URL, { cache: 'no-store' });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        // Read the response body to ensure the entire file is downloaded
        const reader = response.body.getReader();
        let receivedLength = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            receivedLength += value.length;
        }

        const endTime = performance.now();
        const durationSeconds = (endTime - startTime) / 1000; // Convert ms to seconds

        // Use the actual received length if available, otherwise use the approximate size
        const bytesDownloaded = receivedLength > 0 ? receivedLength : DOWNLOAD_FILE_SIZE_BYTES;

        const bytesPerSecond = bytesDownloaded / durationSeconds;

        // Convert to Mbps, MBps, Kbps
        const mbps = (bytesPerSecond * 8) / (1024 * 1024);
        const mbpsFormatted = mbps.toFixed(2);

        const mbpsBytes = bytesPerSecond / (1024 * 1024);
        const mbpsBytesFormatted = mbpsBytes.toFixed(2);

        const kbps = (bytesPerSecond * 8) / 1024;
        const kbpsFormatted = kbps.toFixed(2);

        downloadResult.textContent = `${mbpsFormatted} Mbps`;
        downloadMBps.textContent = `${mbpsBytesFormatted} MBps`;
        downloadKbps.textContent = `${kbpsFormatted} Kbps`;
        console.log(`Download test completed: ${mbpsFormatted} Mbps`);

        return { mbps: mbps, mbpsBytes: mbpsBytes, kbps: kbps };
    } catch (error) {
        console.error('Download test failed:', error);
        downloadResult.textContent = 'Error';
        downloadMBps.textContent = 'Error';
        downloadKbps.textContent = 'Error';
        throw new Error('Download test failed: ' + error.message);
    }
}

// Function to calculate and display upload speed
async function testUpload() {
    try {
        console.log('Starting upload test...');
        // Create a dummy blob of data for upload
        const data = new Uint8Array(UPLOAD_FILE_SIZE_BYTES).map(() => Math.floor(Math.random() * 256));
        const blob = new Blob([data], { type: 'application/octet-stream' });

        const startTime = performance.now();
        const response = await fetch(UPLOAD_TEST_URL, {
            method: 'POST',
            body: blob,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Cache-Control': 'no-cache' // Prevent caching
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const endTime = performance.now();
        const durationSeconds = (endTime - startTime) / 1000; // Convert ms to seconds

        const bytesUploaded = UPLOAD_FILE_SIZE_BYTES;
        const bytesPerSecond = bytesUploaded / durationSeconds;

        // Convert to Mbps, MBps, Kbps
        const mbps = (bytesPerSecond * 8) / (1024 * 1024);
        const mbpsFormatted = mbps.toFixed(2);

        const mbpsBytes = bytesPerSecond / (1024 * 1024);
        const mbpsBytesFormatted = mbpsBytes.toFixed(2);

        const kbps = (bytesPerSecond * 8) / 1024;
        const kbpsFormatted = kbps.toFixed(2);

        uploadResult.textContent = `${mbpsFormatted} Mbps`;
        uploadMBps.textContent = `${mbpsBytesFormatted} MBps`;
        uploadKbps.textContent = `${kbpsFormatted} Kbps`;
        console.log(`Upload test completed: ${mbpsFormatted} Mbps`);

        return { mbps: mbps, mbpsBytes: mbpsBytes, kbps: kbps };
    } catch (error) {
        console.error('Upload test failed:', error);
        uploadResult.textContent = 'Error';
        uploadMBps.textContent = 'Error';
        uploadKbps.textContent = 'Error';
        throw new Error('Upload test failed: ' + error.message);
    }
}

// Main function to run all tests
async function runSpeedTest() {
    showLoading();
    try {
        await testPing();
        await testDownload();
        await testUpload();
        detailedResults.classList.remove('hidden'); // Show detailed results after all tests
    } catch (error) {
        // Display the specific error message from the thrown error
        showError(error.message);
        console.error('Overall speed test failed:', error);
    } finally {
        hideLoading();
    }
}

// Event listener for the start button
startButton.addEventListener('click', runSpeedTest);

// Initialize results on page load
document.addEventListener('DOMContentLoaded', resetResults);
