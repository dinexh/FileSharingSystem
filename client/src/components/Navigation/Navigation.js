import './Navigation.css';
import { FiUploadCloud, FiShield, FiZap, FiGift } from 'react-icons/fi';

export default function Navigation({ onScrollTo }) {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <FiUploadCloud className="logo-icon pulse-animation" />
                CloudShare
            </div>
            <div className="navbar-links">
                <a href="#features" className="navbar-link" onClick={(e) => {
                    e.preventDefault();
                    onScrollTo('features');
                }}>
                    <FiZap className="nav-icon" />
                    <span>Features</span>
                </a>
                <a href="#security" className="navbar-link" onClick={(e) => {
                    e.preventDefault();
                    onScrollTo('security');
                }}>
                    <FiShield className="nav-icon" />
                    <span>Security</span>
                </a>
                <a href="#start" className="navbar-link special">
                    <FiGift className="nav-icon" />
                    <span>Get 5GB Free</span>
                </a>
                <button className="navbar-button">Upload Now</button>
            </div>
        </nav>
    );
} 