import "./login.css";
import React, { useState } from "react";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoClick = () => {
    // Placeholder: handle login logic here
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="login">
      <div className="group">
        <div className="text-wrapper">Welcome, user_name</div>

        <div className="rectangle" />
        <div className="div" />
        <div className="rectangle-2" />

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-wrapper-2 input-field"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-wrapper-3 input-field"
        />

        <p className="p">Make sure you entered your details correctly</p>

        {/* Sign in as a link */}
        <a href="/signup" className="text-wrapper-4">
          Don't have an account? Sign up
        </a>

        {/* Go as a button */}
        <button className="text-wrapper-6" type="button" onClick={handleGoClick}>
          Go
        </button>
      </div>
    </div>
  );
};
