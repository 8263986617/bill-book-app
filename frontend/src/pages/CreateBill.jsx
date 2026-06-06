import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBill, getBillById, getNextBillNo, updateBill } from "../services/billService";
import { numToWordsMr } from "../utils/numberToWords";
import "../styles/CreateBill.css";
import { useToast } from "../context/ToastContext";

export default function CreateBill() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [billNo, setBillNo] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewRef = useRef();
  const containerRef = useRef();

  const [items, setItems] = useState([
    {
      name: "",
      quantity: "",
      rate: "",
      amount: "",
    },
  ]);

  const fetchNextBillNo = async () => {
    try {
      const data = await getNextBillNo();
      const nextNo = data?.data?.nextBillNo;
      if (nextNo) {
        setBillNo(nextNo.toString());
      }
    } catch (error) {
      console.error("Error fetching next bill number:", error);
    }
  };

  useEffect(() => {
    const loadBillData = async () => {
      if (isEditMode) {
        try {
          const data = await getBillById(id);
          const bill = data.data;
          setCustomerName(bill.customerName || "");
          setMobile(bill.mobile || "");
          setBillNo(bill.billNo ? bill.billNo.toString() : "");
          setNotes(bill.notes || "");
          setItems(
            bill.items?.map((item) => ({
              name: item.name || "",
              quantity: item.quantity?.toString() || item.qty?.toString() || "",
              rate: item.rate?.toString() || "",
              amount: item.amount?.toString() || "",
            })) || [
              {
                name: "",
                quantity: "",
                rate: "",
                amount: "",
              },
            ]
          );
        } catch (error) {
          console.error("Error loading bill:", error);
          showToast("बिल लोड करताना त्रुटी आली.", "error");
        }
      } else {
        await fetchNextBillNo();
      }
    };

    loadBillData();
  }, [id, isEditMode]);

  // Ensure inputs scroll into view on mobile so sticky actions don't cover them
  useEffect(() => {
    const root = containerRef.current || document;
    const handlerIn = (e) => {
      const t = e.target;
      if (!t) return;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) {
        // hide sticky actions while typing so they don't cover fields
        document.body.classList.add("hide-sticky-actions");
        // slight delay to allow mobile keyboard to open
        setTimeout(() => {
          try {
            t.scrollIntoView({ behavior: "smooth", block: "center" });
          } catch (err) {
            const rect = t.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + rect.top - 150, behavior: "smooth" });
          }
        }, 200);
      }
    };

    const handlerOut = (e) => {
      const t = e.target;
      if (!t) return;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) {
        // restore actions after leaving field
        document.body.classList.remove("hide-sticky-actions");
      }
    };

    root.addEventListener && root.addEventListener("focusin", handlerIn);
    root.addEventListener && root.addEventListener("focusout", handlerOut);
    return () => {
      root.removeEventListener && root.removeEventListener("focusin", handlerIn);
      root.removeEventListener && root.removeEventListener("focusout", handlerOut);
    };
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "quantity" && Number(value) > 0) {
      updatedItems[index].amount = "";
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        quantity: "",
        rate: "",
        amount: "",
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      alert("किमान एक वस्तू असावी");
      return;
    }

    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const totalAmount = items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const explicit = Number(item.amount) || 0;
    const lineAmount = quantity > 0 && rate > 0 ? quantity * rate : explicit;
    return total + lineAmount;
  }, 0);

  const formatItems = (sourceItems) =>
    sourceItems
      .filter((item) => item.name && item.name.trim())
      .map((item) => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        const explicit = Number(item.amount) || 0;
        const amount = quantity > 0 && rate > 0 ? quantity * rate : explicit || 0;
        return {
          name: item.name,
          quantity: quantity > 0 ? quantity : 0,
          qty: quantity > 0 ? quantity : 0,
          rate: rate > 0 ? rate : 0,
          amount,
        };
      });

  const saveBill = async () => {
    try {
      if (!customerName.trim()) {
        showToast("कृपया ग्राहकाचे नाव भरा", "error");
        return;
      }

      if (!mobile.trim()) {
        showToast("कृपया मोबाइल नंबर भरा", "error");
        return;
      }

      const validItems = formatItems(items);

      if (validItems.length === 0) {
        showToast("कृपया किमान एक वस्तूचे/सेवा नाव भरा", "error");
        return;
      }

      setLoading(true);

      const formattedItems = formatItems(items);

      const billData = {
        customerName,
        mobile,
        totalAmount,
        items: formattedItems,
        notes,
      };

      if (isEditMode) {
        await updateBill(id, billData);
        showToast("बिल यशस्वीरित्या अद्यतनित केले ✓", "success");
      } else {
        const response = await createBill(billData);
        const savedBill = response?.data;
        if (savedBill?.billNo) {
          setBillNo(savedBill.billNo.toString());
        }
        showToast("बिल जतन झाले ✓", "success");
      }

      setCustomerName("");
      setMobile("");
      setNotes("");
      setItems([
        {
          name: "",
          quantity: "",
          rate: "",
          amount: "",
        },
      ]);

      if (!isEditMode) {
        fetchNextBillNo();
      }

      if (isEditMode) {
        navigate("/bills");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast(error.message || "बिल जतन करताना त्रुटी आली", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const previewItems = formatItems(items);
  const previewBill = {
    billNo,
    date: new Date().toLocaleDateString("en-GB"),
    customerName,
    mobile,
    notes,
    items: previewItems,
    totalAmount,
  };

  const handlePreview = () => {
    if (!customerName.trim()) {
      showToast("कृपया ग्राहकाचे नाव भरा", "error");
      return;
    }

    if (!mobile.trim()) {
      showToast("कृपया मोबाइल नंबर भरा", "error");
      return;
    }

    if (previewItems.length === 0) {
      showToast("कृपया किमान एक वस्तूचे/सेवा नाव भरा", "error");
      return;
    }

    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  const downloadPreviewPDF = async () => {
    try {
      const { jsPDF } = window.jspdf;
      const html2canvas = window.html2canvas;
      if (!jsPDF || !html2canvas) {
        showToast("PDF साठी आवश्यक ग्रंथालये उपलब्ध नाहीत. ब्राउझर प्रिंट वापरण्यासाठी.", "info");
        window.print();
        return;
      }
      const element = previewRef.current;
      // Ensure webfonts are loaded (important on mobile)
      try {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
      } catch (e) {
        // ignore
      }

      // Force the printable element to A4 width (CSS uses mm) to get consistent rendering on mobile
      const prevWidth = element.style.width;
      element.style.width = '210mm';
      element.style.boxSizing = 'border-box';

      const scale = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
      const canvas = await html2canvas(element, { scale, useCORS: true });

      // restore width
      element.style.width = prevWidth || '';
      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      let imgWidth = pdfWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      if (imgHeight > pdfHeight) {
        const scale = pdfHeight / imgHeight;
        imgWidth *= scale;
        imgHeight = pdfHeight;
      }
      const xOffset = (pdfWidth - imgWidth) / 2;
      pdf.addImage(imgData, "PNG", xOffset, 0, imgWidth, imgHeight);
      const safeName = customerName
        ? customerName.replace(/\s+/g, "_").replace(/[^\w\u0900-\u097F_-]/g, "")
        : "customer";
      pdf.save(`Bill_${billNo || "Preview"}_${safeName}.pdf`);
    } catch (error) {
      console.error(error);
      showToast("PDF तयार करण्यात समस्या. ब्राउझर प्रिंट वापरात येत आहे.", "error");
      window.print();
    }
  };

  const saveFromPreview = async () => {
    await saveBill();
    setPreviewOpen(false);
  };

  return (
    <div className="create-bill-container">
      <div className="bill-form-section">
        <h2>ग्राहक माहिती</h2>
        <div className="form-row">
          <div className="form-group">
            <label>बिल क्रमांक</label>
            <input
              type="text"
              className="form-control"
              value={billNo ? `#${billNo}` : isEditMode ? "" : "स्वयंचलित"
              }
              disabled
            />
          </div>
          <div className="form-group">
            <label>ग्राहकाचे नाव *</label>
            <input
              type="text"
              className="form-control"
              placeholder="ग्राहकाचे नाव टाका"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>मोबाइल नंबर *</label>
            <input
              type="text"
              className="form-control"
              placeholder="मोबाइल नंबर टाका"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bill-form-section">
        <h2>बिल वस्तू</h2>
        <table className="items-table">
          <thead>
            <tr>
              <th>वस्तूचे नाव</th>
              <th>संख्य</th>
              <th>दर</th>
              <th>रक्कम</th>
              <th>क्रिया</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const quantity = Number(item.quantity) || 0;
              const rate = Number(item.rate) || 0;
              return (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      placeholder="वस्तूचे नाव"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      className="input-cell"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="input-cell input-number"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                      className="input-cell input-number"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="रक्कम"
                      step="0.01"
                      value={quantity > 0 ? (rate > 0 ? (quantity * rate).toFixed(2) : "") : item.amount}
                      onChange={(e) =>
                        handleItemChange(index, "amount", e.target.value)
                      }
                      className="input-cell input-number"
                      disabled={quantity > 0}
                    />
                  </td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => removeItem(index)}
                      title="वस्तू हटवा"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <button className="btn-add-item" onClick={addItem}>
            + नवीन वस्तू जोडा
          </button>
        </div>
      </div>

      <div className="bill-form-section">
        <h2>टीप (ऐच्छिक)</h2>
        <textarea
          className="form-control"
          placeholder="अतिरिक्त टीप येथे टाका..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
        />
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <div className="summary-row">
            <span className="summary-label">उपएकूण:</span>
            <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">कर (0%):</span>
            <span className="summary-value">₹0.00</span>
          </div>
          <div className="summary-row total">
            <span className="summary-label">एकूण रक्कम:</span>
            <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="amount-words">
            <strong>शब्दांत:</strong> {numToWordsMr(totalAmount)}
          </div>
        </div>
      </div>

      <div className="form-actions sticky-mobile">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={handlePreview}
          disabled={loading}
        >
          👁️ बिल पूर्वावलोकन
        </button>
        <button
          className="btn btn-primary"
          onClick={saveBill}
          disabled={loading}
        >
          {loading
            ? "जतन करत आहे..."
            : isEditMode
            ? "💾 बिल अद्यतनित करा"
            : "💾 बिल जतन करा"}
        </button>
      </div>

      {previewOpen && (
        <div className="preview-overlay">
          <div className="preview-modal">
            <div className="preview-header">
              <h3>बिल पूर्वावलोकन</h3>
              <button className="btn btn-secondary" type="button" onClick={closePreview}>
                ❌ बंद करा
              </button>
            </div>
            <div className="preview-actions">
              <button className="btn btn-primary" type="button" onClick={saveFromPreview} disabled={loading}>
                💾 बिल जतन करा
              </button>
            </div>
            <div className="preview-content" ref={previewRef}>
              <div className="invoice-preview-card">
                <div className="invoice-header">
                  <div>
                    <div className="invoice-title">शिवानी फॅब्रिकेशन</div>
                    <div className="invoice-subtitle">Bill Book Maker</div>
                    <div className="invoice-details">मोबाइल: {mobile || "-"}</div>
                  </div>
                  <div className="invoice-meta">
                    <div><strong>बिल क्रमांक:</strong> {billNo || "स्वयंचलित"}</div>
                    <div><strong>दिनांक:</strong> {previewBill.date}</div>
                  </div>
                </div>

                <div className="invoice-customer">
                  <strong>ग्राहकाचे नाव:</strong> {customerName || "-"}
                </div>

                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>क्र.</th>
                      <th>विवरण</th>
                      <th>संख्या</th>
                      <th>दर</th>
                      <th>रक्कम</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewItems.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <div>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                            {item.quantity && item.rate
                              ? `${item.quantity} × ₹${Number(item.rate).toLocaleString('en-IN')}`
                              : item.amount
                              ? `मजुरी: ₹${Number(item.amount).toLocaleString('en-IN')}`
                              : ''}
                          </div>
                        </td>
                        <td>{item.quantity || ''}</td>
                        <td>{item.rate ? Number(item.rate).toLocaleString('en-IN') : ''}</td>
                        <td>{item.amount ? Number(item.amount).toLocaleString('en-IN') : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="invoice-summary">
                  <div>एकूण रक्कम:</div>
                  <div>₹{previewBill.totalAmount.toFixed(2)}</div>
                </div>
                <div className="invoice-words">
                  <strong>शब्दांत:</strong> {numToWordsMr(previewBill.totalAmount)}
                </div>
                {notes && (
                  <div className="invoice-notes">
                    <strong>टीप:</strong> {notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}