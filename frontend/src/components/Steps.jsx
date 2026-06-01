import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Landing.css";

function Steps() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "Why should creators use LinkSutra?",
      answer: "LinkSutra brings all your important links, profiles, projects, and products onto a single, lightning-fast page. It gives you 100% data ownership, server-side privacy-first analytics, and elegant custom styles with zero tracking cookies."
    },
    {
      question: "Is LinkSutra a completely open-source project?",
      answer: "Yes! LinkSutra is built with modern open-source technologies (FastAPI, React, SQLite/PostgreSQL) and can be self-hosted, modified, or extended freely without any platform lock-in."
    },
    {
      question: "Can I self-host LinkSutra on my own server?",
      answer: "Absolutely. LinkSutra supports straightforward deployment via docker or hosting platforms like Render and Railway, utilizing simple environment configurations."
    },
    {
      question: "Is it safe to share my LinkSutra on my social media profiles?",
      answer: "Yes, LinkSutra is fully responsive, standard-compliant, and secure. Sharing your custom profile link on Instagram, TikTok, LinkedIn, or Twitter works seamlessly across all device webviews."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="marketing-details-container">
      {/* 1. Interactive FAQ Accordion */}
      <section className="faq-section bg-maroon">
        <div className="faq-inner max-w-4xl mx-auto">
          <h2 className="faq-title">Questions? Answered</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question-row">
                  <h4>{faq.question}</h4>
                  <span className={`faq-arrow-icon ${activeFaq === index ? 'rotate' : ''}`}>↓</span>
                </div>
                <div className="faq-answer-row">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Steps);