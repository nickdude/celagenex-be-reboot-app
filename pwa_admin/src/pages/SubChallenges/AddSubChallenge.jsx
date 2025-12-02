import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Image } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../lib/utils";
import { Toaster, toast } from "react-hot-toast";

const AddSubChallenge = () => {
  const location = useLocation();
  const challengeData = location.state?.challengeData; // Passed challenge data
  const challengeId = challengeData?.id; // ✅ Use `challengeData.id`
  const navigate = useNavigate();

  // console.log("Location state:", location.state);
  // console.log(challengeData);
  // console.log(challengeId);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    shortDescription: "",
    weekId: "",
    descriptions: ["", "", ""],
    challenge_images: [null, null, null],
    rewards: "",
    status: "",
  });

  const [weeks, setWeeks] = useState([]); // Store available weeks
  const [loading, setLoading] = useState(true); // Loading state

  // ✅ Fetch Weeks Data
  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const response = await API.get("/admin/week"); // Adjust endpoint as needed
        setWeeks(response.data);
      } catch (error) {
        console.error("Error fetching weeks:", error);
        toast.error("Failed to load weeks.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeks();
  }, []);

  // ✅ Populate form data from passed challengeData
  useEffect(() => {
    if (challengeData) {
      setFormData({
        id: challengeData.id || "",
        name: challengeData.name || "",
        shortDescription: challengeData.shortDescription || "",
        weekId: challengeData.weekId || "",
        descriptions: Array.isArray(challengeData.descriptions)
          ? challengeData.descriptions
          : JSON.parse(challengeData.descriptions || "[]"),
        challenge_images: Array.isArray(challengeData.challenge_images)
          ? challengeData.challenge_images
          : JSON.parse(challengeData.challenge_images || "[]"), // ✅ Ensure it's an array
        rewards: challengeData.rewards || "",
        status: challengeData.status || "",
      });
    }
  }, [challengeData]);

  // ✅ Fetch challenge details if challengeId is provided
  useEffect(() => {
    if (challengeId) {
      const fetchChallengeData = async () => {
        try {
          const response = await API.get(`/admin/get/challenge/${challengeId}`);

          if (!response.data) {
            throw new Error("Invalid response data");
          }

          const challenge = response.data;

          // Safe parsing for descriptions
          let parsedDescriptions = ["", "", ""];
          if (challenge.descriptions) {
            if (typeof challenge.descriptions === "string") {
              try {
                parsedDescriptions = JSON.parse(challenge.descriptions);
              } catch (error) {
                parsedDescriptions = challenge.descriptions.includes(",")
                  ? challenge.descriptions.split(",").map((desc) => desc.trim()) // Ensure trimming spaces
                  : [challenge.descriptions];
              }
            } else if (Array.isArray(challenge.descriptions)) {
              parsedDescriptions = challenge.descriptions;
            }
          }

          // Safe parsing for challenge_images
          let parsedImages = [null, null, null];
          if (challenge.challenge_images) {
            if (typeof challenge.challenge_images === "string") {
              try {
                parsedImages = JSON.parse(challenge.challenge_images);
              } catch (error) {
                parsedImages = [challenge.challenge_images];
              }
            } else if (Array.isArray(challenge.challenge_images)) {
              parsedImages = challenge.challenge_images;
            }
          }

          // Fetch weeks to map weekId to weekName
          const weeksResponse = await API.get("/admin/week");
          const weekMap = {};
          weeksResponse.data?.forEach((week) => {
            weekMap[week.id] = week.name;
          });

          setFormData({
            id: challenge.id ?? null,
            name: challenge.name ?? "",
            shortDescription: challenge.shortDescription ?? "",
            weekId: challenge.weekId ?? "",
            weekName: weekMap[challenge.weekId] || "Unknown",
            descriptions: parsedDescriptions, // Ensure this is an array
            challenge_images: parsedImages,
            rewards: challenge.rewards ?? "",
            status: challenge.status ?? "",
          });
        } catch (error) {
          console.error("Error fetching challenge:", error);
          toast.error("Failed to fetch challenge data.");
        }
      };

      fetchChallengeData();
    }
  }, [challengeId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle description change
  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...formData.descriptions];
    updatedDescriptions[index] = value;
    setFormData({ ...formData, descriptions: updatedDescriptions });
  };

  // Handle image upload
  const handleImageChange = (index, file) => {
    setFormData((prev) => {
      const updatedImages = [...prev.challenge_images];

      if (file) {
        updatedImages[index] = file; // ✅ New file replaces existing one
      } else {
        updatedImages[index] = null; // ✅ Ensure removal is properly registered
      }

      return { ...prev, challenge_images: updatedImages };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Challenge Data:", formData);

    if (!formData.name || !formData.shortDescription || !formData.weekId) {
      toast.error("Name, Short Description, and Week are required.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      const challengeData = new FormData();
      challengeData.append("name", formData.name);
      challengeData.append("shortDescription", formData.shortDescription);
      challengeData.append("weekId", formData.weekId);
      challengeData.append("rewards", formData.rewards);
      challengeData.append("status", formData.status);
      challengeData.append(
        "descriptions",
        JSON.stringify(formData.descriptions)
      );

      console.log("Before Submitting:", formData.challenge_images);

      // Append images properly
      const updatedImages = [];

      formData.challenge_images.forEach((image, index) => {
        if (image instanceof File) {
          challengeData.append(`challenge_image${index + 1}`, image); // New image
        } else if (typeof image === "string" && image.trim() !== "") {
          updatedImages.push(image); // Store existing images correctly
        }
      });

      // 🚀 Ensure correct serialization (avoid double encoding)
      challengeData.append("challenge_images", JSON.stringify(updatedImages));

      // 🔍 Debugging: Log final FormData before submission
      console.log("Final FormData before submitting:");
      for (let pair of challengeData.entries()) {
        console.log(pair[0], pair[1]);
      }

      let response;
      if (formData.id) {
        response = await API.put(
          `/admin/update/challenge/${formData.id}`,
          challengeData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await API.post("/admin/challenge", challengeData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Server Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Challenge saved successfully!");
        setTimeout(() => navigate("/challenges/list"), 1000);
      }

      // Reset form
      setFormData({
        id: null,
        name: "",
        shortDescription: "",
        weekId: "",
        descriptions: ["", "", ""],
        challenge_images: [null, null, null],
        rewards: "",
        status: "",
      });
    } catch (error) {
      console.error("Error submitting challenge:", error);
      toast.error(
        error.response?.data?.message || "Error processing challenge."
      );
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" autoClose={3000} />
      <Helmet>
        <title>Breboot | Add Challenge</title>
        <meta name="Challenge Add" content="Add a new Challenge!" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {challengeData ? "Edit Challenge" : "Add New Challenge"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter Challenge name"
            required
          />
        </div>

        {/* Short Description */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter short description"
            required
          />
        </div>

        {/* Main Challenge Selection */}
        <div className="flex flex-col">
          {/* Week Dropdown */}
          <label className="block text-gray-700 font-medium">Week</label>
          <select
            name="weekId"
            value={formData.weekId}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 w-full mb-3"
            required
          >
            <option value="">Select Week</option>
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                {week.name}
              </option>
            ))}
          </select>
        </div>

        {/* Three Descriptions with Images */}
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex flex-col mb-4">
            {/* Description Input */}
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              Description {index + 1}
            </label>
            <textarea
              value={formData.descriptions[index] || ""}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              className="p-3 rounded-lg border border-gray-300 mb-3"
              placeholder={`Enter description ${index + 1}`}
              required
            />

            {/* Image Upload */}
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Image className="h-4 w-4 text-gray-400" />
              Upload Image {index + 1}
            </label>

            <div className="relative w-full">
              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                id={`challenge_image_${index}`}
                onChange={(e) => handleImageChange(index, e.target.files[0])}
                className="hidden"
              />

              <label
                htmlFor={`challenge_image_${index}`}
                className="flex items-center justify-center w-1/3 px-4 py-2 bg-gradient-to-r from-[#312d2e] via-[#f8bd77] to-[#f7941d] text-white text-sm font-medium rounded-lg cursor-pointer shadow-sm hover:bg-white hover:text-black hover:border transition-all duration-200"
              >
                Choose File
              </label>

              {/* Preview Selected Image */}
              {/* Preview Selected Image */}
              {formData.challenge_images[index] && (
                <div className="mt-2 flex items-center gap-2">
                  {typeof formData.challenge_images[index] === "string" ? (
                    <img
                      src={`https://2ej9ufdjyb.ap-south-1.awsapprunner.com/${formData.challenge_images[index]}`}
                      alt={`Challenge Image ${index + 1}`}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      Selected:{" "}
                      {formData.challenge_images[index]?.name ||
                        "Existing Image"}
                    </p>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="text-red-500 hover:underline"
                    onClick={() => handleImageChange(index, null)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Reward */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Reward
          </label>
          <input
            type="number"
            name="rewards"
            value={formData.rewards}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter reward Points"
            required
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-3 w-full bg-black text-white rounded-lg"
        >
          {challengeData ? "Update Challenge" : "Add Challenge"}
        </button>
      </form>
    </div>
  );
};

export default AddSubChallenge;
