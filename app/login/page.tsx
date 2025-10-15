import LoginForm from "@/components/auth/login-form"

export default function Page() {
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
      `}</style>

      {/* Floating Orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

    <main className="min-h-dvh flex items-center justify-center p-6" style={{ position: 'relative', zIndex: 1 }}>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
    </div>
  )
}
