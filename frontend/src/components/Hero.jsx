
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          Own your <br />
          link page.
        </h1>

        <p>
          No tracking. No lock-in. Open-source, privacy-first,
          self-hostable link-in-bio platform for developers.
        </p>

        <button
          className="get-started-btn"
          onClick={handleGetStarted}
          style={{
            backgroundColor: '#f96a0a',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e55a00'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f96a0a'}
        >
          Get Started for Free
        </button>
      </div>

      <div className="hero-right">
        <div className="card">
          <div className="profile">

            <h1>Alex Rivet</h1>
            <p>@alex_dev</p>
          </div>

          <div className="links">
            <button>My Github</button>
            <button>Latest Project</button>
            <button>Read Blog</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;