import { User, Swords, CodeSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_IMAGE_URL } from "../utils/Api";
import coin from "../assets/images/Coin_b.png";


const ChallengeCard = ({ challenge, status }) => {
  const { weekId } = useParams();
  const navigate = useNavigate();

  let challengeImages = [];
  try {
    challengeImages = JSON.parse(challenge.challenge_images);
  } catch (error) {
    console.error("Error parsing challenge_images:", error);
  }


  return (
    <div className="bg-white rounded-2xl border border-black/15 shadow-sm mb-6 overflow-hidden flex items-center p-4">
      {/* Left Side: Image */}
      <img
        src={challengeImages.length > 0 ? `${BASE_IMAGE_URL}/${challengeImages[0]}` : ""}
        alt={challenge.name}
        className="w-24 h-24 object-contain rounded-lg mr-4"
      />

      {/* Right Side: Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">

          <h2 className="text-lg font-semibold text-gray-900">
            {challenge.name}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="flex justify-center items-center space-x-1">
              <img src={coin} alt="coin-image" className="w-3 h-auto" />
              <div className="text-xs">
                {challenge?.rewards || 0}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <User className="w-3 h-3" />
              {challenge.submissionCount}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">{challenge.shortDescription}</p>

        {/* Start/Completed Button */}
        <button
          onClick={() =>
            navigate(`/challenges/week/${weekId}/${challenge.id}`, {
              state: { challenge },
            })
          }
          className={`w-full py-2 px-4 rounded-xl text-white font-medium transition-all hover:opacity-90 ${status === "Completed"
            ? "bg-green-500 active:bg-green-600"
            : status === "Under Verification"
              ? "bg-yellow-500 active:bg-yellow-600"
              : status === "Disapproved"
                ? "bg-red-500 active:bg-red-600"
                : "bg-[#F7941C] active:bg-amber-600"
            } flex items-center justify-center gap-2`}
          disabled={status === "Completed" || status === "Under Verification"}
        >
          <span>{status}</span>
          {status === "Start" && <Swords className="w-4 h-4" />}

        </button>

      </div>
    </div>
  );
};

export default ChallengeCard;