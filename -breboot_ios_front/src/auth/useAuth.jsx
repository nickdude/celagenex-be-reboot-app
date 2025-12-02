import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/Api";

const useAuth = (fetchUserDetails, navigate) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpResendCount, setOtpResendCount] = useState(0); // Track OTP resends
  const MAX_OTP_RESENDS = 3; // Frontend limit for resends

  // Registration Functions
  const handleRegister = async (formData, activeTab, registerWithPhone) => {
    //selectedState
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Please enter a valid name");
      return;
    }

    if (
      activeTab === "Dr" &&
      (!formData.state || formData.state.trim() === "")
    ) {
      toast.error("Please select a valid state");
      return;
    }

    if (registerWithPhone) {
      if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }
    } else {
      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    try {
      setIsLoading(true);
      const payload = {
        name: formData.name.trim(),
        phone: registerWithPhone ? formData.phone : null,
        email: formData.email.trim(),
        code: activeTab !== "Dr" ? formData.referralCode?.toUpperCase() : null,
        gender: "ios",
        userType: activeTab === "Dr" ? "Doctor" : "OtherUser",
        state: "ios", // ✅ Use formData.state
      };

      const response = await api.post("/auth/user/register", payload);

      if (response.status === 200 || response.status === 201) {
        if (registerWithPhone) {
          setShowOtpModal(true);
        } else {
          setShowPasswordModal(true);
        }
      } else {
        toast.error(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (formData, activeTab, selectedState) => {
    //selectedState
    if (!formData.password || formData.password.length < 6) {
      toast.error("Please enter a password (minimum 6 characters)");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        gender: "ios",
        userType: activeTab === "Dr" ? "Doctor" : "OtherUser",
        code: activeTab !== "Dr" ? formData.referralCode?.toUpperCase() : null,
        state: "ios",
      };

      const response = await api.post("/auth/user/register", payload);

      if (response.status === 200 || response.status === 201) {
        setShowPasswordModal(false);
        setShowOtpModal(true);
      } else {
        toast.error(
          response.data.message ||
            "Password submission failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Password submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to set password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (
    formData,
    activeTab,
    registerWithPhone,
    selectedState
  ) => {
    //selectedState
    if (!formData.otp || formData.otp.length < 4) {
      toast.error("Please enter a valid OTP (at least 4 digits)");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: formData.name.trim(),
        gender: "ios",
        phone: registerWithPhone ? formData.phone : null,
        email: formData.email.trim(),
        otp: formData.otp,
        password: !registerWithPhone ? formData.password : null,
        userType: activeTab === "Dr" ? "Doctor" : "OtherUser",
        code: activeTab !== "Dr" ? formData.referralCode : null,
        state: "ios",
      };

      const response = await api.post("/auth/user/register", payload);

      if (response.data.status === "success" || response.status === 200) {
        toast.success("OTP verified successfully!");
        setShowOtpModal(false);
        localStorage.setItem("authToken", response.data.token);
        try {
          await fetchUserDetails();
          const route = activeTab === "Dr" ? "/firstlogin" : "/welcome";
          navigate(route);
        } catch (fetchError) {
          console.error("Fetch user details error:", fetchError);
          toast.error("Failed to load user data. Please log in again.");
          navigate("/login");
        }
      } else {
        toast.error(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Login Functions
  const handleLogin = async (formData, loginWithPhone, setShowOtpInput) => {
    if (loginWithPhone) {
      if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }
    } else {
      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        toast.error("Please enter a password (minimum 6 characters)");
        return;
      }
    }

    try {
      setIsLoading(true);
      const payload = loginWithPhone
        ? {
            phone: formData.phone,
            email: formData.email,
            otp: null,
            password: null,
          }
        : {
            phone: null,
            email: formData.email,
            otp: null,
            password: formData.password,
          };

      const response = await api.post("/auth/user/login", payload);

      if (response.data.status === "success") {
        if (loginWithPhone) {
          toast.success("OTP sent successfully!");
          setShowOtpInput(true);
          setOtpResendCount(0); // Reset resend count
        } else {
          localStorage.setItem("authToken", response.data.token);
          try {
            await fetchUserDetails();
            toast.success("Login successful!");
            const userType =
              response.data.userType === "Doctor"
                ? "Dr"
                : response.data.userType;
            localStorage.setItem("userType", userType);
            navigate("/welcome");
          } catch (fetchError) {
            console.error("Fetch user details error:", fetchError);
            toast.error("Failed to load user data. Please log in again.");
            navigate("/login");
          }
        }
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginOtpVerify = async (formData) => {
    if (!formData.otp || formData.otp.length < 4) {
      toast.error("Please enter a valid OTP (at least 4 digits)");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        phone: formData.phone,
        email: formData.email,
        otp: formData.otp,
        password: null,
      };

      const response = await api.post("/auth/user/login", payload);

      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        try {
          await fetchUserDetails();
          toast.success("Login successful!");
          const userType =
            response.data.userType === "Doctor" ? "Dr" : response.data.userType;
          localStorage.setItem("userType", userType);
          navigate("/welcome");
        } catch (fetchError) {
          console.error("Fetch user details error:", fetchError);
          toast.error("Failed to load user data. Please log in again.");
          navigate("/login");
        }
      } else {
        toast.error(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resendLoginOtp = async (formData) => {
    if (otpResendCount >= MAX_OTP_RESENDS) {
      toast.error(
        "Maximum OTP resend attempts reached. Please wait or try again later."
      );
      return false;
    }

    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      toast.error("Please provide a valid 10-digit phone number to resend OTP");
      return false;
    }

    try {
      setIsLoading(true);
      const payload = {
        phone: formData.phone,
        email: formData.email,
        otp: null,
        password: null,
      };

      const response = await api.post("/auth/user/login", payload);

      if (response.status === 200) {
        setOtpResendCount((prev) => prev + 1);
        toast.success(
          `New OTP sent successfully! (${
            otpResendCount + 1
          }/${MAX_OTP_RESENDS})`
        );
        return true;
      } else {
        toast.error(
          response.data.message || "Failed to resend OTP. Please try again."
        );
        return false;
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP. Check your connection."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showOtpModal,
    setShowOtpModal,
    showPasswordModal,
    setShowPasswordModal,
    handleRegister,
    handlePasswordSubmit,
    handleOtpVerify,
    handleLogin,
    handleLoginOtpVerify,
    resendLoginOtp,
  };
};

export default useAuth;
