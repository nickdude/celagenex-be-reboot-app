import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { Helmet } from "react-helmet-async";
import API from "../../lib/utils";
import { Toaster, toast } from "react-hot-toast";

const ListSubChallenge = () => {
  const navigate = useNavigate();
  const [Challenges, setChallenges] = useState([]);

  // **Fetch Sub-Challenges List**
  useEffect(() => {
    const fetchChallengesWithWeeks = async () => {
      try {
        // Fetch challenges
        const challengesResponse = await API.get("/admin/challenges");

        // Fetch weeks
        const weeksResponse = await API.get("/admin/week");
        // Create a map of weekId -> weekName for quick lookup
        const weekMap = {};
        weeksResponse.data.forEach((week) => {
          weekMap[week.id] = week.name;
        });

        // Attach weekName to each challenge
        const challengesWithWeekNames = challengesResponse.data.map(
          (challenge) => ({
            ...challenge,
            weekName: weekMap[challenge.weekId] || "Unknown",

            // ✅ Ensure 'descriptions' is always an array
            descriptions:
              typeof challenge.descriptions === "string"
                ? JSON.parse(challenge.descriptions || "[]")
                : challenge.descriptions,

            // ✅ Fix image parsing to prevent double encoding issues
            // ✅ Fix image parsing
            challenge_images: (() => {
              try {
                if (!challenge.challenge_images) return [];

                if (typeof challenge.challenge_images === "string") {
                  // Remove extra quotes if they exist
                  let parsedImages = challenge.challenge_images;
                  if (
                    parsedImages.startsWith('"') &&
                    parsedImages.endsWith('"')
                  ) {
                    parsedImages = parsedImages.slice(1, -1);
                  }

                  parsedImages = JSON.parse(parsedImages);
                  return Array.isArray(parsedImages) ? parsedImages : [];
                }

                return Array.isArray(challenge.challenge_images)
                  ? challenge.challenge_images
                  : [];
              } catch (error) {
                console.warn("Error parsing challenge images:", error);
                return [];
              }
            })(),
          })
        );

        // Set state with updated challenges
        setChallenges(challengesWithWeekNames.reverse());
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to fetch challenges.", { position: "top-right" });
      }
    };

    fetchChallengesWithWeeks();
  }, []);

  // **Custom Confirmation Toast**
  const confirmAction = (message, onConfirm) => {
    toast.success(
      <div className="flex flex-col">
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss();
              onConfirm();
            }}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // **Delete Sub-Challenge**
  const deleteSubChallenge = async (id) => {
    confirmAction(
      "Are you sure you want to delete this Challenge?",
      async () => {
        try {
          const response = await API.delete(`/admin/delete/challenge/${id}`); // Update API endpoint
          if (response.status === 200) {
            setChallenges((prev) => prev.filter((item) => item.id !== id));
            toast.success("Sub-challenge deleted successfully!", {
              position: "top-right",
            });
          }
        } catch (error) {
          console.error("Error deleting sub-challenge:", error);
          toast.error("Failed to delete sub-challenge.", {
            position: "top-right",
          });
        }
      }
    );
  };

  // **Toggle Sub-Challenge Status**
  const updateStatus = async (row) => {
    confirmAction("Are you sure you want to change the status?", async () => {
      try {
        const newStatus = row.status === "Active" ? "Inactive" : "Active";

        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Unauthorized. Please login again.", {
            position: "top-right",
          });
          return;
        }

        const response = await API.put(
          `/admin/update/challenge/${row.id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setChallenges((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, status: newStatus } : item
            )
          );

          toast.success(`Status changed to ${newStatus}!`, {
            position: "top-right",
          });
        } else {
          throw new Error("Unexpected response status: " + response.status);
        }
      } catch (error) {
        console.error("Error updating sub-challenge status:", error);
        toast.error(
          error.response?.data?.message || "Failed to update status.",
          {
            position: "top-right",
          }
        );
      }
    });
  };

  // **Table Columns**
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Short Description", accessor: "shortDescription" },
    { header: "Week", accessor: "weekName" },
    {
      header: "Descriptions",
      accessor: "descriptions",
      cell: (row) => row.descriptions?.join(", ") || "No descriptions", // Ensure correct display
    },
    { header: "Images", accessor: "challenge_images" },
    { header: "Rewards", accessor: "rewards" },
    { header: "Status", accessor: "status" },
  ];

  // **Table Actions**
  const actions = [
    {
      label: (
        <span className="flex items-center gap-1 text-green-500 hover:text-green-600">
          <SquarePen className="w-4 h-4" />
          Edit
        </span>
      ),
      handler: (row) => navigate("/challenges/add", { state: { challengeData: row } }),
    },
    {
      label: (
        <span className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
          <RefreshCcw className="w-4 h-4" />
          Change Status
        </span>
      ),
      handler: (row) => updateStatus(row),
    },
  ];
  

  return (
    <div className="p-6">
      <Toaster position="top-right" autoClose={3000} />
      <Helmet>
        <title>Breboot | Challenge List</title>
        <meta name="Challenge List" content="List of all Challenges" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Challenge List</h1>
      {Challenges.length > 0 ? (
        <Table columns={columns} data={Challenges} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default ListSubChallenge;
