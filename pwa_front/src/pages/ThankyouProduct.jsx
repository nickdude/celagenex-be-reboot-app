import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ThankYouProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { orderId, transactionId } = location.state || {};

    useEffect(() => {
        if (!orderId || !transactionId) {
            navigate("/welcome"); // Redirect if no valid data
        }
    }, [orderId, transactionId, navigate]);

    if (!orderId || !transactionId) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-b from-[#F7941C] to-amber-500 pt-12 pb-20 px-4">
                <div className="flex flex-col items-center text-white">
                    <CheckCircle className="w-16 h-16 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
                    <p className="text-center opacity-90">
                        Your payment has been submitted successfully!
                    </p>
                </div>
            </div>
            <div className="px-4 -mt-12">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="border-b border-gray-300 pb-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 text-sm">Order ID:</span>
                            <span className="font-medium text-gray-600">{orderId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Transaction ID:</span>
                            <span className="font-medium text-gray-600">{transactionId}</span>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                        Your payment will be verified shortly. You can check the status in your <strong>History</strong> page.
                    </p>
                    <button
                        onClick={() => navigate("/pruchaseHistory")}
                        className="w-full bg-[#F7941C] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium active:bg-orange-50"
                    >
                        Go to History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThankYouProduct;
