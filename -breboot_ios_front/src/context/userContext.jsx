import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/Api";
import toast from "react-hot-toast"; // Optional: for user feedback

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const PUBLIC_ROUTES = ["/", "/login", "/termsandcondition", "/privacypolicy", "/refund"];

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No auth token found");
      }
      const response = await api.get("/user/getuserdetails");
      setUserData(response.data.user);
      localStorage.setItem("GenderType", response.data.user.gender);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setUserData(null);

      if (!PUBLIC_ROUTES.includes(location.pathname)) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route.toLowerCase()));

    if (token) {
      fetchUserDetails();
    } else {
      setUserData(null);
      setLoading(false);
      if (!isPublicRoute) {
        navigate("/");
      }
    }
  }, [navigate, location.pathname]);

  const logout = () => {
    setUserData(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("GenderType"); // Clean up other stored data
    localStorage.removeItem("userType");
    setLoading(false);
    navigate("/"); // Redirect to "/" on explicit logout
    toast.success("Logged out successfully"); // Optional feedback
  };

  return (
    <UserContext.Provider
      value={{ userData, setUserData, loading, logout, fetchUserDetails }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};