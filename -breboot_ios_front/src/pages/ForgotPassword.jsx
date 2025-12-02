import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";  // Add this import
import api from "../utils/Api";
import brebootSvg from "../assets/svg/BrebootLogo.svg";
import ContactModal from "../components/ContactUsModal";

const ForgotPassword = () => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();  // Use useNavigate hook to navigate

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast("Please enter your email to reset password.");
      return;
    }
    try {
      const response = await api.post(`/auth/user/forgot-password`, {
        email: forgotPasswordEmail,
      });
      toast(response.data.message);
      setShowForgotPassword(false); // Hide the form after successful submission
    } catch (error) {
      console.error("Error", error);
      toast(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full bg-[#F7941C] text-white flex items-center justify-between py-4 text-sm px-4 z-50 mb-5"></div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center px-10">
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-center">
            <img src={brebootSvg} alt="" className="w-auto h-26" />
          </div>
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">
              Forgot Password?
            </h2>
          </div>

          <div className="space-y-6 mb-6">
            {showForgotPassword ? (
              <div className="max-w-80 mx-auto flex flex-col items-center">
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5 focus:outline-none"
                  type="email"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
                <button
                  onClick={handleForgotPassword}
                  className="w-full bg-black text-white py-3 rounded-xl mt-2"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => navigate("/login")} // Redirect back to login
                  className="text-gray-500 text-sm mt-4"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="max-w-80 mx-auto flex flex-col items-center">
                <p className="text-sm text-gray-700">
                  Please check your email for reset instructions.
                </p>
              </div>
            )}
            <p
              className="text-center text-xs px-6 mb-3 text-[#F7941C] cursor-pointer hover:underline font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              If you have any queries, please contact us
            </p>
            {isModalOpen && (
              <ContactModal onClose={() => setIsModalOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
