import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Upload, CheckCircle, Landmark } from "lucide-react";
import Loader from "../components/Loader";
import QRCodeFull from "../assets/images/brebootQr.png"
import QRCode from "../assets/images/QRCode.png";
import api from "../utils/Api";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productData, orderId, orderStatus, orderAmount, orderQuantity } = location.state || {};
  const [screenshot, setScreenshot] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [landMark, setLandMark] = useState("");
  const [gstNumber, setGstNumber] = useState("");



  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Address validation: At least 10 characters, no special characters like !@#$%^&*
    const addressRegex = /^[A-Za-z0-9\s,.'-]{10,}$/;

    // State and City validation: Minimum 3 letters, only alphabets and spaces
    const stateCityRegex = /^[A-Za-z\s]{3,}$/;

    // Pincode validation: Exactly 6 digits
    const pincodeRegex = /^[0-9]{6}$/;

    if (!address.trim() || !addressRegex.test(address)) {
      toast.error("Please enter a valid address with at least 10 characters.");
      return;
    }

    if (!state.trim() || !stateCityRegex.test(state)) {
      toast.error("Please enter a valid state with at least 3 letters.");
      return;
    }

    if (!city.trim() || !stateCityRegex.test(city)) {
      toast.error("Please enter a valid city with at least 3 letters.");
      return;
    }

    if (!pincode.trim() || !pincodeRegex.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!screenshot) {
      toast.error("Please upload a screenshot to proceed.");
      return;
    }

    if (!transactionId.trim()) {
      toast.error("Please enter the transaction ID to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("transactionId", transactionId);
      formData.append("paymentScreenshot", screenshot);
      formData.append("orderId", orderId);
      formData.append("name", productData.name);
      formData.append("image", productData.image);

      const addressObj = {
        address,
        city,
        state,
        pincode,
      };

      if (landMark) addressObj.landMark = landMark;
      if (gstNumber) addressObj.gstNumber = gstNumber;

      // Stringify the address object before appending
      formData.append("address", JSON.stringify(addressObj));



      const response = await api.post("/auth/user/payment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Payment submitted successfully!");

        // Redirect to Thank You page
        navigate("/thank-you-product", {
          state: {
            orderId: orderId,
            transactionId: transactionId,
          },
        });
      }
    } catch (error) {
      console.error("Error in submitting payment review:", error);

      if (error.response) {
        console.error("Response error:", error.response.data);
      }

      toast.error("Error in submitting payment review");
    } finally {
      setIsSubmitting(false);
    }
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
        {/* <button
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button> */}
        <h1 className="text-lg font-bold text-gray-900">Payment</h1>
      </div>

      {isSubmitting ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
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

          {/* Payment Instructions */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Instructions</h2>
            <ol className="space-y-2 text-gray-700 text-sm pl-5 list-decimal">
              <li>Scan the QR code below to pay the exact amount</li>
              <li>Add your Address and other details</li>
              <li>Complete the payment using any UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
              <li>Take a screenshot of your successful payment</li>
              <li>Upload the screenshot and enter the transaction ID below</li>
              <li>Submit for review</li>
            </ol>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            {/* Address Field */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 h-20 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7941C] focus:border-[#F7941C] outline-none resize-none"
              placeholder="Enter your address"
              required
              minLength={10}
              title="Address must be at least 10 characters long"
            />

            {/* Landmark Field */}
            {/* Landmark Field */}
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">Landmark</label>
            <input
              value={landMark}
              onChange={(e) => setLandMark(e.target.value)} // Updated this line
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7941C] focus:border-[#F7941C] outline-none"
              placeholder="Any near Landmark"
            />


            {/* City Field */}
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">City *</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7941C] focus:border-[#F7941C] outline-none"
              placeholder="Enter your city"
              required
              minLength={3}
              title="City must be at least 3 characters long"
            />


            {/* State Field */}
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">State *</label>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7941C] focus:border-[#F7941C] outline-none"
              placeholder="Enter your state"
              required
              minLength={3}
              title="State must be at least 3 characters long"
            />

            {/* Pincode Field */}
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">Pincode *</label>
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7941C] focus:border-[#F7941C] outline-none"
              placeholder="Enter your pincode"
              required
              pattern="^[0-9]{5,6}$"
              title="Please enter a valid 5 or 6-digit pincode"
            />

            {/* GST Number Field */}
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">GST No.</label>
            <input
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)} // Updated this line
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7941C] focus:border-[#F7941C] outline-none"
              placeholder="Enter your GST number here"
            />

          </div>



          {/* QR Code */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 self-start">Scan & Pay</h2>
            <img
              src={QRCodeFull}
              alt="Payment QR Code"
              className="w-48 h-full object-contain"
              onError={(e) => {
                e.target.src = "/api/placeholder/240/240";
                e.target.alt = "QR Code placeholder";
              }}
            />
            <p className="text-center text-sm font-medium text-[#F7941C] mt-1">
              Pay ₹{productData.amount.toLocaleString()}
            </p>
          </div>

          {/* Payment Verification */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Verification</h2>

            {/* Screenshot upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot</label>
              <div
                className={`border-2 ${previewUrl ? 'border-[#F7941C]' : 'border-dashed border-gray-300'} 
                  rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label htmlFor="screenshot-upload" className="cursor-pointer text-center w-full">
                  {previewUrl ? (
                    <div className="relative">
                      <img src={previewUrl} alt="Payment Screenshot" className="max-h-40 mx-auto rounded-lg" />
                      <div className="mt-2 text-xs text-[#F7941C] flex items-center justify-center gap-1">
                        <Upload className="w-3 h-3" />
                        Change image
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6 text-[#F7941C]" />
                      </div>
                      <p className="text-sm text-gray-600">Click to upload payment screenshot</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7941C] focus:border-[#F7941C] outline-none"
                placeholder="Enter UPI transaction ID"
              />
            </div>
          </div>

          {/* Note */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#F7941C] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                You'll receive confirmation via email once verified.
              </p>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#F7941C] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium mb-6"
          >
            Submit for Review
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;