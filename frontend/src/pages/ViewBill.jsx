import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getBillById, getCompany } from "../services/billService";
import { numToWordsMr } from "../utils/numberToWords";
import "../styles/ViewBill.css";
import { useToast } from "../context/ToastContext";

export default function ViewBill() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [company, setCompany] = useState(null);
  const printRef = useRef();
  const location = useLocation();
  const [autoDownloaded, setAutoDownloaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const billResponse = await getBillById(id);
        setBill(billResponse.data);
      } catch (error) {
        console.error("Error fetching bill:", error);
      }

      try {
        const companyResponse = await getCompany();
        setCompany(companyResponse.data);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const shouldDownload = params.get("download") === "1" || params.get("download") === "true";
      if (shouldDownload && bill && company && !autoDownloaded) {
        // trigger download once data is ready
        downloadPDF().catch((e) => console.error("auto download error", e));
        setAutoDownloaded(true);
      }
    } catch (e) {
      // ignore
    }
  }, [location.search, bill, company, autoDownloaded]);

  const fmt = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "";
    }
    return Number(value).toLocaleString("en-IN");
  };

  const defaultServices = "आर.सी.सी. कन्स्ट्रक्शन | आर.सी.सी. विहीर बांधकाम | आर.सी.सी. पाण्याची टाकी | फॅब्रिकेशन (वेल्डिंग कामे) | पत्र्याच्या शेडची कामे | आधुनिक कांदाचाळ बांधणी कामे";

  const printBill = () => {
    window.print();
  };

  const sharePdfOnWhatsApp = async () => {
    try {
      const { jsPDF } = window.jspdf;
      const html2canvas = window.html2canvas;

      if (!html2canvas || !jsPDF) {
        showToast("PDF लायब्ररी उपलब्ध नाहीत. कृपया आधी PDF डाउनलोड करा आणि नंतर शेअर करा.", "info");
        return;
      }

      const element = printRef.current;
      try {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
      } catch (e) {}

      const prevWidth = element.style.width;
      element.style.width = '210mm';
      element.style.boxSizing = 'border-box';
      const canvas = await html2canvas(element, { scale: Math.max(window.devicePixelRatio || 1, 2), useCORS: true });
      element.style.width = prevWidth || '';
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      let imgWidth = pdfWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      if (imgHeight > pdfHeight) {
        const scale = pdfHeight / imgHeight;
        imgWidth = imgWidth * scale;
        imgHeight = pdfHeight;
      }

      const xOffset = (pdfWidth - imgWidth) / 2;
      pdf.addImage(imgData, "PNG", xOffset, 0, imgWidth, imgHeight);

      const blob = pdf.output("blob");
      const billNumber = bill.billNo || bill._id?.slice(-6) || "bill";
      const safeName = bill.customerName
        ? bill.customerName.replace(/\s+/g, "_").replace(/[^\w\u0900-\u097F_-]/g, "")
        : "customer";
      const file = new File([blob], `Bill_${billNumber}_${safeName}.pdf`, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Bill ${billNumber}`,
          text: `शिवानी फॅब्रिकेशन बिल - ${bill.customerName || "ग्राहक"}`,
        });
      } else {
        showToast("तुमच्या डिव्हाइसवर शेअर API उपलब्ध नाही. PDF डाउनलोड करून नंतर शेअर करा.", "info");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      showToast("PDF शेअर करताना त्रुटी झाली. कृपया आधी PDF डाउनलोड करा आणि नंतर शेअर करा.", "error");
    }
  };

  const downloadPDF = async () => {
    try {
      const { jsPDF } = window.jspdf;
      const html2canvas = window.html2canvas;

      if (!html2canvas || !jsPDF) {
        showToast("PDF लायब्ररी उपलब्ध नाहीत — प्रिंटचा वापर केला जात आहे.", "info");
        window.print();
        return;
      }

      const element = printRef.current;
      try {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
      } catch (e) {}

      const prevWidth = element.style.width;
      element.style.width = '210mm';
      element.style.boxSizing = 'border-box';
      const canvas = await html2canvas(element, { scale: Math.max(window.devicePixelRatio || 1, 2), useCORS: true });
      element.style.width = prevWidth || '';
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      let imgWidth = pdfWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      if (imgHeight > pdfHeight) {
        const scale = pdfHeight / imgHeight;
        imgWidth = imgWidth * scale;
        imgHeight = pdfHeight;
      }

      const xOffset = (pdfWidth - imgWidth) / 2;
      pdf.addImage(imgData, "PNG", xOffset, 0, imgWidth, imgHeight);

      const safeName = bill.customerName
        ? bill.customerName.replace(/\s+/g, "_").replace(/[^\w\u0900-\u097F_-]/g, "")
        : "customer";

      const billNumber = bill.billNo || bill._id?.slice(-6);
      pdf.save(`Bill_${billNumber}_${safeName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("PDF तयार करताना त्रुटी. ब्राउझर प्रिंट वापरला जात आहे.", "error");
      window.print();
    }
  };

  if (!bill || !company) {
    return <div className="loading">Loading bill...</div>;
  }

  const total = (bill.items || []).reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    const amount = qty > 0 && rate > 0 ? qty * rate : parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="view-bill-container">
      <div className="bill-actions">
        <button className="btn btn-primary" onClick={printBill}>
          🖨️ Print
        </button>
        <button className="btn btn-primary" onClick={downloadPDF}>
          📥 Download PDF
        </button>
        <button className="btn btn-primary" onClick={sharePdfOnWhatsApp}>
          📎 PDF WhatsApp शेअर करा
        </button>
      </div>

      <div ref={printRef} className="bill-printable">
        <div className="bill-wrapper-print">
          <div className="bill-container-print">
            <div className="ph">
              {company && company.signature && String(company.signature).trim() && (
                <div className="ph-signature-corner">
                  <img src={company.signature} alt="signature" />
                </div>
              )}
              {company && company.logo && String(company.logo).trim() && (
                <div className="ph-logo-corner">
                  <img src={company.logo} alt="logo" />
                </div>
              )}
              <div className="ph-mural">॥ श्री भैरवनाथ प्रसन्न ॥</div>
              <div className="ph-name">{company.companyName || "शिवानी फॅब्रिकेशन"}</div>
              <div className="ph-owner">{company.ownerName || "प्रोप्रा: गोरख किसन शिंदे"}</div>
              <div className="ph-addr">{company.address || "मु.पो.चांडगाव, ता. श्रीगोंदा, जि. अहिल्यानगर"}</div>
              <div className="ph-mob">मोबा. {company.mobile || "९२७२९७०९९७"}</div>
              <div className="ph-services">
                {(() => {
                  const text = company.services && String(company.services).trim() ? company.services : defaultServices;
                  const parts = String(text).split(/\s*\|\s*|\r?\n/).filter(Boolean);
                  return parts.map((p, i) => (
                    <span key={i}>
                      {p}
                      {i < parts.length - 1 ? <span> | </span> : null}
                    </span>
                  ));
                })()}
              </div>
            </div>

            <div className="pm">
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: '55%' }}><strong>नंबर / Bill No:</strong> <span className="fill-line">&nbsp;{bill.billNo || bill._id?.slice(-6)}&nbsp;</span></td>
                    <td style={{ textAlign: 'right' }}><strong>दिनांक / Date:</strong> <span className="fill-line">&nbsp;{bill.date || new Date().toLocaleDateString('en-GB')}&nbsp;</span></td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ paddingTop: 6 }}><strong>नाव / M/s.:</strong> <span className="fill-line" style={{ minWidth: 200 }}>&nbsp;{bill.customerName || ''}&nbsp;</span></td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ paddingTop: 6 }}><strong>ग्राहक मोबाइल नंबर / Customer Mobile:</strong> <span className="fill-line" style={{ minWidth: 200 }}>&nbsp;{bill.mobile || '-'}&nbsp;</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <table className="pt">
              <thead>
                <tr>
                  <th style={{ width: '7%' }}>अ.नं.</th>
                  <th style={{ width: '50%', textAlign: 'left', paddingLeft: 10 }}>तपशील / Description</th>
                  <th style={{ width: '13%' }}>नग / Qty</th>
                  <th style={{ width: '14%' }}>दर / Rate</th>
                  <th style={{ width: '16%' }}>रक्कम / Amount</th>
                </tr>
              </thead>
              <tbody>
                {(bill.items || []).map((item, idx) => {
                  const qty = parseFloat(item.quantity || item.qty) || 0;
                  const rate = parseFloat(item.rate) || 0;
                  const amount = qty > 0 && rate > 0 ? qty * rate : parseFloat(item.amount) || 0;
                  return (
                    <tr key={idx}>
                      <td className="center-cell">{idx + 1}</td>
                      <td className="desc-cell">{item.name}</td>
                      <td className="num-cell">{qty || ''}</td>
                      <td className="num-cell">{rate ? fmt(rate) : ''}</td>
                      <td className="num-cell">{amount ? fmt(amount) : ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <table className="ptotal">
              <tbody>
                <tr>
                  <td style={{ width: '84%', textAlign: 'right', paddingRight: 16, color: '#b71c1c' }}>एकूण / Total:</td>
                  <td style={{ width: '16%', textAlign: 'right', fontWeight: 900, fontSize: '12pt', color: '#b71c1c' }}>{fmt(total)} /-</td>
                </tr>
              </tbody>
            </table>

            <div className="pfoot">
              <div className="pwords">
                <div className="pwords-label">अक्षरी रुपये / Amount in words:</div>
                <div className="pwords-value">{numToWordsMr(total)}</div>
                <div className="pwords-sub">{numToWordsMr(total).replace('रूपये फक्त','रुपये फक्त')}</div>
              </div>
              <div className="paction">
                <div className="pthanks">धन्यवाद ! / Thank You!</div>
                <div className="psign">
                  <div className="psign-space">
                    {company && company.signature && String(company.signature).trim() && (
                      <img src={company.signature} alt="sig" className="sig-img" />
                    )}
                  </div>
                  <strong>For {company?.companyName || 'शिवानी फॅब्रिकेशन'}</strong><br />
                  <span style={{ fontSize: '9pt', color: '#555' }}>(authorized signature)</span>
                </div>
              </div>
              {bill.notes && <div style={{ marginTop: 10, fontSize: '10pt', color: '#333', fontStyle: 'italic' }}>टीप: {bill.notes}</div>}
              <div className="pnotice">* टीप: वरील सर्व कामे कमीतकमी दरात करून मिळतील.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
