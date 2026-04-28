import React, { useEffect, useState, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';

interface NarrativeLandingProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const NarrativeLanding: React.FC<NarrativeLandingProps> = ({ isDarkMode = false, toggleTheme }) => {
  const [progress, setProgress] = useState(0);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', college: '', role: '', struggle: '' });
  const [formErrors, setFormErrors] = useState({ firstName: false, email: false });

  // Refs for IntersectionObserver
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    // Progress bar and Nav scroll logic
    const handleScroll = () => {
      const doc = document.documentElement;
      const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
      setProgress(pct);
      setIsNavScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    // Intersection Observer for animations
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), 0);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      obs.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameValid = formData.firstName.trim() !== '';
    const emailValid = formData.email.trim() !== '';
    
    setFormErrors({ firstName: !nameValid, email: !emailValid });

    if (nameValid && emailValid) {
      setIsFormSubmitted(true);
      // Here you would normally send the data to your backend
    }
  };

  return (
    <>
      <div id="progress" style={{ width: `${progress}%` }}></div>

      <nav id="nav" className={isNavScrolled ? 'scrolled' : ''}>
        <a href="#" className="logo">Founder<span>Match</span></a>
        <div className="nav-right">
          <a href="#how" className="nav-link">How it works</a>
          <a href="#roles" className="nav-link">Who it's for</a>
          {toggleTheme && (
            <button 
              onClick={toggleTheme} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'flex', alignItems: 'center' }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <a href="#waitlist" className="nav-cta">Join Waitlist</a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero" id="home">
        <div className="hero-bg-text">FM</div>

        <div className="hero-tag">India's Co-Founder Network</div>

        <h1 className="hero-headline">
          Every great company<br />
          started with <em>two people</em><br />
          who trusted each other.
        </h1>

        <div className="hero-bottom">
          <p className="hero-sub">
            FounderMatch is where India's next generation of builders find the person they'll build with — not just someone who's available, but someone who <em>fits.</em> Verified skills, real compatibility, no fluff.
          </p>
          <div className="hero-actions">
            <a href="#waitlist" className="btn-primary">
              Join the Waitlist
              <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <span className="hero-note">200+ founders already waiting. Free to join.</span>
          </div>
        </div>

        <div className="hero-divider"></div>
      </section>

      {/* ─── NUMBERS ─── */}
      <section className="numbers-strip">
        <div className="section-wrap">
          <div className="numbers-grid">
            <div className="num-item" ref={addToRefs}>
              <div className="num-val">90<em>%</em></div>
              <div className="num-label">of startups that fail cite team problems as the root cause — not the idea.</div>
            </div>
            <div className="num-item" ref={addToRefs}>
              <div className="num-val">3<em>×</em></div>
              <div className="num-label">more likely to raise funding when you have a co-founder versus going solo.</div>
            </div>
            <div className="num-item" ref={addToRefs}>
              <div className="num-val">0</div>
              <div className="num-label">platforms in India built specifically for Gen Z founders who want to actually ship.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="story">
        <div className="section-wrap">
          <div className="story-grid">
            <div>
              <div className="story-label reveal" ref={addToRefs}>The Problem</div>
              <h2 className="story-title reveal" ref={addToRefs}>
                The right co-founder is out there.<br />
                The system for finding them<br />
                <em>isn't.</em>
              </h2>
            </div>
            <div className="story-body reveal reveal-d1" ref={addToRefs}>
              <p>You've felt it. A great idea that sits in a Notion doc because you don't have someone to build it with. Or worse — you found someone, started building, and six months later realized you had fundamentally different ideas about equity, effort, and what success even looks like.</p>
              <p>LinkedIn cold outreach leads to polite calls that go nowhere. Networking events produce card exchanges with people who are mildly interested but not committed. And the few co-founder matching tools that exist treat it like a job board — a profile, a skill tag, a ping.</p>
              <p><strong>Startups aren't built on resumes. They're built on relationships.</strong> On shared obsessions, on compatible risk tolerance, on knowing what happens when things go wrong — and they will go wrong.</p>
              <p>FounderMatch is designed around that reality. Before you match with anyone, we understand who you actually are as a builder — not just what skills you list.</p>

              <div className="story-aside" style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="aside-card" ref={addToRefs} style={{ transitionDelay: '0s' }}>
                  <div className="aside-card-num">65<em>%</em></div>
                  <div className="aside-card-text">of solo founders quit in year one. Not because their idea was bad. Because they burned out alone.</div>
                </div>
                <div className="aside-card" ref={addToRefs} style={{ transitionDelay: '0.12s' }}>
                  <div className="aside-card-num">↑ YC</div>
                  <div className="aside-card-text">Y Combinator has a set of questions they ask co-founding teams before funding. We built our compatibility engine around the same logic.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="how" id="how">
        <div className="section-wrap">
          <div className="how-header">
            <h2 className="how-title reveal" ref={addToRefs}>
              How it<br />
              actually <em>works.</em>
            </h2>
            <p className="how-desc reveal reveal-d1" ref={addToRefs}>
              Most matching is surface-level. We go deeper — because the difference between a great co-founder and a wrong one isn't skills. It's character, commitment, and compatibility.
            </p>
          </div>

          <div className="steps">
            <div className="step-row" ref={addToRefs} style={{ transitionDelay: '0s' }}>
              <div className="step-num-big">01</div>
              <div>
                <h3 className="step-content-title">Build a real founder profile.</h3>
                <p className="step-content-desc">Not a resume. Link your GitHub or portfolio, write a 140-character pitch for what you want to build, and tell us what you'd still work on in five years even if it paid nothing. We verify proof of work — not self-reported skills.</p>
                <span className="step-tag">Verified Skills</span>
              </div>
            </div>
            <div className="step-row" ref={addToRefs} style={{ transitionDelay: '0.08s' }}>
              <div className="step-num-big">02</div>
              <div>
                <h3 className="step-content-title">Take the compatibility quiz.</h3>
                <p className="step-content-desc">Inspired by the questions Y Combinator asks co-founding teams. Equity split philosophy. Risk tolerance. What happens when you disagree. What happens when you fail. We surface your working style before you surface to anyone else.</p>
                <span className="step-tag">YC-Inspired</span>
              </div>
            </div>
            <div className="step-row" ref={addToRefs} style={{ transitionDelay: '0.16s' }}>
              <div className="step-num-big">03</div>
              <div>
                <h3 className="step-content-title">Get matched with your complement.</h3>
                <p className="step-content-desc">Our engine pairs you with people who fill your gaps — not clones of you. A product thinker with a technical builder. A sales-driven CEO with a quiet CTO who ships fast. Complementary by design. Chemistry by conversation.</p>
                <span className="step-tag">Smart Matching</span>
              </div>
            </div>
            <div className="step-row" ref={addToRefs} style={{ transitionDelay: '0.24s' }}>
              <div className="step-num-big">04</div>
              <div>
                <h3 className="step-content-title">Build together — from the first conversation.</h3>
                <p className="step-content-desc">Matched pairs get a private space to talk, brainstorm, and figure out if they actually work well together before committing to anything. No pressure. Just space to see if the chemistry is real.</p>
                <span className="step-tag">Private Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROLES ─── */}
      <section className="roles" id="roles">
        <div className="section-wrap">
          <div className="section-label reveal" ref={addToRefs} style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            Who It's For <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }}></span>
          </div>
          <h2 className="roles-title reveal" ref={addToRefs}>
            Every great startup is<br />built by <em>three archetypes.</em>
          </h2>

          <div className="roles-grid">
            <div className="role-col" ref={addToRefs} style={{ transitionDelay: '0s' }}>
              <div className="role-marker">⚡</div>
              <h3 className="role-name">The Hustler</h3>
              <div className="role-alias">CEO · Sales · Growth</div>
              <p className="role-desc">You can sell the vision before the product exists. You live in conversations, pitch decks, and market research. You need someone who builds what you promise — and trusts you to find the customers.</p>
              <div className="role-skills">
                <span className="skill-tag">GTM</span>
                <span className="skill-tag">Fundraising</span>
                <span className="skill-tag">Partnerships</span>
                <span className="skill-tag">Sales</span>
              </div>
            </div>
            <div className="role-col" ref={addToRefs} style={{ transitionDelay: '0.1s' }}>
              <div className="role-marker">👾</div>
              <h3 className="role-name">The Hacker</h3>
              <div className="role-alias">CTO · Builder · Engineer</div>
              <p className="role-desc">You ship in a weekend what others spend a month planning. You think in systems, love elegant solutions, and need someone who handles the noise while you build in focused silence.</p>
              <div className="role-skills">
                <span className="skill-tag">Full Stack</span>
                <span className="skill-tag">AI / ML</span>
                <span className="skill-tag">Architecture</span>
                <span className="skill-tag">DevOps</span>
              </div>
            </div>
            <div className="role-col" ref={addToRefs} style={{ transitionDelay: '0.2s' }}>
              <div className="role-marker">✨</div>
              <h3 className="role-name">The Hipster</h3>
              <div className="role-alias">CPO · Design · Product</div>
              <p className="role-desc">You see user experience where others see functionality. You obsess over how things feel, not just how they work. You're the reason users fall in love with the product on their first day.</p>
              <div className="role-skills">
                <span className="skill-tag">Product</span>
                <span className="skill-tag">UX Research</span>
                <span className="skill-tag">Brand</span>
                <span className="skill-tag">Figma</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUIZ TEASER ─── */}
      <section className="quiz">
        <div className="quiz-wrap">
          <div className="quiz-grid">
            <div>
              <div className="quiz-label reveal" ref={addToRefs}>Compatibility Engine</div>
              <h2 className="quiz-title reveal" ref={addToRefs}>
                The questions that<br />
                <em>actually predict</em><br />
                co-founder chemistry.
              </h2>
              <p className="quiz-body reveal reveal-d1" ref={addToRefs}>
                Y Combinator asks co-founding teams these questions before writing a check. We ask them before making an introduction. Because the most common reason startups fail isn't product — it's founder conflict that no one saw coming.
              </p>
              <a href="#waitlist" className="quiz-cta reveal reveal-d2" ref={addToRefs}>Take the full quiz when you join →</a>
            </div>

            <div className="quiz-card-stack">
              <div className="quiz-q-card" ref={addToRefs} style={{ transitionDelay: '0s' }}>
                <div className="q-num">01</div>
                <div>
                  <div className="q-text">What problem would you still be working on in five years, even if it paid you nothing?</div>
                  <div className="q-tag">Intrinsic motivation</div>
                </div>
              </div>
              <div className="quiz-q-card" ref={addToRefs} style={{ transitionDelay: '0.1s' }}>
                <div className="q-num">02</div>
                <div>
                  <div className="q-text">If you and your co-founder disagree on a major product decision, what happens?</div>
                  <div className="q-tag">Conflict resolution</div>
                </div>
              </div>
              <div className="quiz-q-card" ref={addToRefs} style={{ transitionDelay: '0.2s' }}>
                <div className="q-num">03</div>
                <div>
                  <div className="q-text">Your startup has no traction at month six. What's your move?</div>
                  <div className="q-tag">Resilience & pivot logic</div>
                </div>
              </div>
              <div className="quiz-q-card" ref={addToRefs} style={{ transitionDelay: '0.3s' }}>
                <div className="q-num">04</div>
                <div>
                  <div className="q-text">How do you split equity? And what happens to that split if roles change?</div>
                  <div className="q-tag">Equity philosophy</div>
                </div>
              </div>
              <div className="quiz-q-card" ref={addToRefs} style={{ transitionDelay: '0.4s' }}>
                <div className="q-num">05</div>
                <div>
                  <div className="q-text">Why are you the person to build this? What's your unfair advantage?</div>
                  <div className="q-tag">Founder–market fit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WAITLIST ─── */}
      <section className="waitlist" id="waitlist">
        <div className="section-wrap">
          <div className="waitlist-grid">
            <div className="waitlist-sticky">
              <div className="waitlist-label reveal" ref={addToRefs}>Early Access</div>
              <h2 className="waitlist-title reveal" ref={addToRefs}>
                Your co-founder is<br />
                already <em>looking</em><br />
                for you.
              </h2>
              <p className="waitlist-body reveal reveal-d1" ref={addToRefs}>
                Join the waitlist. Get early access before we open to the public, help shape what gets built, and be among the first founders matched on the platform.
              </p>
              <div className="waitlist-proof reveal reveal-d2" ref={addToRefs}>
                <div className="proof-line"><span className="proof-dot"></span> 200+ founders already on the waitlist</div>
                <div className="proof-line"><span className="proof-dot"></span> University hubs launching at CU, IIT, and BITS first</div>
                <div className="proof-line"><span className="proof-dot"></span> Free to join. Always.</div>
                <div className="proof-line"><span className="proof-dot"></span> No spam. One email when your spot is ready.</div>
              </div>
            </div>

            <div className="reveal reveal-d1" ref={addToRefs}>
              <div className="form-card">
                <div className="form-header">Reserve your spot</div>
                
                {!isFormSubmitted ? (
                  <form className="form-body" onSubmit={handleSubmit}>
                    <div className="frow">
                      <div className="fg">
                        <label>First Name</label>
                        <input 
                          type="text" 
                          placeholder="Arjun"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          style={{ borderColor: formErrors.firstName ? 'var(--terra)' : '' }}
                        />
                      </div>
                      <div className="fg">
                        <label>Last Name</label>
                        <input 
                          type="text" 
                          placeholder="Sharma"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="fg">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="arjun@yourstartup.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ borderColor: formErrors.email ? 'var(--terra)' : '' }}
                      />
                    </div>
                    <div className="frow">
                      <div className="fg">
                        <label>College or Company</label>
                        <input 
                          type="text" 
                          placeholder="Chandigarh University"
                          value={formData.college}
                          onChange={(e) => setFormData({...formData, college: e.target.value})}
                        />
                      </div>
                      <div className="fg">
                        <label>Your Archetype</label>
                        <select 
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                          <option value="" disabled>Choose one</option>
                          <option>Hustler — CEO / Sales</option>
                          <option>Hacker — CTO / Dev</option>
                          <option>Hipster — Design / Product</option>
                          <option>Still figuring it out</option>
                        </select>
                      </div>
                    </div>
                    <div className="fg" style={{ marginBottom: '1.5rem' }}>
                      <label>Your biggest challenge right now</label>
                      <textarea 
                        placeholder="Be honest. This helps us understand where you are."
                        value={formData.struggle}
                        onChange={(e) => setFormData({...formData, struggle: e.target.value})}
                      ></textarea>
                    </div>
                    <button type="submit" className="submit-btn">
                      Reserve My Spot
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <p className="form-note">No payment required. No spam. Ever.</p>
                  </form>
                ) : (
                  <div className="success-state" style={{ display: 'block' }}>
                    <div className="success-line"></div>
                    <h3 className="success-title">You're on the list.</h3>
                    <p className="success-body">We'll reach out when your early access is ready. In the meantime, if you know another founder who's serious — send them here. The more quality builders we have, the better your matches.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <a href="#" className="footer-logo">Founder<span>Match</span></a>
        <div className="footer-copy">Built for Gen Z founders who are tired of building alone &nbsp;·&nbsp; India</div>
      </footer>
    </>
  );
};

export default NarrativeLanding;
