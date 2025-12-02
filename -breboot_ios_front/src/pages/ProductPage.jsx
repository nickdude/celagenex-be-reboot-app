import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useId } from "react";
import { CreditCard } from "lucide-react";
import { useUser } from "../context/userContext";
import toast from "react-hot-toast";
import api from "../utils/Api";
import Loader from "../components/Loader";
import PayUPayment from "../pages/PayUPayment";


const ProductPage = () => {
    const { id } = useParams();
    const userType = localStorage.getItem("userType") || "Patient";
    const [copied, setCopied] = useState(false);
    const [doctorCode, setDoctorCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(userType === "Dr" ? 5 : 2);
    const [hash, setHash] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [showPaymentForm, setShowPaymentForm] = useState(false); // New state to control PayUPayment rendering

    const { userData, fetchUserDetails } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state || null;

    const BASE_URL = "http://192.168.1.11:4040";
    const FRONTEND_URL = "http://localhost:3000";

    const userId = userData?.id || ""  // Use optional chaining and fallback value



    const data = {
        txnid: `TXN_${id}_${Date.now()}`,
        amount: (product.price * quantity).toFixed(2),
        productinfo: product.name,
        firstname: userData?.name || "Guest",
        email: userData?.email || "guest@example.com",
        phone: "1234567890",
        status: "success",
        quantity: quantity,
        userId: userData?.id,
        userType: userData?.userType,
    };

    useEffect(() => {
        const initializeUserData = async () => {
            try {
                if (!userData) {
                    await fetchUserDetails();
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error("Failed to load user data.");
            }
        };
        initializeUserData();
    }, [fetchUserDetails]);

    useEffect(() => {
        if (userData?.code) {
            setDoctorCode(userData.code);
        }
    }, [userData]);

    const handleGetHash = async () => {
        try {
            setIsLoading(true);
            const response = await api.post("/auth/user/hash", data);
            setHash(response.data.hash.hash);
            setTransactionId(response.data.hash.txnid);
            // setShowPaymentForm(true);
        } catch (error) {
            console.error("Error in generating hash", error);
            toast.error("Failed to initiate payment.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleGetHash();
    };

    if (!product) {
        return (
            <div className="text-center text-red-500 font-medium">
                {isLoading ? <Loader /> : "Product not found!"}
            </div>
        );
    }

    const handleTempPayment = async () => {
        try {
            setIsLoading(true);
            const response = await api.post("/auth/user/success", data);

            if (response.status === 200) {
                toast.success("Payment successful!");

                // Map response data to orderDetails structure expected by ThankYouPage
                const orderDetails = {
                    orderId: response.data.paymentData.txnid, // Use txnid as orderId
                    product: {
                        name: response.data.paymentData.productinfo, // Product name
                        price: `₹${parseFloat(response.data.paymentData.amount).toLocaleString()}`, // Formatted price
                        quantity: quantity, // From ProductPage state
                        image: product.image, // From ProductPage state
                    },
                };
                // Navigate to ThankYouPage with the mapped data
                navigate("/thankyou", { state: { orderDetails } });
            }
        } catch (error) {
            console.error("Error in processing payment", error);
            toast.error("Error in processing payment.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!userData) {
        return <Loader />;  // Show loader while user data is being fetched
    }


    const handleBuyNow = async () => {
        const productData = {
            productId: product.id,
            quantity,
            price: product.price,
            amount: (product.price * quantity).toFixed(2),
            name: product.name,
            image: product.image
        };

        try {
            const response = await api.post("/auth/user/order", productData);

            if (response?.status === 201 && response.data?.order) {
                const orderDetails = response.data.order;

                navigate("/payment", {
                    state: {
                        productData,
                        orderId: orderDetails.orderId,
                        orderStatus: orderDetails.status,
                        orderAmount: orderDetails.amount,
                        orderQuantity: orderDetails.quantity
                    }
                });

                toast.success("Order created successfully!");
            } else {
                throw new Error("Failed to create order");
            }
        } catch (error) {
            console.error("Error in creating order:", error);
            toast.error("Error in creating order");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="relative w-full h-96">
                {isLoading ? (
                    <Loader />
                ) : (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                )}
                {product.discountPercentage > 0 && !isLoading ? (
                    <div className="absolute top-4 left-4 bg-[#F7941C] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {product.discountPercentage}% OFF
                    </div>
                ) : null}
            </div>
            <div className="px-4 py-6 flex-1 flex flex-col justify-between border-t border-gray-100">
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-[#F7941C]">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.discountPercentage > 0 && (
                                <span className="text-lg text-gray-500 line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        {userType === "Patient" && doctorCode && (
                            <div className="bg-orange-50 p-4 rounded-xl">
                                <h3 className="font-semibold text-gray-900 mb-2">Doctor's Referral Code</h3>
                                <input
                                    type="text"
                                    value={doctorCode}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-white rounded-lg border border-blue-200 text-gray-700"
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                            <span className="font-medium text-gray-700">Quantity</span>
                            <div className="flex items-center gap-4">
                                <button
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg active:bg-gray-100"
                                    onClick={() => setQuantity((q) => (q > (userType === "Dr" ? 5 : 2) ? q - 1 : q))}
                                    disabled={isLoading}
                                >
                                    -
                                </button>
                                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                                <button
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg active:bg-gray-100"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    disabled={isLoading}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="p-4">
                    {/* <button
                        onClick={handleSubmit}
                        // onClick={handleTempPayment}
                        className="w-full bg-[#F7941C] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium active:bg-amber-600"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader isCenter={false} BorderColor="border-white" />
                                Proceeding Payment...
                            </div>
                        ) : (
                            <div className="flex justify-center items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Buy Now • ₹{(product.price * quantity).toLocaleString()}
                            </div>
                        )}
                    </button> */}

                    <button
                        onClick={handleBuyNow}
                        className="w-full bg-[#F7941C] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium mt-4"
                    >
                        <CreditCard className="w-5 h-5" /> Buy Now • ₹{(product.price * quantity).toLocaleString()}
                    </button>

                </div>
            </div>
            {/* Render PayUPayment outside the button when showPaymentForm is true */}
            {showPaymentForm && (
                <PayUPayment setToggle={setShowPaymentForm} form={data} hash={hash} transactionId={transactionId} />
            )}
        </div>
    );
};

export default ProductPage;