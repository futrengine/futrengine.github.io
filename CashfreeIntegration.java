import com.cashfree.*;
import com.cashfree.models.*;

public class CashfreeIntegration {
    public static void main(String[] args) {
        Cashfree.XClientId = "YOUR_CLIENT_KEY";
        Cashfree.XClientSecret = "YOUR_CLIENT_SECRET_KEY";
        Cashfree.XEnvironment = Cashfree.SANDBOX;

        createOrder(1.0, "123", "9999999999", "test@example.com");
    }

    static String createOrder(double amount, String customerId, String customerPhone, String customerEmail) {
        CustomerDetails customerDetails = new CustomerDetails();
        customerDetails.setCustomerId(customerId);
        customerDetails.setCustomerPhone(customerPhone);
        customerDetails.setCustomerEmail(customerEmail);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setOrderAmount(amount);
        request.setOrderCurrency("INR");
        request.setCustomerDetails(customerDetails);

        try {
            Cashfree cashfree = new Cashfree();
            ApiResponse<OrderEntity> response = cashfree.PGCreateOrder(String.valueOf(System.currentTimeMillis()), request, null, null, null);
            return response.getData().getOrderId();
        } catch (ApiException e) {
            throw new RuntimeException(e);
        }
    }
}
