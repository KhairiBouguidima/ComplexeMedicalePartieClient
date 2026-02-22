import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
    return ( 
        <nav className="NavbarContainer">
            {/* Branding Logo */}
            <div className="NavLogo">
                <div className="LogoBox">
                    <div className="LogoDot" />
                </div>
                <span className="BrandName">Nexus.io</span>
            </div>

            {/* Navigation Links */}
            <div className="NavLinks">
                <Link to="/Home" className="NavLinkItem active">Home</Link>
                <div className="NavActions">
                    <Link to="/Login" className="btn-login">Login</Link>
                    <Link to="/Register" className="btn-register">Register</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;