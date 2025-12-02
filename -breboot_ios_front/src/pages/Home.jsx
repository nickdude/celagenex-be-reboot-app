import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";
import { useNavigate } from "react-router-dom";
import brebootSvg from "../assets/svg/BrebootLogo.svg";
import { FormModal } from "../components/Modal";
import { useUser } from "../context/userContext";
import Loader from "../components/Loader";
import useAuth from "../auth/useAuth";
import ContactModal from "../components/ContactUsModal";

const Home = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [checked, setChecked] = useState(true);
  const [activeTab, setActiveTab] = useState("Dr");
  // const [gender, setGender] = useState("female");
  // const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    referralCode: "",
    otp: "",
    // gender: "female",
    // state: "",
  });
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { fetchUserDetails } = useUser();
  const {
    isLoading,
    showOtpModal,
    setShowOtpModal,
    handleRegister,
    handleOtpVerify,
    resendLoginOtp,
  } = useAuth(fetchUserDetails, navigate);

  useEffect(() => {
    localStorage.setItem("userType", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showOtpModal && resendTimer > 0) {
      const countdown = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [showOtpModal, resendTimer]);

  const handleResendOtp = async () => {
    const success = await resendLoginOtp(formData);
    if (success) {
      setResendTimer(60);
      setCanResend(false);
      setFormData((prev) => ({ ...prev, otp: "" }));
    }
  };

  // const states = [
  //   "Andhra Pradesh",
  //   "Arunachal Pradesh",
  //   "Assam",
  //   "Bihar",
  //   "Chhattisgarh",
  //   "Goa",
  //   "Gujarat",
  //   "Haryana",
  //   "Himachal Pradesh",
  //   "Jharkhand",
  //   "Karnataka",
  //   "Kerala",
  //   "Madhya Pradesh",
  //   "Maharashtra",
  //   "Manipur",
  //   "Meghalaya",
  //   "Mizoram",
  //   "Nagaland",
  //   "Odisha",
  //   "Punjab",
  //   "Rajasthan",
  //   "Sikkim",
  //   "Tamil Nadu",
  //   "Telangana",
  //   "Tripura",
  //   "Uttar Pradesh",
  //   "Uttarakhand",
  //   "West Bengal",
  //   "Andaman and Nicobar Islands",
  //   "Chandigarh",
  //   "Dadra and Nagar Haveli and Daman and Diu",
  //   "Lakshadweep",
  //   "Delhi",
  //   "Puducherry",
  //   "Jammu and Kashmir",
  //   "Ladakh",
  // ];

  // const handleStateChange = (e) => {
  //   const value = e.target.value.trim();
  //   setSelectedState(value);
  //   setFormData((prev) => ({ ...prev, state: value }));
  // };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  // const handleGenderChange = (newGender) => {
  //   setGender(newGender);
  //   setFormData((prev) => ({ ...prev, gender: newGender }));
  //   localStorage.setItem("GenderType", newGender);
  // };

  return (
    <>
      {isSplashVisible ? (
        <SplashScreen />
      ) : (
        <div className="min-h-screen flex flex-col">
          <div className="w-full bg-[#F7941C] text-white flex items-center justify-between py-4 text-sm px-4 z-50 mb-5"></div>
          <div className="flex-1 flex flex-col items-center px-4 sm:px-10 overflow-y-auto">
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={brebootSvg}
                  alt="Breboot Logo"
                  className="w-auto h-26 mb-3"
                />
                <h2 className="text-xl font-bold text-gray-800">
                  Let's create your account
                </h2>
              </div>
              <div className="flex justify-center pb-5">
                <div className="bg-white shadow-xs border border-gray-200 rounded-xl py-1 px-1 inline-flex gap-1">
                  <button
                    className={`relative px-6 py-2 text-xs font-semibold rounded-xl transition-all ${
                      activeTab === "Dr"
                        ? "bg-[#F7941C] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("Dr")}
                    aria-pressed={activeTab === "Dr"}
                  >
                    Doctor
                  </button>
                  <button
                    className={`relative px-6 py-2 text-xs font-semibold rounded-xl transition-all ${
                      activeTab === "Patient"
                        ? "bg-[#F7941C] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("Patient")}
                    aria-pressed={activeTab === "Patient"}
                  >
                    Others
                  </button>
                </div>
              </div>
              <div className="w-full max-w-80 space-y-6 mb-4 text-sm flex flex-col items-center">
                <div className="w-full flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F7941C]/20 focus-within:border-[#F7941C]">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-r border-gray-200 w-20 shrink-0">
                    <span className="text-gray-700 font-semibold">
                      {activeTab === "Dr" ? "Dr" : "Others"}
                    </span>
                  </div>
                  <input
                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleFormChange}
                    aria-label="Name"
                  />
                </div>
                <div className="w-full flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F7941C]/20 focus-within:border-[#F7941C]">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-r border-gray-200 w-20 shrink-0">
                    <span className="text-gray-700 font-semibold">+91</span>
                  </div>
                  <input
                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none no-spinner"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    name="phone"
                    maxLength={10}
                    onChange={handleFormChange}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                    aria-label="Phone number"
                  />
                </div>
                <div className="w-full flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F7941C]/20 focus-within:border-[#F7941C]">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-r border-gray-200 w-20 shrink-0">
                    <span className="text-gray-700 font-semibold">Email</span>
                  </div>
                  <input
                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    name="email"
                    onChange={handleFormChange}
                    aria-label="Email address"
                  />
                </div>
                {/* {activeTab === "Dr" && (
                  <div className="w-full flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F7941C]/20 focus-within:border-[#F7941C]">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-r border-gray-200 w-20 shrink-0">
                      <span className="text-gray-700 font-semibold">State</span>
                    </div>
                    <select
                      className="flex-1 bg-transparent px-4 py-3 focus:outline-none"
                      value={selectedState}
                      onChange={handleStateChange}
                      aria-label="Select state"
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}
                {activeTab === "Patient" && (
                  <div className="w-full flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F7941C]/20 focus-within:border-[#F7941C]">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-r border-gray-200 w-20 shrink-0">
                      <span className="text-gray-700 font-semibold">Code</span>
                    </div>
                    <input
                      className="flex-1 bg-transparent px-4 py-3 focus:outline-none uppercase"
                      type="text"
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      name="referralCode"
                      onChange={handleFormChange}
                      aria-label="Referral code"
                    />
                  </div>
                )}
                {/* <div className="flex flex-col items-center w-full">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === "male"}
                        onChange={() => handleGenderChange("male")}
                        className="hidden"
                        aria-label="Male"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border border-[#F7941C] flex items-center justify-center transition-all ${
                          gender === "male" ? "bg-[#F7941C]" : "bg-white"
                        }`}
                      >
                        {gender === "male" && (
                          <div className="w-2 h-2 rounded-full bg-[#F7941C]"></div>
                        )}
                      </div>
                      <span className="text-gray-600">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === "female"}
                        onChange={() => handleGenderChange("female")}
                        className="hidden"
                        aria-label="Female"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border border-[#F7941C] flex items-center justify-center transition-all ${
                          gender === "female" ? "bg-[#F7941C]" : "bg-white"
                        }`}
                      >
                        {gender === "female" && (
                          <div className="w-2 h-2 rounded-full bg-[#F7941C]"></div>
                        )}
                      </div>
                      <span className="text-gray-600">Female</span>
                    </label>
                  </div>
                </div> */}
                <label className="flex items-center gap-3 mb-8 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className="hidden"
                    aria-label="Receive updates on WhatsApp"
                  />
                  <div className="w-3 h-3 rounded-full border border-[#F7941C] flex items-center justify-center transition-all">
                    {checked && (
                      <div className="w-1 h-1 rounded-full bg-[#F7941C]"></div>
                    )}
                  </div>
                  <span className="text-xs text-gray-600">
                    Receive updates and reminders on WhatsApp
                  </span>
                </label>
              </div>
              <button
                disabled={isLoading}
                onClick={() =>
                  handleRegister(
                    {
                      ...formData,
                      state: "ios",
                      gender: "ios",
                    },
                    activeTab,
                    true
                  )
                } //selectedState
                className={`w-full max-w-80 text-white py-3 rounded-xl mb-4 active:bg-gray-900 transition-opacity ${
                  isLoading ? "bg-gray-700" : "bg-black"
                }`}
                aria-label="Continue"
              >
                {isLoading ? <Loader isCenter={false} /> : "Continue"}
              </button>
              {showOtpModal && (
                <FormModal
                  title="Enter OTP"
                  onClose={() => setShowOtpModal(false)}
                >
                  <input
                    className="w-full px-4 py-3 border rounded mb-2"
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleFormChange}
                    aria-label="OTP"
                  />
                  <button
                    onClick={
                      () => handleOtpVerify(formData, activeTab, true) //selectedState
                    }
                    className="w-full bg-orange-500 text-white py-3 rounded-xl mb-2"
                    disabled={isLoading}
                    aria-label="Verify OTP"
                  >
                    {isLoading ? (
                      <Loader BorderColor="border-white" isCenter={false} />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend || isLoading}
                    className={`w-full text-[#F7941C] py-2 rounded-xl transition-opacity ${
                      !canResend || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    aria-label={
                      canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`
                    }
                  >
                    {isLoading ? (
                      <Loader isCenter={false} />
                    ) : canResend ? (
                      "Resend OTP"
                    ) : (
                      `Resend OTP in ${resendTimer}s`
                    )}
                  </button>
                </FormModal>
              )}
              <p className="text-center text-xs text-gray-500 px-6 mb-2">
                By signing up I agree to the{" "}
                <a
                  href="/termsandcondition"
                  className="text-[#F7941C] underline"
                >
                  Terms of Services
                </a>{" "}
                and{" "}
                <a href="/privacypolicy" className="text-[#F7941C] underline">
                  Privacy Policy
                </a>{" "}
                including usage of cookies.
              </p>
              <p
                className="text-center text-xs px-6 mb-5 text-[#F7941C] cursor-pointer hover:underline"
                onClick={() => setIsModalOpen(true)}
              >
                If you have any queries, please contact us
              </p>
              {isModalOpen && (
                <ContactModal onClose={() => setIsModalOpen(false)} />
              )}
              <p
                onClick={() => navigate("/login")}
                className="text-center text-xs px-6 pb-10 text-[#F7941C] font-semibold tracking-wide cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/login")}
                aria-label="Already a user? Login"
              >
                Already a user?
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
