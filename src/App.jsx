import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Journal from "./pages/Journal.jsx";
import Week from "./pages/Week.jsx";
import Plan from "./pages/Plan.jsx";

const NavLink = ({to, label, emoji})=>{
  const loc = useLocation();
  const active = loc.pathname.includes(to);
  return (
    <Link to={to}
      className={`tap flex-1 text-center py-3 rounded-xl transition
        ${active ? "bg-accent text-white" : "text-white/80 hover:bg-white/10"}`}>
      <div className="text-lg">{emoji}</div>
      <div className="text-[12px] -mt-0.5">{label}</div>
    </Link>
  );
};

export default function App(){
  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#0b1220] to-[#12172a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-transparent">
        <div className="max-w-xl mx-auto px-4 pt-5 pb-3">
          <div className="glass shadow-soft rounded-2xl px-4 py-3 flex items-center justify-between">
            <h1 className="font-bold">🏋️ Coach Fadi</h1>
            <span className="text-xs text-white/70">PWA • Offline</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-xl mx-auto px-4 pb-28 pt-3">
        <Routes>
          <Route path="/" element={<Navigate to="/journal" replace />} />
          <Route path="/journal" element={<Journal/>} />
          <Route path="/week" element={<Week/>} />
          <Route path="/plan" element={<Plan/>} />
        </Routes>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-4 left-0 right-0">
        <div className="max-w-xl mx-auto px-4">
          <div className="glass rounded-2xl p-2 grid grid-cols-3 gap-2 shadow-soft">
            <NavLink to="/journal" label="Journal" emoji="🍽️" />
            <NavLink to="/week" label="Semaine" emoji="📊" />
            <NavLink to="/plan" label="Planning" emoji="📅" />
          </div>
        </div>
      </nav>
    </div>
  );
}
