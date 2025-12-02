import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import { BottomNavBar } from "../components/BottomNavBar";
import api from "../utils/Api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const ChallengesPage = () => {
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [completedChallengeIds, setCompletedChallengeIds] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoading(true);

        // Fetch all weeks
        const weeksResponse = await api.get("/user/weeks");
        const weeksData = weeksResponse.data || [];
        const activeaWeeks = weeksResponse.data.filter(week => week.status === "Active");

        // Fetch completed challenges (handling 404 error separately)
        let completedIds = [];
        try {
          const completedResponse = await api.get("/user/allchallengeForms");
          completedIds = Array.isArray(completedResponse?.data)
            ? completedResponse.data.map((item) => ({
              challengeId: item.challengeId,
              isVerified: item.isVerified,
            }))
            : [];
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn("No completed challenges found, treating as empty.");
          } else {
            console.error("Error fetching completed challenges:", error);
            throw error;
          }
        }

        setCompletedChallengeIds(completedIds);

        // Fetch challenges for each week and calculate progress
        const updatedWeeks = await Promise.all(
          weeksData.map(async (week) => {
            try {
              const challengesResponse = await api.get(
                `/user/challenges/${week.id}`
              );
              const challenges = challengesResponse.data || [];

              // Calculate the number of completed challenges for this week
              const completedInWeek = challenges.filter((challenge) =>
                completedIds.some((completed) => completed.challengeId === challenge.id && completed.isVerified === true)).length;

              // Calculate progress percentage
              const totalChallenges = challenges.length;
              const progress =
                totalChallenges > 0
                  ? Math.round((completedInWeek / totalChallenges) * 100)
                  : 0;

              return { ...week, progress }; // Add progress to week object
            } catch (error) {
              console.error(
                `Error fetching challenges for week ${week.id}:`,
                error
              );
              return { ...week, progress: 0 }; // Fallback to 0% on error
            }
          })
        );

        setWeeks(updatedWeeks);
      } catch (error) {
        console.error("Error in fetching challenges", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []); // Empty dependency array since we only fetch once on mount

  return (
    <div className="min-h-screen poppins-regular">
      <Header title="Weekly Challenges" />
      <div className="px-4 py-4 pb-24">
        <h2 className="font-semibold text-lg pb-4 text-gray-700">Select a Week</h2>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            {weeks.filter((week) => week.status === "Active").length > 0 ? (
              weeks
                .filter((week) => week.status === "Active")
                .map((week) => (
                  <div
                    key={week.id}
                    className="bg-white rounded-2xl border border-black/15 shadow-sm mb-6 p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {week.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {week.progress}% Completed
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <ProgressBar progress={week.progress} />

                    {/* Join Button */}
                    <button
                      onClick={() =>
                        navigate(`/challenges/week/${week.id}`, {
                          state: { weekName: week.name, completedChallengeIds },
                        })
                      }
                      className="w-full mt-6 py-2 px-4 rounded-xl text-white font-medium transition-all hover:opacity-90 bg-[#F7941C] active:bg-amber-600"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div>Join Weekly Challenges</div>
                      </div>
                    </button>
                  </div>
                ))
            ) : (
              <div className="text-center text-gray-600 font-medium mt-10">
                No active challenges available.
              </div>
            )}
          </div>
        )}

      </div>
      <BottomNavBar />
    </div>
  );
};

export default ChallengesPage;
