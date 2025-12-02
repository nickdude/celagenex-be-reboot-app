import React, { useState, useEffect } from "react";
import { CategoryCard, ProductCard, BrandCard } from "../components/cards";
import { BottomNavBarMemberProgram } from "../components/BottomNavBar";
import Header from "../components/Header";
import api from "../utils/Api";
import Loader from "../components/Loader";
import { BASE_IMAGE_URL } from "../utils/Api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const MemberProgramPage = () => {
  const [userType, setUserType] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Added for error state
  const navigate = useNavigate();
  const { userData } = useUser();

  useEffect(() => {
    const user = localStorage.getItem("userType") || "Patient"; // Default to "Patient" if not set
    setUserType(user);

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Please log in to view member offers.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state
        const response = await api.get("user/products");
        setProductDetails(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        toast.error("Unable to fetch products.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const getDisplayPrice = (product) => {
    // If the user is NOT a doctor and doesn't have a code, use priceForUser if it exists
    if (userType !== "Dr" && !userData?.code) {
      return product.priceForUser || product.price;
    }
    return product.price;
  };


  const getDiscountPercentage = (product) => {
    if (!product.oldPrice || product.oldPrice <= product.price) return 0;
    return ((1 - product.price / product.oldPrice) * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen text-gray-900 font-poppins">
      <div>
        <Header title={"Member Program"} icon={userType === "Dr" ? "Doctor" : userType} />
      </div>

      <div className="px-4 py-4 pb-24">
        {/* Products */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Exclusive Member Offers</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-x-auto no-scrollbar pb-2">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <p className="text-red-500 text-center mt-10">{error}</p>
            ) : productDetails.filter((product) => product.status === "Active").length > 0 ? (
              productDetails
                .filter((product) => product.status === "Active")
                .map((product) => {
                  const displayPrice = getDisplayPrice(product);  // Updated to use the new logic
                  const discountPercentage = getDiscountPercentage(product);
                  const imageUrl = product.product_image
                    ? `${BASE_IMAGE_URL}/${product.product_image.replace(/^"|"$/g, "")}`
                    : "/fallback-image.jpg";

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={displayPrice}
                      originalPrice={product.oldPrice || null}
                      image={imageUrl}
                      discount={discountPercentage > 0 ? `${discountPercentage}% OFF` : null}
                      description={product.description}
                      inStock={product.inStock}
                    />
                  );
                })
            ) : (
              <p className="text-gray-500 text-center mt-10">No active products available.</p>
            )}
          </div>
        </div>
      </div>

      <BottomNavBarMemberProgram />
    </div>
  );
};

export default MemberProgramPage;