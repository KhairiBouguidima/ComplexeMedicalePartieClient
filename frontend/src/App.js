import React from "react";
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";
import NotFound from "./components/auth/NotFound/NotFound";
import Footer from "./components/Footer/Foorter"; 
import Navbar from "./components/Navbar/Navbar";
import PatientDashboard from "./components/Patient/PatientDashboard";
import './App.css';
// A clean wrapper for protected content
//const DashboardLayout = ({ children }) => (
  //<div style={{ display: 'flex', minHeight: '80vh', backgroundColor: '#020617' }}>
    //<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      //<main style={{ flex: 1 }}>
        //{children}
      //</main>
    //</div>
  //</div>
//);

function App() {
  const logout =()=>{
      localStorage.removeItem('token');
      <Navigate to={"/Login"} /> 
  }
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar logout={logout} />

        <Routes>
          {/* Public Routes */}
          <Route path="/Register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />

          {/* Protected Routes */}
              {/* Patient Routes */}
                <Route path="/Patient/Dashboard" element={<PatientDashboard />} />
              {/* Doctor Routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;