import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/Api';

const PaymentGatewayTest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const testPaymentGateway = async () => {
    try {
      setIsLoading(true);
      
      // Create a test order first
      const orderResponse = await api.post("/auth/user/order", {
        productId: "test_product",
        quantity: 1,
        price: 1
      });

      if (orderResponse?.status === 201 && orderResponse.data?.order) {
        const orderDetails = orderResponse.data.order;
        
        // Now initiate payment
        const paymentResponse = await api.post("/auth/user/initiate-payment", {
          orderId: orderDetails.orderId
        });

        if (paymentResponse?.status === 200 && paymentResponse.data?.redirectUrl) {
          console.log("Payment gateway URL:", paymentResponse.data.redirectUrl);
          
          // Redirect to payment gateway
          window.location.href = paymentResponse.data.redirectUrl;
        } else {
          throw new Error("Failed to get payment gateway URL");
        }
      } else {
        throw new Error("Failed to create test order");
      }

    } catch (error) {
      console.error("Payment gateway test error:", error);
      toast.error("Payment gateway test failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectNDPS = () => {
    // Test direct NDPS URL - Updated to use correct NDPS URL
    const testUrl = "https://uat.ndps.in/payment/initiate?merchId=317157&merchTxnId=TEST_TXN_123&amount=1&product=BreBoot&custEmail=test@example.com&payMode=uat";
    window.open(testUrl, '_blank');
  };

  const testAtomtechURL = () => {
    // Test the URL that was failing
    const testUrl = "https://uat.atomtech.in/paynetz/epi/fts?token=15000000782410&txnId=Invoicemdq57cqz&merchId=317157&login=317157&pass=Test@123&prodid=NSE&txncurr=INR&ru=http://10.43.206.244:4040/auth/user/payment-gateway";
    window.open(testUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🧪 Payment Gateway Test
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={testPaymentGateway}
            disabled={isLoading}
            className="w-full bg-[#F7941C] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#e6851a] disabled:opacity-50"
          >
            {isLoading ? "Testing..." : "Test Payment Gateway"}
          </button>
          
          <button
            onClick={testDirectNDPS}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700"
          >
            Test Direct NDPS URL
          </button>
          
          <button
            onClick={testAtomtechURL}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700"
          >
            Test Atomtech URL (Failing)
          </button>
          
          <button
            onClick={testAtomtechPaynetz}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
          >
            Test Atomtech Paynetz URL
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400"
          >
            Back to Home
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Test Instructions:</h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Click "Test Payment Gateway" to test your backend integration</li>
            <li>2. Click "Test Direct NDPS URL" to test NDPS directly</li>
            <li>3. Check if payment options (netbanking/UPI) appear</li>
            <li>4. Verify the payment flow works end-to-end</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayTest; 