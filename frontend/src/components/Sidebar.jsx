import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="brand-title">शिवानी<br />फेब्रिकेशन</h1>
        <p className="brand-subtitle">बिल पुस्तिका</p>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className="nav-link">
          <span className="nav-icon">📊</span>
          <span className="nav-text">डॅशबोर्ड</span>
        </Link>

        <Link to="/create-bill" className="nav-link">
          <span className="nav-icon">➕</span>
          <span className="nav-text">नवीन बिल</span>
        </Link>

        <Link to="/bills" className="nav-link">
          <span className="nav-icon">📋</span>
          <span className="nav-text">सर्व बिल</span>
        </Link>

        <Link to="/settings" className="nav-link">
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">सेटिंग्ज</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email || user?.mobile}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          लॉगआउट
        </button>
      </div>
    </aside>
  );
}
