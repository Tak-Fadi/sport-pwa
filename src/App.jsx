import { Link, Routes, Route, Navigate } from "react-router-dom";
import Journal from "./pages/Journal.jsx";
import Week from "./pages/Week.jsx";
import Plan from "./pages/Plan.jsx";

export default function App(){
  return (
    <div className="container">
      <h1>Coach Fadi</h1>
      <div className="nav">
        <Link to="/journal">Journal Caloriques</Link>
        <Link to="/week">Semaine </Link>
        <Link to="/plan">Planning</Link>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/journal" replace />} />
        <Route path="/journal" element={<Journal/>} />
        <Route path="/week" element={<Week/>} />
        <Route path="/plan" element={<Plan/>} />
      </Routes>
    </div>
  );
}
