import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="topbar gradient-header">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>🧾</div>
        <div>
          <div className="brand-title">शिवानी फेब्रिकेशन</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>बिल पुस्तिका</div>
        </div>
      </div>

      <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>🏠 मुख्यपृष्ठ</Link>
        <Link to="/create-bill" style={{ color: "#fff", textDecoration: "none" }}>➕ नवीन बिल</Link>
        <Link to="/bills" style={{ color: "#fff", textDecoration: "none" }}>📋 सर्व बिल</Link>
        <Link to="/settings" style={{ color: "#fff", textDecoration: "none" }}>⚙️ सेटिंग्ज</Link>
      </nav>
    </header>
  );
}
