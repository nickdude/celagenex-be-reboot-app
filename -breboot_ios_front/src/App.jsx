import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ChallengesPage from "./pages/Challenges";
import MemberProgramPage from "./pages/MemberProgram";
import Home from "./pages/Home";
import RedeemPage from "./pages/Redeem";
import Layout from "./layout/Layout";
import Welcome from "./pages/welcome";
import ChallengeDetails from "./pages/ChallengeDetails";
import DietConsultation from "./pages/DietConsultation";
import WeekChallengesPage from "./pages/WeekChallengesPage";
import Profile from "./pages/Profile";
import ProductPage from "./pages/ProductPage";
import RewardPage from "./pages/RewardPage";
import FirstLogin from "./pages/FirstLoginPage";
import ThankYouPage from "./pages/Thankyou";
import SplashScreen from "./pages/SplashScreen";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import SubmissionHistory from "./pages/SubmissionHistory";
import { UserProvider } from "./context/userContext";
import RedeemHistory from "./pages/RedeemHistory";
import TermsAndCondition from "./pages/TermsAndCondition";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Refund from "./pages/Refund";
import PurchaseHistory from "./pages/PurchaseHistory";
import Success from "./pages/PaymentSuccess";
import Failure from "./pages/PaymentFailure";
import ComingSoonProductPage from "./pages/ComingSoon";
import PublicLayout from "./layout/PublicLayout";
import NoNetworkPage from "./pages/NoNetworkPage";
import PaymentPage from "./pages/PaymentQR";
import ThankYouProduct from "./pages/ThankyouProduct";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <NoNetworkPage />;
  }

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <UserProvider>
          <Routes>
            {/* Public Route (Home) */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/termsandcondition" element={<TermsAndCondition />} />
              <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/success" element={<Success />} />
              <Route path="/failure" element={<Failure />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route path="/Challenges" element={<ChallengesPage />} />
                <Route path="/challenges/week/:weekId" element={<WeekChallengesPage />} />
                <Route path="/memberprogram" element={<MemberProgramPage />} />
                <Route path="/redeem" element={<RedeemPage />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/challenges/week/:weekId/:challengeId" element={<ChallengeDetails />} />
{/*                 <Route path="/dietconsultation" element={<DietConsultation />} /> */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/reward/:id" element={<RewardPage />} />
                <Route path="/thankyou" element={<ThankYouPage />} />
                <Route path="/firstlogin" element={<FirstLogin />} />
                <Route path="/challengehistory" element={<SubmissionHistory />} />
                <Route path="/redeemhistory" element={<RedeemHistory />} />
                <Route path="/pruchaseHistory" element={<PurchaseHistory />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/thank-you-product" element={<ThankYouProduct />} />
                {/* <Route path="/memberprogram" element={<ComingSoonProductPage />} /> */}
              </Route>
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
