import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Table from "../components/Table";
import { Download } from "lucide-react";
import API from "../lib/utils";
import { Toaster, toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../lib/utils";

const OrdersList = () => {
  const navigate = useNavigate();
  const [eligibleOrderIds, setEligibleOrderIds] = useState([]);
  const [showModal, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("Admin");

  useEffect(() => {
    const fetchChallengeForms = async () => {
      try {
        const response = await API.get("/admin/getOrders");
        console.log("Fetched Orders Data:", response.data);

        // Ensure address is formatted in frontend (if needed)
        const formattedOrders = response.data.orders.map((order) => ({
          ...order,
          address:
            typeof order.address === "string"
              ? order.address // Use as is if backend is fixed
              : [
                  order.address?.address || "",
                  order.address?.city || "",
                  order.address?.state || "",
                  order.address?.pincode || "",
                  order.address?.landMark || "",
                ]
                  .filter(Boolean)
                  .join(", "),
        }));

        setOrders(formattedOrders.reverse());
      } catch (error) {
        console.error("Error fetching payment invoices:", error);
        toast.error("No payment invoices found.", {
          position: "top-right",
        });
      }
    };

    fetchChallengeForms();
  }, []);

  const handleCreatePaymentManually = async () => {
    try {
      const response = await API.get("/admin/eligible-orders");
      setEligibleOrderIds(response.data.orderIds);
      setModalOpen(true);
    } catch (error) {
      toast.error("Error fetching eligible orders.", {
        position: "top-right",
      });
    }
  };

  const handleCreateManualPayment = async () => {
    try {
      const payload = {
        orderId: selectedOrderId,
        transactionId,
        address: JSON.stringify({
          address,
          city: "Vadodara",
          state: "Gujarat",
          pincode: "390019",
          landMark: "no",
          gstNumber: "wdci8c9d89scd",
        }),
        paymentScreenshot,
      };

      const response = await API.post("/admin/create-payment", payload);

      toast.success("Payment created successfully.", {
        position: "top-right",
      });

      // Reset modal state
      setSelectedOrderId("");
      setTransactionId("");
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
      setLandmark("");
      setGstNumber("");
      setPaymentScreenshot("");
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error(
        error.response?.data?.message || "Failed to create payment.",
        {
          position: "top-right",
        }
      );
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const columns = [
    { header: "Name", accessor: "userName" },
    { header: "State", accessor: "userState" },
    { header: "Order Id", accessor: "orderId" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Status", accessor: "status" },
    { header: "Order Date", accessor: "createdAt" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="p-6">
      <Toaster position="top-right" autoClose={3000} />
      <Helmet>
        <title>Breboot | Order's Invoice List</title>
        <meta name="Week List" content="List of all Weeks" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Order's Invoice List
      </h1>
      {/* <button className="px-4 py-2 mb-4 bg-orange-400/90 text-white rounded-md hover:bg-orange-500/90">Create Payment Manually</button> */}
      {orders.length > 0 ? (
        <Table
          columns={columns}
          data={orders}
          handleCreatePaymentManually={handleCreatePaymentManually}
        />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}

      {/* Modal: Show eligible orders in dropdown */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50">
          <div className="bg-white p-6 border border-orange-400/10 rounded-lg shadow-md w-[500px]">
            <h2 className="text-xl text-orange-400/90 font-medium mb-6 text-center">
              Create Manual Payment
            </h2>

            {/* Order ID */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Order ID
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              >
                <option value="" disabled>
                  Select Order ID
                </option>
                {eligibleOrderIds.map((orderId) => (
                  <option key={orderId} value={orderId}>
                    Order ID: {orderId}
                  </option>
                ))}
              </select>
            </div>

            {/* Row: Transaction ID + Street Address */}
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Transaction ID<span className="text-[14px] text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Street Address<span className="text-[14px] text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  placeholder="Street address"
                />
              </div>
            </div>

            {/* Row: City + State */}
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  City<span className="text-[14px] text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  placeholder="City"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  State<span className="text-[14px] text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  placeholder="State"
                />
              </div>
            </div>

            {/* Row: Pincode + Landmark */}
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Pincode<span className="text-[14px] text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  placeholder="Pincode"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Landmark<span className="text-[14px] text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  placeholder="Landmark"
                />
              </div>
            </div>

            {/* Row: GST Number + Screenshot */}
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  GST Number<span className="text-[10px] text-gray-500 italic">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  placeholder="GST Number"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Payment Screenshot URL
                </label>
                <input
                  type="text"
                  placeholder="Paste screenshot URL"
                  value={paymentScreenshot}
                  onChange={(e) => setPaymentScreenshot(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-black/20 border-gray-300 disabled:opacity-50"
                  disabled
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCreateManualPayment}
                disabled={!selectedOrderId || !transactionId || !address}
                className="px-4 py-2 bg-black text-white rounded border border-black hover:bg-white hover:text-black hover:border-black disabled:opacity-50 disabled:border-opacity-50 transition-colors duration-300 ease-in-out"
              >
                Create Payment
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-300 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
