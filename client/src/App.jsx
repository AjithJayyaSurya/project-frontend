import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (token, role) => {
    setToken(token);
    setRole(role);
  };

  const handleSignup = (token, role) => {
    setToken(token);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  if (!token) {
    if (showSignup) {
      return <Signup onSignup={handleSignup} switchToLogin={() => setShowSignup(false)} />;
    }
    return <Login onLogin={handleLogin} switchToSignup={() => setShowSignup(true)} />;
  }

  if (role === "ADMIN") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
