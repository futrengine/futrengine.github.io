document.getElementById('donateButton').addEventListener('click', function() {
    let amount = prompt('What is your donation amount?');
    if (amount && !isNaN(amount)) {
        redirectToCashfree(amount);
    } else {
        alert('Please enter a valid amount.');
    }
});

function redirectToCashfree(amount) {
    // Cashfree payment gateway URL (replace with actual payment gateway URL)
    const cashfreeURL = 'https://your-cashfree-payment-link.com'; // Replace with your actual Cashfree payment link

    // Redirect to the Cashfree payment gateway with the specified amount
    window.location.href = `${cashfreeURL}?amount=${amount}`;
}
