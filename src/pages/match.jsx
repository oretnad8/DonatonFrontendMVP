import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "../styles/app.css";

function MatchIcon({ type }) {
  const t = type.toLowerCase();
  const map = {
    water: <path d="M12 2C6.5 7 4 11.5 4 14a8 8 0 0 0 16 0c0-2.5-2.5-7-8-12z" />,
    medical: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8M8 12h8" strokeLinecap="round" /></>,
    food: <><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M3 11h18" /><path d="M8 8V5a2 2 0 0 1 4 0v3" strokeLinecap="round" /></>,
  };
  return (
    <div className="match-icon-circle">
      <svg viewBox="0 0 24 24" fill="none" stroke="#c0573e" strokeWidth="1.8" width="24" height="24">
        {map[t] || map['food']}
      </svg>
    </div>
  );
}

export default function Match() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const [necRes, stockRes] = await Promise.all([
          axios.get('/necesidades'),
          axios.get('/stock')
        ]);
        
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

        const matchRes = await axios.post('/api/match/procesar', {
          necesidades: necesidadesFormat,
          stocks: stockFormat
        });
        
        const rawMatches = matchRes.data.propuestas_match || [];
        
        // Enrich the matches with real names for transparency
        const enrichedMatches = rawMatches.map(m => {
          const nec = necesidadesFormat.find(n => n.id === m.necesidad_id) || {};
          const st = stockFormat.find(s => s.id === m.stock_id) || {};
          return {
            ...m,
            necesidad_nombre: nec.nombreOriginal || "Desconocido",
            stock_nombre: st.nombreOriginal || "Desconocido"
          };
        });
        
        setMatches(enrichedMatches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  return (
    <div className="page">
      <Header />
      <div className="page-content pb-24">
        <h1 className="page-title">Match Engine</h1>
        <p className="page-subtitle">Cruce automático de Necesidades vs Stock en tiempo real.</p>

        <div className="stats-grid">
          <div className="stat-card"><span className="stat-label">Matches Totales</span><span className="stat-value stat-primary">{matches.length}</span></div>
          <div className="stat-card"><span className="stat-label">Eficiencia</span><span className="stat-value stat-orange">92%</span></div>
          <div className="stat-card"><span className="stat-label">Pendientes</span><span className="stat-value stat-dark">0</span></div>
          <div className="stat-card"><span className="stat-label">Logística Activa</span><span className="stat-value stat-primary">{matches.filter(m => m.estado_match === "TOTAL").length}</span></div>
        </div>

        <div className="match-section-header">
          <span className="match-section-title">ÚLTIMOS CRUZAMIENTOS</span>
          <button type="button" className="filtrar-btn">Filtrar ⇅</button>
        </div>

        <div className="match-list">
          {loading ? <p className="text-[#8a726c] text-center mt-4">Analizando variables y cruzando datos mediante IA...</p> : 
            matches.length === 0 ? <p className="text-[#8a726c] text-center mt-4">No hay cruces logísticos disponibles con el stock actual.</p> :
            matches.map((m, idx) => (
            <div key={idx} className={`match-card match-found`}>
              <div className="match-card-top">
                <MatchIcon type={m.tipoItem === 'Agua' ? 'water' : m.tipoItem === 'Medicamentos' ? 'medical' : 'food'} />
                <div className="match-card-info">
                  <span className="match-name">{m.tipoItem}</span>
                  <span className="match-route">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {m.comuna_destino}
                    <span className="match-arrow">←</span> Desde Stock
                  </span>
                </div>
                <span className={`match-badge match-badge-found`}>
                  {m.estado_match === "TOTAL" ? "Match\nTotal" : "Match\nParcial"}
                </span>
              </div>
              <div className="match-card-bottom">
                <span className="match-cobertura">Asignado: <strong>{m.cantidad_asignada} unidades</strong></span>
                <button type="button" className="btn-primary btn-sm" onClick={() => setSelectedMatch(m)}>
                  Ver Detalles
                </button>
              </div>
              <p style={{fontSize:'12px', color:'#666', marginTop:'10px'}}>{m.justificacion}</p>
            </div>
          ))}
        </div>

        {/* Eficiencia card */}
        <div className="eficiencia-card">
          <p className="eficiencia-text">
            El tiempo promedio de cruce ha disminuido en un 15% esta mañana gracias a nuevos ingresos en stock.
          </p>
          <span className="eficiencia-ia">⚡ IA Engine Optimizando...</span>
        </div>
      </div>
      <BottomNav />

      {/* Match Details Modal (Tailwind styled for transparency) */}
      {selectedMatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-[#fff8f5] px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">⚡</span>
                <h2 className="text-[18px] font-bold text-[#1f1b18] m-0">Reporte de Transparencia</h2>
              </div>
              <button 
                type="button" 
                className="text-[#8a726c] hover:bg-black/5 rounded-full p-1"
                onClick={() => setSelectedMatch(null)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[11px] font-bold text-[#8a726c] uppercase mb-1">Ítem Suministrado</p>
                  <p className="text-[18px] font-bold text-[#1f1b18]">{selectedMatch.tipoItem}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-[#8a726c] uppercase mb-1">Volumen Asignado</p>
                  <p className="text-[18px] font-bold text-[#a03f28]">{selectedMatch.cantidad_asignada} uds.</p>
                </div>
              </div>

              <div className="bg-[#fcfafa] border border-[#e0d8d5] rounded-xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#a03f28] opacity-[0.03] rounded-full blur-xl -mr-10 -mt-10"></div>
                <h3 className="text-[12px] font-bold text-[#1f1b18] uppercase mb-3">Trazabilidad Algorítmica</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[13px] text-[#56423d]">Necesidad Origen:</span>
                    <div className="text-right">
                      <span className="block text-[13px] font-medium text-[#1f1b18]">{selectedMatch.necesidad_nombre}</span>
                      <span className="text-[11px] font-mono text-[#8a726c]">ID: #{selectedMatch.necesidad_id}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[13px] text-[#56423d]">Stock Proveedor:</span>
                    <div className="text-right">
                      <span className="block text-[13px] font-medium text-[#1f1b18]">{selectedMatch.stock_nombre}</span>
                      <span className="text-[11px] font-mono text-[#8a726c]">ID: #{selectedMatch.stock_id}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2 items-center">
                    <span className="text-[13px] text-[#56423d]">Nivel de Cobertura:</span>
                    <span className={`text-[13px] font-bold ${selectedMatch.estado_match === "TOTAL" ? "text-green-600" : "text-amber-600"}`}>
                      {selectedMatch.estado_match}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#56423d]">Destino Logístico:</span>
                    <span className="text-[13px] font-medium text-[#1f1b18] flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {selectedMatch.comuna_destino}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[12px] font-bold text-[#8a726c] uppercase mb-2">Justificación del Motor de IA</h3>
                <p className="text-[14px] text-[#56423d] leading-relaxed bg-[#fff8f5] p-3 rounded-lg border-l-4 border-[#a03f28]">
                  "{selectedMatch.justificacion}"
                </p>
              </div>

              <div className="mt-8 flex gap-3">
                <button type="button" className="flex-1 py-3 px-4 rounded-xl border-2 border-[#e0d8d5] text-[#56423d] font-bold hover:bg-[#fff8f5] transition-colors" onClick={() => setSelectedMatch(null)}>
                  Cerrar
                </button>
                <button type="button" className="flex-1 py-3 px-4 rounded-xl bg-[#a03f28] text-white font-bold hover:bg-[#8b3520] transition-all active:scale-95 flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                  Aprobar Envío
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
