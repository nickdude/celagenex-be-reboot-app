import { useEffect, useState } from "react";
import { EllipsisVertical, User, LogOut, Copy, Check, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import redeem from "../assets/images/redeem-bg.png";
import brebootSvg from "../assets/svg/BrebootLogo.svg";
import coin from "../assets/images/coin-br.gif";
import { ConsentModal } from "../components/Modal";
import useLogout from "../auth/Logout.Jsx";
import { useUser } from "../context/userContext";
import Loader from "../components/Loader";
import redeem from "../assets/images/Coin_b.png";

const FirstLogin = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const logout = useLogout();
  const { userData, loading } = useUser();

  // Redirect if no user data after loading
  useEffect(() => {
    if (!loading && !userData) {
      navigate("/", { replace: true });
    }
  }, [loading, userData, navigate]);

  const handleDropdown = () => setIsDropDownOpen(!isDropDownOpen);
  const handleLogout = () => setShowLogoutModal(true);

  const handleCopy = () => {
    if (!userData?.code) return; // Prevent copy if no code

    const textToCopy = userData.code;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Clipboard API failed: ", err));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <Loader />  
        );
  }

  if (!userData) {
    return null; // This won't render as useEffect will redirect
  }

  return (
    <div className="min-h-screen">
      <div className="w-full bg-[#F7941C] text-white flex items-center justify-between py-4 text-sm px-4 z-50">
        <div className="flex items-center space-x-2 font-semibold">
          <p>{userType === "Dr" ? "Doctor" : userType || "User"}</p>
        </div>
        <div onClick={handleDropdown} className="relative">
          <div className="flex items-center">
            <button onClick={() => navigate("/redeem")}>
              <img src={redeem} alt="redeem-logo" className="w-5 h-auto" />
            </button>
            <button onClick={() => setIsDropDownOpen(!isDropDownOpen)} className="focus:outline-none">
              <EllipsisVertical className="w-6 h-5" />
            </button>
          </div>

          {isDropDownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg rounded-tr-none overflow-hidden z-50">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-3 text-gray-700 active:bg-gray-100 flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-gray-700 active:bg-gray-100 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}

          {showLogoutModal && (
            <ConsentModal
              onAction={logout}
              title="Are you sure you want to log out?"
              action="Logout"
            />
          )}
        </div>
      </div>

      <main className="flex flex-col items-center justify-center max-w-md mx-auto px-4 pt-12 pb-8">
        <div className="flex justify-center mb-10">
          <img src={brebootSvg} alt="logo" className="h-24" />
        </div>

        <div className="text-center mb-10">
          <h2 className="text-gray-600 font-medium mb-2">Welcome</h2>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{userData.name || "User"}</h1>

          {userType === "Dr" && (
            <div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 active:bg-gray-200 text-gray-600 transition-colors gap-2"
              >
                {userData.code || "No Code"}
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <p className="font-medium text-gray-900 pt-1">Your referral code</p>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <img src={coin} alt="Coin-SVG" className="w-60 h-auto mx-auto" />
        </div>

        <div className="rounded-lg text-3xl font-semibold p-3 text-center text-[#F7941C]">
          <p>You have earned</p>
          <p>{userData.points || 0} Points!</p>
        </div>

        <button
          onClick={() => navigate("/welcome")}
          className="flex items-center justify-center gap-3 border w-40 mt-5 border-[#F7941C] active:bg-amber-600/30 bg-amber-600/20 text-gray-700 font-semibold px-3 py-2 rounded-xl"
        >
          <div>Continue</div>
          <div>
            <MoveRight />
          </div>
        </button>
      </main>
    </div>
  );
};

export default FirstLogin;