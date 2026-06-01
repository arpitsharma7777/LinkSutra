import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Landing.css";

function Features() {
  const navigate = useNavigate();

  return (
    <div className="features-section-container">
      {/* Feature 1: Customize */}
      <section className="feature-row bg-blue">
        <div className="feature-row-inner max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="feature-mockup-side order-2 lg:order-1">
            <div className="mockup-frame customize-frame">
              <div className="mockup-header-bar">
                <span className="dot bg-red-400"></span>
                <span className="dot bg-yellow-400"></span>
                <span className="dot bg-green-400"></span>
              </div>
              <div className="mockup-inner-content">
                <div className="customizer-widget">
                  <h4>Theme Customizer</h4>
                  <div className="customizer-options">
                    <div className="color-option active" style={{ backgroundColor: '#d2e823' }}></div>
                    <div className="color-option" style={{ backgroundColor: '#2665d6' }}></div>
                    <div className="color-option" style={{ backgroundColor: '#780016' }}></div>
                    <div className="color-option" style={{ backgroundColor: '#502274' }}></div>
                  </div>
                  <div className="toggle-row">
                    <span>Show profile views</span>
                    <div className="toggle-switch active"></div>
                  </div>
                  <div className="toggle-row">
                    <span>Password protection</span>
                    <div className="toggle-switch"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-text-side order-1 lg:order-2">
            <h2 className="feature-heading text-green">
              Create and customize your link in minutes
            </h2>
            <p className="feature-desc text-white">
              Connect all your links across social media, portfolios, stores, and more in one bio link. Customize every design detail or let our automatic themes style your page to match your aesthetic.
            </p>
            <button onClick={() => navigate('/login')} className="btn-feature-pill bg-green text-dark">
              Get started for free
            </button>
          </div>
        </div>
      </section>

      {/* Feature 2: Share Anywhere */}
      <section className="feature-row bg-maroon">
        <div className="feature-row-inner max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="feature-text-side">
            <h2 className="feature-heading text-pink">
              Share your LinkSutra anywhere you like!
            </h2>
            <p className="feature-desc text-white">
              Add your unique LinkSutra URL to all of your social platforms, websites, and emails to make discovery effortless. Generate a sleek, high-fidelity QR code to drive offline billboard, merch, or business card traffic instantly.
            </p>
            <button onClick={() => navigate('/login')} className="btn-feature-pill bg-pink text-dark">
              Get started for free
            </button>
          </div>
          <div className="feature-mockup-side">
            <div className="mockup-frame share-frame">
              <div className="qr-code-box">
                <div className="qr-grid">
                  {/* CSS representation of a QR code */}
                  <div className="qr-square qr-top-left"></div>
                  <div className="qr-square qr-top-right"></div>
                  <div className="qr-square qr-bottom-left"></div>
                  <div className="qr-dot qr-d1"></div>
                  <div className="qr-dot qr-d2"></div>
                  <div className="qr-dot qr-d3"></div>
                  <div className="qr-center-logo">🔗</div>
                </div>
                <p className="qr-caption">scan to view profile</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Analyze */}
      <section className="feature-row bg-light-green">
        <div className="feature-row-inner max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="feature-mockup-side order-2 lg:order-1">
            <div className="mockup-frame analytics-frame">
              <div className="analytics-widget">
                <span className="widget-tag">REALTIME CLICK STATS</span>
                <h3>Traffic Momentum</h3>
                <div className="bar-chart-mockup">
                  <div className="bar-col" style={{ height: '40%' }}><span className="bar-label">M</span></div>
                  <div className="bar-col" style={{ height: '65%' }}><span className="bar-label">T</span></div>
                  <div className="bar-col" style={{ height: '50%' }}><span className="bar-label">W</span></div>
                  <div className="bar-col" style={{ height: '85%' }}><span className="bar-label">T</span></div>
                  <div className="bar-col active" style={{ height: '95%' }}><span className="bar-label">F</span></div>
                  <div className="bar-col" style={{ height: '70%' }}><span className="bar-label">S</span></div>
                  <div className="bar-col" style={{ height: '60%' }}><span className="bar-label">S</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-text-side order-1 lg:order-2">
            <h2 className="feature-heading text-dark">
              Analyze your audience and keep them engaged
            </h2>
            <p className="feature-desc text-dark opacity-90">
              Track click stats over time, monitor performance trends, and learn what converts your audience best. Make informed updates in real time to optimize traffic distribution instantly.
            </p>
            <button onClick={() => navigate('/login')} className="btn-feature-pill bg-pink text-dark">
              Get started for free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Features);