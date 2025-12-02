import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import coin from "../assets/images/Coin_b.png";
import { useUser } from '../context/userContext';
import toast from 'react-hot-toast';
import api, { BASE_IMAGE_URL } from '../utils/Api';
import { BottomNavBarRedeemRewards } from '../components/BottomNavBar';

const extractImagePath = (imageString) => {
  try {
    const cleanedString = decodeURIComponent(imageString).replace(/^\["|"\]$/g, "");
    return `${BASE_IMAGE_URL}/${cleanedString}`;
  } catch (error) {
    console.error("Error parsing image path:", error);
    return ""; // Return empty string if there's an error
  }
};

// Reward Card Component
const RewardCard = ({ id, name, points, reward_image, description, redeemedCount, isClaimed }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isClaimed) {
      navigate(`/reward/${id}`, { state: { id, name, points, reward_image, description, redeemedCount } });
    }
  };

  const imageUrl = extractImagePath(reward_image);

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-2xl shadow-sm group transition-all duration-300 ${
        isClaimed
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-md cursor-pointer'
      }`}
    >
      <div className="flex gap-3 p-3">
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <img src={imageUrl} alt={name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1">{name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm font-bold text-[#F7941C]">{points.toLocaleString()}</span>
            <span className="text-xs text-gray-500">points</span>
            <img src={coin} alt="coin-image" className="w-4 h-auto" />
          </div>
          {description && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{description}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{redeemedCount} claimed</span>
            </div>
          )}
          {isClaimed && (
            <span className="text-xs text-gray-600 mt-1 inline-block">Already Claimed</span>
          )}
        </div>
      </div>
    </div>
  );
};

const UserPoints = ({ points }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 mb-1">Available Points</p>
      <div className="flex items-center justify-center gap-2">
        <img src={coin} alt="coin-image" className="w-6 h-auto" />
        <p className="text-2xl font-bold text-[#F7941C]">{points}</p>
      </div>
    </div>
  </div>
);

const RedeemPage = () => {
  const { userData, fetchUserDetails, loading } = useUser();
  const [allRewards, setAllRewards] = useState([]);
  const [claimedRewardIds, setClaimedRewardIds] = useState([]);

  useEffect(() => {
    const initializeUserData = async () => {
      if (!userData) {
        try {
          await fetchUserDetails();
        } catch (error) {
          console.error("Error in fetching user data", error);
        }
      }
    };
    initializeUserData();
  }, [userData, fetchUserDetails]);

  useEffect(() => {
    const fetchAllRewards = async () => {
      try {
        const response = await api.get("/user/rewards");
        if (response?.data) {
          const activeRewards = response.data.filter(reward => reward.status === "Active");
          setAllRewards(activeRewards);
        } else {
          console.error("Invalid response structure", response);
          toast.error("Failed to load rewards.");
        }
      } catch (error) {
        console.error("Error fetching rewards", error);
        toast.error("Error fetching rewards.");
      }
    };

    const fetchClaimedRewards = async () => {
      try {
        const response = await api.get("/user/get/redeem");
        if (response?.data?.redeemedRewardIds) {
          setClaimedRewardIds(response.data.redeemedRewardIds);
        } else {
          console.error("Invalid claimed rewards structure", response);
          toast.error("Failed to load claimed rewards.");
        }
      } catch (error) {
        console.error("Error fetching claimed rewards", error);
        toast.error("Error fetching claimed rewards.");
      }
    };

    fetchAllRewards();
    fetchClaimedRewards();
  }, []);

  // Combine rewards with claimed status
  const rewardsWithClaimedStatus = allRewards.map(reward => ({
    ...reward,
    isClaimed: claimedRewardIds.includes(reward.id),
  }));

  return (
    <div className="min-h-screen text-gray-900 font-poppins">
      <Header title="Redeem Rewards" />

      <div className="px-4 py-4 pb-24">
        <UserPoints points={userData?.points || 0} />
        {/* Popular Rewards */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Rewards to redeem</h2>
          </div>
          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : rewardsWithClaimedStatus.length > 0 ? (
              <div className="flex flex-col gap-3">
                {rewardsWithClaimedStatus.map((reward) => (
                  <RewardCard key={reward.id} {...reward} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No active rewards available.</p>
            )}
          </div>
        </div>
      </div>
      <BottomNavBarRedeemRewards />
    </div>
  );
};

export default RedeemPage;