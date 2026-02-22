import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, UserCircle, Phone, MapPin, Building2, Map } from "lucide-react";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  
  // États de base
  const [role, setRole] = useState('');
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfPass, setCfPass] = useState("");
  
  // Nouveaux états basés sur ton PatientModel
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation de base
    if (!role || !firstname || !lastname || !email || !password) {
      setMsg("Required fields are missing");
      return;
    }
    if (password !== cfPass) {
      setMsg("Passwords do not match");
      return;
    }

    const fullname = `${firstname} ${lastname}`;

    try {
      const res = await axios.post("http://127.0.0.1:5000/register", {
        role,
        username: fullname,
        email,
        password,
        // Envoi des nouveaux champs au backend
        Telephone: telephone,
        address: address,
        city: city,
        state: state
      });
      
      if (res.status === 200 || res.status === 201) {
        navigate('/Login');
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-info">
          <div className="brand-wrapper">
            <div className="logo-box-small"><div className="logo-dot" /></div>
            <h2>Nexus Medical</h2>
          </div>
          <p>Create your account to manage your health network.</p>
          <img src="/imgs/pngegg.png" alt="medical" className="register-img" />
        </div>

        <div className="register-form-section">
          {msg && <div className="error-banner">{msg}</div>}
          
          <form onSubmit={handleRegister}>
            {/* ROLE SELECTION */}
            <div className="input-group">
              <label>Role</label>
              <div className="input-wrapper">
                <UserCircle className="input-icon" size={18} />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="" disabled>Select your role</option>
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
            </div>

            {/* NAME ROW */}
            <div className="form-row">
              <div className="input-group">
                <label>First Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="John" required />
                </div>
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Doe" required />
                </div>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@nexus.com" required />
              </div>
            </div>

            <div className="input-group">
              <label>Telephone</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+216 ..." />
              </div>
            </div>

            {/* ADDRESS SECTION (Optional fields from Model) */}
            <div className="input-group">
              <label>Address</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Medical St" />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>City</label>
                <div className="input-wrapper">
                  <Building2 className="input-icon" size={18} />
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Tunis" />
                </div>
              </div>
              <div className="input-group">
                <label>State / Region</label>
                <div className="input-wrapper">
                  <Map className="input-icon" size={18} />
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Ariana" />
                </div>
              </div>
            </div>

            {/* PASSWORDS */}
            <div className="form-row">
              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
              </div>
              <div className="input-group">
                <label>Confirm</label>
                <div className="input-wrapper">
                  <ShieldCheck className="input-icon" size={18} />
                  <input type="password" value={cfPass} onChange={(e) => setCfPass(e.target.value)} placeholder="••••••••" required />
                </div>
              </div>
            </div>

            <button type="submit" className="register-btn">Create Account</button>
            
            <p className="login-link">
              Already have an account? <Link to="/Login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;