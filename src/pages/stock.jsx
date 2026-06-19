import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "../styles/app.css";

function StockIcon({ type }) {
  const icons = {
    water: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c0573e" strokeWidth="1.8" width="26" height="26">
        <path d="M12 2C6.5 7 4 11.5 4 14a8 8 0 0 0 16 0c0-2.5-2.5-7-8-12z" />
      </svg>
    ),
    medical: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c0573e" strokeWidth="1.8" width="26" height="26">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
    blanket: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c0573e" strokeWidth="1.8" width="26" height="26">
        <rect x="2" y="7" width="20" height="13" rx="2" />
        <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        <path d="M6 11h12M6 15h8" strokeLinecap="round" />
      </svg>
    ),
    food: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#c0573e" strokeWidth="1.8" width="26" height="26">
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M3 11h18" />
        <path d="M8 8V5a2 2 0 0 1 4 0v3M12 8V5" strokeLinecap="round" />
      </svg>
    ),
  };
  return <div className="stock-icon-circle">{icons[type] || icons.food}</div>;
}

export default function Stock() {
  const [stockData, setStockData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Alimentos");
  const [cantidadDisponible, setCantidadDisponible] = useState(1);
  const [estado, setEstado] = useState("DISPONIBLE");
  const [ubicacionBodega, setUbicacionBodega] = useState("Bodega Central");

  const loadStock = () => {
    axios.get('/stock')
      .then(res => setStockData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadStock();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNombre("");
    setCategoria("Alimentos");
    setCantidadDisponible(1);
    setEstado("DISPONIBLE");
    setUbicacionBodega("Bodega Central");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setNombre(item.nombre);
    setCategoria(item.categoria);
    setCantidadDisponible(item.cantidadDisponible);
    setEstado(item.estado);
    setUbicacionBodega(item.ubicacionBodega);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este ítem de stock?")) {
      try {
        await axios.delete(`/stock/${id}`);
        loadStock();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { nombre, categoria, cantidadDisponible, estado, ubicacionBodega };
    try {
      if (editingId) {
        await axios.put(`/stock/${editingId}`, payload);
      } else {
        await axios.post('/stock', payload);
      }
      setShowModal(false);
      loadStock();
    } catch (err) {
      console.error(err);
      alert("Error guardando el stock");
    }
  };

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <h1 className="page-title">Gestión de Stock</h1>
        <p className="page-subtitle">Inventario central de suministros para emergencias.</p>

        <button type="button" className="btn-primary btn-full" onClick={openAddModal}>
          + Añadir Stock
        </button>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Ítems</span>
            <span className="stat-value stat-primary">{stockData.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Disponibles</span>
            <span className="stat-value stat-green">{stockData.filter(s => s.estado === 'DISPONIBLE').length}</span>
          </div>
        </div>

        <div className="stock-list">
          {stockData.map((item) => {
            const pct = Math.round((item.cantidadDisponible / 500) * 100);
            return (
              <div key={item.id} className="stock-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span className={`estado-badge estado-${item.estado?.toLowerCase() || 'disponible'}`}>
                    {item.estado}
                  </span>
                  <div>
                    <button style={{marginRight:'5px', background:'none', border:'none', color:'#007bff'}} onClick={() => openEditModal(item)}>✏️</button>
                    <button style={{background:'none', border:'none', color:'#dc3545'}} onClick={() => handleDelete(item.id)}>🗑️</button>
                  </div>
                </div>
                <div className="stock-card-row">
                  <StockIcon type={item.categoria?.toLowerCase() === 'agua' ? 'water' : 'food'} />
                  <div className="stock-card-info">
                    <span className="stock-name">{item.nombre}</span>
                    <span className="stock-sub">{item.categoria}</span>
                  </div>
                </div>
                <div className="stock-cantidad-row">
                  <span className="stock-cantidad-label">Cantidad</span>
                  <span className="stock-cantidad-value">
                    {item.cantidadDisponible} unidades
                  </span>
                </div>
                <div className="stock-bar-track">
                  <div
                    className="stock-bar-fill"
                    style={{ width: `${pct > 100 ? 100 : pct}%` }}
                  />
                </div>
                <div className="stock-comuna">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  BODEGA: {item.ubicacionBodega}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-[#fff8f5]">
              <h2 className="text-[18px] font-bold text-[#1f1b18] m-0">
                {editingId ? 'Editar Stock' : 'Añadir Stock'}
              </h2>
              <button 
                type="button"
                className="text-[#8a726c] hover:text-[#1f1b18] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5" 
                onClick={() => setShowModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Nombre del Ítem</label>
                <input 
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all" 
                  type="text" value={nombre} onChange={e => setNombre(e.target.value)} required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Categoría</label>
                <select 
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all appearance-none" 
                  value={categoria} onChange={e => setCategoria(e.target.value)}
                >
                  <option value="Alimentos">Alimentos</option>
                  <option value="Agua">Agua</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Construcción">Construcción</option>
                  <option value="Medicamentos">Medicamentos</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Cantidad Disponible</label>
                <input 
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all" 
                  type="number" min="1" value={cantidadDisponible} onChange={e => setCantidadDisponible(e.target.value)} required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Estado</label>
                <select 
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all appearance-none" 
                  value={estado} onChange={e => setEstado(e.target.value)}
                >
                  <option value="DISPONIBLE">DISPONIBLE</option>
                  <option value="RESERVADO">RESERVADO</option>
                  <option value="AGOTADO">AGOTADO</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Ubicación / Bodega</label>
                <input 
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all" 
                  type="text" value={ubicacionBodega} onChange={e => setUbicacionBodega(e.target.value)} required 
                />
              </div>

              <div className="flex items-center gap-3 mt-2 pt-2">
                <button type="button" className="flex-1 py-3 px-4 rounded-xl border-2 border-[#e0d8d5] text-[#56423d] font-bold hover:bg-[#fff8f5] transition-colors" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="flex-1 py-3 px-4 rounded-xl bg-[#a03f28] text-white font-bold hover:bg-[#8b3520] shadow-lg shadow-[#a03f28]/30 transition-all active:scale-95">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
