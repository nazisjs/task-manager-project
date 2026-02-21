import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./login/login";     // твоя страница логина
import { Signin } from "./signin/signin";  // твоя страница регистрации

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />         {/* Главная страница - Login */}
        <Route path="/signup" element={<Signin />} />  {/* Страница Signin */}
      </Routes>
    </Router>
  );
}

export default App;
