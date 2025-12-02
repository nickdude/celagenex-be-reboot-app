import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Gift, CheckCircle } from "lucide-react";
import api, { BASE_IMAGE_URL } from "../utils/Api";
import toast from "react-hot-toast";

const RewardPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const reward = location.state;

  if (!reward) {
    return <div className="text-center text-red-500 font-medium">Reward not found!</div>;
  }

  const handleRedeem = async () => {
    try {
      const response = await api.post("/user/redeem", { rewardId: id });


      if (response.status === 400) {
        toast.error(response.data?.error || "Unable to redeem reward.");
        return;
      }

      if (response.status === 201) {
        toast.success("Reward redeemed successfully!");
        // Pass reward details to ThankYouPage
        navigate("/thankyou", { state: { rewardName: reward.name } });
      }
    } catch (error) {
      console.error("Error in Redeeming Reward:", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Not Enough Points");
        } else {
          toast.error(
            error.response.data?.message || "Not able to redeem reward. Please try again."
          );
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  const extractImagePath = (imageString) => {
    try {
      const cleanedString = decodeURIComponent(imageString).replace(/^\["|"\]$/g, "");
      return `${BASE_IMAGE_URL}/${cleanedString}`;
    } catch (error) {
      console.error("Error parsing image path:", error);
      return "";
    }
  };

  const imageUrl = extractImagePath(reward.reward_image);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Reward Image */}
      <div className="relative w-full h-96">
        <img src={imageUrl} alt={reward.name} className="w-full h-full object-contain" />
      </div>

      {/* Reward Details */}
      <div className="flex-1 px-4 py-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{reward.name}</h1>
          <p className="text-gray-600 text-sm">{reward.description}</p>

          <div className="mt-4 flex items-center gap-2 text-lg text-[#F7941C] font-bold">
            <Gift className="w-6 h-6" />
            <span>{reward.points} Points</span>
          </div>
        </div>

        {/* Redeem Button */}
        <div className="mt-auto pb-6">
          <button
            onClick={handleRedeem}
            className="w-full bg-[#F7941C] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium active:bg-amber-600"
          >
            <CheckCircle className="w-5 h-5" />
            Redeem Reward
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardPage;