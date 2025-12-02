import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { FileText, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import API from '../../lib/utils';
import { Toaster, toast } from "react-hot-toast";

const AddWeek = () => {
  const location = useLocation();
  const weekData = location.state?.weekData; // Data passed from list
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null, // Ensure ID is tracked for updates
    name: "",
    status: "",
  });

  // Populate form when weekData is available
  useEffect(() => {
    if (weekData) {
      setFormData({
        id: weekData.id || null,
        name: weekData.name || "",
        status: weekData.status || "",
      });
    }
  }, [weekData]);

  // Fetch data from API if weekData.id is provided
  useEffect(() => {
    if (weekData?.id) {
      const fetchWeekData = async () => {
        try {
          const response = await API.get(`/admin/get/week/${weekData.id}`);
          console.log(response.data);

          setFormData({
            id: response.data.id,
            name: response.data.name,
            status: response.data.status,
          });
        } catch (error) {
          console.error("Error fetching week data:", error);
          toast.error("Failed to fetch week data.", { position: "top-right" });
        }
      };

      fetchWeekData();
    }
  }, [weekData?.id]); // Use weekData.id as the dependency

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (POST for new, PUT for update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.status) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      const weekPayload = {
        name: formData.name,
        status: formData.status,
      };

      let response;

      if (formData.id) {
        // **Update existing week (PUT)**
        response = await API.put(`/admin/update/week/${formData.id}`, weekPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          toast.success("Week updated successfully!", {
            position: "top-right",
          });
          setTimeout(() => navigate("/week/list"), 1000);
        }
      } else {
        // **Add new week (POST)**
        response = await API.post("/admin/week", weekPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 201) {
          toast.success("Week added successfully!", { position: "top-right" });
          setTimeout(() => navigate("/week/list"), 1000);
        }
      }

      // Reset form after success
      setFormData({ id: null, name: "", status: "" });
    } catch (error) {
      console.error("Error submitting week:", error);
      toast.error(
        error.response?.data?.message ||
          "Error processing week. Please try again.",
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Breboot | Add Challenge</title>
        <meta name="Challenge Add" content="Add a new challenge!" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {weekData ? "Edit Week" : "Add New Week"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Challenge Title */}
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Title
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter Week"
            required
          />
        </div>

        {/* Description */}
        {/* <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter challenge description"
            required
          />
        </div> */}

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

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-3 w-full bg-black text-white rounded-lg"
        >
          {weekData ? "Update Week" : "Add Week"}
        </button>
      </form>
      <Toaster position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddWeek;
