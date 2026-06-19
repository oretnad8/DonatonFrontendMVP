import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "../styles/app.css";

export default function Donante() {
  const [donacion, setDonacion] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [comuna, setComuna] = useState("Providencia");
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    axios.get('/necesidades')
      .then(res => setNeeds(res.data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <h1 className="donante-title">Tu ayuda llega directo a quien la necesita</h1>
        <p className="page-subtitle">
          Explora las necesidades activas en tu comuna y haz la diferencia hoy mismo.
        </p>

        <div className="nec-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" width="18" height="18">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Buscar necesidades (ej: agua, frazadas...)" />
        </div>

        <div className="donante-filters">
          <button type="button" className="comuna-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Mi Comuna: Providencia
          </button>
          <button type="button" className="filtros-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
            </svg>
            Filtros
          </button>
        </div>

        <div className="panel-section-header">
          <h2 className="panel-section-title">Necesidades Urgentes</h2>
          <button type="button" className="panel-ver-todas">Ver todas →</button>
        </div>

        <div className="donante-list">
          {needs.map((n) => (
            <div key={n.id} className="donante-card">
              <div className="donante-card-top">
                <span className={`donante-badge donante-badge-${n.nivelPrioridad?.toLowerCase()}`}>{n.nivelPrioridad}</span>
                <span className="donante-time">{n.ubicacion}</span>
              </div>
              <h3 className="donante-name">{n.nombre}</h3>
              <p className="donante-desc">Requeridos: {n.cantidadRequerida}</p>
              <div className="donante-progress-header">
                <span className="donante-progress-label">Progreso</span>
                <span className="donante-progress-pct">0% recolectado</span>
              </div>
              <div className="donante-bar-track">
                <div className="donante-bar-fill" style={{ width: `0%` }} />
              </div>
              <button type="button" className="btn-primary btn-full">
                Quiero donar esto
              </button>
            </div>
          ))}
        </div>

        {/* Registro libre */}
        <div className="donante-registro-card">
          <h3 className="donante-registro-title">¿Tienes algo más para ofrecer?</h3>
          <p className="donante-registro-desc">
            Si tienes artículos en buen estado que no aparecen en la lista, regístralos aquí para que podamos asignarlos a una necesidad futura.
          </p>
          <div className="donante-registro-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="#a03f28" strokeWidth="2" width="16" height="16">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Más de 1,200 donaciones hoy
          </div>
          <label className="donante-form-label">¿Qué deseas donar?</label>
          <input
            type="text"
            className="donante-input"
            placeholder="Ej: Frazadas, Ropa de invierno"
            value={donacion}
            onChange={(e) => setDonacion(e.target.value)}
          />
          <div className="donante-form-row">
            <div className="donante-form-col">
              <label className="donante-form-label">Cantidad</label>
              <input
                type="number"
                className="donante-input"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div className="donante-form-col">
              <label className="donante-form-label">Comuna de retiro</label>
              <select
                className="donante-input"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
              >
                <option>Providencia</option>
                <option>Viña del Mar</option>
                <option>Valparaíso</option>
                <option>Quilpué</option>
                <option>Villa Alemana</option>
              </select>
            </div>
          </div>
          <button type="button" className="btn-primary btn-full">
            Registrar Mi Donación
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
