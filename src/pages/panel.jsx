import { Link } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "../styles/app.css";



function ItemIcon({ type }) {
  const map = {
    water: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c0573e" strokeWidth="2" width="20" height="20">
        <path d="M12 2C6.5 7 4 11.5 4 14a8 8 0 0 0 16 0c0-2.5-2.5-7-8-12z" />
      </svg>
    ),
    food: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c0573e" strokeWidth="2" width="20" height="20">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" strokeLinecap="round" />
        <line x1="10" y1="1" x2="10" y2="4" strokeLinecap="round" />
        <line x1="14" y1="1" x2="14" y2="4" strokeLinecap="round" />
      </svg>
    ),
    medical: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c0573e" strokeWidth="2" width="20" height="20">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
  };
  return <div className="panel-item-icon">{map[type]}</div>;
}

import { useState, useEffect } from "react";
import axios from "axios";

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
};

export default function Panel() {
  const [necesidades, setNecesidades] = useState([]);
  const [stock, setStock] = useState([]);
  const [userRole, setUserRole] = useState("Cargando...");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserRole(
          decoded.rol === "ADMIN_SENAPRED" ? "Administrador Senapred" :
          decoded.rol === "COORDINADOR_CENTRO" ? "Coordinador" : "Voluntario"
        );
        // We can fetch user's real name via ID if we want, or just show role
      }
    }
    
    async function loadData() {
      try {
        const [necRes, stockRes] = await Promise.all([
          axios.get('/necesidades'),
          axios.get('/stock')
        ]);
        setNecesidades(necRes.data || []);
        setStock(stockRes.data || []);
      } catch(err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const recientes = necesidades.slice(-3).reverse(); // Last 3

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <h1 className="page-title">Hola, {userRole}</h1>
        <p className="page-subtitle">Resumen de impacto y logística para hoy.</p>

        {/* KPI cards */}
        <div className="kpi-list">
          <div className="kpi-card">
            <span className="kpi-label">NECESIDADES ACTIVAS</span>
            <span className="kpi-value">{necesidades.length}</span>
            <span className="kpi-trend kpi-up">↗ Actualizado en tiempo real</span>
            <svg className="kpi-watermark" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" width="64" height="64" aria-hidden="true">
              <path d="M32 2C18 14 10 24 10 32a22 22 0 0 0 44 0c0-8-8-18-22-30z" opacity=".15"/>
            </svg>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">STOCK DISPONIBLE</span>
            <span className="kpi-value">{stock.length}</span>
            <span className="kpi-trend kpi-neutral">⊙ 85% de capacidad</span>
            <svg className="kpi-watermark" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" width="64" height="64" aria-hidden="true">
              <rect x="8" y="16" width="48" height="36" rx="4" opacity=".15"/>
            </svg>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">MATCHES RECIENTES</span>
            <span className="kpi-value">15</span>
            <span className="kpi-trend kpi-up">📍 +2 entregas en camino</span>
            <svg className="kpi-watermark" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" width="64" height="64" aria-hidden="true">
              <path d="M48 12a18 18 0 0 0-25.46 0L20 14.54l-2.54-2.54a18 18 0 0 0-25.46 25.46L14.54 50 20 55.46l5.46-5.46 22.54-22.54A18 18 0 0 0 48 12z" opacity=".15"/>
            </svg>
          </div>
        </div>

        {/* Urgency chart */}
        <div className="panel-card">
          <div className="panel-card-header">
            <h2 className="panel-card-title">Urgencia de Necesidades</h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="#a03f28" strokeWidth="2" width="20" height="20">
              <rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
            </svg>
          </div>
          {[
            { label: "Alta",  count: 22, pct: 78, color: "#ba1a1a" },
            { label: "Media", count: 15, pct: 54, color: "#8a5100" },
            { label: "Baja",  count: 5,  pct: 18, color: "#c8bfbc" },
          ].map((u) => (
            <div key={u.label} className="urgency-row">
              <span className="urgency-label">{u.label}</span>
              <div className="urgency-bar-track">
                <div className="urgency-bar-fill" style={{ width: `${u.pct}%`, background: u.color }} />
              </div>
              <span className="urgency-count" style={{ color: u.color }}>{u.count}</span>
            </div>
          ))}
          <div className="panel-quote">
            "La urgencia alta ha aumentado un 12% desde el reporte de la mañana en la Región de Valparaíso."
          </div>
        </div>

        {/* Recientes */}
        <div className="panel-section-header">
          <h2 className="panel-section-title">Necesidades Recientes</h2>
          <Link to="/necesidades" className="panel-ver-todas">Ver todas →</Link>
        </div>
        <div className="panel-card panel-card-list">
          {recientes.map((item, i) => (
            <div key={item.id} className={`panel-list-item${i < recientes.length - 1 ? " bordered" : ""}`}>
              <ItemIcon type={item.categoria?.toLowerCase() === 'agua' ? 'water' : 'food'} />
              <div className="panel-list-info">
                <span className="panel-list-name">{item.nombre}</span>
                <span className="panel-list-loc">{item.ubicacion}</span>
              </div>
              <span className={`urgente-badge urgente-${item.nivelPrioridad?.toLowerCase()}`}>{item.nivelPrioridad}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" width="16" height="16"><path d="m9 18 6-6-6-6" /></svg>
            </div>
          ))}
        </div>

        {/* Mapa banner */}
        <div className="mapa-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="#a03f28" strokeWidth="1.5" width="36" height="36">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          <span>Explorar Mapa de Necesidades</span>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
