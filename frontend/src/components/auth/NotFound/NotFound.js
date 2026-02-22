import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import './NotFound.css';

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        {/* Glow effect background */}
        <div className="glow-sphere" />
        
        <div className="error-code">404</div>
        
        <div className="icon-wrapper">
          <AlertCircle size={48} className="text-blue-500" />
        </div>
        
        <h1>Page Not Found</h1>
        <p className="description">
          The medical record or page you are looking for doesn't exist or has been moved.
        </p>

        <div className="actions">
          <Link to="/Home" className="back-btn">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Link>
          
          <Link to="/Login" className="secondary-btn">
            Sign In
          </Link>
        </div>
      </div>
      
      <div className="notfound-footer">
        <div className="logo-box-small">
          <div className="logo-dot" />
        </div>
        <span>Nexus Medical Systems</span>
      </div>
    </div>
  );
}

export default NotFound;