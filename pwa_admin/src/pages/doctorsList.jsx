import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Table from "../components/Table";
import { XCircle, CheckCircle } from "lucide-react";
import API from "../lib/utils";
import { Toaster, toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DoctorsList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchChallengeForms = async () => {
      try {
        const response = await API.get("/admin/users");
        console.log(response.data.users);
        const parsedata = response.data.users.reverse();
        const doctors = parsedata.filter((user) => user.userType === "Doctor");
        setDoctors(doctors);
      } catch (error) {
        console.error("Error fetching challenge forms:", error);
        toast.error("Failed to fetch challenge forms.", {
          position: "top-right",
        });
      }
    };
    fetchChallengeForms();
  }, []);

  // Excel download function
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(doctors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doctors");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "DoctorsList.xlsx");
  };

  // Table columns
  const columns = [
    { header: "Refferal Code", accessor: "code" },
    { header: "Name", accessor: "name" },
    { header: "Phone-Number", accessor: "phone" },
    { header: "Email", accessor: "email" },
    { header: "Gender", accessor: "gender" },
    { header: "Points", accessor: "points" },
    { header: "State", accessor: "state" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="p-6">
      <Toaster position="top-right" autoClose={3000} />
      <Helmet>
        <title>Breboot | Doctor's List</title>
        <meta name="Week List" content="List of all Weeks" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Doctor's List</h1>
      <button
        onClick={downloadExcel}
        className="bg-green-600 text-white px-4 py-2 mb-4 rounded-lg hover:bg-green-700 transition"
      >
        Download Excel
      </button>
      {doctors.length > 0 ? (
        <Table columns={columns} data={doctors} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No records found</div>
      )}
    </div>
  );
};

export default DoctorsList;
