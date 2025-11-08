import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";

import ProtectedRoute from "./utils/ProtectedRoute.tsx";
import { AuthProvider } from "./utils/AuthContext";
import Layout from "./components/Layout";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddActivity from "./pages/AddActivity";
import Categories from "./pages/Categories";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import SubscriptionPage from "./pages/SubscriptionPage";
import ManageSubscription from "./pages/ManageSubscription.tsx";
import RequireSubscription from "./utils/RequireSubscription.tsx";

// Import Sales Tracker pages

// import Profile from "./pages/Profile";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes without sidebar layout */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />{" "}
        {/* Add this route */}
        {/* Protected routes with sidebar layout */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            {/* ✅ Allow access to subscription pages without payment */}
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route
              path="/manage-subscription"
              element={<ManageSubscription />}
            />

            {/* ✅ Paid-only routes */}
            <Route element={<RequireSubscription />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-activity" element={<AddActivity />} />
              <Route path="/history" element={<History />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
