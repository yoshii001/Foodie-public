import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import all your pages
import Home from "./Pages/Home/home";
import CusLogin from "./Pages/Customer/cusLogin";
import ResLogin from "./Pages/Restaurant/resLogin";
import ResRegister from "./Pages/Restaurant/resRegister";
import ResWelcome from "./Pages/Restaurant/resWelcome";
import AddRestaurant from "./Pages/Restaurant/addRestaurant";
import Dashboard from "./Pages/Restaurant/Dashboard";
import AddMenu from "./Pages/Restaurant/Add-Menu";
import Menu from "./Pages/Restaurant/Menu";
import Orders from "./Pages/Restaurant/Orders";
import MyProfile from "./Pages/Restaurant/MyProfile";
import MyRestaurant from "./Pages/Restaurant/MyRestaurant";
import Overview from "./Pages/Restaurant/Overview";
// Add other imports as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cuslogin" element={<CusLogin />} />
        <Route path="/reslogin" element={<ResLogin />} />
        <Route path="/resregister" element={<ResRegister />} />
        <Route path="/reswelcome" element={<ResWelcome />} />
        <Route path="/addrestaurant" element={<AddRestaurant />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-menu" element={<AddMenu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/myrestaurant" element={<MyRestaurant />} />
        <Route path="/overview" element={<Overview />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;