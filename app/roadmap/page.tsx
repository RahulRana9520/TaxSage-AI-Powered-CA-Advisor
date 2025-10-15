"use client"

export default function RoadmapPage() {
  return (
    <div className="animated-bg" style={{
      minHeight: '100vh',
      position: 'relative'
    }}>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(-12px) rotate(-1deg); }
        }
        .animated-bg {
          background: linear-gradient(-45deg, #1e1b4b, #312e81, #3730a3, #1e40af, #1e3a8a);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          animation: float 6s ease-in-out infinite;
          z-index: 0;
        }
        .floating-orb:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        .floating-orb:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 20%;
          right: 10%;
          animation-delay: 2s;
        }
        .floating-orb:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }
        .floating-orb:nth-child(4) {
          width: 120px;
          height: 120px;
          bottom: 10%;
          right: 20%;
          animation-delay: 1s;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
        }
        .roadmap-item {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        .roadmap-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .roadmap-step {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        .step-number {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.1rem;
        }
        .step-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: white;
        }
        .step-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-left: auto;
        }
        .status-completed {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .status-current {
          background: rgba(249, 115, 22, 0.2);
          color: #fb923c;
          border: 1px solid rgba(249, 115, 22, 0.3);
        }
        .status-upcoming {
          background: rgba(107, 114, 128, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(107, 114, 128, 0.3);
        }
      `}</style>

      {/* Floating Orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      <main style={{ position: 'relative', zIndex: 1, padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: 'white',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🗺️ TaxSage Roadmap
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your journey to financial freedom with AI-powered insights and expert CA guidance
          </p>
        </div>

        {/* Navigation Back */}
        <div style={{ marginBottom: '2rem' }}>
          <a 
            href="/dashboard" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLElement;
              target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLElement;
              target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Roadmap Steps */}
        <div>
          <div className="roadmap-item">
            <div className="roadmap-step">
              <div className="step-number">1</div>
              <div className="step-title">Account Setup & Profile</div>
              <div className="status-badge status-completed">Completed</div>
            </div>
            <div className="step-description">
              ✅ Create your TaxSage account<br/>
              ✅ Complete profile information<br/>
              ✅ Set up financial preferences
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-step">
              <div className="step-number">2</div>
              <div className="step-title">Credit Score Analysis</div>
              <div className="status-badge status-current">Current Step</div>
            </div>
            <div className="step-description">
              📊 Upload and analyze your credit report<br/>
              🎯 Get personalized credit improvement recommendations<br/>
              💡 Understand your loan eligibility and rates
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-step">
              <div className="step-number">3</div>
              <div className="step-title">Financial Goal Setting</div>
              <div className="status-badge status-upcoming">Coming Soon</div>
            </div>
            <div className="step-description">
              🎯 Define your financial objectives<br/>
              📈 Create investment strategies<br/>
              🏠 Plan for major purchases (home, car, etc.)
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-step">
              <div className="step-number">4</div>
              <div className="step-title">Tax Optimization</div>
              <div className="status-badge status-upcoming">Coming Soon</div>
            </div>
            <div className="step-description">
              💰 Maximize tax deductions and savings<br/>
              📋 Automated tax planning suggestions<br/>
              📊 Investment options for tax benefits
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-step">
              <div className="step-number">5</div>
              <div className="step-title">Wealth Building</div>
              <div className="status-badge status-upcoming">Coming Soon</div>
            </div>
            <div className="step-description">
              🚀 Advanced investment strategies<br/>
              🏦 Portfolio management<br/>
              📈 Long-term wealth creation plans
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-step">
              <div className="step-number">6</div>
              <div className="step-title">Expert CA Consultation</div>
              <div className="status-badge status-upcoming">Coming Soon</div>
            </div>
            <div className="step-description">
              👨‍💼 Connect with certified CAs<br/>
              📞 1-on-1 consultation sessions<br/>
              📋 Personalized financial audit
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-panel" style={{ 
          padding: '2rem', 
          marginTop: '3rem', 
          textAlign: 'center' 
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: 'white',
            marginBottom: '1rem'
          }}>
            Ready to Continue Your Journey?
          </h2>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2rem'
          }}>
            Take the next step towards financial freedom
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/credit-analysis"
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
              }}
            >
              Analyze Credit Score
            </a>
            <a 
              href="/dashboard"
              style={{
                padding: '0.75rem 2rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
