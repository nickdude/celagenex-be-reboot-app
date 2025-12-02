import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import AddWeek from "./pages/Week/AddWeek";
import ListWeek from "./pages/Week/ListWeek";
import ProtectedRoute from "./helper/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";
import AddChallenge from "./pages/SubChallenges/AddSubChallenge";
import ListChallenge from "./pages/SubChallenges/ListSubChallenge";
import AddProduct from "./pages/Product/AddProduct";
import ListProduct from "./pages/Product/ListProduct";
import AddRewardCategory from "./pages/RewardCategory.jsx/addRewardCategory";
import ListRewardCategory from "./pages/RewardCategory.jsx/listRewardCategory";
import ChallengeFormList from "./pages/challengesForms";
import DoctorsList from "./pages/doctorsList";
import PaymentList from "./pages/paymentsList"
import AddRewards from "./pages/Rewards/AddRewards";
import ListRewards from "./pages/Rewards/ListReward";
import Login from "./pages/Login";
import PatientList from "./pages/patientList";
import OrdersList from "./pages/ordersList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <HelmetProvider>
          <Routes>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout setIsAuthenticated={setIsAuthenticated} />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route path="dashboard" element={<Dashboard />} />
              <Route path="week/add" element={<AddWeek />} />
              <Route path="week/list" element={<ListWeek />} />
              <Route path="challenges/add" element={<AddChallenge />} />
              <Route path="challenges/list" element={<ListChallenge />} />
              <Route path="product/add" element={<AddProduct />} />
              <Route path="product/list" element={<ListProduct />} />
              {/* <Route path='rewardcategory/add' element={<AddRewardCategory />} /> */}
              {/* <Route path='rewardcategory/list'
               element={<ListRewardCategory /> }/> */}
              <Route path="challengeformlist" element={<ChallengeFormList />} />
              <Route path="doctorsList" element={<DoctorsList />} />
              <Route path="patientList" element={<PatientList />} />
              <Route path="paymentsList" element={<PaymentList />} />
              <Route path="ordersList" element={<OrdersList />} />
              <Route path="rewards/add" element={<AddRewards />} />
              <Route path="rewards/list" element={<ListRewards />} />
            </Route>
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
              }
            />
          </Routes>
        </HelmetProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
