import React from "react";
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

      

      <div className="main">
        <div className="Full-main">
          <h1>LinkSutra</h1>
        <h2>All your links in one place</h2>
        <p>Create a beautiful dashboard for all your links 
          and share it with the world.<br/>
          Customize your profile, add your social media links, and let your audience connect with you effortlessly.
        </p>
        
        <button className="start">Get Started for Free</button><br/>
        

        <button className="logoutBtn" onClick={handleLogout}>Logout</button>

        <ProfileCard />

        <h2>LinkSutra Dashboard</h2>

        <button className="addBtn">+ Add New Link</button>

        <LinkList />

        </div>
      </div>

    </div>
  );
}

export default Dashboard;