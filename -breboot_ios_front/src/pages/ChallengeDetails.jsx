import { useState, useEffect } from "react"; // Added useEffect
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FileImage,
  FileVideo,
  User,
  Phone,
  Upload,
  X,
  Check,
  ChevronUpSquare,
  CodeSquare,
  CopySlash,
} from "lucide-react";
import challenge1 from "../assets/images/challenge1.png";
import challenge2 from "../assets/images/challenge2.png";
import steps from "../assets/images/steps-rb.png";
import { useUser } from "../context/userContext";
import api, { BASE_IMAGE_URL } from "../utils/Api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const ChallengeDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [message, setMessage] = useState(false);
  const { userData, fetchUserDetails } = useUser();
  const [isButtonLoading, setIsButtonLoading] = useState();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    userId: "",
    mediaFiles: [],
    previews: [],
    mediaType: "image",
    challengeId: "",
  });
  const [loading, setLoading] = useState(true); // Added loading state

  const navigate = useNavigate();
  const location = useLocation();
  const { challenge: ChallengeDetails } = location.state || {};

  // Fetch user details on mount
  useEffect(() => {
    const initializeUserData = async () => {
      if (!userData) {
        try {
          await fetchUserDetails(); // Fetch user data if not present
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.error("Failed to load user data.");
        }
      }
      setFormData((prev) => ({
        ...prev,
        name: userData?.name || "",
        phone: userData?.phone || "",
        userId: userData?.id || "",
        challengeId: ChallengeDetails?.id || "",
      }));
      setLoading(false);
    };
    initializeUserData();
  }, [userData, fetchUserDetails]);

  if (!ChallengeDetails) {
    return <p className="text-center text-gray-500">Challenge not found.</p>;
  }

  let challengeImages = [];
  try {
    challengeImages = JSON.parse(ChallengeDetails.challenge_images);
    if (!Array.isArray(challengeImages)) {
      challengeImages = [];
    }
  } catch (error) {
    console.error("Error parsing challenge_images:", error);
    challengeImages = [];
  }

  const finalImages = [
    challengeImages[0] || challenge1,
    challengeImages[1] || challenge2,
    challengeImages[2] || steps,
  ];

  const descriptionsWithDetails = (ChallengeDetails?.descriptions || []).map(
    (desc, index) => ({
      text: desc,
      imagePlaceholder: finalImages[index] || challenge1,
      side: index % 2 === 0 ? "left" : "right",
    })
  );

  const participation = [
    "Share your progress through images/videos",
    "Complete this challenge to earn reward",
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const isVideo = selectedFiles.some((file) =>
      file.type.startsWith("video/")
    );
    const isImage = selectedFiles.some((file) =>
      file.type.startsWith("image/")
    );

    if (isVideo && isImage) {
      toast.error("Please upload either images OR a single video.");
      return;
    }
    if (isVideo && selectedFiles.length > 1) {
      toast.error("You can upload only one video.");
      return;
    }
    if (isImage && formData.mediaFiles.length + selectedFiles.length > 5) {
      toast.error("You can select up to 5 images.");
      return;
    }

    setFormData({
      ...formData,
      mediaFiles: [...formData.mediaFiles, ...selectedFiles],
      previews: [
        ...formData.previews,
        ...selectedFiles.map((file) => URL.createObjectURL(file)),
      ],
      mediaType: isVideo ? "video" : "image",
    });
  };

  const removeFile = (index) => {
    const newFiles = [...formData.mediaFiles];
    const newPreviews = [...formData.previews];

    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setFormData({
      ...formData,
      mediaFiles: newFiles,
      previews: newPreviews,
    });
  };

  const handleSubmit = async () => {
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (formData.phone.length < 10) {
      toast.error("Phone number should not be less than 10 digits.");
      return;
    }

    if (!/^\d+$/.test(formData.phone)) {
      toast.error("Phone number should contain only numbers.");
      return;
    }

    if (!formData.mediaFiles.length) {
      toast.error("Please upload at least one file.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("phone", formData.phone);
    submissionData.append("remark", formData.message);
    submissionData.append("mediaType", formData.mediaType);
    submissionData.append("userId", formData.userId);
    submissionData.append("challengeId", formData.challengeId);
    formData.mediaFiles.forEach((file) => {
      submissionData.append("mediaFiles", file);
    });

    try {
      setIsButtonLoading(true);
      const response = await api.post("/user/challengeForm", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("data",response.data)

      if (response.status === 200 || response.status === 201) {
        setMessage(true);
        toast.success("Challenge submitted successfully!");
        setTimeout(() => {
          navigate("/challenges");
        }, 3000);
      } else {
        toast.error(response.data.message || "Failed to submit challenge.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting the challenge.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        {" "}
        <Loader /> Loading user data...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-4 z-20">
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-xl py-2 px-2 inline-flex gap-2">
            <button
              className={`relative px-8 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "details"
                  ? "bg-[#F7941C] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`relative px-8 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "submit"
                  ? "bg-[#F7941C] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("submit")}
            >
              Submit Challenge
            </button>
          </div>
        </div>
      </div>

      <div className="pt-10 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {ChallengeDetails.name}
          </h2>
          <p className="text-sm text-gray-500">
            {ChallengeDetails.shortDescription}
          </p>
        </div>

        {activeTab === "details" && (
          <div className="space-y-12 pb-10">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-8">
                Challenge Details
              </h3>
              <div className="space-y-12">
                {descriptionsWithDetails.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-8 ${
                      item.side === "right" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-amber-400/10 rounded-full">
                      <img
                        src={
                          item.imagePlaceholder
                            ? `${BASE_IMAGE_URL}/${item.imagePlaceholder}`
                            : challenge1
                        }
                        alt="Challenge illustration"
                        className="w-20 h-20"
                      />
                    </div>
                    <p className="flex-1 text-sm text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-orange-100 rounded-3xl p-8 text-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                How to Participate
              </h3>
              <ul className="space-y-4">
                {participation.map((point, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F7941C] text-white text-sm">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-gray-600">{point}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {activeTab === "submit" && (
          <div className="space-y-6">
            <div className="p-6">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                <User className="w-5 h-5 text-gray-500" />
                <input
                  className="ml-2 flex-1 bg-transparent text-gray-400 focus:outline-none text-sm"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  disabled
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  multiple={formData.mediaType === "image"}
                />
              </div>

              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                <Phone className="w-5 h-5 text-gray-500" />
                <input
                  className="ml-2 flex-1 bg-transparent focus:outline-none text-sm text-gray-700"
                  type="tel"
                  maxLength={10}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!!userData?.phone}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4"
                rows="3"
                placeholder="How was your experience? Let us Know!"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              ></textarea>

              <div>
                <label className="flex items-center gap-3 justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-4 cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload className="w-4 h-4 text-[#F7941C]" />
                  <div className="text-sm text-gray-600">
                    {formData.mediaFiles.length === 0
                      ? "Upload Image (max 5) or 1 Video"
                      : formData.mediaFiles[0]?.type.startsWith("video/")
                      ? "1 Video selected"
                      : `${formData.mediaFiles.length}/5 Images selected`}
                  </div>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple={
                      !formData.mediaFiles.some((file) =>
                        file.type.startsWith("video/")
                      )
                    }
                  />
                </label>

                {formData.previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {formData.previews.map((preview, index) => (
                      <div key={index} className="relative">
                        {formData.mediaFiles[index]?.type.startsWith(
                          "image/"
                        ) ? (
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={preview}
                            className="w-full h-24 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#F7941C] text-white py-3 rounded-xl mt-6 hover:opacity-90 transition-opacity flex items-center justify-center"
                disabled={isButtonLoading}
              >
                {isButtonLoading ? (
                  <>
                    <Loader isCenter={false} BorderColor="border-white" />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  "Submit Challenge"
                )}
              </button>

              {message && (
                <div className="border border-green-500 mt-4 py-3 rounded-md">
                  <p className="capitalize text-center text-sm text-green-600">
                    <div className="flex items-center justify-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      <div>Challenge Completed Successfully</div>
                    </div>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetails;
