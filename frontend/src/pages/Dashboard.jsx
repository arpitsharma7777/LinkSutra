import React from "react";
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