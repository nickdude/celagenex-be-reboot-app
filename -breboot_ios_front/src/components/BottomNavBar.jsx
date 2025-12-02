import { HomeIcon, Dumbbell, History, Gift, Award } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

// Unified BottomNavBar component with variant support for three different nav bars
const BottomNavBar = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Define navigation items based on variant
  let navItems = [];
  
  if (variant === "default") {
    navItems = [
      { path: "/welcome", icon: HomeIcon, label: "Home" },
      { path: "/challenges", icon: Dumbbell, label: "Challenges" },
      { path: "/challengehistory", icon: History, label: "History" }
    ];
  } else if (variant === "memberProgram") {
    navItems = [
      { path: "/welcome", icon: HomeIcon, label: "Home" },
      { path: "/memberprogram", icon: Gift, label: "Member" },
      { path: "/pruchaseHistory", icon: History, label: "History" }
    ];
  } else if (variant === "redeemRewards") {
    navItems = [
      { path: "/welcome", icon: HomeIcon, label: "Home" },
      { path: "/redeem", icon: Award, label: "Rewards" },
      { path: "/redeemhistory", icon: History, label: "History" }
    ];
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 pb-5">
      <div className="flex justify-around items-center p-3 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center ${
              currentPath === item.path ? "text-[#F7941C]" : "text-gray-400"
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Export specific variants for backward compatibility and easier usage
const BottomNavBarMemberProgram = () => <BottomNavBar variant="memberProgram" />;
const BottomNavBarRedeemRewards = () => <BottomNavBar variant="redeemRewards" />;

export { BottomNavBar, BottomNavBarMemberProgram, BottomNavBarRedeemRewards };