
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const useLogout = () => {
  const navigate = useNavigate();
  const { logout: clearUserData } = useUser(); 

  const logout = () => {
    // Clear stored data
    localStorage.removeItem("userType"); 
    localStorage.removeItem("authToken"); 
    localStorage.clear();

    // Clear context data
    clearUserData();

    navigate("/login");
  };
  return logout;
};

export default useLogout;
