import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signin } from "./signin/signin";
import { Login } from "./login/login";
import { Landing } from "./landing page/landing";
import TasksPage from "./task/tasks";
import Account from "./account/account";
import { ProtectedRoute } from "./components/Protectedroute";  // ✅ правильный импорт

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Публичные маршруты */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signin />} />

        {/* 🔒 Защищённые маршруты */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;