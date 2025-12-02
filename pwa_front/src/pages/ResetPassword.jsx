import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, useSearchParams } from "react-router-dom"; // Use useNavigate for navigation
import api from "../utils/Api";
import brebootSvg from "../assets/svg/BrebootLogo.svg"; // Logo for branding

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate(); // Use navigate hook for navigation
  const expires = useSearchParams.get("expires")

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast("Both fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post(`/auth/user/reset-password/${token}?expires=${expires}`, {
        newPassword,
        confirmNewPassword,
      });
      toast(response.data.message);
      navigate("/login"); // Redirect to login after successful password reset
    } catch (error) {
      console.error("Error resetting password:", error);
      toast(error.response?.data?.message || "Something went wrong.");
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
            <img src={brebootSvg} alt="Breboot Logo" className="w-auto h-26" />
          </div>
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">
              Reset Your Password
            </h2>
          </div>

          <div className="space-y-6 mb-6">
            <div className="max-w-80 mx-auto flex flex-col items-center">
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5 focus:outline-none"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5 focus:outline-none"
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button
                onClick={handleResetPassword}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
