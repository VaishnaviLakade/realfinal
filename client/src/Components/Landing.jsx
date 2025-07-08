// src/components/Landing.jsx
import React, { useState } from "react";
import "../css/Landing.css";
import pictLogo from "../assets/pictlogo.png";

const Landing = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: email, pass: password }),
      });

      const result = await response.text();

      if (result === "Login Successful") {
        window.location.href = "/dashbrd";
      } else {
        alert(result);
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={pictLogo} alt="PICT Logo" className="logo-img" />
        <button className="login-btn" onClick={() => setShowPopup(true)}>
          <i className="fa-solid fa-user"></i> Login
        </button>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h2>
            Welcome to <span>PICT, Pune</span>
          </h2>
          <p className="para">
            To be the leading and most sought-after institute of education and
            research in emerging engineering and technology disciplines.
          </p>
        </div>
      </section>

      {showPopup && (
        <div className="popup-overlay">
          <div
            className={`form-popup ${isSignup ? "show-signup" : "show-login"}`}
          >
            <span className="close-btn" onClick={() => setShowPopup(false)}>
              &times;
            </span>
            <div className="form-box">
              <div className="form-content">
                <h1>
                  {isSignup ? "Subject-Cordinator Login" : "Teacher Login"}
                </h1>
                <form onSubmit={handleSubmit}>
                  <div className="input-field">
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email</label>
                  </div>
                  <div className="input-field">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                  </div>
                  <button type="submit">Log in</button>
                </form>
                <div className="bottom-link">
                  {isSignup ? (
                    <>
                      Are you a Teacher?{" "}
                      <a href="#" onClick={() => setIsSignup(false)}>
                        Login
                      </a>
                    </>
                  ) : (
                    <>
                      Are you Subject-Cordinator?{" "}
                      <a href="#" onClick={() => setIsSignup(true)}>
                        Login
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="landing-footer">
        <div className="footer-col">
          <i className="fa-solid fa-location-dot"></i>
          <h4>Address</h4>
          <p>
            Survey No. 27, Near Trimurti Chowk
            <br />
            Dhankwadi, Pune - 411043
          </p>
        </div>
        <div className="footer-col">
          <i className="fa-solid fa-phone"></i>
          <h4>Phone</h4>
          <p>
            +91 20 24371101
            <br />
            Fax: +91 20 24364741
          </p>
        </div>
        <div className="footer-col">
          <i className="fa-solid fa-envelope"></i>
          <h4>Email</h4>
          <p>registrar@pict.edu</p>
        </div>
        <div className="footer-col">
          <h4>Follow us</h4>
          <div className="social-links">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
