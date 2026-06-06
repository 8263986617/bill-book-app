import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { saveCompany, getCompany } from "../services/billService";
import "../styles/CompanySettings.css";
import { useToast } from "../context/ToastContext";

export default function CompanySettings() {
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [services, setServices] = useState("");
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const data = await getCompany();
        const defaultServices = "आर.सी.सी. कन्स्ट्रक्शन | आर.सी.सी. विहीर बांधकाम | आर.सी.सी. पाण्याची टाकी | फॅब्रिकेशन (वेल्डिंग कामे) | पत्र्याच्या शेडची कामे | आधुनिक कांदाचाळ बांधणी कामे";

        if (data.data) {
          console.log("Loaded company data - Logo:", !!data.data.logo, "Signature:", !!data.data.signature);

          setCompanyName(data.data.companyName || "");
          setOwnerName(data.data.ownerName || "");
          setMobile(data.data.mobile || "");
          setAddress(data.data.address || "");
          setGstNumber(data.data.gstNumber || "");
          setLogo(data.data.logo || null);
          setSignature(data.data.signature || null);

          if (data.data.services && String(data.data.services).trim()) {
            setServices(data.data.services);
          } else {
            setServices(defaultServices);
          }
        }
      } catch (error) {
        console.error("Error loading company:", error);
      }
    };

    loadCompanyData();
  }, []);

  const { showToast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (type === "logo") {
      setLogoLoading(true);
    } else if (type === "signature") {
      setSignatureLoading(true);
    }

    reader.onload = () => {
      if (type === "logo") {
        setLogo(reader.result);
        setLogoLoading(false);
      } else if (type === "signature") {
        setSignature(reader.result);
        setSignatureLoading(false);
      }
    };

    reader.onerror = (error) => {
      console.error(`Error reading ${type}:`, error);
      if (type === "logo") {
        setLogoLoading(false);
      } else if (type === "signature") {
        setSignatureLoading(false);
      }
      showToast(`चित्र अपलोड करताना त्रुटी. कृपया वेगळे चित्र वापरून पहा.`, "error");
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (!companyName.trim()) {
        showToast("कृपया कंपनीचे नाव भरा", "error");
        return;
      }

      setLoading(true);

      const companyData = {
        companyName,
        ownerName,
        mobile,
        address,
        gstNumber,
        services,
        logo,
        signature,
      };

      console.log("Saving company data:", {
        logo: !!logo,
        signature: !!signature,
        logoSize: logo ? logo.length : 0,
        signatureSize: signature ? signature.length : 0,
      });

      const response = await saveCompany(companyData);

      if (response.success || response.data) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        showToast(`सेटिंग्ज जतन झाल्या ✓${logo ? ' • लोगो तयार' : ''}${signature ? ' • सही तयार' : ''}`, "success");
        if (response.data) {
          setLogo(response.data.logo || logo);
          setSignature(response.data.signature || signature);
        }
      } else {
        showToast("सेटिंग्ज जतन करण्यात समस्या आली.", "error");
      }
    } catch (error) {
      console.error("Error saving company:", error);
      if (error.response?.data?.message) {
        showToast(`त्रुटी: ${error.response.data.message}`, "error");
      } else {
        showToast(`सेटिंग्ज जतन करताना त्रुटी: ${error.message}`, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-settings-container">
      {saved && (
        <div className="success-message">
          ✓ सेटिंग्ज जतन झाल्या
          {logo && " • लोगो जतन"}
          {signature && " • सही जतन"}
        </div>
      )}

      <div className="settings-section">
        <h2>कंपनी माहिती</h2>
        <div className="form-row">
          <div className="form-group">
            <label>कंपनीचे नाव *</label>
            <input
              type="text"
              className="form-control"
              placeholder="कंपनीचे नाव टाका"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>मालकाचे नाव</label>
            <input
              type="text"
              className="form-control"
              placeholder="मालकाचे नाव टाका"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>मोबाइल नंबर</label>
            <input
              type="text"
              className="form-control"
              placeholder="मोबाइल नंबर टाका"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>GST क्रमांक</label>
            <input
              type="text"
              className="form-control"
              placeholder="GST क्रमांक टाका"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>पत्ता</label>
          <textarea
            className="form-control"
            placeholder="पूर्ण पत्ता टाका"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>सेवांची माहिती</label>
          <textarea
            className="form-control"
            placeholder="उदाहरण: फॅब्रिकेशन, वेल्डिंग इत्यादी"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            rows="3"
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>कंपनी ब्रँडिंग</h2>

        <div className="form-row">
          <div className="upload-container">
            <label>कंपनी लोगो</label>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logo")}
              />
              <div className="upload-content">
                {logoLoading ? (
                  <p style={{ fontSize: '13px', color: '#666' }}>लोगो लोड होत आहे...</p>
                ) : logo ? (
                  <>
                    <img src={logo} alt="Company Logo" className="upload-preview" />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>✓ जतन करण्यास तयार</p>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    📸 लोगो अपलोड करा
                  </div>
                )}
              </div>
            </div>
            {logo && (
              <button
                className="btn-remove"
                onClick={() => setLogo(null)}
              >
                लोगो हटवा
              </button>
            )}
          </div>

          <div className="upload-container">
            <label>अधिकृत सही</label>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "signature")}
              />
              <div className="upload-content">
                {signatureLoading ? (
                  <p style={{ fontSize: '13px', color: '#666' }}>सही लोड होत आहे...</p>
                ) : signature ? (
                  <>
                    <img src={signature} alt="Signature" className="upload-preview" />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>✓ जतन करण्यास तयार</p>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    ✍️ सही अपलोड करा
                  </div>
                )}
              </div>
            </div>
            {signature && (
              <button
                className="btn-remove"
                onClick={() => setSignature(null)}
              >
                सही हटवा
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
          <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading || logoLoading || signatureLoading}
        >
          {loading ? "जतन करत आहे..." : "💾 सेटिंग्ज जतन करा"}
        </button>
        <button
          className="btn btn-outline"
          style={{ marginLeft: 12 }}
          onClick={handleLogout}
        >
          🔒 लॉगआउट
        </button>
      </div>
    </div>
  );
}