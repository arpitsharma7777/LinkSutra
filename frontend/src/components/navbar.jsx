import "../styles/Landing.css";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/login');
  };
  return (
    <>
    <nav className="navbar">
      <div className="logo">LinkSutra</div>

      <button onClick={handleGetStarted} className="btn">GET STARTED</button>
    </nav>
    </>
  );
}

export default Navbar;