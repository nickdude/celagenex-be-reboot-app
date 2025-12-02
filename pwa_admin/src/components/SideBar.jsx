import React, { useState } from "react";
import { NavLink } from "react-router";
import {
  Home,
  ChevronDown,
  ChevronUp,
  Plus,
  Rows3,
  UserCheck,
  LogOut,
  Menu,
  Users,
  X,
  Swords,
  Calendar,
  ShoppingCart,
  ReceiptText,
  Stethoscope,
  TicketCheck,
} from "lucide-react";
import logo from "../assets/Breboot-Logo.svg";

const Sidebar = ({ setIsAuthenticated }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    setIsAuthenticated(false);
  };

  const menuStructure = [
    { path: "/dashboard", name: "Dashboard", icon: Home, type: "link" },
    {
      name: "Weeks",
      icon: Calendar,
      type: "submenu",
      submenuItems: [
        { path: "/week/list", name: "Week List", icon: Rows3 },
        { path: "/week/add", name: "Week Add", icon: Plus },
      ],
    },
    {
      name: "Challenges",
      icon: Swords,
      type: "submenu",
      submenuItems: [
        { path: "/challenges/list", name: "Challenges List", icon: Rows3 },
        { path: "/challenges/add", name: "Add Challenges", icon: Plus },
      ],
    },
    { path: "/challengeformlist", name: "Challenge-Form", icon: UserCheck, type: "link" },
    {
      name: "Product",
      icon: ShoppingCart,
      type: "submenu",
      submenuItems: [
        { path: "/product/list", name: "Product List", icon: Rows3 },
        { path: "/product/add", name: "Add Product", icon: Plus },
      ],
    },
    // {
    //   name: 'Reward Category',
    //   icon: ChartBarStacked,
    //   type: 'submenu',
    //   submenuItems: [
    //     { path: '/rewardcategory/list', name: 'Reward Category List', icon: Rows3 },
    //     { path: '/rewardcategory/add', name: 'Add Reward Category', icon: Plus },
    //   ],
    // },
    {
      name: "Rewards",
      icon: TicketCheck,
      type: "submenu",
      submenuItems: [
        { path: "/rewards/list", name: "Reward List", icon: Rows3 },
        { path: "/rewards/add", name: "Add Reward", icon: Plus },
      ],
    },
    { path: "/doctorsList", name: "Doctors's", icon: Stethoscope, type: "link" },
    { path: "/patientList", name: "Patient's", icon: Users, type: "link" },
    { path: "/paymentsList", name: "Payment List", icon: ReceiptText, type: "link" },
    { path: "/ordersList", name: "Order's List", icon: ReceiptText, type: "link" },
    // { path: '/PaymentList', name: 'Payment Info', icon: Banknote, type: 'link' },
    // { path: '/inquirylist', name: 'Inquiry', icon: MessageSquareHeart, type: 'link' },
  ];

  const handleSubmenuToggle = (submenuName) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [submenuName]: !prevState[submenuName],
    }));
  };

  const renderMenuItem = (item) => {
    if (item.type === "link") {
      return (
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
              isActive
                ? "bg-gray-200 text-gray-900 font-medium"
                : "text-gray-700 hover:bg-gray-300"
            }`
          }
          onClick={() => setIsSidebarOpen(false)}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </NavLink>
      );
    }

    if (item.type === "submenu") {
      return (
        <>
          <button
            onClick={() => handleSubmenuToggle(item.name)}
            className="w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 text-gray-700 hover:bg-gray-300"
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
            {openSubmenus[item.name] ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {openSubmenus[item.name] && (
            <ul className="mt-1 ml-4 space-y-1 mb-1 text-xs">
              {item.submenuItems.map((subItem) => (
                <li key={subItem.path}>
                  <NavLink
                    to={subItem.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-150 ${
                        isActive
                          ? "bg-gray-200 text-gray-900 font-medium"
                          : "text-gray-700 hover:bg-gray-300"
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <subItem.icon className="w-4 h-4" />
                    <span>{subItem.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </>
      );
    }
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 text-black"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 h-screen bg-[#f9f9f9] text-gray-300 shadow-lg border-r border-gray-200 flex flex-col flex-shrink-0 text-sm transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-300 flex items-center justify-center flex-shrink-0">
          <img className="w-44 h-auto" src={logo} alt="breboot-logo" />
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow overflow-y-auto p-4">
          <div className="mb-4 px-4 text-xs font-semibold text-gray-900 uppercase">
            Main Menu
          </div>
          <ul className="space-y-1">
            {menuStructure.map((item, index) => (
              <li key={item.name || index}>{renderMenuItem(item)}</li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-300 flex-shrink-0">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-sm font-medium text-white">B</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-gray-900">Breboot</h3>
              <p className="text-xs text-gray-900">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="hover:bg-gray-300 p-2 rounded-md"
            >
              <LogOut className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
