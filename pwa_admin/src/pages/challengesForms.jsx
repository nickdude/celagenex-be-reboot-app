import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Table from "../components/Table";
import { XCircle, CheckCircle } from "lucide-react";
import API from "../lib/utils";
import { Toaster, toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const ListChallengeForm = () => {
  const navigate = useNavigate();
  const [challengeForms, setChallengeForms] = useState([]);

  useEffect(() => {
    const fetchChallengeForms = async () => {
      try {
        const response = await API.get("/admin/challengeForms");
        console.log(response.data)
        setChallengeForms(response.data);
      } catch (error) {
        console.error("Error fetching challenge forms:", error);
        toast.error("Failed to fetch challenge forms.", {
          position: "top-right",
        });
      }
    };
    fetchChallengeForms();
  }, []);

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

  const approveChallenge = async (id) => {
    confirmAction(
      "Are you sure you want to approve this challenge?",
      async () => {
        try {
          const response = await API.put(`/admin/get/challengeForm/${id}`, {
            isVerified: 1,
            status: "Approved",
          });
          if (response.status === 200) {
            setChallengeForms((prev) =>
              prev.map((item) =>
                item.id === id
                  ? { ...item, status: "Approved", isVerified: 1 }
                  : item
              )
            );
            toast.success("Challenge approved successfully!", {
              position: "top-right",
            });
          }
        } catch (error) {
          console.error("Error approving challenge:", error);
          toast.error("Failed to approve challenge.", {
            position: "top-right",
          });
        }
      }
    );
  };

  const rejectChallenge = async (id) => {
    confirmAction("Are you sure you want to reject this challenge?", async () => {
      console.log("Rejecting Challenge ID:", id); // ✅ Debugging
      console.log("Sending Data:", { isVerified: 2, status: "Rejected" }); // ✅ Debugging
  
      try {
        const response = await API.put(`/admin/get/challengeForm/${id}`, {
          isVerified: 2, // Ensure this is a number
        });
  
        console.log("API Response:", response.data); // ✅ Debugging
  
        if (response.status === 200) {
          setChallengeForms((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: "Rejected", isVerified: 2 } : item
            )
          );
          toast.success("Challenge rejected successfully!", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error rejecting challenge:", error);
        toast.error("Failed to reject challenge.", { position: "top-right" });
      }
    });
  };  

  // Table columns
  const columns = [
    { header: "User Id", accessor: "userId" },
    { header: "Name", accessor: "name" },
    { header: "Media-Type", accessor: "mediaType" },
    { header: "Media-Files", accessor: "mediaFiles" },
    { header: "Status", accessor: "isVerified" },
    { header: "Date", accessor: "createdAt" },
  ];

  // Table actions
  const actions = [
    {
      label: (
        <span className="flex items-center gap-1 text-green-500 hover:text-green-600">
          <CheckCircle className="w-4 h-4" />
          Approve
        </span>
      ),
      handler: (row) => approveChallenge(row.id),
    },
    {
      label: (
        <span className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
          <XCircle className="w-4 h-4" />
          Reject
        </span>
      ),
      handler: (row) => rejectChallenge(row.id),
    },
  ];
  

  return (
    <div className="p-6">
      <Toaster position="top-right" autoClose={3000} />
      <Helmet>
        <title>Breboot | Challenge-Form List</title>
        <meta name="Week List" content="List of all Weeks" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Challenge-Form List</h1>
      {challengeForms.length > 0 ? (
        <Table columns={columns} data={challengeForms} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default ListChallengeForm;
