import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import LinkList from "../components/LinkList";
import "../styles/Dashboard.css";
function Dashboard() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main">

        <ProfileCard />

        <h2>LinkSutra Dashboard</h2>

        <button className="addBtn">+ Add New Link</button>

        <LinkList />

      </div>

    </div>
  );
}

export default Dashboard;