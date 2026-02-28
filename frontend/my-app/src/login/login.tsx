import "./login.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleGoClick = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      navigate("/landing");
    } else {
      alert("Wrong email or password");
    }
  };

  return (
    <div className="login">
      <div className="group">
        <div className="text-wrapper">Welcome, user_name</div>

        <div className="rectangle" />
        <div className="div" />
        <div className="rectangle-2" />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-wrapper-2 input-field"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-wrapper-3 input-field"
        />

        <p className="p">Make sure you entered your details correctly</p>

        <Link to="/signup" className="text-wrapper-4">
          Don't have an account? Sign up
        </Link>

        <button
          className="text-wrapper-6"
          type="button"
          onClick={handleGoClick}
        >
          Go
        </button>
      </div>
    </div>
  );
};