import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import React from "react";

import Home from "./Pages/Home/home";
import NotFound from "./Pages/NotFound"; 

import ResLogin from "./Pages/Restaurant/resLogin";
import MerchentRegister from "./Pages/Restaurant/resRegister";
import AddRestaurant from "./Pages/Restaurant/addRestaurant";
import ResWelcome from "./Pages/Restaurant/resWelcome";
import RestaurantDashboard from "./Pages/Restaurant/dashboardComponents/Dashboard/Dashboard";

import CusLogin from "./Pages/Customer/cusLogin";
import CusRegister from "./Pages/Customer/cusRegister";
import CusDashboard from "./Pages/Customer/customer-dashboard/CusDashboard";

// ⭐ Import your PaymentPage
import PaymentPage from "./Pages/Payment/PaymentPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Restaurant routes */}
        <Route path="/merchants" element={<ResLogin />} />
        <Route path="/merchants-signUp" element={<MerchentRegister />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/res-welcome" element={<ResWelcome />} />

        {/* Protected dashboard routes */}
        <Route path="/restaurant/*" element={<RestaurantDashboard />} />

        {/* Customer routes */}
        <Route path="/login" element={<CusLogin />} />
        <Route path="/register" element={<CusRegister />} />
        
        <Route path="/customer-dashboard" element={<CusDashboard />} />


        {/* 🔥 Payment Route - New */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* 404 Not Found - should be last */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
