import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BillsList from "./pages/BillsList";
import CreateBill from "./pages/CreateBill";
import ViewBill from "./pages/ViewBill";
import CompanySettings from "./pages/CompanySettings";

import "./App.css";

function ProtectedLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />

            <Route
              path="/"
              element={<Navigate to="/dashboard" />}
            />

            <Route
              path="/bills"
              element={
                <ProtectedLayout>
                  <BillsList />
                </ProtectedLayout>
              }
            />

            <Route
              path="/create-bill"
              element={
                <ProtectedLayout>
                  <CreateBill />
                </ProtectedLayout>
              }
            />

            <Route
              path="/edit-bill/:id"
              element={
                <ProtectedLayout>
                  <CreateBill />
                </ProtectedLayout>
              }
            />

            <Route
              path="/view-bill/:id"
              element={
                <ProtectedLayout>
                  <ViewBill />
                </ProtectedLayout>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedLayout>
                  <CompanySettings />
                </ProtectedLayout>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;