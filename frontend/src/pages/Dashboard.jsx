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

  // Fetch user data and links on component mount
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

  // Handle adding a new link
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
      alert("Error adding link: " + err.message);
    }
  }

  // Handle deleting a link
  async function handleDeleteLink(linkId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      console.log("Deleting link with ID:", linkId);
      await deleteLink(token, linkId);

      const updatedLinks = links.filter(link => link.id !== linkId);
      setLinks(updatedLinks);
      console.log("Link deleted successfully. Remaining links:", updatedLinks);
      alert("Link deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting link: " + err.message);
    }
  }

  // Handle editing a link
  async function handleEditLink(linkId, title, url) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      const updatedLink = await updateLink(token, linkId, { title, url });
      setLinks(links.map(link => link.id === linkId ? updatedLink : link));
      alert("Link updated successfully!");
    } catch (err) {
      alert("Error updating link: " + err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="main">
          <div className="Full-main">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="main">
        <div className="Full-main">
          <h1>LinkSutra</h1>
          <button className="logoutBtn" onClick={handleLogout}>Logout</button>

          {user && <ProfileCard user={user} />}

          <h2>LinkSutra Dashboard</h2>

          <LinkList
            links={links}
            onAddLink={handleAddLink}
            onDeleteLink={handleDeleteLink}
            onEditLink={handleEditLink}
          />

        </div>
      </div>
    </div>
  );
}

export default Dashboard;