

function Hero() {
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

        <button className="hero-btn">Get Started</button>
      </div>

      <div className="hero-right">
        <div className="card">
          <div className="profile">
           
            <h3>Alex Rivet</h3>
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