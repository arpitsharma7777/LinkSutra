import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Landing.css";

function Hero() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleClaim = (e) => {
    e.preventDefault();
    if (username.trim()) {
      // Pass the username to the registration form through state or search query
      navigate(`/login?claim=${encodeURIComponent(username.trim())}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-inner max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="hero-text-block">
          <h1 className="hero-title">
            Everything you are.<br />In one simple link.
          </h1>
          <p className="hero-description">
            Join millions using LinkSutra for their link in bio. One simple, privacy-first, open-source link to help you share everything you create, curate, and sell across Instagram, TikTok, YouTube, GitHub, and more.
          </p>
          <form className="claim-form" onSubmit={handleClaim}>
            <div className="claim-input-wrapper">
              <span className="claim-prefix">linksutra.app/</span>
              <input
                type="text"
                className="claim-input"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              />
            </div>
            <button type="submit" className="btn-claim-submit">
              Claim your LinkSutra
            </button>
          </form>
        </div>

        <div className="hero-mockup-block">
          <div className="mockup-scroll-container">
            <div className="mockup-scroll-track animate-scroll-up">
              {/* Card 1: Minimalist Tech Theme */}
              <div className="mockup-phone-card card-minimal">
                <div className="mockup-header">
                  <div className="mockup-avatar">👨‍💻</div>
                  <h3>Alex Rivier</h3>
                  <p>@alex_dev</p>
                </div>
                <div className="mockup-links">
                  <div className="mockup-link-pill">💻 Latest Project</div>
                  <div className="mockup-link-pill">🌐 My Website</div>
                  <div className="mockup-link-pill">🐦 Twitter / X</div>
                </div>
              </div>

              {/* Card 2: Soft Pink Artistic Theme */}
              <div className="mockup-phone-card card-artistic">
                <div className="mockup-header">
                  <div className="mockup-avatar avatar-art">🎨</div>
                  <h3>Sonia Arts</h3>
                  <p>@sonia_curates</p>
                </div>
                <div className="mockup-links">
                  <div className="mockup-link-pill">📸 Instagram Gallery</div>
                  <div className="mockup-link-pill">✨ Support my Work</div>
                  <div className="mockup-link-pill">🛒 Digital Shop</div>
                </div>
              </div>

              {/* Card 3: Deep Blue Crypto/Finance Theme */}
              <div className="mockup-phone-card card-dark">
                <div className="mockup-header">
                  <div className="mockup-avatar avatar-dark">🚀</div>
                  <h3>Future Capital</h3>
                  <p>@future_cap</p>
                </div>
                <div className="mockup-links">
                  <div className="mockup-link-pill">📊 Portfolio Tracker</div>
                  <div className="mockup-link-pill">⚡ Direct Tips</div>
                  <div className="mockup-link-pill">🔗 Join Discord</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Hero);