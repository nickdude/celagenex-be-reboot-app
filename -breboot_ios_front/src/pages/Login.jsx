import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brebootSvg from "../assets/svg/BrebootLogo.svg";
import { useUser } from "../context/userContext";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import useAuth from "../auth/useAuth";
import { Eye, EyeClosed } from "lucide-react";
import ContactModal from "../components/ContactUsModal";
import api from "../utils/Api";

const Login = () => {
  const navigate = useNavigate();
  const [loginWithPhone, setLoginWithPhone] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fetchUserDetails } = useUser();
  const { isLoading, handleLogin, handleLoginOtpVerify, resendLoginOtp } =
    useAuth(fetchUserDetails, navigate);

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    otp: "",
    password: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResendOtp = async () => {
    const success = await resendLoginOtp(formData);
    if (success) {
      setResendTimer(60);
      setIsResendDisabled(true);
    }
  };

  useEffect(() => {
    let interval;
    if (showOtpInput && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpInput, resendTimer]);

  const toggleLoginMethod = () => {
    setLoginWithPhone(!loginWithPhone);
    setShowOtpInput(false);
    setFormData({
      phone: "",
      email: "",
      otp: "",
      password: "",
    });
  };

  const togglePasswordVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full bg-[#F7941C] text-white flex items-center justify-between py-4 text-sm px-4 z-50 mb-5"></div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center px-10">
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-center">
            <img src={brebootSvg} alt="" className="w-auto h-26 mb-3" />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-sm text-gray-600 mt-2">Login to your account</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-6">
            {loginWithPhone ? (
              <>
                <div className="flex items-center max-w-80 mx-auto bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F7941C]/20 focus-within:border-[#F7941C]">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-r border-gray-200 w-20">
                    <span className="text-gray-700 font-semibold">+91</span>
                  </div>
                  <input
                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    maxLength={10}
                    onChange={handleFormChange}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                {showOtpInput && (
                  <div className="max-w-80 mx-auto flex flex-col items-center">
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F7941C]/20 focus:border-[#F7941C]"
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleFormChange}
                    />
                    <button
                      onClick={handleResendOtp}
                      disabled={isResendDisabled || isLoading}
                      className={`text-[#F7941C] font-semibold text-xs mt-2 ${
                        isResendDisabled || isLoading ? "opacity-50" : ""
                      }`}
                    >
                      {isResendDisabled
                        ? `Resend OTP in ${resendTimer}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center max-w-80 mx-auto bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F7941C]/20 focus-within:border-[#F7941C]">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-r border-gray-200 w-20">
                    <span className="text-gray-700 font-semibold">Email</span>
                  </div>
                  <input
                    className="w-full bg-transparent px-4 py-3 focus:outline-none text-sm"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="relative max-w-80 mx-auto">
                  <input
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F7941C]/20 focus:border-[#F7941C]"
                    type={isVisible ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleFormChange}
                  />
                  <button
                    onClick={togglePasswordVisible}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {isVisible ? (
                      <EyeClosed className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Login Button */}
          <div className="max-w-80 mx-auto w-full">
            <button
              onClick={() =>
                loginWithPhone
                  ? showOtpInput
                    ? handleLoginOtpVerify(formData)
                    : handleLogin(formData, loginWithPhone, setShowOtpInput)
                  : handleLogin(formData, loginWithPhone, setShowOtpInput)
              }
              className={`w-full bg-black text-white py-3 rounded-xl mb-4 active:bg-gray-900 transition-opacity ${
                isLoading ? "bg-gray-700" : "bg-black"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader isCenter={false} />
              ) : loginWithPhone ? (
                showOtpInput ? (
                  "Verify OTP"
                ) : (
                  "Get OTP"
                )
              ) : (
                "Login"
              )}
            </button>

            {/* Divider */}
            {/* <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-gray-500 font-medium text-xs">
                or continue with
              </span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div> */}

            {/* Toggle Method Button */}
            {/* <button
              onClick={toggleLoginMethod}
              className="w-full text-gray-700 border border-gray-400 py-3 rounded-xl mb-8 active:bg-gray-200 transition-opacity"
            >
              {loginWithPhone ? "Email Address" : "Phone Number"}
            </button> */}

            {/* Sign Up Link */}
            {/* Forgot Password Link */}
            {/* <p
              className="text-center text-xs px-6 pb-6 text-[#F7941C] font-semibold tracking-wide cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p> */}
            <p
              onClick={() => navigate("/")}
              className="text-center text-xs px-6 pb-3 text-[#F7941C] font-semibold tracking-wide cursor-pointer"
            >
              Don't have an account?
            </p>
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

export default Login;
