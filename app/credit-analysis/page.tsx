"use client"

import { useState, useEffect } from 'react'

// Dummy CIBIL API fetcher (replace with real API integration)
async function fetchCibilScore(aadhaar: string, pan: string): Promise<{score: number, band: string, reportId: string}> {
  // Simulate API call
  await new Promise(res => setTimeout(res, 2500));
  // Demo: random score for now
  const score = 650 + Math.floor(Math.random() * 150);
  const getBand = (score: number) => {
    if (score >= 750) return "Excellent"
    if (score >= 720) return "Very Good"
    if (score >= 680) return "Good"
    if (score >= 650) return "Fair"
    return "Poor"
  }
  return {
    score,
    band: getBand(score),
    reportId: `CIBIL-${Math.floor(Math.random()*1000000)}`
  }
}

export default function Page() {
  // Modes: 'choose', 'demo', 'real', 'result'
  const [mode, setMode] = useState<'choose'|'demo'|'real'|'result'>("choose")
  const [aadhaar, setAadhaar] = useState("")
  const [pan, setPan] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // State hooks (must be declared before handlers)
  const [scoreData, setScoreData] = useState<any>(null);
  const [error, setError] = useState<string|null>(null);

  // Handle demo mode
  const handleDemo = async () => {
    setIsLoading(true);
    setError(null);
    // Demo: fixed score for beginners
    const demoScore = 720;
    setTimeout(() => {
      const demoData = {
        score: demoScore,
        band: "Very Good",
        reportId: "DEMO-123456"
      };
      setScoreData(demoData);
      setIsLoading(false);
      setMode("result");
      // Sync to chatbot context
      localStorage.setItem("chatbot_credit_score", JSON.stringify(demoData));
    }, 1200);
  };

  // Handle real CIBIL fetch
  const handleCibilFetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCibilScore(aadhaar, pan);
      setScoreData(data);
      setMode("result");
      // Sync to chatbot context
      localStorage.setItem("chatbot_credit_score", JSON.stringify(data));
    } catch (e: any) {
      setError("Failed to fetch CIBIL score. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // On mount, clear chatbot context if starting fresh
  // On mount, load score from localStorage if present
  useEffect(() => {
    if (mode === "choose") {
      const saved = localStorage.getItem("chatbot_credit_score");
      if (saved) {
        setScoreData(JSON.parse(saved));
        setMode("result");
      } else {
        setScoreData(null);
      }
    }
  }, [mode]);

  // UI
  return (
    <div className="relative max-w-xl mx-auto py-10 px-4">
      {/* Home button top left */}
      <a
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition-colors"
        style={{ textDecoration: 'none' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
        </svg>
        Home
      </a>
      <h1 className="text-3xl font-bold mb-6 text-center">Check Your Credit Score</h1>

      {mode === "choose" && (
        <div className="flex flex-col gap-6 items-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow"
            onClick={() => setMode("real")}
          >
            Fetch Real CIBIL Score
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg shadow"
            onClick={handleDemo}
          >
            Try Demo Mode (For Beginners)
          </button>
        </div>
      )}

      {mode === "real" && (
        <form
          className="flex flex-col gap-4 max-w-md mx-auto"
          onSubmit={e => {
            e.preventDefault();
            // Extra validation: trim and check digits
            const trimmed = aadhaar.trim();
            if (!/^\d{12}$/.test(trimmed)) {
              setError("Aadhaar must be exactly 12 digits (no spaces or letters)");
              return;
            }
            setAadhaar(trimmed);
            handleCibilFetch();
          }}
        >
          <label className="font-medium">Aadhaar Number
            <input
              type="text"
              className="mt-1 w-full border rounded px-3 py-2"
              value={aadhaar}
              onChange={e => setAadhaar(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Enter your Aadhaar number"
              required
              minLength={12}
              maxLength={12}
              pattern="\d{12}"
              inputMode="numeric"
            />
          </label>
          <label className="font-medium">PAN Number
            <input
              type="text"
              className="mt-1 w-full border rounded px-3 py-2"
              value={pan}
              onChange={e => setPan(e.target.value)}
              placeholder="Enter your PAN number"
              required
              minLength={10}
              maxLength={10}
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            />
          </label>
          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? "Fetching..." : "Get CIBIL Score"}
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow"
              onClick={() => setMode("choose")}
              disabled={isLoading}
            >
              Back
            </button>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      )}

      {mode === "result" && scoreData && (
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center mt-6">
          <div className="text-6xl font-bold text-blue-700 mb-2">{scoreData.score}</div>
          <div className="text-lg font-semibold mb-1">Band: <span className="text-blue-600">{scoreData.band}</span></div>
          <div className="text-gray-500 mb-4">Report ID: {scoreData.reportId}</div>
          <div className="text-green-700 font-medium mb-2">Your credit score has been synced to the chatbot for personalized tax advice.</div>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
            onClick={() => { setMode("choose"); setScoreData(null); setAadhaar(""); setPan(""); }}
          >
            Check Another Score
          </button>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <div className="loader mb-4"></div>
            <div className="text-lg font-semibold">Processing...</div>
          </div>
        </div>
      )}
    </div>
  );
}


