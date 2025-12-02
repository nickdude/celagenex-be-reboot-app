
import React from 'react';
import { useNavigate } from 'react-router-dom';


const CategoryCard = ({ title, icon }) => (
    <div className="flex flex-col items-center gap-3 min-w-[90px] group cursor-pointer">
        <div className="w-[70px] h-[70px] rounded-2xl bg-white shadow-sm group-active:shadow-lg active:bg-gray-100 transition-all duration-300 flex items-center justify-center relative overflow-hidden">
            <div className="inset-0 bg-gradient-to-br from-white to-gray-50"></div>
            <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-sm font-medium text-gray-700 text-center">{title}</p>
    </div>
);

const BrandCard = ({ name, bgImage }) => (
    <div
        className="relative cursor-pointer group rounded-2xl overflow-hidden min-w-[180px] h-[110px]"
    >
        <img src={bgImage} alt={name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative flex items-center justify-center h-full bg-black/30 active:bg-black/40 bg-opacity-50">
            <h3 className="text-white font-bold text-lg">{name}</h3>
        </div>
    </div>
);


const ProductCard = ({ id, name, price, originalPrice, image, description, inStock }) => {
    const navigate = useNavigate();

    // Calculate discount percentage
    const discountPercentage = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    // Handle click only if in stock (optional, comment out if not desired)
    const handleClick = () => {
        if (inStock) {
            navigate(`/product/${id}`, {
                state: { id, name, price, originalPrice, image, discountPercentage, description },
            });
        }
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-sm group transition-all duration-300 min-w-[150px] border border-gray-200 ${inStock
                    ? "cursor-pointer active:shadow-lg"
                    : "cursor-not-allowed opacity-75"
                }`}
            onClick={handleClick}
        >
            {/* Image Section */}
            <div className="relative overflow-hidden rounded-t-2xl">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-[160px] object-contain transform transition-transform duration-500 ${inStock ? "group-active:scale-105" : ""
                        }`}
                />
                {/* Uncomment if you want to add a "Popular" badge */}
                {/* <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white shadow-sm">
              🔥 Popular
            </span>
          </div> */}
            </div>

            {/* Product Details */}
            <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>

                <div className="flex flex-col">
                    {/* Discounted Price */}
                    <span className="text-lg font-bold text-[#F7941C]">
                        ₹ {price.toLocaleString()}
                    </span>

                    {/* MRP with Discount */}
                    {originalPrice && discountPercentage > 0 && (
                        <span className="text-sm text-gray-500">
                            MRP ₹{originalPrice.toLocaleString()} @ {discountPercentage}% off
                        </span>
                    )}

                    {/* Stock Status */}
                    <span
                        className={`text-sm mt-1 ${inStock ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {inStock ? "" : "Out of Stock"}
                    </span>
                </div>
            </div>
        </div>
    );
};
export { ProductCard, BrandCard, CategoryCard };