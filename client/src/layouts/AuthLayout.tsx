import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-brand-bg text-brand-text">
      {/* Left — Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-card border-r border-brand-border relative overflow-hidden flex-col justify-center px-16">
        {/* Glow Spheres */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand-accent/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-success/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-accent to-[#00DFA2]">
                <span className="text-xl font-black text-white">FL</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-text">FlowLedger</h1>
            </div>
            <h2 className="text-4xl font-extrabold text-brand-text leading-tight mb-4 tracking-tight">
              Understand where
              <br />
              <span className="bg-gradient-to-r from-brand-accent to-[#00DFA2] bg-clip-text text-transparent">
                your money goes.
              </span>
            </h2>
            <p className="text-md text-brand-muted max-w-md font-light leading-relaxed">
              FlowLedger is a minimal, premium financial command center that helps you track transactions, visualize spending trends, and analyze category performance.
            </p>
          </div>

          {/* Premium highlights (No Emojis) */}
          <div className="space-y-4">
            {[
              "Interactive spending timeline and trends",
              "Dynamic category breakdown analytics",
              "Income vs expense comparison tracking",
              "Secure, localized data management",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-brand-muted hover:text-brand-text transition-colors duration-200"
              >
                <div className="h-2 w-2 rounded-full bg-brand-accent" />
                <span className="text-sm font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Glow Spheres for mobile view background */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-brand-accent/3 blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-brand-success/3 blur-[100px]" />
        </div>
        <div className="w-full max-w-md z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
