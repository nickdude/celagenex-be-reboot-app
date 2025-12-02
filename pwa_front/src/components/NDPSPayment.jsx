import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CreditCard, Loader } from 'lucide-react';
import api from '../utils/Api';
import { getNDPSConfig, validateNDPSConfig } from '../config/ndpsConfig';

  const NDPSPayment = ({ orderData, onClose }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);
    const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Get NDPS configuration
  const NDPS_CONFIG = getNDPSConfig();

  useEffect(() => {
    // Initialize NDPS payment when component mounts
    if (orderData && !paymentInitiated) {
      initiateNDPSPayment();
    }
  }, [orderData]);

  // Handle payment callback from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const txnId = urlParams.get('txnId');
    const merchId = urlParams.get('merchId');
    
    if (token && txnId && merchId && !paymentCompleted) {
      console.log("Payment callback received:", { token, txnId, merchId });
      handlePaymentCallback(token, txnId, merchId);
    }
  }, [paymentCompleted]);

  const initiateNDPSPayment = async () => {
    let paymentResponse = null;
    
    try {
      // Validate NDPS configuration
      if (!validateNDPSConfig(NDPS_CONFIG)) {
        throw new Error("Invalid NDPS configuration");
      }

      setIsLoading(true);
      setPaymentInitiated(true);

      // Call your initiate-payment API with the orderId
      paymentResponse = await api.post("/auth/user/initiate-payment", {
        orderId: orderData.orderId
      });

      console.log("Payment response from backend:", paymentResponse.data);

      if (!paymentResponse.data?.redirectUrl) {
        throw new Error("Failed to get payment URL");
      }

             // For now, let's always redirect to the backend payment gateway
       // since NDPS library might not work properly in web environment
       if (!paymentResponse.data.redirectUrl) {
         console.log("Backend returned redirect URL:", paymentResponse.data.redirectUrl);
         console.log("Redirecting to backend payment gateway...");
         
         // Store the redirect URL for manual button
         setRedirectUrl(paymentResponse.data.redirectUrl);
         
         // Show toast and redirect immediately
         toast.success("Redirecting to payment gateway...");
         
         // Force redirect after a short delay
         setTimeout(() => {
           console.log("Executing redirect to:", paymentResponse.data.redirectUrl);
           
           // Try multiple redirect methods
           try {
             window.location.replace(paymentResponse.data.redirectUrl);
           } catch (error) {
             console.log("Replace failed, trying href...");
             try {
               window.location.href = paymentResponse.data.redirectUrl;
             } catch (error2) {
               console.log("Href failed, trying window.open...");
               window.open(paymentResponse.data.redirectUrl, '_blank');
             }
           }
         }, 500);
         return;
       }

      // Extract payment data from the response or use the orderData
      const paymentData = {
        merchId: NDPS_CONFIG.merchId,
        password: NDPS_CONFIG.password,
        merchTxnId: `TXN_${orderData.orderId}_${Date.now()}`,
        product: orderData.name,
        custAccNo: orderData.orderId,
        txnCurrency: "INR",
        custFirstName: orderData.customerName || "Customer",
        custEmail: orderData.customerEmail || "customer@example.com",
        custMobile: orderData.customerMobile || "8888888888",
        amount: orderData.amount.toString(),
        encryptionKey: NDPS_CONFIG.encryptionKey,
        decryptionKey: NDPS_CONFIG.decryptionKey,
        responseHashKey: NDPS_CONFIG.responseHashKey,
        udf1: orderData.orderId,
        udf2: orderData.name,
        udf3: orderData.quantity.toString(),
        udf4: orderData.image,
        udf5: "BreBoot Payment",
        payMode: NDPS_CONFIG.payMode
      };

      console.log("NDPS Payment Data:", paymentData);
      console.log("NDPS Config:", NDPS_CONFIG);

      // For now, skip NDPS library call and redirect directly
      // await initializeNDPSPayment(paymentData, orderData.orderId, paymentResponse);

    } catch (error) {
      console.error("Payment initiation error:", error);
      
             // If we have a payment response with redirect URL, try to redirect as fallback
       if (paymentResponse?.data?.redirectUrl) {
         console.log("Falling back to backend redirect URL:", paymentResponse.data.redirectUrl);
         toast.success("Redirecting to payment gateway...");
         
         // Use setTimeout to ensure the toast shows before redirect
         setTimeout(() => {
           window.location.href = paymentResponse.data.redirectUrl;
         }, 1000);
         return;
       }
      
      toast.error("Failed to initiate payment. Please try again.");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeNDPSPayment = async (paymentData, orderId, paymentResponse) => {
    try {
      console.log("Attempting to import NDPS library...");
      
      // Import NDPS library dynamically
      const { NdpsAESLibrary } = await import('ndpsaeslibrary');
      const { NdpsAipayPayments } = NdpsAESLibrary;
      
      console.log("NDPS library imported successfully");
      console.log("NdpsAipayPayments function:", typeof NdpsAipayPayments);
      
      if (typeof NdpsAipayPayments !== 'function') {
        throw new Error("NdpsAipayPayments is not a function");
      }

      // Set up payment response handler
      const handlePaymentResponse = (eventData) => {
        window.removeEventListener('ndps_pg_response', handlePaymentResponse);
        
        try {
          const parsedResponse = JSON.parse(eventData.response);
          const statusCode = parsedResponse?.payInstrument?.responseDetails?.statusCode;
          
          if (statusCode === "OTS0101") {
            toast.error("Payment was cancelled by user");
            onClose();
          } else if (statusCode === "OTS0000" || statusCode === "OTS0551") {
            // Payment successful - send to backend
            handlePaymentSuccess(parsedResponse, orderId);
          } else {
            toast.error("Payment failed. Please try again.");
            onClose();
          }
        } catch (error) {
          console.error("Error parsing payment response:", error);
          toast.error("Payment verification failed");
          onClose();
        }
      };

      // Add event listener for payment response
      window.addEventListener('ndps_pg_response', handlePaymentResponse);

      // Open NDPS payment gateway
      console.log("Calling NdpsAipayPayments with data:", paymentData);
      
      try {
        await NdpsAipayPayments({ value: paymentData });
        console.log("NdpsAipayPayments called successfully");
        
        // Wait a bit to see if the payment gateway opens
        setTimeout(() => {
          console.log("Checking if payment gateway opened...");
          // If no payment gateway opened, try fallback
          if (!document.querySelector('.ndps-payment-modal') && !window.ndpsPaymentActive) {
            console.log("Payment gateway didn't open, trying fallback...");
            throw new Error("Payment gateway failed to open");
          }
        }, 3000);
        
      } catch (error) {
        console.error("NdpsAipayPayments error:", error);
        throw error;
      }

    } catch (error) {
      console.error("NDPS payment error:", error);
      
             // If NDPS library fails, try to redirect to the backend URL as fallback
       if (paymentResponse?.data?.redirectUrl) {
         console.log("Falling back to backend redirect URL:", paymentResponse.data.redirectUrl);
         toast.success("Redirecting to payment gateway...");
         
         // Use setTimeout to ensure the toast shows before redirect
         setTimeout(() => {
           window.location.href = paymentResponse.data.redirectUrl;
         }, 1000);
         return;
       }
      
      toast.error("Payment gateway error. Please try again.");
      onClose();
    }
  };

  const handlePaymentCallback = async (token, txnId, merchId) => {
    try {
      setPaymentCompleted(true);
      console.log("Processing payment callback...");
      
      // Send payment response to backend
      const backendResponse = await api.post("/auth/user/handle-payment-response", {
        encData: JSON.stringify({
          token: token,
          txnId: txnId,
          merchId: merchId,
          status: "success"
        }),
        orderId: orderData.orderId,
        name: orderData.name,
        image: orderData.image,
        address: JSON.stringify({
          address: "Payment Gateway",
          city: "Online",
          state: "Digital",
          pincode: "000000"
        })
      });

      if (backendResponse.status === 200) {
        toast.success("Payment successful!");
        
        // Navigate to success page
        navigate("/success", {
          state: {
            orderId: orderData.orderId,
            transactionId: txnId,
            amount: orderData.amount
          }
        });
      } else {
        throw new Error("Backend payment processing failed");
      }

    } catch (error) {
      console.error("Payment callback handling error:", error);
      toast.error("Payment verification failed. Please contact support.");
      onClose();
    }
  };

  const handlePaymentSuccess = async (paymentResponse, orderId) => {
    try {
      const responseData = paymentResponse.payInstrument?.responseDetails;
      
      // Send payment response to backend
      const backendResponse = await api.post("/auth/user/handle-payment-response", {
        encData: JSON.stringify(paymentResponse),
        orderId: orderId,
        name: orderData.name,
        image: orderData.image,
        address: JSON.stringify({
          address: "Payment Gateway",
          city: "Online",
          state: "Digital",
          pincode: "000000"
        })
      });

      if (backendResponse.status === 200) {
        toast.success("Payment successful!");
        
        // Navigate to success page
        navigate("/success", {
          state: {
            orderId: orderId,
            transactionId: responseData?.merchTxnId || "NDPS_TXN",
            amount: orderData.amount
          }
        });
      } else {
        throw new Error("Backend payment processing failed");
      }

    } catch (error) {
      console.error("Payment success handling error:", error);
      toast.error("Payment verification failed. Please contact support.");
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin text-[#F7941C] mb-4" />
          <p className="text-gray-700">Initializing payment gateway...</p>
        </div>
      </div>
    );
  }

  if (paymentCompleted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 flex flex-col items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-700">Payment completed successfully!</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to success page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment Gateway</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center">
          <CreditCard className="w-12 h-12 text-[#F7941C] mx-auto mb-4" />
          <p className="text-gray-700 mb-4">
            Redirecting to secure payment gateway...
          </p>
          <p className="text-sm text-gray-500">
            Amount: ₹{orderData?.amount?.toLocaleString()}
          </p>
          <div className="mt-4">
            <div className="animate-pulse bg-gray-200 h-2 rounded-full mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-2 rounded-full mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-2 rounded-full w-1/2 mx-auto"></div>
          </div>
          
                     {/* Manual redirect button in case automatic redirect fails */}
           {redirectUrl && (
             <button
               onClick={() => {
                 console.log("Manual redirect to:", redirectUrl);
                 try {
                   window.location.href = redirectUrl;
                 } catch (error) {
                   console.log("Manual redirect failed, trying window.open...");
                   window.open(redirectUrl, '_blank');
                 }
               }}
               className="mt-4 bg-[#F7941C] text-white px-4 py-2 rounded-lg text-sm"
             >
               Click here if not redirected automatically
             </button>
           )}
           
           {/* Debug information */}
           <div className="mt-4 text-xs text-gray-500">
             <p>Debug Info:</p>
             <p>Order ID: {orderData?.orderId}</p>
             <p>Amount: ₹{orderData?.amount}</p>
             {redirectUrl && (
               <p className="break-all">Redirect URL: {redirectUrl}</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default NDPSPayment; 