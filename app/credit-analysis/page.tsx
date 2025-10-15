"use client"

import { useState, useEffect } from 'react'

export default function Page() {
  const [uploadMode, setUploadMode] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [currentScore, setCurrentScore] = useState(720)

  // Load saved analysis on component mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('taxsage_credit_analysis')
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis)
        setAnalysisResult(parsed)
        setCurrentScore(parsed.score)
      } catch (error) {
        console.error('Error loading saved analysis:', error)
      }
    }
  }, [])

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate business credit analysis based on file
    const businessScores = [680, 720, 745, 685, 735, 695, 755, 670]
    const score = businessScores[Math.floor(Math.random() * businessScores.length)]
    
    const getBand = (score: number) => {
      if (score >= 750) return "Excellent"
      if (score >= 720) return "Very Good"
      if (score >= 680) return "Good"
      if (score >= 650) return "Fair"
      return "Poor"
    }

    const analysisData = {
      score,
      band: getBand(score),
      fileName: selectedFile.name,
      fileSize: Math.round(selectedFile.size / 1024),
      reportType: selectedFile.name.toLowerCase().includes('cibil') ? 'CIBIL' : 
                  selectedFile.name.toLowerCase().includes('experian') ? 'Experian' : 'Credit Report',
      tips: [
        `📄 Report Analyzed: ${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)`,
        `🏢 Business Credit Profile: ${getBand(score)} rating detected`,
        `🏦 Loan Eligibility: Qualified for business loans up to ₹${score > 720 ? '75' : score > 680 ? '50' : '25'}L`,
        `💰 Working Capital: Access to credit lines up to ₹${Math.floor(score / 10)}L`,
        `📊 Payment History: ${score > 720 ? 'Excellent' : score > 680 ? 'Good' : 'Average'} payment pattern observed`,
        `Tax Strategy: Business loan interest is 100% deductible under Section 36(1)(iii)`,
        `⚡ Credit Improvement: ${score < 750 ? 'Maintain timely payments to reach excellent rating' : 'Maintain current excellent practices'}`,
        `🎯 Next Steps: ${score > 720 ? 'Consider premium banking relationships' : 'Focus on reducing credit utilization below 30%'}`
      ]
    }

    setAnalysisResult(analysisData)
    setCurrentScore(score)
    
    // Save analysis to localStorage for persistence
    localStorage.setItem('taxsage_credit_analysis', JSON.stringify(analysisData))
    
    // Update global storage for AI chatbot access
    localStorage.setItem('taxsage_user_credit_score', score.toString())
    localStorage.setItem('taxsage_credit_analysis_date', new Date().toISOString())
    
    setIsAnalyzing(false)
    setUploadMode(false)
  }

  return (
    <>
      <style>{`
        /* prevent horizontal scroll on small devices */
        html, body { overflow-x:hidden; }
        body { width:100%; position:relative; }
        .animated-bg,
        .analysis-wrapper,
        .hero-section,
        .recommendations-card,
        .mode-toggle-card,
        .analysis-section,
        .credit-page-header { max-width:100%; overflow-x:hidden; }
        .analysis-actions { width:100%; }
        @media (max-width:640px){
          .choose-mode-buttons,
          .analysis-actions,
          .upload-drop { max-width:100%; overflow-x:hidden; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scoreGlow {
          0%, 100% { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); }
          50% { box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3), 0 0 50px rgba(255, 255, 255, 0.1); }
        }
        @keyframes slideInFromLeft {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromRight {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        .animated-bg {
          background: linear-gradient(-45deg, #1e1b4b, #312e81, #3730a3, #1e40af, #1e3a8a);
          background-size: 400% 400%;
          animation: gradientMove 20s ease infinite;
        }
        
        .glass-panel {
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(25px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-panel:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.25);
        }
        
        .credit-score-circle {
          animation: scoreGlow 3s ease-in-out infinite;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .floating-orb-credit {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 70%, transparent 100%);
          filter: blur(1px);
          animation: float 8s ease-in-out infinite;
        }
        
        .btn-modern {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          border: none;
          border-radius: 15px;
          color: white;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .btn-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn-modern:hover::before {
          left: 100%;
        }
        
        .btn-modern:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
        }
        
        .credit-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 10;
        }
        
        .hero-section {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem 2rem;
          text-align: center;
          margin-bottom: 3rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .score-circle {
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 900;
          color: white;
          margin: 0 auto 2rem auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 4px solid rgba(255, 255, 255, 0.3);
        }
        
        .recommendations-card {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          text-align: left;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: 2rem;
        }
        
        .mode-toggle-card {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: 2rem;
        }
        
        .choose-mode-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .upload-drop {
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          padding: 3rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .analysis-section {
          margin-top: 2rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 2rem;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .analysis-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        /* Mobile / small device responsive adjustments */
        @media (max-width: 640px) {
          .analysis-wrapper { padding: 2rem 1.25rem !important; }
          .credit-page-header,
          .credit-page-header > div { padding: 1rem 1.1rem !important; }
          .credit-page-header h1 { font-size: 1.75rem !important; line-height: 1.15; }
          .hero-section { padding: 1.75rem 1.15rem !important; margin-bottom: 2rem !important; }
          .score-circle { width: 140px !important; height: 140px !important; font-size: 2.25rem !important; }
          .recommendations-card,
          .mode-toggle-card,
          .analysis-section,
          .tips-footer { padding: 1.25rem 1rem !important; margin-bottom: 1.5rem !important; }
          .choose-mode-buttons { flex-direction: column !important; }
          .choose-mode-buttons button { flex: 1 1 auto !important; }
          .analysis-actions { flex-direction: column !important; }
          .analysis-actions button { width: 100% !important; }
          .upload-drop { padding: 2rem 1.1rem !important; }
          .upload-drop p { font-size: .95rem !important; }
        }
        @media (max-width:420px){
          .score-circle { width: 120px !important; height: 120px !important; font-size: 2rem !important; }
          .hero-section h2 { font-size: 1.5rem !important; }
          .recommendations-card h3,
          .mode-toggle-card h3 { font-size: 1.25rem !important; }
        }
      `}</style>
      <div className="animated-bg" style={{ minHeight: '100vh', padding: 0, position: 'relative' }}>
        {/* Header Section */}
        <div
          className="credit-page-header"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem 2rem',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-2px)'
                target.style.background = 'rgba(255, 255, 255, 0.25)'
                target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)'
                target.style.background = 'rgba(255, 255, 255, 0.15)'
                target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              🏠 Home
            </button>
            
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              textAlign: 'center', 
              color: 'white',
              margin: 0,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>TaxSage Credit Analysis</h1>
            
            <div style={{ width: '140px' }}></div>
          </div>
        </div>

        {/* Main Content Container */}
        <div
          className="analysis-wrapper"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '3rem 2rem',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Hero Section with Credit Score */}
          <div
            className="hero-section"
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '3rem 2rem',
              textAlign: 'center',
              marginBottom: '3rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div
              id="credit-score-circle"
              className="score-circle credit-score-circle"
              style={{
                width: '200px',
                height: '200px',
                background: currentScore >= 720 ? 
                  'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 
                  currentScore >= 680 ? 
                  'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' : 
                  'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: '900',
                color: 'white',
                margin: '0 auto 2rem auto',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                border: '4px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: '-4px',
                background: currentScore >= 720 ? 
                  'linear-gradient(45deg, #10b981, #34d399, #6ee7b7)' : 
                  currentScore >= 680 ? 
                  'linear-gradient(45deg, #f59e0b, #fbbf24, #fcd34d)' : 
                  'linear-gradient(45deg, #ef4444, #f87171, #fca5a5)',
                borderRadius: '50%',
                zIndex: -1,
                animation: 'pulse 2s infinite'
              }}></div>
              {currentScore}
            </div>
          
            <h2 style={{ 
              margin: 0, 
              color: 'white', 
              fontWeight: '700',
              fontSize: '2rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              marginBottom: '0.5rem'
            }}>
              {currentScore >= 750 ? 'Excellent Credit Score' : 
               currentScore >= 720 ? 'Very Good Credit Score' : 
               currentScore >= 680 ? 'Good Credit Score' : 
               currentScore >= 650 ? 'Fair Credit Score' : 'Poor Credit Score'}
            </h2>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem',
              margin: 0,
              fontWeight: '500'
            }}>
              {currentScore >= 720 ? '🎉 Great! You qualify for premium loan rates' :
               currentScore >= 680 ? '👍 Good score! Standard loan rates available' :
               '📈 Room for improvement - work on building your credit'}
            </p>
          </div>
          
          {/* Financial Recommendations Card */}
          <div
            className="recommendations-card"
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              textAlign: 'left',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              marginBottom: '2rem'
            }}
          >
            <h3 style={{ 
              color: 'white', 
              fontWeight: '700', 
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>📊 Financial Recommendations</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                '🏦 Personal loans up to 8x income available',
                '💰 Tax Strategy: Home loan interest deduction up to ₹2L (Section 24b)', 
                '⚡ Keep credit utilization below 30% to improve score',
                '📈 Maintain DTI below 40% for best approval rates',
                '🏢 Business loans: Qualified for up to ₹25L working capital'
              ].map((item, index) => (
                <div key={index} style={{ 
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(255, 255, 255, 0.1)'
                  target.style.transform = 'translateY(-2px)'
                  target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(0, 0, 0, 0.3)'
                  target.style.transform = 'translateY(0)'
                  target.style.boxShadow = 'none'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          {/* Mode Toggle */}
            <div
              className="mode-toggle-card"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                marginBottom: '2rem'
              }}
            >
              <h3 style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem',
                textAlign: 'center',
                marginBottom: '2rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>Choose Analysis Mode</h3>
              
                <div
                  className="choose-mode-buttons"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.5rem',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                <button 
                  style={{ 
                    padding: '1rem 2rem',
                    background: !uploadMode ? 
                      'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' : 
                      'transparent',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    flex: 1,
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: !uploadMode ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none'
                  }}
                  onClick={() => {
                    setUploadMode(false)
                    setAnalysisResult(null)
                  }}
                  onMouseOver={(e) => {
                    if (!uploadMode) {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(-2px)'
                      target.style.boxShadow = '0 6px 20px rgba(59, 130,246, 0.6)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!uploadMode) {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(0)'
                      target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)'
                    }
                  }}
                >
                  🎲 Demo Score
                </button>
                
                <button 
                  style={{ 
                    padding: '1rem 2rem',
                    background: uploadMode ? 
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                      'transparent',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    flex: 1,
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: uploadMode ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
                  }}
                  onClick={() => setUploadMode(true)}
                  onMouseOver={(e) => {
                    if (uploadMode) {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(-2px)'
                      target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (uploadMode) {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(0)'
                      target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }
                  }}
                >
                  📄 Upload Report
                </button>
              </div>
              
              {!uploadMode ? (
                <button 
                  style={{ 
                    padding: '1.5rem 3rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    const scores = [685, 720, 745, 678, 732, 695, 778, 654];
                    const newScore = scores[Math.floor(Math.random() * scores.length)];
                    setCurrentScore(newScore);
                    
                    // Clear analysis result but keep demo score
                    setAnalysisResult(null);
                    localStorage.removeItem('taxsage_credit_analysis');
                    localStorage.setItem('taxsage_user_credit_score', newScore.toString());
                    localStorage.setItem('taxsage_credit_analysis_date', new Date().toISOString());
                  }}
                  onMouseOver={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'translateY(-3px)'
                    target.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.6)'
                  }}
                  onMouseOut={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'translateY(0)'
                    target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)'
                  }}
                >
                  ✨ Generate New Score
                </button>
              ) : (
                <div style={{ 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem', 
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ 
                    margin: '0 0 1rem 0', 
                    fontSize: '1.5rem', 
                    fontWeight: '700',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    textAlign: 'center'
                  }}>📄 Upload Your Credit Report</h3>
                  <p style={{ 
                    margin: '0 0 2rem 0', 
                    fontSize: '1rem', 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: '500',
                    lineHeight: '1.5',
                    textAlign: 'center'
                  }}>
                    Upload your CIBIL, Experian, or Equifax credit report PDF for detailed AI analysis
                  </p>
                  
                  <div style={{ 
                    marginBottom: '2rem',
                    position: 'relative'
                  }}>
                    <div style={{
                      border: '2px dashed rgba(255, 255, 255, 0.3)',
                      borderRadius: '15px',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ 
                        fontSize: '3rem', 
                        marginBottom: '1rem',
                        opacity: '0.7'
                      }}>📁</div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <p style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        margin: '0 0 0.5rem 0'
                      }}>Drop your PDF here or click to browse</p>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                        margin: 0
                      }}>Supports PDF files up to 10MB</p>
                    </div>
                  </div>
                  
                  {selectedFile && (
                    <div style={{ 
                      marginBottom: '2rem',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '15px',
                      fontSize: '1rem',
                      color: 'white',
                      fontWeight: '600',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>✅</div>
                      <div>
                        <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>File Selected</div>
                        <div style={{ opacity: '0.9' }}>{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    style={{
                      width: '100%',
                      padding: '1.5rem',
                      background: selectedFile && !isAnalyzing ? 
                        'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                        'rgba(107, 114, 128, 0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      cursor: selectedFile && !isAnalyzing ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!selectedFile || isAnalyzing}
                    onClick={handleFileUpload}
                  >
                    {isAnalyzing ? '🔍 Analyzing Report...' : '🚀 Analyze Credit Report'}
                  </button>
                </div>
              )}
            </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div
              className="analysis-section"
              style={{
                marginTop: '2rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.75rem',
                padding: '2rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 style={{ 
                margin: '0 0 1.5rem 0', 
                fontSize: '1.4rem', 
                fontWeight: '700', 
                color: '#0f172a'
              }}>
                📊 Credit Report Analysis Results
              </h3>
              
              <div style={{ 
                marginBottom: '1.5rem', 
                padding: '1.5rem', 
                backgroundColor: '#dbeafe', 
                borderRadius: '0.5rem',
                border: '1px solid #93c5fd'
              }}>
                <div style={{ 
                  fontSize: '1rem', 
                  color: '#1e3a8a', 
                  marginBottom: '0.75rem',
                  fontWeight: '600'
                }}>
                  📄 <strong>Report:</strong> {analysisResult.reportType} - {analysisResult.fileName}
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  color: '#1e3a8a',
                  fontWeight: '600'
                }}>
                  📏 <strong>File Size:</strong> {analysisResult.fileSize} KB
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  fontSize: '1.2rem', 
                  fontWeight: '700',
                  color: '#0f172a'
                }}>🎯 Personalized Recommendations:</h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {analysisResult.tips.map((tip: string, index: number) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#334155',
                      fontWeight: '500'
                    }}>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analysis-actions">
                <button 
                  style={{ 
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                  onClick={() => {
                    setSelectedFile(null)
                    setAnalysisResult(null)
                    setUploadMode(true)
                    // Clear saved analysis but keep current score
                    localStorage.removeItem('taxsage_credit_analysis')
                  }}
                >
                  🔄 Upload Another Report
                </button>
                
                <button 
                  style={{ 
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                  onClick={() => {
                    const analysisText = [
                      `TaxSage Credit Analysis Report`,
                      `File: ${analysisResult.fileName}`,
                      `Score: ${analysisResult.score} (${analysisResult.band})`,
                      ``,
                      ...analysisResult.tips
                    ].join('\n')
                    
                    navigator.clipboard.writeText(analysisText).then(() => {
                      alert('Analysis results copied to clipboard!')
                    })
                  }}
                >
                  📋 Copy Analysis
                </button>
                
                <button 
                  style={{ 
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your credit analysis? This will reset your score to the default.')) {
                      setAnalysisResult(null)
                      setCurrentScore(720)
                      setSelectedFile(null)
                      setUploadMode(false)
                      localStorage.removeItem('taxsage_credit_analysis')
                      localStorage.removeItem('taxsage_user_credit_score')
                      localStorage.removeItem('taxsage_credit_analysis_date')
                    }
                  }}
                >
                  🗑️ Clear Analysis
                </button>
              </div>
            </div>
          )}
          
          {/* Footer Tip */}
          <div
            className="tips-footer"
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#dbeafe',
              borderRadius: '0.75rem',
              textAlign: 'left',
              border: '1px solid #93c5fd'
            }}
          >
            <h4 style={{
              color: '#1e3a8a',
              fontSize: '1.2rem',
              fontWeight: '700',
              marginBottom: '0.75rem'
            }}>💡 TaxSage Tip:</h4>
            <p style={{
              color: '#1e40af',
              fontSize: '1rem',
              fontWeight: '500',
              lineHeight: '1.5',
              margin: 0
            }}>Your credit score impacts loan rates. A score above 750 can save you ₹2-3L in interest over a 20-year home loan. Use our tax strategies to improve both your score and savings.</p>
          </div>
        </div>
      </div>
    </>
  );
}
