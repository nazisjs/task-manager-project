import "./signin.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";  // ✅ используем axios клиент

export const Signin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoClick = async () => {
    // Валидация на фронте
    if (!username || !email || !password || !confirm) {
      setError("Все поля обязательны");
      return;
    }

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const registerResponse = await api.post("/api/register/", {
        username,
        email,
        password,
      });

      if (registerResponse.status === 201) {

        const loginResponse = await api.post("/api/token/", {
          username,
          password,
        });

        localStorage.setItem("access", loginResponse.data.access);
        localStorage.setItem("refresh", loginResponse.data.refresh);

        navigate("/account");
      }
    } catch (err: any) {

      if (err.response?.data) {
        const errors = err.response.data;
        const errorMsg = Object.values(errors).flat().join(", ");
        setError(errorMsg || "Ошибка регистрации");
      } else {
        setError("Ошибка регистрации. Попробуй ещё раз.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in">
      <div className="group">
        <div className="text-wrapper">Hi, what's your name?</div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field password-field"
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input-field confirm-field"
          disabled={loading}
        />
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <Link to="/login" className="text-wrapper-5">
          Already have an account? Log in
        </Link>

        <button
          onClick={handleGoClick}
          className="text-wrapper-7"
          disabled={loading}
        >
          {loading ? "Registering..." : "Go"}
        </button>
      </div>
    </div>
  );
};