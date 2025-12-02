import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  UserPen,
  Copy,
  Check,
  Mail,
  Phone,
  User,
  LogOut,
  Key,
  Dot,
  MapPin,
  Edit2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConsentModal } from "../components/Modal";
import { useUser } from "../context/userContext";
import api from "../utils/Api";
import toast from "react-hot-toast";
import useLogout from "../auth/Logout.Jsx";
import coin from "../assets/images/Coin_b.png";
import menProfile from "../assets/images/man.png";
import womanProfile from "../assets/images/woman.png";
import ConfirmModal from "../components/ConfirmModal";

const Profile = () => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Added for update loading
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { userData, setUserData, loading } = useUser();
  const user = localStorage.getItem("userType") || "Patient"; // Default to Patient
  const logout = useLogout();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    doctorCode: "",
    // state: "",
  });

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

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        doctorCode: userData.code || "",
        // state: userData.state || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^[0-9]*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(), // Trim all inputs
    }));
  };

  const handleUpdate = async () => {
    if (!formData.name) {
      toast.error("Name is required.");
      return;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await api.put("/user/update", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        // state: formData.state,
      });

      if (response.status === 200) {
        setUserData((prev) => ({
          ...prev,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          // state: formData.state,
        }));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile. Try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoutConfirm = () => {
    setIsModalOpen(true);
  };

  const handleModalAction = (confirm) => {
    setIsModalOpen(false);
    if (confirm) {
      logout();
    }
  };

  const handleCopy = () => {
    const textToCopy = formData.doctorCode;
    if (!textToCopy) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Clipboard API failed: ", err);
          toast.error("Failed to copy code.");
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
        toast.error("Failed to copy code.");
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!userData) {
    return (
      <div className="text-center py-10">
        No user data available. Please{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-[#F7941C] underline"
        >
          log in
        </button>
        .
      </div>
    );
  }

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          title="Delete Account"
          message="Once you confirm, your account and all associated data will be scheduled for deletion within 7 days."
          sub="If you change your mind during this period and wish to reactivate your account, please contact us at cheerfol2@gmail.com"
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            async function setup() {
              setShowConfirmModal(false);
              const response = await api.delete("/auth/user/delete-account");

              if (response.status === 200) {
                toast.success(response.data.message || "Account deleted");
              } else {
                toast.error(
                  response.data.message || "Failed to delete account"
                );
              }
              logout(false);
            }

            setup();
          }}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

      <div className="min-h-[100dvh] flex flex-col bg-gray-50">
        <Header
          title={isEditing ? "Update Profile" : "Profile"}
          icon={<UserPen className="w-6 h-6" />}
          onAction={() => setIsEditing(!isEditing)}
          extraContent={
            isEditing ? (
              <span className="text-sm text-[#F7941C] flex items-center gap-1">
                <Edit2 className="w-4 h-4" /> Edit Mode
              </span>
            ) : null
          }
        />

        <div className="flex-1">
          <div className="pb-10">
            <div className="h-32 bg-[#F7941C]" />
            <div className="px-4 -mt-16">
              <div className="relative">
                {/* Delete Button - Top Right */}
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="absolute right-0 top-19 text-sm text-red-600 bg-white border border-red-300 rounded-lg px-4 py-2 hover:bg-red-50 transition"
                >
                  Delete Account
                </button>

                {/* Profile Image */}
                <div className="w-32 h-32 bg-white rounded-full p-1">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center relative overflow-hidden">
                    <img
                      src={menProfile}
                      alt={`${userData.name}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 -mt-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 mb-1">Available Points</p>
                <div className="flex items-center justify-center gap-2">
                  <img src={coin} alt="Points coin" className="w-5 h-auto" />
                  <p className="text-xl font-bold text-[#F7941C]">
                    {userData.points || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="space-y-6">
                <div>
                  <label
                    className="text-sm text-gray-500 mb-1 block"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F7941C]/20 ${
                      isEditing
                        ? "bg-white border border-[#F7941C]/50 text-black"
                        : "bg-gray-50 text-gray-500"
                    }`}
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    aria-label="Name"
                  />
                </div>

                {user === "Dr" && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Key className="w-4 h-4" />
                      <span className="text-sm">Doctor Code</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                      <input
                        type="text"
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                        value={formData.doctorCode}
                        disabled
                        aria-label="Doctor code"
                      />
                      <button
                        onClick={handleCopy}
                        onKeyDown={(e) => e.key === "Enter" && handleCopy()}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#F7941C]"
                        aria-label={copied ? "Copied" : "Copy doctor code"}
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Phone Number</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F7941C]/20 ${
                        isEditing
                          ? "bg-white border border-[#F7941C]/50 text-black"
                          : "bg-gray-50 text-gray-500"
                      }`}
                      value={formData.phone}
                      onChange={handleInputChange}
                      // disabled={!isEditing}
                      disabled={userData.phone ? true : !isEditing}
                      aria-label="Phone number"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <input
                      type="email"
                      name="email"
                      className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F7941C]/20 ${
                        isEditing
                          ? "bg-white border border-[#F7941C]/50 text-black"
                          : "bg-gray-50 text-gray-500"
                      }`}
                      value={formData.email}
                      onChange={handleInputChange}
                      // disabled={!isEditing}
                      disabled={userData.email ? true : !isEditing}
                      aria-label="Email"
                    />
                  </div>

                  {/* {user === "Dr" && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">State</span>
                      </div>
                      <select
                        name="state"
                        className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F7941C]/20 ${isEditing
                            ? "bg-white border border-[#F7941C]/50 text-black"
                            : "bg-gray-50 text-gray-500"
                          }`}
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        aria-label="State"
                      >
                        <option value="">Select a state</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  )} */}
                </div>
              </div>

              {!isEditing && (
                <div className="mt-8">
                  <button
                    onClick={handleLogoutConfirm}
                    className="w-full py-2 px-4 rounded-xl text-white font-medium transition-colors bg-[#F7941C] active:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-[#F7941C]"
                    aria-label="Logout"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div>Log Out</div>
                      <LogOut className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              )}

              {isModalOpen && (
                <ConsentModal
                  onAction={handleModalAction}
                  title="Are you sure you want to log out?"
                  action="Logout"
                />
              )}

              {isEditing && (
                <div className="mt-8">
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className={`w-full bg-[#F7941C] text-white py-2 px-4 rounded-xl font-medium transition-colors ${
                      isUpdating
                        ? "opacity-50 cursor-not-allowed"
                        : "active:bg-amber-600"
                    }`}
                    aria-label="Update profile"
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
