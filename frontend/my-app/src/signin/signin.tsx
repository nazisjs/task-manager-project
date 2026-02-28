import "./signin.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const handleGoClick = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      navigate("/landing");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="sign-in">
      <div className="group">
        {/* FIX 1: Added text-wrapper class here */}
        <div className="text-wrapper">Hi, what's your name?</div>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field" 
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field password-field" // ADDED CLASS HERE
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input-field confirm-field" // ADDED CLASS HERE
        />

        <Link to="/" className="text-wrapper-5">Already have an account? Log in</Link>

        <button onClick={handleGoClick} className="text-wrapper-7">Go</button>
      </div>
    </div>
  );
};