import "./login.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";  // ✅ импорт axios клиента

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");  // Django использует username, не email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoClick = async () => {
    try {
      const response = await api.post('/api/token/', { username, password })
      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)

      navigate("/account")  // ✅ переходим на аккаунт
    } catch (err) {
      alert("Неверный логин или пароль")
    }
  };

  return (
    <div className="login">
      <div className="group">
        <div className="text-wrapper">Welcome back!</div>

        <div className="rectangle" />
        <div className="div" />
        <div className="rectangle-2" />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <button className="text-wrapper-6" type="button" onClick={handleGoClick}>
          Go
        </button>
      </div>
    </div>
  );
};