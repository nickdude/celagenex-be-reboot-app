import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { Users, Swords, Type, Stethoscope, Download, Package } from "lucide-react";
import API from "../lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import renderActiveShape from "../components/pieChart";
import { Helmet } from "react-helmet-async";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [doctorData, setDoctorsData] = useState();
  const [otherUsers, setOtherUsers] = useState();
  const [totalChallenges, setChallenges] = useState();
  const [totalRedeems, setRedeems] = useState();
  const [soldItems, SetSoldItems] = useState();
  const [redeemGraph, SetRedeemGraph] = useState();
  const [soldItemsGraph, setSoldItemsGraph] = useState([]); // ✅ Ensure it starts as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [bookingChartData, setBookingChartData] = useState();
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/users");
        const parsedata = response.data.users;
        // Count total users
        const totalUsers = parsedata.length;
        // Count users who are doctors
        const doctorCount = parsedata.filter(
          (user) => user.userType === "Doctor"
        ).length;
        setDoctorsData(doctorCount);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/users");
        const parsedata = response.data.users;
        // Count total users
        const totalUsers = parsedata.length;
        // Count users who are doctors
        const patientCount = parsedata.filter(
          (user) => user.userType === "OtherUser"
        ).length;
        setOtherUsers(patientCount);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/challenges");
        const parsedata = response.data;
        setChallenges(parsedata.length);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/soldItems");
        const parsedata = response.data;
        SetSoldItems(parsedata.length);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/redeem");
        const parsedata = response.data.redeemedRewards;
        setRedeems(parsedata.length);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/redeem/graph");
        SetRedeemGraph(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/soldItemsGraph");
        // console.log("Fetched Orders Data:", response.data.data); // Debugging Log

        if (response.data.data && response.data.data.length > 0) {
          setSoldItemsGraph(response.data.data);
        } else {
          console.warn("Received empty data");
          setSoldItemsGraph([]); // Ensure state is always an array
        }
      } catch (err) {
        console.error("Error fetching graph data:", err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const downloadExcel = async () => {
    try {
      const response = await API.get("/admin/excel_data");
      console.log("Excel data", response.data);

      if (!response.data || response.data.length === 0) {
        alert("No data available to download");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(response.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ExcelData");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "ExcelData.xlsx");
    } catch (error) {
      console.error("Error in fetching and downloading Excel data", error);
    }
  };


  // useEffect(() => {
  //   const fetchBookingChartData = async () => {
  //     const response = await API.get("admin/booking-details/graph");
  //     const data = response.data;
  //     setBookingChartData(data);
  //   }
  //   fetchBookingChartData()
  // },[])

  const UserAgentPieCharData = [
    { name: "Doctors", value: doctorData || 0 },
    { name: "Patients", value: otherUsers || 0 },
  ];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const COLORS = ["#0088FE", "#00C49F"];

  // const LinechartData = [
  //   { date: "2023-12-01", bookings: 30 },
  //   { date: "2023-12-02", bookings: 45 },
  //   { date: "2023-12-03", bookings: 60 },
  //   { date: "2023-12-04", bookings: 25 },
  //   { date: "2023-12-05", bookings: 75 },
  //   { date: "2023-12-06", bookings: 50 },
  //   { date: "2023-12-07", bookings: 90 },
  // ];

  // const DashboardItems = [
  //   { title: "Total Bookings", value: data || 0, icon: <Calendar className="w-5 h-5" /> },
  //   { title: "Total Users", value: totalUsers || 0, icon: <Users className="w-5 h-5" /> },
  //   { title: "Total Agents", value: totalAgents || 0, icon: <Users className="w-5 h-5" /> },
  //   { title: "Total Rooms", value: totalRooms || 0, icon: <Type className="w-5 h-5" /> },
  // ];

  const DashboardItems = [
    {
      title: "Total Doctors",
      value: doctorData,
      icon: <Stethoscope className="w-5 h-5" />,
    },
    {
      title: "Total Patients",
      value: otherUsers,
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Total Challenges",
      value: totalChallenges,
      icon: <Swords className="w-5 h-5" />,
    },
    {
      title: "Total Redeems",
      value: totalRedeems,
      icon: <Type className="w-5 h-5" />,
    },
    {
      title: "Total Orders",
      value: soldItems,
      icon: <Package className="w-5 h-5" />
    },
  ];

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <Helmet>
        <title>Breboot | Dashboard</title>
        <meta name="Dachboard" content="Breboot Dashboard!" />
      </Helmet>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-6 mt-20">
        {DashboardItems.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      <div className="flex justify-start mx-6 mt-4">
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Order Excel
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 gap-8 mt-10 px-6">
        <div className="h-80 flex flex-col items-center justify-center shadow-sm bg-white p-6 space-y-5">
          <ResponsiveContainer>
            <LineChart
              data={redeemGraph}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#333" }}
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getDate()}-${date.getMonth() + 1
                    }-${date.getFullYear()}`;
                }}
              />
              <YAxis tick={{ fill: "#333" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                }}
                itemStyle={{ color: "#333" }}
              />
              <Legend wrapperStyle={{ color: "#333" }} />
              <Line
                type="monotone"
                dataKey="redemptions"
                stroke="#00C49F"
                strokeWidth={2}
                activeDot={{ r: 10 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="font-bold text-gray-600 text-xl mt-2">Redeem Trends</p>
        </div>
        {/* Pie Chart */}
        <div className="h-80 flex flex-col items-center justify-center shadow-sm bg-white p-6 space-y-5">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={UserAgentPieCharData}
                cx="50%"
                cy="50%"
                innerRadius={37}
                outerRadius={55}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {UserAgentPieCharData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="font-bold text-gray-600 text-xl mt-2">
            Doctor's <span className="text-[#00C49F]">vs</span> Patient's
          </p>
        </div>
      </div>
      <div className="h-[400px] flex flex-col mt-10 items-center justify-center shadow-md bg-white p-6 mx-auto w-2/4">
        {soldItemsGraph.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={soldItemsGraph}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#333" }}
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getDate()}-${date.getMonth() + 1
                    }-${date.getFullYear()}`;
                }}
              />
              <YAxis tick={{ fill: "#333" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff" }}
                itemStyle={{ color: "#333" }}
              />
              <Legend wrapperStyle={{ color: "#333" }} />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#00C49F"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
        <p className="font-bold text-gray-600 text-xl text-center">
          Order Trends
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
