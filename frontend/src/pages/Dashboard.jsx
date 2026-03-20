import React, { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import LinkList from "../components/LinkList";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserLinks, createLink, updateLink, deleteLink } from "../api/auth";
import "../styles/Dashboard.css";

function Dashboard({ setToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    async function fetchData() {
      try {
        const userData = await getCurrentUser(token);
        setUser(userData);

        const linksData = await getUserLinks(token);
        setLinks(linksData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  async function handleAddLink(title, url) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      const newLink = await createLink(token, title, url);
      setLinks([...links, newLink]);
      alert("Link added successfully!");
    } catch (err) {
      throw err;
    }
  }

  async function handleDeleteLink(linkId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      await deleteLink(token, linkId);
      setLinks(links.filter(link => link.id !== linkId));
    } catch (err) {
      throw err;
    }
  }

  async function handleEditLink(linkId, title, url) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      const updatedLink = await updateLink(token, linkId, title, url);
      setLinks(links.map(link => link.id === linkId ? updatedLink : link));
    } catch (err) {
      throw err;
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  if (loading) return <div className="dashboard"><p>Loading dashboard...</p></div>;

  return (
    <div className="dashboard">



      <div className="main">
        <div className="Full-main">
          <div className="header">
            <h1>LinkSutra</h1>
            <button className="logoutBtn" onClick={handleLogout}>Logout</button>
          </div>

        <ProfileCard user={user} />

        <h2>LinkSutra Dashboard</h2>

        <LinkList links={links} onAddLink={handleAddLink} onDeleteLink={handleDeleteLink} onEditLink={handleEditLink} />

        </div>
      </div>

    </div>
  );
}

export default Dashboard;