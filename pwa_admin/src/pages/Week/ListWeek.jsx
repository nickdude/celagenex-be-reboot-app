import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import API from '../../lib/utils';
import { Toaster, toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const ListWeek = () => {
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState([]);

  // Fetch challenge list from API
  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const response = await API.get("/admin/week");
        console.log(response.data);
        setWeeks(response.data.reverse());
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to fetch challenges.", { position: "top-right" });
      }
    };

    fetchWeeks();
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

  // Delete challenge
  const deleteChallenge = async (id) => {
    confirmAction(
      "Are you sure you want to delete this week?",
      async () => {
        try {
          const response = await API.delete(`/admin/delete/week/${id}`);
          if (response.status === 200) {
            setWeeks((prev) => prev.filter((item) => item.id !== id));
            toast.success("Week deleted successfully!", {
              position: "top-right",
            });
          }
        } catch (error) {
          console.error("Error deleting Week:", error);
          toast.error("Failed to delete Week.", { position: "top-right" });
        }
      }
    );
  };

  // Toggle challenge status
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
          `/admin/update/week/${row.id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setWeeks((prev) =>
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
        console.error("Error updating challenge status:", error);
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
    { header: "Title", accessor: "name" },
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
      handler: (row) => navigate("/week/add", { state: { weekData: row } }),
    },
    {
      label: (
        <span className="flex items-center gap-1 text-red-500 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
          Delete
        </span>
      ),
      handler: (row) => deleteChallenge(row.id),
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
        <title>Breboot | Week List</title>
        <meta name="Week List" content="List of all Weeks" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Week List</h1>
      {weeks.length > 0 ? (
        <Table
          columns={columns}
          data={weeks}
          globalActions={actions}
        />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default ListWeek;
