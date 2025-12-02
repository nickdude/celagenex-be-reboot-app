import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideBackButton = location.pathname === "/";

  return (
    <div className="min-h-screen poppins-regular flex flex-col justify-between">
      {/* Main Container */}
      <div className="max-w-md mx-auto w-full bg-white min-h-screen">
        <Outlet />
      </div>
      {/* Back Button */}
      <div className="max-w-md">
        {!hideBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="fixed bottom-20 left-8 transform -translate-x-1/2 border border-[#F7941C]/50 text-sm p-1.5 rounded-full flex items-center gap-1 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Layout;
