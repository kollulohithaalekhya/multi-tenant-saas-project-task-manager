import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#020617" }}>
      {/* Header / Sidebar can stay here later */}
      <Outlet />
    </div>
  );
}
