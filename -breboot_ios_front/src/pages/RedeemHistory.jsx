import React, { useState, useEffect } from 'react';
import { BottomNavBarRedeemRewards } from '../components/BottomNavBar';
import Header from '../components/Header';
import { Calendar, Gift, FileText, Clock, ExternalLink, Check } from 'lucide-react';
import api, { BASE_IMAGE_URL } from '../utils/Api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import coin from "../assets/images/Coin_b.png";

const extractImagePath = (imageString) => {
  try {
    // Remove surrounding brackets and decode URL components
    const cleanedString = decodeURIComponent(imageString)
      .replace(/^\[\"|\"\]$/g, "");

    return `${BASE_IMAGE_URL}/${cleanedString}`;
  } catch (error) {
    console.error("Error parsing image path:", error);
    return ""; // Return empty string if there's an error
  }
};

const RewardCard = ({ reward }) => {
  const [expanded, setExpanded] = useState(false);
  const imageUrl = extractImagePath(reward.reward_image);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm">{reward.name}</h3>
          <div className="flex flex-wrap gap-4 mt-1">
            <div className="flex items-center gap-1">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                {new Date(reward.redeemedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Gift size={16} className="text-[#F7941C]" />
              <span className="text-xs text-gray-500">{reward.points} points</span>
              <img src={coin} alt="coin" className="w-3 h-3" />
            </div>
            {/* <div className="flex items-center gap-1">
              <Clock size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500 capitalize">{reward.status}</span>
            </div> */}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[#F7941C] font-medium flex items-center gap-1 ml-2"
        >
          {expanded ? 'Show less' : 'View details'}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 border-t pt-3 border-gray-100">
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={imageUrl} alt={reward.name} className="w-full h-full object-contain" onError={(e) => e.target.src = '/placeholder-image.jpg'} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Description:</p>
              <p className="text-sm text-gray-700 break-words">{reward.description || 'No description available'}</p>
              
              {reward.status === 'Completed' && (
                <div className="mt-2 flex items-center text-green-600">
                  <Check size={16} className="mr-1" />
                  <span className="text-xs">Redeemed successfully</span>
                </div>
              )}
              
              {reward.status === 'Processing' && (
                <div className="mt-2 flex items-center text-amber-600">
                  <Clock size={16} className="mr-1" />
                  <span className="text-xs">Processing your reward</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Gift size={24} className="text-gray-400" />
    </div>
    <h3 className="text-gray-800 font-medium mb-1">No rewards redeemed yet</h3>
    <p className="text-gray-500 text-sm text-center">
      Redeem rewards to see your redemption history here
    </p>
  </div>
);

const RewardHistory = () => {
  const [redeemHistory, setRedeemHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/user/get/redeem`);

        const dataArray = Array.isArray(response.data) ? response.data
          : Array.isArray(response.data?.redeemedRewardDetails) ? response.data.redeemedRewardDetails
            : [response.data]; 
        
        // Transform the data if needed
        const transformedData = dataArray.map(item => ({
          id: item.id,
          name: item.rewardName || item.name,
          points: item.points,
          status: item.status || 'Completed',
          redeemedAt: item.createdAt || item.redeemedAt,
          description: item.description,
          reward_image: item.reward_image
        }));

        setRedeemHistory(transformedData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen text-gray-900 font-poppins bg-gray-50">
      <Header title="Redemption History" />

      <div className="px-4 py-4 pb-24">
        {loading ? (
          <Loader />
        ) : redeemHistory.length > 0 ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Your Redemptions</h2>
              <p className="text-sm text-gray-500">View your reward redemption history</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {redeemHistory.map(reward => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      <BottomNavBarRedeemRewards />
    </div>
  );
};

export default RewardHistory;