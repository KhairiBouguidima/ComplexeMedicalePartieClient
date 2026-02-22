import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  Mail, Lock, UserCircle, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import "./Login.css";

// Constantes pour la maintenance
const ROLES = {
  DOCTOR: 'Doctor',
  PATIENT: 'Patient'
};

function Login() {
  const navigate = useNavigate();
  
  // États du formulaire
  const [role, setRole] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // États d'interface
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation simple avant envoi
    if (!role || !email || !password) {
      setMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const res = await axios.post("http://127.0.0.1:5000/login", { 
        email, 
        password, 
        role 
      });
      
      // Stockage structuré
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      // Redirection dynamique basée sur le mapping
      const routes = {
        [ROLES.DOCTOR]: "/Doctor/Dashboard",
        [ROLES.PATIENT]: "/Patient/Dashboard"
      };
      console.log(routes[res.data.role] )
      navigate(routes[res.data.role] || "/Dashboard");

      
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side: Branding */}
        <div className="login-info">
          <div className="brand-wrapper">
            <div className="logo-box-small"><div className="logo-dot" /></div>
            <h2>Nexus Medical</h2>
          </div>
          <p className="subtitle">Welcome back! Please login to your account.</p>
          <img className="login-logo-img" src="/imgs/pngegg.png" alt="logo" />
        </div>

        {/* Right Side: Form */}
        <div className="login-form-section">
          <h2 className="form-title">Login</h2>
          
          {msg && <div className="error-banner">{msg}</div>}
          
          <form onSubmit={handleLogin}>
            {/* Role Selection */}
            <div className="input-group">
              <label>Role</label>
              <div className="input-wrapper">
                <UserCircle className="input-icon" size={18} />
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value={ROLES.PATIENT}>Patient</option>
                  <option value={ROLES.DOCTOR}>Doctor</option>
                </select>
              </div>
            </div>

            {/* Email Input */}
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@company.com" 
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>Wait a moment... <Loader2 className="spinner" size={18} /></>
              ) : (
                <>Login <ArrowRight size={18} /></>
              )}
            </button>
            
            <p className="register-link">
              Don't have an account? <Link to="/Register">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;