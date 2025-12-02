import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/Api';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get('token');
        const txnId = searchParams.get('txnId');
        const merchId = searchParams.get('merchId');
        
        console.log("Payment callback received:", { token, txnId, merchId });
        
        if (!token || !txnId || !merchId) {
          toast.error("Invalid payment callback parameters");
          navigate("/");
          return;
        }

        // Send payment response to backend
        const backendResponse = await api.post("/auth/user/handle-payment-response", {
          encData: JSON.stringify({
            token: token,
            txnId: txnId,
            merchId: merchId,
            status: "success"
          }),
          orderId: "TEST_ORDER", // This should come from the payment flow
          name: "Test Product",
          image: "test.jpg",
          address: JSON.stringify({
            address: "Payment Gateway",
            city: "Online",
            state: "Digital",
            pincode: "000000"
          })
        });

        if (backendResponse.status === 200) {
          toast.success("Payment processed successfully!");
          
          // Navigate to success page
          navigate("/success", {
            state: {
              orderId: "TEST_ORDER",
              transactionId: txnId,
              amount: 100 // This should come from the actual order
            }
          });
        } else {
          throw new Error("Backend payment processing failed");
        }

      } catch (error) {
        console.error("Payment callback processing error:", error);
        toast.error("Payment verification failed. Please contact support.");
        navigate("/");
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7941C] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentCallback; 