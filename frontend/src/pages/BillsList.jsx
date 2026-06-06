import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBills, deleteBill } from "../services/billService";
import "../styles/BillsList.css";
import { useToast } from "../context/ToastContext";

export default function BillsList() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBills = async () => {
    try {
      const data = await getBills();
      setBills(data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const { showToast } = useToast();

  const filteredBills = useMemo(
    () =>
      bills.filter((bill) => {
        const name = bill.customerName?.toLowerCase() || "";
        const query = searchTerm.toLowerCase();
        return (
          name.includes(query) ||
          bill._id?.includes(searchTerm) ||
          bill.billNo?.toString().includes(searchTerm)
        );
      }),
    [bills, searchTerm]
  );

  useEffect(() => {
    const loadBills = async () => {
      await fetchBills();
    };

    loadBills();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("तुम्हाला हे बिल हटवायचे आहे का?")) return;
    try {
      await deleteBill(id);
      fetchBills();
    } catch (error) {
      console.error(error);
      showToast("बिल हटवताना त्रुटी आली.", "error");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-bill/${id}`);
  };

  return (
    <div className="bills-list-container">
      <div className="bills-header">
        <h1>सर्व बिल</h1>
        <Link to="/create-bill">
          <button className="btn-primary">+ नवे बिल</button>
        </Link>
      </div>

      <div className="bills-stats">
        <div className="stat">
          <span className="stat-label">एकूण बिल</span>
          <span className="stat-value">{bills.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">एकूण रक्कम</span>
          <span className="stat-value">
            ₹{bills.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="ग्राहकाचे नाव किंवा बिल क्रमांक शोधा..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="clear-btn"
            onClick={() => setSearchTerm("")}
          >
            ✕
          </button>
        )}
      </div>

      {filteredBills.length > 0 ? (
        <div className="bills-table-container">
          <table className="bills-table">
            <thead>
              <tr>
                <th>बिल क्र.</th>
                <th>ग्राहक</th>
                <th>वस्तू</th>
                <th>तारीख</th>
                <th>एकूण</th>
                <th>कृती</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill._id}>
                  <td className="bill-no">#{bill.billNo || bill._id.slice(-6)}</td>
                  <td>{bill.customerName}</td>
                  <td className="items-count">{bill.items?.length || 0} वस्तू</td>
                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td className="amount">₹{bill.totalAmount.toLocaleString()}</td>
                  <td className="actions">
                    <Link to={`/view-bill/${bill._id}`}>
                      <button className="btn-view" title="View">👁️</button>
                    </Link>
                    <button className="btn-edit" onClick={() => handleEdit(bill._id)} title="Edit">✏️</button>
                    <button className="btn-delete" onClick={() => handleDelete(bill._id)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>📋 {searchTerm ? "कोणतेही बिल सापडले नाही" : "अद्याप कोणतेही बिल नाही"}</p>
          {!searchTerm && (
            <Link to="/create-bill">
              <button className="btn-primary">पहिले बिल तयार करा</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}