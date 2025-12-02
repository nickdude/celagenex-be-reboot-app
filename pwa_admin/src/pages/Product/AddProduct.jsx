import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  FileText,
  CheckCircle,
  IndianRupee,
  Image as ImageIcon,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import API from "../../lib/utils";
import { Toaster, toast } from "react-hot-toast";

const AddProduct = () => {
  const location = useLocation();
  const productData = location.state?.productData; // Passed product data
  const productId = location.state?.productId; // Passed product ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null, // Ensure ID is tracked for updates
    name: "",
    description: "",
    oldPrice: "",
    status: "",
    product_image: null,
    inStock: true,
  });

  // Populate form data from passed productData
  useEffect(() => {
    if (productData) {
      setFormData({
        id: productData.id || "",
        name: productData.name || "",
        description: productData.description || "",
        oldPrice: productData.oldPrice || "",
        status: productData.status || "",
        product_image: productData.product_image || "",
        inStock: productData.inStock ?? true,
      });
    }
  }, [productData]);

  // Fetch product details if productId is provided
  useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        try {
          const response = await API.get(`/admin/get/product/${productId}`);
          console.log(response.data);
          setFormData({
            id: response.data.product.id,
            name: response.data.product.name,
            description: response.data.product.description,
            oldPrice: response.data.product.oldPrice,
            status: response.data.product.status,
            product_image: response.data.product.product_image || null,
            inStock: response.data.product.inStock ?? true,
          });
        } catch (error) {
          console.error("Error fetching product:", error);
          toast.error("Failed to fetch product data.", {
            position: "top-right",
          });
        }
      };
      fetchProductData();
    }
  }, [productId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Product Data:", formData);

    if (!formData.status) {
      toast.error("Please select a status.", { position: "top-right" });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      const productData = new FormData();
      productData.append("status", formData.status);
      productData.append("inStock", formData.inStock);

      if (formData.name) productData.append("name", formData.name);
      if (formData.description)
        productData.append("description", formData.description);
      if (formData.oldPrice) productData.append("oldPrice", formData.oldPrice);

      // Log and Append Image
      if (
        formData.product_image &&
        typeof formData.product_image !== "string"
      ) {
        console.log("ewfwfwefewfwefe", formData.product_image);
        productData.append("product_image", formData.product_image);
      }

      let response;
      if (formData.id) {
        response = await API.put(
          `/admin/update/product/${formData.id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await API.post("/admin/product", productData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Server Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Product saved successfully!", { position: "top-right" });
        setTimeout(() => navigate("/product/list"), 1000);
      }

      // Reset form
      setFormData({
        id: null,
        name: "",
        description: "",
        oldPrice: "",
        status: "",
        product_image: null,
        inStock: true,
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(
        error.response?.data?.message || "Error processing product.",
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" autoClose={3000} />
      <Helmet>
        <title>Breboot | Add Product</title>
        <meta name="Product Add" content="Add a new Product!" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {productData ? "Edit Product" : "Add New Product"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Product Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-gray-400" />
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter product name"
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
            placeholder="Enter product description"
            required
          />
        </div>

        {/* Old Price */}
        <div className="flex flex-col">
          <label
            htmlFor="oldPrice"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <IndianRupee className="h-4 w-4 text-gray-400" />
            Old Price
          </label>
          <input
            type="number"
            name="oldPrice"
            id="oldPrice"
            value={formData.oldPrice}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            placeholder="Enter Old Price"
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
        {/* Image Upload */}
        <div className="flex flex-col">
          <label
            htmlFor="product_image"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4 text-gray-400" />
            Product Image
          </label>

          {/* Hidden file input */}
          <input
            type="file"
            name="product_image"
            id="product_image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Custom "Choose File" button */}
          <label
            htmlFor="product_image"
            className="flex items-center justify-center w-1/3 px-4 py-2 bg-gradient-to-r from-[#312d2e] via-[#f8bd77] to-[#f7941d] text-white text-sm font-medium rounded-lg cursor-pointer shadow-sm hover:bg-white hover:text-black hover:border transition-all duration-200"
          >
            Choose File
          </label>

          {/* Image preview */}
          {formData.product_image && (
            <img
              src={`https://2ej9ufdjyb.ap-south-1.awsapprunner.com/${formData.product_image}`}
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
          {productData ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
