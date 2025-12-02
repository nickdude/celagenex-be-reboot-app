import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Table from "../components/Table";
import { CheckCircle, XCircle } from "lucide-react";
import API from "../lib/utils";
import { Toaster, toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../lib/utils";

const DoctorsList = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("All"); // Default filter set to "All"

  useEffect(() => {
    const fetchChallengeForms = async () => {
      try {
        const response = await API.get("/admin/getPayments");
        console.log("Fetched Payments:", response.data.payments);

        // // Group payments by userId to keep only the most recent
        // const groupedPayments = response.data.payments.reduce(
        //   (acc, payment) => {
        //     const userId = payment.userId;

        //     // If the user already exists, check if this payment is more recent
        //     if (
        //       !acc[userId] ||
        //       new Date(payment.createdAt) > new Date(acc[userId].createdAt)
        //     ) {
        //       acc[userId] = { ...payment }; // Store latest payment
        //     }

        //     return acc;
        //   },
        //   {}
        // );

        // // Function to extract orderId safely
        // const extractOrderId = (filename) => {
        //   const match = filename.match(/invoice-\d+-(\d+)\.pdf/);
        //   return match ? parseInt(match[1]) : 0; // Default to 0 if no match
        // };

        // // Convert grouped payments object back to an array
        // const recentPayments = Object.values(groupedPayments).map((payment) => {
        //   // Ensure invoices exist before sorting
        //   if (payment.invoices && payment.invoices.length > 0) {
        //     const sortedInvoices = payment.invoices
        //       .map((invoice) => ({
        //         filename: invoice,
        //         orderId: extractOrderId(invoice),
        //       }))
        //       .sort((a, b) => b.orderId - a.orderId) // Sort by orderId (newest first)
        //       .map((invoice) => invoice.filename); // Extract only filenames

        //     payment.invoices =
        //       sortedInvoices.length > 0 ? [sortedInvoices[0]] : []; // Keep only the most recent invoice
        //   }

        //   return {
        //     ...payment, // Keep all existing payment data
        //     invoiceUrl:
        //       payment.invoices.length > 0
        //         ? `${BASE_URL}${payment.invoices[0]}`
        //         : null, // Construct invoice URL
        //   };
        // });

        setPayments(response.data.payments);
      } catch (error) {
        console.error("Error fetching payment invoices:", error);
        toast.error("No payment invoices found.", {
          position: "top-right",
        });
      }
    };

    fetchChallengeForms();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    if (filter === "User") {
      return payment.paymentScreenshot && payment.paymentScreenshot !== "Admin";
    }
    if (filter === "Admin") {
      return payment.paymentScreenshot === "Admin";
    }
    return true; // "All" shows everything
  });

  // Function to download invoice
  const handleDownloadInvoice = (invoiceUrl) => {
    if (!invoiceUrl) {
      toast.error("Invoice not available");
      return;
    }

    const link = document.createElement("a");
    link.href = invoiceUrl;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to update payment status
  const updatePaymentStatus = async (paymentId, status) => {
    try {
      const response = await API.put("/admin/updatePaymentStatus", {
        paymentId,
        status,
      });

      toast.success(`Payment status updated to ${status}`, {
        position: "top-right",
      });

      // Update state after successful API call
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, paymentStatus: status }
            : payment
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status.", {
        position: "top-right",
      });
    }
  };

  // Table columns
  const columns = [
    { header: "Product Name", accessor: "name" },
    { header: "Order Id", accessor: "orderId" },
    { header: "User Id", accessor: "userId" },
    { header: "Transaction Id", accessor: "transactionId" },
    { header: "Payment Proof", accessor: "paymentScreenshot" },
    // { header: "Quantity", accessor: "quantity" },
    // { header: "Email", accessor: "email" },
    { header: "Payment Status", accessor: "paymentStatus" },
    { header: "Status", accessor: "status" },
    { header: "Status", accessor: "invoices" },
    // { header: "Invoices", accessor: "invoices" },
  ];

  // Action buttons for status update
  const actions = [
    {
      label: (
        <span className="flex items-center gap-1 text-green-500 hover:text-green-600">
          <CheckCircle className="w-4 h-4" />
          Approve
        </span>
      ),
      handler: (row) => updatePaymentStatus(row.id, "Verified"),
    },
    {
      label: (
        <span className="flex items-center gap-1 text-red-500 hover:text-red-600">
          <XCircle className="w-4 h-4" />
          Disapprove
        </span>
      ),
      handler: (row) => updatePaymentStatus(row.id, "Rejected"),
    },
  ];

  // Function to handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" autoClose={3000} />
      <Helmet>
        <title>Breboot | Payment Invoice List</title>
        <meta name="Week List" content="List of all Weeks" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Payment Invoice List
      </h1>
      {/* Filter dropdown */}
      <div className="mb-4">
        <select
          className="p-2 border border-gray-300 rounded"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      {filteredPayments.length > 0 ? (
        <Table
          columns={columns}
          data={filteredPayments}
          globalActions={actions}
          handleDownloadInvoice={handleDownloadInvoice}
        />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default DoctorsList;
