import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!mobile || !password) {
        setError("कृपया सर्व फील्ड भरा");
        setLoading(false);
        return;
      }

      const validMobile = "9272970997";
      const validPassword = "9272970997";

      if (mobile !== validMobile || password !== validPassword) {
        setError("चुकीचा मोबाइल नंबर किंवा पासवर्ड. कृपया 9272970997 वापरा.");
        setLoading(false);
        return;
      }

      const user = {
        mobile: validMobile,
        name: "shivani",
        id: "demo123",
      };

      login(user);
      navigate("/bills");
    } catch (error) {
      console.error(error);
      setError("लॉगिन अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="company-title">शिवानी फेब्रिकेशन</h1>
          <p className="tagline">बिल पुस्तिका</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>मोबाइल नंबर</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="आपला मोबाइल नंबर टाका"
              disabled={loading}
            />
          </div>

          <div className="form-group password-group">
            <label>पासवर्ड</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="आपला पासवर्ड टाका"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? "लपवा" : "पाहा"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "प्रवेश करत आहे..." : "लॉगिन"}
          </button>
        </form>

        <div className="demo-info">
          <p>फक्त मोबाइल नंबर 9272970997 आणि पासवर्ड 9272970997 वापरून लॉगिन करा.</p>
        </div>
      </div>
    </div>
  );
}
