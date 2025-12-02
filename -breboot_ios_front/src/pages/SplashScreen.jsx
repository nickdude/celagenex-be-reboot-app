import { useEffect, useState } from "react";
import brebootSvg from "../assets/svg/BrebootLogo.svg";
import ParentLogo from "../assets/images/Parent-Logo.png";

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const finishTimer = setTimeout(() => onFinish && onFinish(), 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-around bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Centered Logo */}
      <div className="flex items-center justify-center">
        <img src={brebootSvg} alt="Logo" className="w-72" />
      </div>

      {/* Parent Logo & Text at the Bottom */}
      <div className="pb-6 flex flex-col items-center text-gray-600 text-xs">
        <img src={ParentLogo} alt="Parent Logo" className="w-72 mb-2" />
        <p>Breboot is a health and wellness initiative by Celagenex</p>
        <p>and both domains and TM are owned by Celagenex</p>
      </div>
    </div>
  );
};

export default SplashScreen;
