document.getElementById('donateButton').addEventListener('click', function() {
    redirectToCashfree();
});

function redirectToCashfree() {
    // Cashfree payment gateway URL
    const cashfreeURL = 'https://payments.cashfree.com/forms/donateme'; // Your actual Cashfree payment link

    // Redirect to the Cashfree payment page
    window.location.href = cashfreeURL;
}

// Function to get URL parameters
function getURLParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

// Check if payment was successful
window.onload = function() {
    const paymentStatus = getURLParameter('status'); // Assume 'status' is the parameter that indicates payment success
    if (paymentStatus === 'success') {
        showSuccessPopup();
    }
};

function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'flex';

    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        popup.style.display = 'none';
    });
}
