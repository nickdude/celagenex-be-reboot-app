import { useNavigate } from "react-router";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import dumuProduct from "../../assets/images/dumy_1.jpg"


const ListRewardCategory = () => {
  const navigate = useNavigate();
  const [RewardCategoryDetails, setRewardCategoryDetails] = useState([
    { id: 1, title: "Reward Category One", image: dumuProduct, status: "Active" },
    { id: 2, title: "Reward Category two", image: dumuProduct, status: "Inactive" },
  ]);

  const deleteReward = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Category?");
    if (!confirmDelete) return;
    setRewardCategoryDetails((prev) => prev.filter((item) => item.id !== id));
    alert("Category deleted successfully");
  };

  const updateStatus = (row) => {
    const confirmChangeStatus = window.confirm("Are you sure you want to change the status?");
    if (!confirmChangeStatus) return;
    const newStatus = row.status === "Active" ? "Inactive" : "Active";
    setRewardCategoryDetails((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
    );
    alert("Status changed successfully");
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Image", accessor: "image" },
    { header: "Status", accessor: "status" },
  ];

  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />, 
      handler: (row) => navigate("/rewardcategory/add", { state: { RewardCategoryData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />, 
      handler: (row) => deleteReward(row.id),
      className: "text-red-500 hover:text-red-600",
    },
    {
      label: <RefreshCcw className="w-4 h-4" />, 
      handler: (row) => updateStatus(row),
      className: "text-blue-500 hover:text-blue-600",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Breboot | Reward Category List</title>
        <meta name="Challenge List" content="List of all challenges" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Reward Category List</h1>
      {RewardCategoryDetails.length > 0 ? (
        <Table columns={columns} data={RewardCategoryDetails} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default ListRewardCategory;
