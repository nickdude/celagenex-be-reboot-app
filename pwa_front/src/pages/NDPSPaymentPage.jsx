import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";
import Loader from "../components/Loader";
import NDPSPayment from "../components/NDPSPayment";
import AtomPayment from "../components/AtomPayment";
import api from "../utils/Api";

const NDPSPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productData, orderId, orderStatus, orderAmount, orderQuantity } = location.state || {};
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentGateway = () => {
    if (!productData) {
      toast.error("Product information not found");
      return;
    }

    setShowPaymentGateway(true);
  };

  const handleClosePayment = () => {
    setShowPaymentGateway(false);
  };

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-lg">No product information found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#F7941C] text-white py-2 px-4 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-lg font-bold text-gray-900">Secure Payment</h1>
      </div>

      <div className="flex-1 p-4">
        {/* Product Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{productData.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">₹{productData.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">{orderQuantity}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Order Id:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="h-px bg-gray-100 my-3"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-semibold">Total:</span>
            <span className="text-lg font-bold text-[#F7941C]">₹{orderAmount}</span>
          </div>
        </div>

        {/* Payment Gateway Info */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Secure Payment Gateway</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Bank-Grade Security</p>
                <p className="text-xs text-gray-600">Your payment is protected with 256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Multiple Payment Options</p>
                <p className="text-xs text-gray-600">Credit/Debit cards, UPI, Net Banking, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Instant Confirmation</p>
                <p className="text-xs text-gray-600">Get immediate payment confirmation and invoice</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Methods</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#F7941C]" />
                <span className="text-sm font-medium">Credit/Debit Cards</span>
              </div>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                <span className="text-sm font-medium">UPI Payments</span>
              </div>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-600 rounded"></div>
                <span className="text-sm font-medium">Net Banking</span>
              </div>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-700 mt-1">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <button
          onClick={handlePaymentGateway}
          disabled={isProcessing}
          className="w-full bg-[#F7941C] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium mb-6 hover:bg-amber-600 transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <Loader isCenter={false} BorderColor="border-white" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              Proceed to Payment • ₹{orderAmount.toLocaleString()}
            </div>
          )}
        </button>
      </div>

      {/* NDPS Payment Gateway Modal */} 
      {showPaymentGateway && (
        // <div>
        //   <h1>NDPS Payment Gateway</h1>
        // </div>
        // <NDPSPayment
        //   orderData={{
        //     orderId: orderId, // Pass the orderId from the route state
        //     productId: productData.id,
        //     quantity: orderQuantity,
        //     price: productData.price,
        //     amount: orderAmount,
        //     name: productData.name,
        //     image: productData.image,
        //     customerName: "Customer", // You can get this from user context
        //     customerEmail: "customer@example.com", // You can get this from user context
        //     customerMobile: "8888888888" // You can get this from user context
        //   }}
        //   onClose={handleClosePayment}
        // />
        <AtomPayment />
      )}
    </div>
  );
};

export default NDPSPaymentPage; 