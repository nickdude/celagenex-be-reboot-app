import { useNavigate } from "react-router";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import API from "../../lib/utils";
import { Toaster, toast } from "react-hot-toast";

const ListProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch product list from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/admin/products"); // Adjust endpoint as needed
        console.log(response.data);
        setProducts(response.data.reverse());
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products.", { position: "top-right" });
      }
    };

    fetchProducts();
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

  // Delete product
  const deleteProduct = async (id) => {
    confirmAction("Are you sure you want to delete this product?", async () => {
      try {
        const response = await API.delete(`/admin/delete/product/${id}`);
        if (response.status === 200) {
          setProducts((prev) => prev.filter((item) => item.id !== id));
          toast.success("Product deleted successfully!", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.", { position: "top-right" });
      }
    });
  };

  // Toggle product status
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
          `/admin/update/product/${row.id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setProducts((prev) =>
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
        console.error("Error updating product status:", error);
        toast.error(
          error.response?.data?.message || "Failed to update status.",
          {
            position: "top-right",
          }
        );
      }
    });
  };

  const toggleInStock = async (row) => {
    try {
      const newInStockValue = !row.inStock;

      // Send the updated value to the backend (adjust as necessary)
      await API.put(`/admin/update/product/${row.id}`, {
        inStock: newInStockValue,
      });

      // Update the local state
      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.id === row.id ? { ...item, inStock: newInStockValue } : item
        )
      );

      if (newInStockValue) {
        toast.success("Product is now In Stock", {
          position: "top-right",
        });
      } else {
        toast.error("Product is now Out of Stock", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating inStock status:", error);
      toast.error("Failed to update inStock status.", {
        position: "top-right",
      });
    }
  };

  // Table columns
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Price", accessor: "oldPrice" },
    { header: "Doctor Price", accessor: "priceForDoctor" },
    { header: "Patient Price", accessor: "priceForOtherUser" },
    { header: "User Price", accessor: "priceForUser" },
    {
      header: "Image",
      accessor: "product_image",
      Cell: ({ value }) => (
        <img src={value} alt="Product" className="w-16 h-16 object-cover" />
      ),
    },
    { header: "Status", accessor: "status" },
    {
      header: "In Stock",
      accessor: "inStock",
      cell: (row) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={row.row.original.inStock === true} // Use row.original to access the actual data object
            onChange={() => toggleInStock(row.row.original)} // Ensure you're passing the correct object to toggleInStock
            className="w-4 h-4 cursor-pointer rounded-full border-2 border-gray-400 checked:bg-[#960B22] checked:border-[#960B22] checked:accent-[#960B22] focus:ring-0"
          />
        </div>
      ),
    },
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
      handler: (row) => navigate("/product/add", { state: { productData: row } }),
    },
    {
      label: (
        <span className="flex items-center gap-1 text-red-500 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
          Delete
        </span>
      ),
      handler: (row) => deleteProduct(row.id),
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
        <title>Breboot | Product List</title>
        <meta name="Product List" content="List of all products" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Product List</h1>
      {products.length > 0 ? (
        <Table
          columns={columns}
          data={products}
          globalActions={actions}
          toggleInStock={toggleInStock}
        />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default ListProduct;
