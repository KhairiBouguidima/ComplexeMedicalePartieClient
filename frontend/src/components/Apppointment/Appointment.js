import React, { useState,Navigate } from 'react';
import './Appointment.css';
import { Link, useNavigate } from "react-router-dom";

const RendezVousPage = () => {
  // 1. Move appointments to state so the list can grow
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "Sarah Connor", date: "Jan 31, 2026", time: "14:30", type: "Urgent Checkup" },
    { id: 2, patient: "James Wilson", date: "Feb 02, 2026", time: "09:00", type: "Consultation" },
    { id: 3, patient: "Elena Rodriguez", date: "Feb 02, 2026", time: "11:15", type: "Follow-up" },
    { id: 4, patient: "Marcus Aurelius", date: "Feb 03, 2026", time: "16:45", type: "Diagnostics" }
  ]);

  // 2. Logic to add a new appointment
  const navigate = useNavigate();
  const addAppointment = () => {
   navigate('Book');
  };

  const nextRendezVous = appointments[0];
  const listRendezVous = appointments.slice(1);

  return (
    <div className="page-container">
      <section className="contact-section">
        
        {/* The New Button */}
        <button className="add-btn" onClick={addAppointment}>
          + Book New Appointment
        </button>

        <h3>Next Appointment</h3>
        
        {nextRendezVous && (
          <div className="info-card next-card">
            <span className="status-badge">Imminent</span>
            <h1 style={{ color: '#2563eb', margin: '0 0 10px 0' }}>{nextRendezVous.patient}</h1>
            <p style={{ fontSize: '1.2rem' }}>{nextRendezVous.date} at {nextRendezVous.time}</p>
            <p style={{ color: '#94a3b8' }}>Reason: {nextRendezVous.type}</p>
          </div>
        )}

        <h3>Upcoming List</h3>

        <div className="contact-grid">
          {listRendezVous.map((appt) => (
            <div key={appt.id} className="info-card">
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{appt.patient}</h4>
              <p style={{ margin: '5px 0' }}>📅 {appt.date}</p>
              <p style={{ margin: '5px 0' }}>⏰ {appt.time}</p>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{appt.type}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RendezVousPage;