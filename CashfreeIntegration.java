import com.cashfree.*;
import com.cashfree.models.*;

public class CashfreeIntegration {
    public static void main(String[] args) {
        Cashfree.XClientId = "TEST1021531814f967785c578f2107e081351201";
        Cashfree.XClientSecret = "cfsk_ma_test_5ea0697a93ed1bb0a15435d85268f769_82945472";
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
