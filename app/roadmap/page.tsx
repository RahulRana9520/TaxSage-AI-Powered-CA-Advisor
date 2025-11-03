"use client"

import { useState, useEffect } from "react"
import { Download, Calendar, Target, ChevronLeft } from "lucide-react"

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([])
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null)

  const formatDescription = (text: string) => {
    if (!text) return ""
    
    return text
      // Remove problematic characters
      .replace(/[\uFFFD�]/g, '')
      
      // Remove markdown headers (### symbols)  
      .replace(/#{1,6}\s*/g, '')
      
      // Handle step patterns - ensure line breaks
      .replace(/🔴\s*🔴\s*Step\s*(\d+):/gi, '\n\n📌 Step $1:\n')
      .replace(/🔴\s*Step\s*(\d+):/gi, '\n\n📌 Step $1:\n')
      .replace(/Step\s*(\d+):/gi, '\n\n📌 Step $1:\n')
      
      // Handle bullet points with proper line breaks
      .replace(/\s*🔸\s*/g, '\n• ')
      .replace(/\s*✅\s*/g, '\n• ')
      .replace(/\s*📍\s*/g, '\n• ')
      .replace(/\s*•\s*/g, '\n• ')
      .replace(/\s*-\s+([A-Z])/g, '\n• $1')
      
      // Handle key sections
      .replace(/(Car Cost:|Recommended|Down Payment:|Loan Required:|Loan Tenure:|Action Items:|Monthly Income:|Savings:|Expenses:)/gi, '\n\n✅ $1')
      
      // Clean up markdown
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      
      // Remove separators and clean up
      .replace(/---\s*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim()
  }

  useEffect(() => {
    const loadRoadmaps = () => {
      try {
        const stored = localStorage.getItem("taxsage_roadmaps")
        if (stored) {
          const parsed = JSON.parse(stored)
          setRoadmaps(Array.isArray(parsed) ? parsed : [])
        }
      } catch (error) {
        console.error("Error loading roadmaps:", error)
        setRoadmaps([])
      }
    }

    loadRoadmaps()
    const handleUpdate = () => loadRoadmaps()
    window.addEventListener("taxsage_roadmap_updated", handleUpdate)
    return () => window.removeEventListener("taxsage_roadmap_updated", handleUpdate)
  }, [])

  const handleDownload = (roadmap: any) => {
    const content = `${roadmap.title}\n\nCreated: ${new Date(roadmap.createdAt).toLocaleDateString()}\n\n${formatDescription(roadmap.description)}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${roadmap.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(-45deg, #1e1b4b, #312e81, #3730a3, #1e40af, #1e3a8a)",
      padding: "2rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", color: "white" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "1rem" }}>
            📋 Financial Roadmaps
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255, 255, 255, 0.8)" }}>
            Your personalized financial journey plans created by TaxSage AI
          </p>
        </div>
        
        {selectedRoadmap && (
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            padding: "2rem",
            borderRadius: "20px",
            marginBottom: "2rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <button 
                onClick={() => setSelectedRoadmap(null)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  color: "inherit",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <button 
                onClick={() => handleDownload(selectedRoadmap)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none", 
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  color: "inherit",
                  cursor: "pointer"
                }}
              >
                <Download size={20} />
                Download
              </button>
            </div>

            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
              {selectedRoadmap.title}
            </h2>

            <div style={{
              background: "rgba(255, 255, 255, 0.15)",
              padding: "2rem",
              borderRadius: "16px"
            }}>
              {formatDescription(selectedRoadmap.description).split('\n').map((line, index) => {
                const trimmed = line.trim()
                
                if (!trimmed) {
                  return <div key={index} style={{ height: "0.8rem" }}></div>
                }
                
                // Step headers
                if (trimmed.startsWith('📌 Step')) {
                  return (
                    <div key={index} style={{ 
                      fontSize: "1.6rem", 
                      fontWeight: "bold", 
                      color: "#fbbf24", 
                      margin: "2rem 0 1rem 0",
                      padding: "1rem 0 0.5rem 0",
                      borderBottom: "2px solid rgba(251, 191, 36, 0.4)",
                      display: "block"
                    }}>
                      {trimmed}
                    </div>
                  )
                }
                
                // Bullet points
                if (trimmed.startsWith('• ')) {
                  return (
                    <div key={index} style={{ 
                      fontSize: "1.1rem",
                      margin: "0.8rem 0",
                      paddingLeft: "2.5rem",
                      position: "relative",
                      lineHeight: 1.7,
                      display: "block",
                      color: "white"
                    }}>
                      <span style={{ 
                        position: "absolute", 
                        left: "1rem", 
                        color: "#60a5fa",
                        fontWeight: "bold",
                        fontSize: "1.3rem"
                      }}>
                        •
                      </span>
                      <span>{trimmed.substring(2)}</span>
                    </div>
                  )
                }
                
                // Important sections with checkmarks
                if (trimmed.startsWith('✅')) {
                  return (
                    <div key={index} style={{ 
                      fontSize: "1.3rem", 
                      fontWeight: "600", 
                      color: "#34d399", 
                      margin: "1.5rem 0 1rem 0",
                      padding: "0.5rem 0",
                      display: "block"
                    }}>
                      {trimmed}
                    </div>
                  )
                }
                
                // Regular paragraphs
                if (trimmed) {
                  return (
                    <div key={index} style={{ 
                      fontSize: "1.05rem",
                      margin: "0.8rem 0",
                      lineHeight: 1.8,
                      color: "rgba(255, 255, 255, 0.95)",
                      display: "block"
                    }}>
                      {trimmed}
                    </div>
                  )
                }
                
                return null
              })}
            </div>
          </div>
        )}
        
        {!selectedRoadmap && (
          <>
            {roadmaps.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "2rem",
                  borderRadius: "12px",
                  maxWidth: "600px",
                  margin: "0 auto"
                }}>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#60a5fa" }}>
                    🚀 Get Started with Your Financial Journey
                  </h3>
                  <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                    No roadmaps yet. Visit the dashboard and ask the CA chatbot to create a personalized roadmap!
                  </p>
                  <a 
                    href="/dashboard"
                    style={{
                      display: "inline-block",
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      color: "white",
                      padding: "0.75rem 2rem",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: "600"
                    }}
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
                {roadmaps.map((roadmap: any) => (
                  <div 
                    key={roadmap.id}
                    onClick={() => setSelectedRoadmap(roadmap)}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      padding: "1.5rem",
                      borderRadius: "16px",
                      cursor: "pointer",
                      color: "white"
                    }}
                  >
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "1rem" }}>
                      {roadmap.title}
                    </h3>
                    <div style={{ fontSize: "0.8rem", opacity: 0.8, marginBottom: "1rem" }}>
                      {new Date(roadmap.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: "0.95rem", lineHeight: 1.5, opacity: 0.9 }}>
                      {formatDescription(roadmap.description).substring(0, 200)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}