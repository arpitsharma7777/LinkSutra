import "../styles/Landing.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">LinkSutra</div>

      <ul className="nav-links">
        <li>Login</li>
        <li>Analytic</li>
        <li>Profile</li>
      </ul>
    </nav>
  );
}

export default Navbar;