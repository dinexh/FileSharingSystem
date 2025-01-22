import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiCloud, FiUploadCloud, FiShare2, FiShield, FiFolder } from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import './page.css';

const Auth = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    const toggleMode = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-illustration">
                    <div className="floating-icons">
                        <div className="icon-group main">
                            <FiCloud className="icon main-icon" />
                            <FiUploadCloud className="icon upload-icon" />
                        </div>
                        <div className="icon-group secondary top">
                            <FiShare2 className="icon" />
                        </div>
                        <div className="icon-group secondary bottom-left">
                            <FiShield className="icon" />
                        </div>
                        <div className="icon-group secondary bottom-right">
                            <FiFolder className="icon" />
                        </div>
                    </div>
                    <h1 className="illustration-title">
                        Cloud Storage <br /> Made Simple
                    </h1>
                </div>
            </div>
            
            <div className="auth-right">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1 className="auth-title">
                            {isSignIn ? "Welcome Back" : "Get Started"}
                        </h1>
                        <p className="auth-subtitle">
                            {isSignIn 
                                ? "Sign in to continue to CloudShare" 
                                : "Create your account"}
                        </p>
                    </div>

                    <div className="social-buttons">
                        <button className="social-button">
                            <FaGoogle className="social-icon" />
                            Google
                        </button>
                        <button className="social-button">
                            <FaGithub className="social-icon" />
                            GitHub
                        </button>
                    </div>
                    <form className="auth-form">
                        {!isSignIn && (
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <FiUser className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="auth-input"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        {isSignIn && (
                            <div className="form-extra">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#forgot" className="forgot-link">Forgot password?</a>
                            </div>
                        )}

                        <button type="submit" className="auth-button">
                            {isSignIn ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    <p className="toggle-text">
                        {isSignIn 
                            ? "Don't have an account? " 
                            : "Already have an account? "}
                        <button onClick={toggleMode} className="toggle-button">
                            {isSignIn ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;