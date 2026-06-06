import { Link } from "react-router-dom";

export default function BottomNav() {
  return (
    <div className="bottom-nav" role="navigation" aria-label="नॅव्हिगेशन">
      <Link to="/dashboard" className="nav-item">🏠<span style={{fontSize:12}}>मुख्य</span></Link>
      <Link to="/create-bill" className="nav-item">➕<span style={{fontSize:12}}>नवीन</span></Link>
      <Link to="/bills" className="nav-item">📋<span style={{fontSize:12}}>बिले</span></Link>
      <Link to="/settings" className="nav-item">⚙️<span style={{fontSize:12}}>सेटिंग्ज</span></Link>
    </div>
  );
}
