import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signin } from "./signin/signin";
import { Login } from "./login/login";
import { Landing } from "./landing page/landing";
import TasksPage from "./tasks/task";
// 1. Import your Account component
import Account from "./account/account";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signin />} />
        <Route path="/account" element={<Account />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;