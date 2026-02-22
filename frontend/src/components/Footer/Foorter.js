import React from 'react';
import './Footer.css';
import { Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

function Footer() {
    return ( 
        <footer className="contentFooter">
            <div className="block">
                <h3>Contact</h3>
                <ul>
                    <li><Phone size={16} className="text-blue-500" /> +216 71 000 000</li>
                    <li><Mail size={16} className="text-blue-500" /> support@medcore.com</li>
                </ul>
            </div>
            
            <div className="block">
                <h3>Our Services</h3>
                <ul>
                    <li>Online Appointments</li>
                    <li>Medical Records</li>
                    <li>Pharmacy Tracking</li>
                </ul>
            </div>
            
            <div className="block">
                <h3>Join Us</h3>
                <div className="social-icons">
                    <Facebook size={18} />
                    <Twitter size={18} />
                    <Instagram size={18} />
                </div>
                <p className="copyright">© 2026 MedCore Inc.</p>
            </div>
        </footer>
     );
}

export default Footer;