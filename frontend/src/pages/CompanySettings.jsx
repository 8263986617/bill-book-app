import { useEffect, useState } from "react";
import { saveCompany, getCompany } from "../services/billService";
import "../styles/CompanySettings.css";

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
      alert(`Error loading ${type}. Please try a different image.`);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (!companyName.trim()) {
        alert("Please enter company name");
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
        alert(`✓ Settings Saved Successfully${logo ? '\n✓ Logo Saved' : ''}${signature ? '\n✓ Signature Saved' : ''}`);
        if (response.data) {
          setLogo(response.data.logo || logo);
          setSignature(response.data.signature || signature);
        }
      } else {
        alert("Error: Save response invalid");
      }
    } catch (error) {
      console.error("Error saving company:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert(`Error saving settings: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-settings-container">
      {saved && (
        <div className="success-message">
          ✓ Settings saved successfully
          {logo && " (Logo saved)"}
          {signature && " (Signature saved)"}
        </div>
      )}

      <div className="settings-section">
        <h2>Company Information</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Owner Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter owner name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>GST Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter GST number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            className="form-control"
            placeholder="Enter full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Services Description</label>
          <textarea
            className="form-control"
            placeholder="Describe your services (e.g., Fabrication, Welding, etc.)"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            rows="3"
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Company Branding</h2>

        <div className="form-row">
          <div className="upload-container">
            <label>Company Logo</label>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logo")}
              />
              <div className="upload-content">
                {logoLoading ? (
                  <p style={{ fontSize: '13px', color: '#666' }}>Loading logo...</p>
                ) : logo ? (
                  <>
                    <img src={logo} alt="Company Logo" className="upload-preview" />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>✓ Ready to save</p>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    📸 Click to upload logo
                  </div>
                )}
              </div>
            </div>
            {logo && (
              <button
                className="btn-remove"
                onClick={() => setLogo(null)}
              >
                Remove Logo
              </button>
            )}
          </div>

          <div className="upload-container">
            <label>Authorized Signature</label>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "signature")}
              />
              <div className="upload-content">
                {signatureLoading ? (
                  <p style={{ fontSize: '13px', color: '#666' }}>Loading signature...</p>
                ) : signature ? (
                  <>
                    <img src={signature} alt="Signature" className="upload-preview" />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>✓ Ready to save</p>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    ✍️ Click to upload signature
                  </div>
                )}
              </div>
            </div>
            {signature && (
              <button
                className="btn-remove"
                onClick={() => setSignature(null)}
              >
                Remove Signature
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
          {loading ? "Saving..." : "💾 Save Settings"}
        </button>
      </div>
    </div>
  );
}