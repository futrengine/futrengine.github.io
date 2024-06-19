document.getElementById('donateButton').addEventListener('click', function() {
    let amount = prompt('What is your donation amount?');
    if (amount && !isNaN(amount)) {
        redirectToPaytm(amount);
    } else {
        alert('Please enter a valid amount.');
    }
});

function redirectToPaytm(amount) {
    // Paytm payment gateway URL (replace with actual payment gateway URL)
    const paytmURL = 'https://paytm.com/your-payment-link'; // Replace with your actual Paytm payment link

    // Redirect to the Paytm payment gateway with the specified amount
    window.location.href = `${paytmURL}?amount=${amount}`;
}
