import React from "react";
import ProfileCard from "../components/ProfileCard";
import LinkList from "../components/LinkList";
import "../styles/Dashboard.css";
function Dashboard() {
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
        
        <LinkList />

        </div>
      </div>

    </div>
  );
}

export default Dashboard;