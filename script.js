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
    const cashfreeURL = 'https://payments.cashfree.com/forms/donateme'; // Replace with your actual Cashfree payment link

    // Create a form dynamically and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = cashfreeURL;

    const orderAmount = document.createElement('input');
    orderAmount.type = 'hidden';
    orderAmount.name = 'orderAmount';
    orderAmount.value = amount;
    form.appendChild(orderAmount);

    const orderCurrency = document.createElement('input');
    orderCurrency.type = 'hidden';
    orderCurrency.name = 'orderCurrency';
    orderCurrency.value = 'INR';
    form.appendChild(orderCurrency);

    // Add other required fields like orderId, customerId, etc.
    // Replace these values with your actual values or generate dynamically
    const orderId = document.createElement('input');
    orderId.type = 'hidden';
    orderId.name = 'orderId';
    orderId.value = 'ORDER12345';
    form.appendChild(orderId);

    const customerId = document.createElement('input');
    customerId.type = 'hidden';
    customerId.name = 'customerId';
    customerId.value = 'CUSTOMER123';
    form.appendChild(customerId);

    document.body.appendChild(form);
    form.submit();
}
