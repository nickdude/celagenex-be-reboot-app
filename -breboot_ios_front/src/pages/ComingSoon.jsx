import { CreditCard } from "lucide-react";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ComingSoonProductPage = () => {

      const [userType, setUserType] = useState(null);
      const navigate = useNavigate();
    

    useEffect(() => {
        const user = localStorage.getItem("userType") || "Patient"; // Default to "Patient" if not set
        setUserType(user);
    
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          toast.error("Please log in to view member offers.");
          navigate("/login");
        }
      }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <div>
                <Header title={"Member Program"} icon={userType === "Dr" ? "Doctor" : userType} />
            </div>

            {/* Content Section */}
            <div className="px-4 py-6 flex-1 flex flex-col border-t border-gray-100 items-center justify-center">
                <div className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Product Coming Soon!</h1>
                    <p className="text-gray-600 text-sm">
                        We’re working to bring you amazing products. Stay tuned for more details!
                    </p>
                </div>
            </div>
            {/* Button Section */}
            <div className="p-4">
                <button
                    onClick={() => window.history.back()} // Simple back navigation
                    className="w-full bg-[#F7941C] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium active:bg-amber-600"
                >
                    <CreditCard className="w-5 h-5" />
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ComingSoonProductPage;