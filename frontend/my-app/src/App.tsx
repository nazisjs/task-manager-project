import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signin } from "./signin/signin";
import { Login } from "./login/login";
import { Landing } from "./landing page/landing";
import { Home } from "./landing page/home";
import TasksPage from "./task/tasks";
import Courses from "./self_courses/courses";
import Account from "./account/account";
import Settings from "./settings/settings";
import { ProtectedRoute } from "./components/Protectedroute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signin />} />
        <Route path="/landing" element={<Landing />} />

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
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;