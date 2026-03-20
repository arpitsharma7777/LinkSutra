import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import LinkList from "../components/LinkList";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard({ setToken }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main">

        <button className="logoutBtn" onClick={handleLogout}>Logout</button>

        <ProfileCard />

        <h2>LinkSutra Dashboard</h2>

        <button className="addBtn">+ Add New Link</button>

        <LinkList />

      </div>

    </div>
  );
}

export default Dashboard;