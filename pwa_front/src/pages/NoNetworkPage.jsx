import React from "react";
import { WifiOff } from "lucide-react";

const NoNetworkPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center poppins-regular">
            <div><WifiOff size={36} className="text-gray-400 my-4" /></div>
            <h1 className="text-2xl font-bold text-gray-500">No Internet Connection</h1>
            <p className="text-gray-400 mt-2">Please check your internet and try again.</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#F7941C] text-white px-6 py-2 rounded-md"
            >
                Retry
            </button>
        </div>
    );
};

export default NoNetworkPage;
