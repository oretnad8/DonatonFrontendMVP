import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "../styles/app.css";

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
};

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [impacto, setImpacto] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = decodeToken(token);
    if (decoded && decoded.sub) {
      axios.get(`/api/usuarios/${decoded.sub}`)
        .then(res => setUser(res.data))
        .catch(err => {
          console.error(err);
        });
        
      Promise.all([
        axios.get('/necesidades'),
        axios.get('/stock')
      ]).then(async ([necRes, stockRes]) => {
        const necesidadesFormat = necRes.data.map(n => ({
          id: n.id,
          comuna: n.ubicacion || "Desconocida",
          tipoItem: n.categoria || "General",
          cantidad: n.cantidadRequerida || 1,
          urgencia: n.nivelPrioridad || "MEDIA",
          nombreOriginal: n.nombre || "Item Requerido"
        }));
        const stockFormat = stockRes.data.map(s => ({
          id: s.id,
          comuna: s.ubicacionBodega || "Desconocida",
          tipoItem: s.categoria || "General",
          cantidadDisponible: s.cantidadDisponible || 0,
          estado: s.estado || "DISPONIBLE",
          nombreOriginal: s.nombre || "Item Stock"
        }));
        try {
          const matchRes = await axios.post('/api/match/procesar', {
            necesidades: necesidadesFormat,
            stocks: stockFormat
          });
          setImpacto(matchRes.data.propuestas_match?.length || 0);
        } catch (e) {
          console.error("Error al procesar match para impacto:", e);
        }
      }).catch(err => console.error(err));
    }
  }, [navigate]);

  if (!user) {
    return <div className="page"><Header/><div className="page-content">Cargando perfil...</div><BottomNav/></div>;
  }

  return (
    <div className="page">
      <Header />
      <div className="page-content">

        {/* Foto de perfil */}
        <div className="perfil-foto-wrap">
          <div className="perfil-foto">
            <svg viewBox="0 0 96 96" fill="none" width="96" height="96">
              <circle cx="48" cy="48" r="48" fill="#e8d0c8" />
              <circle cx="48" cy="36" r="18" fill="#c0573e" opacity=".6" />
              <path d="M16 96c0-17.67 14.33-28 32-28s32 10.33 32 28" fill="#c0573e" opacity=".6" />
            </svg>
            <button type="button" className="perfil-camera-btn" aria-label="Cambiar foto">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" width="14" height="14">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          </div>
          <h1 className="perfil-name">{user.nombre} {user.apellido}</h1>
          <span className="perfil-role">{user.rol}</span>
        </div>

        {/* Info cards */}
        <div className="perfil-info-card">
          <div className="perfil-info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#a03f28" strokeWidth="2" width="20" height="20">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <div>
            <span className="perfil-info-label">CORREO ELECTRÓNICO</span>
            <span className="perfil-info-value">{user.email}</span>
          </div>
        </div>

        <div className="perfil-info-card">
          <div className="perfil-info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#a03f28" strokeWidth="2" width="20" height="20">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="perfil-info-row">
            <div>
              <span className="perfil-info-label">RUT</span>
              <span className="perfil-info-value">{user.rut}</span>
            </div>
            {user.estado && <span className="verificado-badge">Activo</span>}
          </div>
        </div>

        {/* Impacto */}
        <div className="impacto-card">
          <span className="impacto-label">IMPACTO GENERADO</span>
          <span className="impacto-value">{impacto} Match{impacto !== 1 ? 'es' : ''}</span>
          <svg className="impacto-watermark" viewBox="0 0 80 80" fill="none" stroke="#fff" strokeWidth="1" width="80" height="80" aria-hidden="true">
            <path d="M60 16a16.5 16.5 0 0 0-23.33 0L36 17.6l-.67-.6A16.5 16.5 0 0 0 12 40.4L36 64l24-23.6A16.5 16.5 0 0 0 60 16z" opacity=".2"/>
          </svg>
        </div>

        {/* Menú */}
        <div className="perfil-menu">
          <button type="button" className="perfil-menu-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#56423d" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Configuración de cuenta</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" width="16" height="16"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <button type="button" className="perfil-menu-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#56423d" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/>
            </svg>
            <span>Centro de Ayuda</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" width="16" height="16"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <button type="button" className="cerrar-sesion-btn" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar Sesión
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
