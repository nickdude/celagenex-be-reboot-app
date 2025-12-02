import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { FileText,  CheckCircle, ImageIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";

const AddRewardCategory = () => {
  const location = useLocation();
  const RewardCategoryData = location.state?.RewardCategoryData;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    status: "",
  });

  useEffect(() => {
    if (RewardCategoryData) {
      setFormData({
        title: RewardCategoryData.title || "",
        image: RewardCategoryData.image || "",
        status: RewardCategoryData.status || "",
      });
    }
  }, [RewardCategoryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };


  return (
    <div className="p-6">
      <Helmet>
        <title>Breboot | Add Reward Category</title>
        <meta name="Reward Category Add" content="Add a new reward category!" />
      </Helmet>
      
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {RewardCategoryData ? "Edit Reward Category" : "Add New Reward Category"}
      </h1>
      <form className="space-y-6 max-w-2xl mx-auto">
        {/* Challenge Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter reward category title"
            required
          />
        </div>

        {/* image/icon */}
        <div className="flex flex-col">
          <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-gray-400" />
            Icon/Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter challenge description"
            required
          />
          {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}

        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
            <option value="" disabled>Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="px-6 py-3 w-full bg-black text-white rounded-lg">
          {RewardCategoryData ? "Update Reward Category" : "Add Reward Category"}
        </button>
      </form>
    </div>
  );
};

export default AddRewardCategory;
