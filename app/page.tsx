"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const router = useRouter()
  const { data: me, isLoading } = useSWR("/api/me", fetcher)
  const [showHomepage, setShowHomepage] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!me?.user) {
        // Show homepage for non-logged in users
        setShowHomepage(true)
      } else if (!me?.profile?.fullName) {
        // User logged in but hasn't completed onboarding
        router.push("/onboarding")
      } else {
        // User has completed onboarding, go to dashboard
        router.push("/dashboard")
      }
    }
  }, [me, isLoading, router])

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #1e1b4b, #312e81, #3730a3, #1e40af, #1e3a8a)',
        backgroundSize: '400% 400%',
        animation: 'gradientMove 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3); }
          }
          .loading-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 3rem 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
            animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .loading-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
          }
        `}</style>
        
        <div className="loading-container">
          <div className="loading-icon">💼</div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            color: 'white',
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>TaxSage</h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem'
          }}>Loading your financial dashboard...</p>
        </div>
      </div>
    )
  }

  if (showHomepage) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(-45deg, #1e1b4b, #312e81, #3730a3, #1e40af, #1e3a8a)', backgroundSize: '400% 400%', animation: 'gradientMove 15s ease infinite', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-8px) rotate(1deg); }
            66% { transform: translateY(-15px) rotate(-1deg); }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes slideIn {
            0% { opacity: 0; transform: translateX(-40px) scale(0.95); }
            100% { opacity: 1; transform: translateX(0) scale(1); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
          
          .glass-nav {
            background: rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(25px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .glass-card {
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(25px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .glass-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
          }
          
          .glass-card:hover::before {
            left: 100%;
          }
          
          .glass-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            border-color: rgba(255, 255, 255, 0.25);
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            border-radius: 50px;
            color: white;
            font-weight: 700;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .btn-primary:hover::before {
            left: 100%;
          }
          
          .btn-primary:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 15px 40px rgba(16, 185, 129, 0.6);
          }
          
          .btn-secondary {
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            color: white;
            font-weight: 700;
            backdrop-filter: blur(15px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }
          
          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 12px 30px rgba(255, 255, 255, 0.1);
          }
          
          .floating-orb {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 70%, transparent 100%);
            filter: blur(1px);
          }
          
          .text-gradient {
            background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .hero-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            line-height: 1.1;
            letter-spacing: -0.02em;
          }
          
          @media (max-width: 768px) {
            .glass-card {
              margin: 0 1rem;
              padding: 1.5rem;
            }
            .hero-title {
              font-size: clamp(2rem, 8vw, 3rem);
            }
            .btn-group {
              flex-direction: column;
              gap: 1rem;
              width: 100%;
            }
            .btn-group button {
              width: 100%;
            }
          }
          
          @media (max-width: 640px){
            .nav-get-started{
              padding:.55rem 1.15rem !important;
              font-size:.85rem !important;
              border-radius:40px !important;
              font-weight:600;
            }
            .hero-main-btn{
              padding:.9rem 1.6rem !important;
              font-size:.95rem !important;
              width:100%;
              max-width:320px;
              letter-spacing:.3px;
            }
            .cta-main-btn{
              padding:1rem 1.75rem !important;
              font-size:1.05rem !important;
              width:100%;
              max-width:360px;
              line-height:1.2;
              letter-spacing:.2px;
              white-space:normal;
            }
            .final-cta-wrapper{
              padding:2.5rem 1.25rem !important;
            }
            .final-cta-wrapper h2{
              font-size:2rem !important;
              line-height:1.15;
            }
            .hero-title{
              font-size:clamp(1.9rem,9vw,2.4rem) !important;
            }
          }
          @media (max-width: 480px) {
            .floating-orb {
              display: none;
            }
          }
          @media (max-width:420px){
            .hero-main-btn{font-size:.9rem !important; padding:.85rem 1.4rem !important;}
            .cta-main-btn{font-size:.95rem !important; padding:.9rem 1.4rem !important;}
            .final-cta-wrapper h2{font-size:1.75rem !important;}
          }
          /* added: prevent horizontal scroll */
          html, body { overflow-x:hidden; }
          body { width:100%; position:relative; }
          .glass-card, .glass-nav { max-width:100%; }
          .floating-orb { will-change:transform; }
          @media (max-width:640px){
            .hero-title, .final-cta-wrapper, .btn-group, nav, main { max-width:100%; overflow-x:hidden; }
          }
        `}</style>

        {/* Floating Background Elements */}
        <div className="floating-orb" style={{
          top: '10%',
          left: '10%',
          width: '120px',
          height: '120px',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        
        <div className="floating-orb" style={{
          top: '60%',
          right: '15%',
          width: '100px',
          height: '100px',
          animation: 'float 12s ease-in-out infinite reverse'
        }}></div>
        
        <div className="floating-orb" style={{
          bottom: '25%',
          left: '20%',
          width: '80px',
          height: '80px',
          animation: 'float 10s ease-in-out infinite 2s'
        }}></div>
        
        <div className="floating-orb" style={{
          top: '30%',
          right: '40%',
          width: '60px',
          height: '60px',
          animation: 'float 15s ease-in-out infinite 1s'
        }}></div>
        
        <div className="floating-orb" style={{
          bottom: '10%',
          right: '25%',
          width: '90px',
          height: '90px',
          animation: 'float 9s ease-in-out infinite reverse 3s'
        }}></div>

        {/* Navigation */}
        <nav className="glass-nav" style={{
          padding: '1rem 0',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img 
                src="/icon.svg" 
                alt="TaxSage Logo" 
                style={{ 
                  width: '2.5rem',
                  height: '2.5rem',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }}
              />
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>TaxSage</h1>
            </div>
            
            <button
              className="nav-get-started"
              onClick={() => router.push('/login')}
              style={{
                padding: '0.75rem 2rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                const t = e.target as HTMLElement
                t.style.background = 'rgba(255,255,255,0.25)'
                t.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                const t = e.target as HTMLElement
                t.style.background = 'rgba(255,255,255,0.15)'
                t.style.transform = 'translateY(0)'
              }}
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '6rem 2rem',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <h1 className="hero-title text-gradient" style={{
              fontWeight: '900',
              marginBottom: '1.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 1s ease-out'
            }}>
              Your Smart Tax & Financial Assistant
            </h1>
            
            <p style={{
              fontSize: '1.3rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '3rem',
              maxWidth: '600px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.6',
              animation: 'fadeInUp 1s ease-out 0.2s both'
            }}>
              Get personalized tax strategies, credit analysis, and financial planning powered by AI. 
              Maximize your savings and make informed decisions.
            </p>

            <div className="btn-group" style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              animation: 'fadeInUp 1s ease-out 0.4s both'
            }}>
              <button
                className="btn-primary hero-main-btn"
                onClick={() => router.push('/login')}
                style={{ padding: '1.2rem 3rem', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                🚀 Start Free Analysis
              </button>
              
              <button
                className="btn-secondary"
                onClick={() => router.push('/credit-analysis')}
                style={{ padding: '1.2rem 3rem', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                📊 Check Credit Score
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {[
              {
                icon: '🎯',
                title: 'Smart Tax Planning',
                description: 'AI-powered strategies to maximize your tax savings with sections 80C, 80D, HRA, and more.',
                delay: '0.6s'
              },
              {
                icon: '📈',
                title: 'Credit Score Analysis',
                description: 'Upload your credit report for personalized loan eligibility and improvement recommendations.',
                delay: '0.8s'
              },
              {
                icon: '💡',
                title: 'Financial Insights',
                description: 'Get expert advice on investments, budgeting, and wealth building strategies.',
                delay: '1s'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  animation: `fadeInUp 1s ease-out ${feature.delay} both`,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '1rem'
                }}>{feature.title}</h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6'
                }}>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="glass-card final-cta-wrapper" style={{ padding: '4rem 2rem', textAlign: 'center', animation: 'fadeInUp 1s ease-out 1.2s both' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              Ready to Optimize Your Finances?
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
              Join thousands of users who have saved money with TaxSage
            </p>
            <button
              className="btn-primary cta-main-btn"
              onClick={() => router.push('/login')}
              style={{
                padding: '1.5rem 4rem',
                cursor: 'pointer',
                fontSize: '1.3rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
              }}
            >
              🎉 Get Started Today - It's Free!
            </button>
          </div>
        </main>
      </div>
    )
  }

  return null
}
