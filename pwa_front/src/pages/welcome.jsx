import { useState } from "react";
import { EllipsisVertical, User, LogOut, Copy, Check } from "lucide-react";
import menProfile from "../assets/images/man.png";
import womanProfile from "../assets/images/woman.png";
import { Link, useNavigate } from "react-router-dom";
import {ConsentModal} from "../components/Modal";
import brebootSvg from "../assets/svg/BrebootLogo.svg";
import useLogout from "../auth/Logout.Jsx";
import { useUser } from "../context/userContext";
import Loader from "../components/Loader";
import coin from "../assets/images/Coin_b.png"


const Welcome = () => {

    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const user = localStorage.getItem("userType");
    const gender = localStorage.getItem("GenderType");

    const { userData, loading } = useUser();
    const logout = useLogout();

    const handleConsent = (accepted) => {
        setShowModal(false);
        if (accepted) {
            navigate("/challenges");
        }
    };

    const handleDropdown = () => {
        setIsDropDownOpen(!isDropDownOpen)
    };

    const handleModalAction = (confirm) => {
        setShowLogoutModal(false);
        if (confirm) {
            navigate("/");
        }
    };

    const handleCopy = () => {
        const textToCopy = userData.code;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => console.error("Clipboard API failed: ", err));
        } else {
            // Fallback for older browsers and iOS Safari
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
        return <Loader />;
      }
    
      if (!userData) {
        return <div>No user data available. Please log in.</div>;
      }

    return (
        <div className="min-h-[100dvh] flex flex-col items-center pb-7">
            {/* Header */}
            <div className="w-full bg-[#F7941C] text-white flex items-center justify-between py-4 text-sm px-4 z-50">
                <div className="flex items-center space-x-2 font-semibold">
                    <p> {user === "Dr" ? "Doctor" : user} </p>
                </div>
                <div
                    onClick={handleDropdown}
                    className="relative">

                    <div className="flex items-center">
                        <button onClick={() => navigate("/redeem")} >
                            <img src={coin} alt="redeem-logo" className="w-6 h-auto" />
                        </button>
                        <button onClick={() => setIsDropDownOpen(!isDropDownOpen)} className="focus:outline-none">
                            <EllipsisVertical className="w-6 h-5" />
                        </button>
                    </div>

                    {/* Dropdown Menu */}
                    {isDropDownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg rounded-tr-none overflow-hidden z-50">
                            <button
                                onClick={() => navigate("/profile")}
                                className="w-full text-left px-4 py-3 text-gray-700 active:bg-gray-100 flex items-center gap-2">
                                <User className="w-4 h-4" /> Profile
                            </button>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-3 text-gray-700 active:bg-gray-100 flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    )}

                    {showLogoutModal && (
                        <ConsentModal
                            onAction={handleModalAction}
                            title="Are you sure you want to log out?"
                            action="Logout"
                        />
                    )}
                </div>
            </div>

            {/* Logo */}
            <div className="text-center mt-5">
                <img src={brebootSvg} alt="logo" className="w-auto h-14" />
            </div>

            {/* Profile Icon */}
            <div className="mt-3 mb-3 rounded-full overflow-hidden">
                {
                    gender === "male"
                        ? <img src={menProfile} className="w-24 h-24" alt="man-profile-icom" />
                        : <img src={womanProfile} className="w-24 h-24" alt="woman-prfile-icon" />
                }
            </div>

            {/* Welcome Text */}

            <h2 className="text-lg font-bold">Welcome back</h2>
            <p className="text-4xl text-black font-bold text-center px-3">{userData.name} !</p>
            {user === "Dr" && <div className="text-center">
                <button
                    onClick={handleCopy}
                    className="flex items-center justify-center mt-3 bg-gray-100 active:bg-gray-200 text-gray-600 py-1 rounded-xl w-full gap-3 px-5">
                    <p>{userData.code}</p>
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <p className="font-medium text-gray-900 pt-1">Your referral code</p>
            </div>}

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-5 mt-5 w-full px-6">
                {/* Action 1 - Challenge (Triggers Modal) */}
                {user === "Dr" && <button onClick={() => setShowModal(true)}>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 flex items-center justify-center bg-[#F7941C] text-white rounded-full">
                            <User className="w-10 h-10" />
                        </div>
                        <p className="mt-2 text-base text-black">#B-reboot Challenge</p>
                    </div>
                </button>}

                {/* Action 2 - Member Program */}
                <Link to={"/memberprogram"}>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 flex items-center justify-center bg-[#F7941C] text-white rounded-full">
                            <User className="w-10 h-10" />
                        </div>
                        <p className="mt-2 text-base text-black">Privileged Member</p>
                        <p className="text-base text-black">Program</p>
                    </div>
                </Link>

                {/* Action 3 - Free Diet Consultation */}
                <Link to={"/dietconsultation"}>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 flex items-center justify-center bg-[#F7941C] text-white rounded-full">
                            <User className="w-10 h-10" />
                        </div>
                        <p className="mt-2 text-base text-balck">Celebrity Diet</p>
                        <p className="text-base text-black">Consultation</p>
                    </div>
                </Link>
            </div>

            {/* Consent Modal */}
            {showModal && <ConsentModal title={"Consent Required"} subtitleOne={"By joining weekly challenges in the Breboot app, you consent to the app accessing your submitted photos and videos, which will remain confidential and not be shared without your permission"} onAction={handleConsent} action={"Accept & Continue"} />}
        </div>
    );
};

export default Welcome;
