import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#020617" }}>
      <Navbar />
      <Outlet />
    </div>
  );
}
