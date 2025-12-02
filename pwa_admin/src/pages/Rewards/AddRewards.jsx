import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { FileText, CheckCircle, Image as ImageIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import API from "../../lib/utils";
import { Toaster, toast } from "react-hot-toast";

const AddRewards = () => {
  const location = useLocation();
  const rewardData = location.state?.rewardData; // Passed reward data
  const rewardId = location.state?.rewardId; // Passed reward ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    points: "",
    description: "",
    status: "",
    reward_image: null,
  });

  // Populate form data from passed rewardData
  useEffect(() => {
    if (rewardData) {
      setFormData({
        id: rewardData.id || "",
        name: rewardData.name || "",
        points: rewardData.points || "",
        description: rewardData.description || "",
        status: rewardData.status || "",
        reward_image: rewardData.reward_image || null,
      });
    }
  }, [rewardData]);

  // Fetch reward details if rewardId is provided
  useEffect(() => {
    if (rewardId) {
      const fetchRewardData = async () => {
        try {
          const response = await API.get(`/admin/get/reward/${rewardId}`);
          console.log(response.data);
          setFormData({
            id: response.data.reward.id,
            name: response.data.reward.name,
            points: response.data.reward.points,
            description: response.data.reward.description,
            status: response.data.reward.status,
            reward_image: response.data.reward.reward_image || null,
          });
        } catch (error) {
          console.error("Error fetching reward:", error);
          toast.error("Failed to fetch reward data.", {
            position: "top-right",
          });
        }
      };
      fetchRewardData();
    }
  }, [rewardId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData({ ...formData, reward_image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Reward Data:", formData);

    if (!formData.status) {
      toast.error("Please select a status.", { position: "top-right" });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      const rewardData = new FormData();
      rewardData.append("status", formData.status);
      rewardData.append("name", formData.name);
      rewardData.append("points", formData.points);
      rewardData.append("description", formData.description);

      // Handle Image: If no new file is selected, keep the existing image URL
      if (formData.reward_image && typeof formData.reward_image !== "string") {
        rewardData.append("reward_image", formData.reward_image);
      } else if (typeof formData.reward_image === "string") {
        rewardData.append("existing_reward_image", formData.reward_image); // Send existing image URL
      }

      let response;
      if (formData.id) {
        response = await API.put(
          `/admin/update/reward/${formData.id}`,
          rewardData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await API.post("/admin/reward", rewardData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Server Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Reward saved successfully!", { position: "top-right" });
        setTimeout(() => navigate("/rewards/list"), 1000);
      }

      // Reset form
      setFormData({
        id: null,
        name: "",
        points: "",
        description: "",
        status: "",
        reward_image: null,
      });
    } catch (error) {
      console.error("Error submitting reward:", error);
      toast.error(error.response?.data?.message || "Error processing reward.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" autoClose={3000} />
      <Helmet>
        <title>Breboot | Add Reward</title>
        <meta name="Challenge Add" content="Add a new challenge!" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {rewardData ? "Edit Reward" : "Add New Reward"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Reward Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Reward Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter reward name"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-gray-400" />
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter reward description"
            required
          />
        </div>

        {/* Points */}
        <div className="flex flex-col">
          <label
            htmlFor="points"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Points
          </label>
          <input
            type="number"
            name="points"
            id="points"
            value={formData.points}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter points"
            required
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Status
          </label>
          <select
            name="status"
            id="status"
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

        {/* Image Upload */}
        <div className="flex flex-col">
          <label
            htmlFor="reward_image"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4 text-gray-400" />
            Image
          </label>

          {/* Hidden Input */}
          <input
            type="file"
            name="reward_image"
            id="reward_image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            required={!rewardData}
          />

          {/* Styled Button Label */}
          <label
            htmlFor="reward_image"
            className="flex items-center justify-center w-1/3 px-4 py-2 bg-gradient-to-r from-[#312d2e] via-[#f8bd77] to-[#f7941d] text-white text-sm font-medium rounded-lg cursor-pointer shadow-sm hover:bg-white hover:text-black hover:border transition-all duration-200"
          >
            Choose File
          </label>

          {/* Preview Image */}
          {formData.reward_image && (
            <img
            src={`https://2ej9ufdjyb.ap-south-1.awsapprunner.com/${formData.reward_image}`}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-3 w-full bg-black text-white rounded-lg"
        >
          {rewardData ? "Update Reward" : "Add Reward"}
        </button>
      </form>
    </div>
  );
};

export default AddRewards;
