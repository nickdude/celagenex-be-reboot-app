import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Download, ArrowLeft, Receipt } from "lucide-react";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, transactionId, amount } = location.state || {};

  // useEffect(() => {
  //   if (!orderId || !transactionId) {
  //     toast.error("Payment information not found");
  //     navigate("/");
  //   }
  // }, [orderId, transactionId, navigate]);

  const handleDownloadInvoice = () => {
    // This would typically download the invoice PDF
    toast.success("Invoice download started");
  };

  const handleGoHome = () => {
    navigate("/welcome");
  };

  // const handleViewOrders = () => {
  //   navigate("/pruchaseHistory");
  // };

  // if (!orderId || !transactionId) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="bg-white p-6 rounded-xl shadow-md text-center">
  //         <p className="text-lg text-gray-700">Payment information not found</p>
  //         <button
  //           onClick={() => navigate("/")}
  //           className="mt-4 bg-[#F7941C] text-white py-2 px-4 rounded-lg font-medium"
  //         >
  //           Go Home
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Payment Success</h1>
      </div>

      <div className="flex-1 p-4">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium text-gray-900">1234567890</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium text-gray-900">1234567890</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-bold text-[#F7941C]">₹1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-900">Secure Gateway</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Completed</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• You'll receive an email confirmation with order details</p>
            <p>• Your invoice will be generated and sent to your email</p>
            <p>• Track your order status in the purchase history</p>
            <p>• Contact support if you have any questions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadInvoice}
            className="w-full bg-white border border-[#F7941C] text-[#F7941C] py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-orange-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Invoice
          </button>
          
          {/* <button
            onClick={handleViewOrders}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-gray-50 transition-colors"
          >
            <Receipt className="w-5 h-5" />
            View Order History
          </button> */}
          
          <button
            onClick={handleGoHome}
            className="w-full bg-[#F7941C] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-amber-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;