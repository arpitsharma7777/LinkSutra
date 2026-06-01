import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Landing.css";

function CTA() {
  const navigate = useNavigate();
  const [claimName, setClaimName] = useState("");

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (claimName.trim()) {
      navigate(`/login?claim=${encodeURIComponent(claimName.trim())}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-bottom-block">
      {/* Final CTA Banner */}
      <section className="final-cta-section bg-purple">
        <div className="final-cta-inner max-w-4xl mx-auto text-center relative z-10">
          <h2 className="final-cta-title text-pink">
            Jumpstart your corner of the internet today
          </h2>
          <form className="final-claim-form" onSubmit={handleClaimSubmit}>
            <div className="claim-input-wrapper">
              <span className="claim-prefix">linksutra.app/</span>
              <input
                type="text"
                className="claim-input"
                placeholder="yourname"
                value={claimName}
                onChange={(e) => setClaimName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              />
            </div>
            <button type="submit" className="btn-final-claim-submit">
              Claim your LinkSutra
            </button>
          </form>
        </div>
      </section>

      {/* Main Footer Redesign */}
      <footer className="landing-footer bg-purple">
        <div className="footer-card-wrapper max-w-7xl mx-auto bg-white">
          <div className="footer-columns grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="footer-col">
              <h5>Product</h5>
              <ul className="footer-links">
                <li><span className="f-link">Features</span></li>
                <li><span className="f-link">Integrations</span></li>
                <li><span className="f-link">Open Source Repository</span></li>
                <li><span className="f-link">Pricing Plans</span></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Community</h5>
              <ul className="footer-links">
                <li><span className="f-link">Contributor Guidelines</span></li>
                <li><span className="f-link">Discord Server</span></li>
                <li><span className="f-link">Developer Blog</span></li>
                <li><span className="f-link">Showcase Directory</span></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Support</h5>
              <ul className="footer-links">
                <li><span className="f-link">Self-Host Docs</span></li>
                <li><span className="f-link">Getting Started Guide</span></li>
                <li><span className="f-link">Report issues</span></li>
                <li><span className="f-link">FAQs</span></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Trust & Legal</h5>
              <ul className="footer-links">
                <li><span className="f-link">Terms & Conditions</span></li>
                <li><span className="f-link">Privacy Policy</span></li>
                <li><span className="f-link">Security Policies</span></li>
                <li><span className="f-link">GDPR Compliance</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-acknowledgement text-center text-pink">
          LinkSutra is a privacy-first, open-source project. Proudly built and customized to help creators own their audience.
        </div>
      </footer>
    </div>
  );
}

export default React.memo(CTA);