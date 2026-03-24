import React from "react";
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
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">LinkSutra</div>
        <nav>
          <div className="nav-item ">Links</div>
          <div className="nav-item">Analytics</div>
          <div className="nav-item">Settings</div>
          <div className="nav-item">Support</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <div>
            <span className="workspace-label">WORKSPACE</span>
            <h1 className="title">Manage Links</h1>
          </div>
          <button className="add-link-btn">+ Add link</button>
        </div>

        <div className="links-list">
          {/* Item 1 */}
          <div className="link-card">
            <div className="card-left">
              <div className="img-box"></div>
              <div className="text-info">
                <h3>My Portfolio</h3>
                <p>portfolio.dev</p>
              </div>
            </div>
            <div className="card-right">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>

          {/* Item 2 */}
          <div className="link-card">
            <div className="card-left">
              <div className="img-box"></div>
              <div className="text-info">
                <h3>Open Source Projects</h3>
                <p>github.com/dev/projects</p>
              </div>
            </div>
            <div className="card-right">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>

          {/* Item 3 */}
          <div className="link-card">
            <div className="card-left">
              <div className="img-box"></div>
              <div className="text-info">
                <h3>Tech Blog</h3>
                <p>medium.com/@devlog</p>
              </div>
            </div>
            <div className="card-right">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>

          {/* Item 4 */}
          <div className="link-card">
            <div className="card-left">
              <div className="img-box"></div>
              <div className="text-info">
                <h3>Latest Workshop</h3>
                <p>zoom.us/j/99283741</p>
              </div>
            </div>
            <div className="card-right">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        </div>
        <button className="btn">LOGOUT</button>
      </main>
    </div>
  );
}

export default Dashboard;