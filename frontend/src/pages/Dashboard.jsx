import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const API_URL = "https://bill-book-app.onrender.com/api/bills";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBills: 0,
    totalRevenue: 0,
    thisMonth: 0,
    avgBill: 0,
  });

  const [recentBills, setRecentBills] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});

  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const bills = data.data || [];

      if (bills.length > 0) {
        const totalRevenue = bills.reduce(
          (sum, bill) => sum + bill.totalAmount,
          0
        );

        const avgBill = Math.round(totalRevenue / bills.length);

        const now = new Date();

        const currentMonth = bills.filter((bill) => {
          const billDate = new Date(bill.createdAt);
          return (
            billDate.getMonth() === now.getMonth() &&
            billDate.getFullYear() === now.getFullYear()
          );
        });

        const thisMonthTotal = currentMonth.reduce(
          (sum, bill) => sum + bill.totalAmount,
          0
        );

        setStats({
          totalBills: bills.length,
          totalRevenue,
          thisMonth: thisMonthTotal,
          avgBill,
        });

        setRecentBills(bills.slice(0, 5));

        const months = {};

        bills.forEach((bill) => {
          const date = new Date(bill.createdAt);
          const monthName = date.toLocaleDateString("en-US", {
            month: "short",
          });

          months[monthName] =
            (months[monthName] || 0) + bill.totalAmount;
        });

        setMonthlyData(months);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">डॅशबोर्ड</h1>
          <p className="dashboard-subtitle">
            तुमच्या बिलांची झटपट माहिती
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("/create-bill")}
        >
          + नवीन बिल
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">एकूण बिल</div>
          <div className="stat-value">{stats.totalBills}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">एकूण रक्कम</div>
          <div className="stat-value">
            ₹{stats.totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">या महिन्यात</div>
          <div className="stat-value">
            ₹{stats.thisMonth.toLocaleString()}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">सरासरी बिल</div>
          <div className="stat-value">
            ₹{stats.avgBill.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="chart-card">
        <h2>मासिक महसूल चार्ट</h2>

        <div className="chart-container">
          <div className="chart-bars">
            {Object.entries(monthlyData).length > 0 ? (
              Object.entries(monthlyData).map(([month, amount]) => (
                <div key={month} className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      height:
                        (amount /
                          Math.max(
                            ...Object.values(monthlyData)
                          )) *
                          300 +
                        "px",
                    }}
                    title={`₹${amount}`}
                  ></div>

                  <div className="chart-label">
                    {month}
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "#999",
                }}
              >
                No data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bills */}
      <div className="recent-bills">
        <h2>अलीकडील बिल</h2>

        {recentBills.length > 0 ? (
          <table className="bills-table">
            <thead>
              <tr>
                <th>बिल क्र.</th>
                <th>ग्राहक</th>
                <th>तारीख</th>
                <th>एकूण</th>
              </tr>
            </thead>

            <tbody>
              {recentBills.map((bill) => (
                <tr key={bill._id}>
                  <td className="bill-no">
                    #{bill.billNo || bill._id.slice(-6)}
                  </td>

                  <td>{bill.customerName}</td>

                  <td>
                    {new Date(
                      bill.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="amount">
                    ₹{bill.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "#999",
            }}
          >
            No bills available
          </p>
        )}
      </div>
    </div>
  );
}