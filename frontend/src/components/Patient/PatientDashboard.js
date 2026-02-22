import React, {useCallback, useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Settings, LogOut, User, 
  Clock, Activity, MapPin, Save, ShieldCheck, Bell, ChevronRight, Plus, Trash2,
  CreditCard // Added for Invoices
} from 'lucide-react';
import { apiRequest } from '../api/api';
import "./Dashboard.css";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]); // New state for invoices
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [newBooking, setNewBooking] = useState({ doctorId: '', date: '', time: '', reason: '' });

  const [resetStep, setResetStep] = useState(1); 
  const [resetData, setResetData] = useState({ email: '', method: 'email', code: '', new_password: '' });

  const [formData, setFormData] = useState({
    username: '', Telephone: '', address: '', city: '', state: ''
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) fetchData();
  }, [userId,fetchData]);

 // 1. Wrap the function in useCallback
const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const [profileRes, apptRes, docsRes, invRes] = await Promise.all([
      apiRequest(`/patient/my-profile/${userId}`),
      apiRequest(`/patient/appointments/${userId}`),
      apiRequest(`/doctors/list`),
      apiRequest(`/patient/invoices/${userId}`)
    ]);

    if (profileRes.status === "success") {
      setProfile(profileRes.data);
      setFormData({
        username: profileRes.data.info.username || '',
        Telephone: profileRes.data.info.telephone || '',
        address: profileRes.data.info.address || '',
        city: profileRes.data.info.city || '',
        state: profileRes.data.info.state || ''
      });
      setResetData(prev => ({ ...prev, email: profileRes.data.info.email || '' }));
    }
    if (apptRes.status === "success") setAppointments(apptRes.data);
    if (docsRes.status === "success") setDoctors(docsRes.data);
    if (invRes.status === "success") setInvoices(invRes.data);
  } catch (err) {
    console.error("Failed to fetch dashboard data");
  } finally {
    setLoading(false);
  }
}, [userId]); // 2. Add userId as the only dependency here

// 3. Update your useEffect to look like this
useEffect(() => {
  if (userId) {
    fetchData(); 
  }
}, [userId, fetchData]); // No parentheses after fetchData!

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      doctorId: newBooking.doctorId,
      patientId: userId,
      appointment_date: `${newBooking.date} ${newBooking.time}:00`,
      reason: newBooking.reason
    };

    const res = await apiRequest('/appointments/add', 'POST', payload);
    if (res.status === "success") {
      alert("Rendez-vous enregistré !");
      setIsModalOpen(false);
      fetchData();
    } else {
      alert(res.message);
    }
  };

  const handleDeleteAppointment = async (apptId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const res = await apiRequest(`/appointments/delete/${apptId}`, 'DELETE');
        if (res.status === "success") {
          fetchData(); 
        } else {
          alert(res.message || "Error deleting appointment");
        }
      } catch (err) {
        alert("Server error during deletion");
      }
    }
  };

  // Payment handler
  const handlePayInvoice = async (invoiceId) => {
    const method = window.prompt("Enter payment method (Card, Cash, Bank Transfer):", "Card");
    if (!method) return;

    const res = await apiRequest(`/invoices/pay/${invoiceId}`, 'PUT', { payment_method: method });
    if (res.status === "success") {
      alert(res.message);
      fetchData();
    } else {
      alert(res.message);
    }
  };

  const handleRequestReset = async () => {
    const res = await apiRequest('/settings/reset-password-request', 'POST', {
      email: resetData.email,
      method: resetData.method
    });
    if (res.message) {
      alert(res.message);
      setResetStep(2);
    }
  };

  const handleConfirmReset = async () => {
    const res = await apiRequest('/settings/reset-password-confirm', 'POST', {
      email: resetData.email,
      code: resetData.code,
      new_password: resetData.new_password
    });
    if (res.message) {
      alert(res.message);
      setResetStep(1);
      setResetData({ ...resetData, code: '', new_password: '' });
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <Activity size={24} color="#2563eb" />
          <span className="logo-text">MedConnect</span>
        </div>
        
        <nav className="nav-menu">
          <NavItem id="overview" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab} onClick={setActiveTab} />
          <NavItem id="appointments" icon={<Calendar size={20}/>} label="Appointments" active={activeTab} onClick={setActiveTab} />
          <NavItem id="billing" icon={<CreditCard size={20}/>} label="Billing" active={activeTab} onClick={setActiveTab} />
          <NavItem id="profile" icon={<User size={20}/>} label="Profile" active={activeTab} onClick={setActiveTab} />
          <NavItem id="settings" icon={<Settings size={20}/>} label="Settings" active={activeTab} onClick={setActiveTab} />
        </nav>

        <button className="nav-item logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div>
            <h2 style={{ fontSize: '10px', color: 'var(--primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Portal</h2>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{activeTab}</h1>
          </div>
          
          <div className="user-profile">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="user-info">
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{profile?.info?.username}</p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Patient ID: #2024</p>
            </div>
            <div className="avatar">
              {profile?.info?.photo ? 
                <img src={`data:image/jpeg;base64,${profile.info.photo}`} alt="avatar" /> : 
                <User size={20} style={{ color: 'var(--text-muted)' }}/>}
            </div>
          </div>
        </header>

        <div className="scroll-area" style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          <div className="animate-view" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            {activeTab === 'overview' && (
              <div className="stats-grid">
                <StatCard icon={<Clock size={24}/>} theme="blue" title="Next Visit" value={profile?.next_appointment?.date || "No Schedule"} sub={profile?.next_appointment?.doctor_name || "Stay Tuned"} />
                <StatCard icon={<ShieldCheck size={24}/>} theme="green" title="Health Score" value="94%" sub="Verified Profile" />
                <StatCard icon={<MapPin size={24}/>} theme="orange" title="Location" value={profile?.info?.city || "Set Location"} sub={profile?.info?.state || "N/A"} />
              </div>
            )}
            
            {activeTab === 'appointments' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: 'bold' }}>Your Appointments</h3>
                  <button className="btn-primary" style={{ margin: 0 }} onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> New Appointment
                  </button>
                </div>
                <AppointmentsTable appointments={appointments} onDelete={handleDeleteAppointment} />
              </>
            )}

            {activeTab === 'billing' && (
              <>
                <h3 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Billing & Invoices</h3>
                <InvoicesTable invoices={invoices} onPay={handlePayInvoice} />
              </>
            )}

            {activeTab === 'profile' && <ProfileContent profile={profile} />}
            
            {activeTab === 'settings' && (
              <SettingsContent 
                formData={formData} 
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
                onSave={() => alert('Saved')}
                resetStep={resetStep}
                setResetStep={setResetStep}
                resetData={resetData}
                setResetData={setResetData}
                handleRequestReset={handleRequestReset}
                handleConfirmReset={handleConfirmReset}
              />
            )}
          </div>
        </div>
      </main>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        doctors={doctors}
        bookingData={newBooking}
        setBookingData={setNewBooking}
        onSubmit={handleBookSubmit}
      />
    </div>
  );
};

// --- Sous-Composants ---

const NavItem = ({ id, icon, label, active, onClick }) => (
  <button onClick={() => onClick(id)} className={`nav-item ${active === id ? 'active' : ''}`}>
    {icon} <span>{label}</span>
    {active === id && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
  </button>
);

const InvoicesTable = ({ invoices, onPay }) => (
  <div className="form-card" style={{ maxWidth: '100%', padding: 0 }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '11px' }}>
        <tr>
          <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>INVOICE ID</th>
          <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>DATE</th>
          <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>DOCTOR</th>
          <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>AMOUNT</th>
          <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>STATUS</th>
          <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {invoices.length > 0 ? invoices.map(inv => (
          <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '1rem 2rem', fontWeight: '600' }}>#{inv.id}</td>
            <td style={{ padding: '1rem 2rem' }}>{inv.issued_at}</td>
            <td style={{ padding: '1rem 2rem' }}>Dr. {inv.doctor_name}</td>
            <td style={{ padding: '1rem 2rem', fontWeight: 'bold' }}>${inv.total_amount}</td>
            <td style={{ padding: '1rem 2rem' }}>
              <span className={`status-badge ${inv.status.toLowerCase()}`}>{inv.status}</span>
            </td>
            <td style={{ padding: '1rem 2rem', textAlign: 'right' }}>
              {inv.status === "Unpaid" && (
                <button 
                  onClick={() => onPay(inv.id)}
                  className="btn-primary" 
                  style={{ padding: '4px 12px', fontSize: '12px', margin: 0 }}
                >
                  Pay Now
                </button>
              )}
            </td>
          </tr>
        )) : (
          <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No invoices found.</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const ProfileContent = ({ profile }) => {
  if (!profile) return null;
  const { info, next_appointment } = profile;

  return (
    <div className="animate-view" style={{ display: 'grid', gap: '2rem' }}>
      <div className="form-card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--primary)' }}>
          {info.photo ? <img src={`data:image/jpeg;base64,${info.photo}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" /> : <User size={40} color="var(--text-muted)" />}
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{info.username}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{info.email}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="form-card">
          <h3 style={{ fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> Contact Info</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div><label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Phone</label><p style={{ fontWeight: '600' }}>{info.telephone || 'N/A'}</p></div>
            <div><label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Address</label><p style={{ fontWeight: '600' }}>{info.address}, {info.city}</p></div>
            <div><label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Region</label><p style={{ fontWeight: '600' }}>{info.state}</p></div>
          </div>
        </div>

        <div className="form-card">
          <h3 style={{ fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> Next Scheduled</h3>
          {next_appointment ? (
            <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '12px' }}>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>{next_appointment.date}</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '4px 0' }}>Dr. {next_appointment.doctor_name}</p>
              <p style={{ fontSize: '12px' }}>{next_appointment.specialty} • {next_appointment.status}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No upcoming visits.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, theme, title, value, sub }) => {
  const colors = { blue: '#2563eb', green: '#059669', orange: '#d97706' };
  const bgs = { blue: '#eff6ff', green: '#ecfdf5', orange: '#fffbeb' };
  return (
    <div className="stat-card">
      <div className="icon-wrapper" style={{ backgroundColor: bgs[theme], color: colors[theme] }}>{icon}</div>
      <h3 className="stat-label">{title}</h3>
      <p className="stat-value">{value}</p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  );
};

const AppointmentsTable = ({ appointments, onDelete }) => (
  <div className="form-card" style={{ maxWidth: '100%', padding: 0 }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '11px' }}>
        <tr>
          <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>DATE</th>
          <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>DOCTOR</th>
          <th style={{ padding: '1rem 2rem', textAlign: 'left' }}>STATUS</th>
          <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(app => (
          <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '1rem 2rem', fontWeight: '600' }}>{app.date}</td>
            <td style={{ padding: '1rem 2rem' }}>Dr. {app.doctor_name}</td>
            <td style={{ padding: '1rem 2rem' }}>
              <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
            </td>
            <td style={{ padding: '1rem 2rem', textAlign: 'right' }}>
               <button 
                 onClick={() => onDelete(app.id)}
                 className="icon-btn-delete"
                 style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                 title="Cancel Appointment"
               >
                 <Trash2 size={18} />
               </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BookingModal = ({ isOpen, onClose, doctors, bookingData, setBookingData, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="form-card animate-view" style={{ width: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Book Appointment</h2>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="input-group">
            <label>Doctor</label>
            <select required className="custom-select" value={bookingData.doctorId} onChange={(e) => setBookingData({...bookingData, doctorId: e.target.value})}>
              <option value="">Select a doctor</option>
              {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.username}</option>)}
            </select>
          </div>
          <div className="input-grid">
            <div className="input-group"><label>Date</label><input type="date" required onChange={(e) => setBookingData({...bookingData, date: e.target.value})} /></div>
            <div className="input-group"><label>Time</label><input type="time" required onChange={(e) => setBookingData({...bookingData, time: e.target.value})} /></div>
          </div>
          <div className="input-group"><label>Reason</label><input type="text" onChange={(e) => setBookingData({...bookingData, reason: e.target.value})} /></div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, margin: 0 }}>Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="loader-container">
    <Activity size={40} className="animate-spin" color="#2563eb" />
    <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontWeight: 'bold' }}>LOADING...</p>
  </div>
);

const SettingsContent = ({ 
  formData, onChange, onSave, 
  resetStep, setResetStep, resetData, setResetData, 
  handleRequestReset, handleConfirmReset 
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div className="form-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Profile Settings</h2>
        <div className="input-grid">
            <div className="input-group"><label>Username</label><input name="username" value={formData.username} onChange={onChange}/></div>
            <div className="input-group"><label>Phone</label><input name="Telephone" value={formData.Telephone} onChange={onChange}/></div>
        </div>
        <button className="btn-primary" style={{marginTop: '1.5rem'}} onClick={onSave}><Save size={18}/> Save Profile</button>
    </div>

    <div className="form-card" style={{ borderTop: '4px solid var(--primary)' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Security</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Reset your password via OTP verification.</p>

      {resetStep === 1 ? (
        <div className="input-grid">
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={resetData.email} onChange={(e) => setResetData({...resetData, email: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Verification Method</label>
            <select className="custom-select" value={resetData.method} onChange={(e) => setResetData({...resetData, method: e.target.value})}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleRequestReset} style={{ gridColumn: 'span 2' }}>Send Reset Code</button>
        </div>
      ) : (
        <div className="input-grid">
          <div className="input-group">
            <label>Enter 6-digit Code</label>
            <input type="text" maxLength="6" onChange={(e) => setResetData({...resetData, code: e.target.value})} />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" onChange={(e) => setResetData({...resetData, new_password: e.target.value})} />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" onClick={() => setResetStep(1)} style={{ flex: 1 }}>Back</button>
            <button className="btn-primary" onClick={handleConfirmReset} style={{ flex: 2, margin: 0 }}>Confirm Update</button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default PatientDashboard;