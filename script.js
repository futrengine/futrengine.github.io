document.getElementById('donateButton').addEventListener('click', function() {
    let amount = prompt('What is your donation amount?');
    if (amount && !isNaN(amount)) {
        createOrder(amount);
    } else {
        alert('Please enter a valid amount.');
    }
});

function createOrder(amount) {
    fetch('/createOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amount,
            customerId: '123',
            customerPhone: '9999999999',
            customerEmail: 'test@example.com'
        })
    })
    .then(response => response.text())
    .then(orderId => {
        // Redirect to Cashfree payment page
        const cashfreeURL = `https://test.cashfree.com/billpay/checkout/post/submit?orderId=${orderId}`;
        window.location.href = cashfreeURL;
    })
    .catch(error => console.error('Error creating order:', error));
}
