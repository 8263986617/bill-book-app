import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav style={{
      backgroundColor: "#333",
      padding: "15px 20px",
      display: "flex",
      gap: "20px",
      alignItems: "center"
    }}>
      <Link to="/bills" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
        📋 Bills
      </Link>
      <Link to="/settings" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
        ⚙️ Settings
      </Link>
    </nav>
  );
}
