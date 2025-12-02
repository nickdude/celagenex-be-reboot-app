import React, { useState, useEffect } from "react";
import { BottomNavBarMemberProgram } from "../components/BottomNavBar";
import Header from "../components/Header";
import api, { API_BASE_URL } from "../utils/Api"; // Ensure API_BASE_URL is imported
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Download } from "lucide-react";

const PurchaseCard = ({ purchase }) => {
  const [showAddress, setShowAddress] = useState(false);

  // Ensure full URL for images and invoice
  const imageUrl = purchase.image.startsWith("http") ? purchase.image : `${API_BASE_URL}${purchase.image}`;
  const invoiceUrl = purchase.invoiceUrl ? `${API_BASE_URL}${purchase.invoiceUrl}` : null;

  let addressObject = purchase.address;
  try {
    if (typeof purchase.address === "string") {
      addressObject = JSON.parse(purchase.address);

      // Check if it's still a string (meaning it was double-encoded)
      if (typeof addressObject === "string") {
        addressObject = JSON.parse(addressObject);
      }
    }
  } catch (error) {
    console.error("Error parsing address:", error);
    addressObject = null; // Fallback in case of error
  }

  const formattedAddress = addressObject
    ? `${addressObject.address}, ${addressObject.landMark}, ${addressObject.city}, ${addressObject.state} - ${addressObject.pincode}`
    : "Address not available";


  // Function to handle invoice download
  const downloadInvoice = () => {
    if (invoiceUrl) {
      const link = document.createElement("a");
      link.href = invoiceUrl;
      link.setAttribute("download", `Invoice-${purchase.orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("Invoice not available");
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4 flex items-center justify-between">
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={purchase.name}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/placeholder-image.jpg")}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800">{purchase.name}</h3>
          <p className="text-xs text-gray-500 mt-1">Order ID: {purchase.orderId}</p>
          <p className="text-xs text-gray-500 mt-1">Transaction ID: {purchase.transactionId}</p>

          {/* Payment Verification Status */}
          <div className="mt-2 flex items-center gap-1">
            {purchase.paymentStatus === "Verified" ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : purchase.paymentStatus === "Verifying" ? (
              <Clock size={16} className="text-yellow-500" />
            ) : (
              <XCircle size={16} className="text-red-500" />
            )}
            <span className="text-xs text-gray-600">
              {purchase.paymentStatus === "Verified"
                ? "Payment Verified"
                : purchase.paymentStatus === "Verifying"
                  ? "Verification Pending"
                  : "Payment Failed"}
            </span>
          </div>

          {/* View Address Option */}
          <button
            onClick={() => setShowAddress(!showAddress)}
            className="text-xs text-gray-500 mt-2 flex items-center gap-1"
          >
            {showAddress ? "Hide Address" : "View Address"}
            {showAddress ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showAddress && <p className="text-xs text-gray-500 mt-1">{formattedAddress}</p>}
        </div>
      </div>

      {/* Download Invoice Icon */}
      {invoiceUrl && (
        <button onClick={downloadInvoice} className="text-blue-500 hover:text-blue-700">
          <Download size={20} />
        </button>
      )}
    </div>
  );
};

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await api.get(`/user/payments`);

        const purchaseDetails = response.data?.payments || [];
        setPurchases(purchaseDetails.reverse());
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching purchase history:", error);
        toast.error("Error fetching purchase history");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="min-h-screen text-gray-900 font-poppins bg-gray-50">
      <Header title="Purchase History" />

      <div className="px-4 py-4 pb-24">
        {loading ? (
          <Loader />
        ) : purchases.length > 0 ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Your Purchase History</h2>
              <p className="text-sm text-gray-500">Details of your past purchases</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {purchases.map((purchase, index) => (
                <PurchaseCard key={index} purchase={purchase} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500 text-sm text-center">No purchase records available</p>
          </div>
        )}
      </div>

      <BottomNavBarMemberProgram />
    </div>
  );
};

export default PurchaseHistory;
