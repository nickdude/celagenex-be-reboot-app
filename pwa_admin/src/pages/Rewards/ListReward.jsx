import { useNavigate } from "react-router";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import API from "../../lib/utils";
import { Toaster, toast } from "react-hot-toast";

const ListRewards = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);

  // Fetch reward list from API
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await API.get("/admin/rewards"); // Adjust endpoint as needed
        console.log(response.data.rewards);
        setRewards(response.data.rewards.reverse());
      } catch (error) {
        console.error("Error fetching rewards:", error);
        toast.error("Failed to fetch rewards.", { position: "top-right" });
      }
    };

    fetchRewards();
  }, []);

  // Custom confirmation toast
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

  // Delete reward
  const deleteReward = async (id) => {
    confirmAction("Are you sure you want to delete this reward?", async () => {
      try {
        const response = await API.delete(`/admin/delete/reward/${id}`);
        if (response.status === 200) {
          setRewards((prev) => prev.filter((item) => item.id !== id));
          toast.success("Reward deleted successfully!", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting reward:", error);
        toast.error("Failed to delete reward.", { position: "top-right" });
      }
    });
  };

  // Toggle reward status
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
          `/admin/update/reward/${row.id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setRewards((prev) =>
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
        console.error("Error updating reward status:", error);
        toast.error(
          error.response?.data?.message || "Failed to update status.",
          {
            position: "top-right",
          }
        );
      }
    });
  };

  // Table columns
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Points", accessor: "points" },
    { header: "Description", accessor: "description" },
    {
      header: "Image",
      accessor: "reward_image",
      Cell: ({ value }) => (
        <img src={value} alt="Reward" className="w-16 h-16 object-cover" />
      ),
    },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: (
        <span className="flex items-center gap-1 text-green-500 hover:text-green-600">
          <SquarePen className="w-4 h-4" />
          Edit
        </span>
      ),
      handler: (row) => navigate("/rewards/add", { state: { rewardData: row } }),
    },
    {
      label: (
        <span className="flex items-center gap-1 text-red-500 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
          Delete
        </span>
      ),
      handler: (row) => deleteReward(row.id),
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
        <title>Breboot | Reward List</title>
        <meta name="Product List" content="List of all products" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Reward List</h1>
      {rewards.length > 0 ? (
        <Table columns={columns} data={rewards} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default ListRewards;
