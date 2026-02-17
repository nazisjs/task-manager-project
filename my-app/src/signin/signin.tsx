import "./signin.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleGoClick = () => {
    console.log("Email:", email, "Password:", password, "Confirm:", confirm);
  };

  return (
    <div className="sign-in">
      <div className="group">
        <div className="text-wrapper">Hi, what's your name?</div>

        {/* Inputs */}
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="text-wrapper-4 input-field"
        />

        {/* Already have account link */}
        <Link to="/" className="text-wrapper-5">
          Already have an account? Log in
        </Link>

        {/* Go button */}
        <button className="text-wrapper-7" type="button" onClick={handleGoClick}>
          Go
        </button>
      </div>
    </div>
  );
};
