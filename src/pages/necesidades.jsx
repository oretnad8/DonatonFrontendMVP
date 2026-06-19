import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "../styles/app.css";

const CATEGORIES = ["Todas", "Alimentos", "Higiene", "Construcción", "Ropa", "Medicamentos"];

function NeedIcon({ category }) {
  if (category === "Alimentos")
    return (
      <div className="need-icon-circle">
        <svg viewBox="0 0 24 24" fill="none" stroke="#c0614e" strokeWidth="1.8" width="26" height="26">
          <path d="M12 2a5 5 0 0 0-5 5c0 3.5 2.5 6.5 5 9 2.5-2.5 5-5.5 5-9a5 5 0 0 0-5-5z" />
          <path d="M12 7v4" strokeLinecap="round" />
        </svg>
      </div>
    );
  if (category === "Construcción")
    return (
      <div className="need-icon-circle">
        <svg viewBox="0 0 24 24" fill="none" stroke="#c0614e" strokeWidth="1.8" width="26" height="26">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>
    );
  return (
    <div className="need-icon-circle need-icon-gray">
      <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" width="26" height="26">
        <path d="M3 12h2l2-5h10l2 5h2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="12" width="20" height="6" rx="2" />
        <path d="M6 18v2M18 18v2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Necesidades() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [needsData, setNeedsData] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Alimentos");
  const [cantidadRequerida, setCantidadRequerida] = useState(1);
  const [nivelPrioridad, setNivelPrioridad] = useState("ALTA");
  const [ubicacion, setUbicacion] = useState("");

  const loadNeeds = () => {
    axios.get('/necesidades')
      .then(res => setNeedsData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadNeeds();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNombre("");
    setCategoria("Alimentos");
    setCantidadRequerida(1);
    setNivelPrioridad("ALTA");
    setUbicacion("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setNombre(item.nombre);
    setCategoria(item.categoria);
    setCantidadRequerida(item.cantidadRequerida);
    setNivelPrioridad(item.nivelPrioridad);
    setUbicacion(item.ubicacion);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta necesidad?")) {
      try {
        await axios.delete(`/necesidades/${id}`);
        loadNeeds();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { nombre, categoria, cantidadRequerida, nivelPrioridad, ubicacion };
    try {
      if (editingId) {
        await axios.put(`/necesidades/${editingId}`, payload);
      } else {
        await axios.post('/necesidades', payload);
      }
      setShowModal(false);
      loadNeeds();
    } catch (err) {
      console.error(err);
      alert("Error guardando necesidad");
    }
  };

  const filtered = needsData.filter((n) => {
    const matchCat = activeCategory === "Todas" || n.categoria === activeCategory;
    const matchSearch =
      n.nombre.toLowerCase().includes(search.toLowerCase()) ||
      n.ubicacion.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <h1 className="page-title">Necesidades Urgentes</h1>

        <div className="nec-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" width="18" height="18">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por comuna o artículo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="nec-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {filtered.map((need) => (
            <div key={need.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0d8d5] flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-md">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${need.nivelPrioridad === 'ALTA' ? 'bg-[#c0573e]' : need.nivelPrioridad === 'MEDIA' ? 'bg-[#d98254]' : 'bg-[#8a726c]'}`}></div>
              
              <div className="flex justify-between items-start pl-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-[#8a726c] uppercase tracking-wider bg-[#f8f4f2] px-2 py-0.5 rounded-md border border-[#e0d8d5]">{need.categoria}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      need.nivelPrioridad === 'ALTA' ? 'text-[#c0573e] bg-[#c0573e]/10 border border-[#c0573e]/20' : 
                      need.nivelPrioridad === 'MEDIA' ? 'text-[#d98254] bg-[#d98254]/10 border border-[#d98254]/20' : 
                      'text-[#8a726c] bg-[#8a726c]/10 border border-[#8a726c]/20'
                    }`}>
                      URGENCIA {need.nivelPrioridad}
                    </span>
                  </div>
                  <h2 className="text-[17px] font-bold text-[#1f1b18] m-0 leading-tight">{need.nombre}</h2>
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#8a726c] mt-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{need.ubicacion}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 bg-[#fff8f5] p-1 rounded-xl border border-[#e0d8d5]">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#2563eb] hover:bg-[#2563eb]/10 transition-colors" 
                    onClick={() => openEditModal(need)}
                    title="Editar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors" 
                    onClick={() => handleDelete(need.id)}
                    title="Eliminar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-2 pt-3 border-t border-[#e0d8d5]/50 flex items-center justify-between pl-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#8a726c] uppercase tracking-wider mb-0.5">Volumen Requerido</span>
                  <span className="text-[22px] font-black text-[#1f1b18] leading-none">{need.cantidadRequerida} <span className="text-[13px] font-semibold text-[#8a726c]">uds.</span></span>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#fff8f5] flex items-center justify-center border border-[#e0d8d5]">
                  <NeedIcon category={need.categoria} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="fab" onClick={openAddModal}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="24" height="24">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </button>

      <BottomNav />

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-[#fff8f5]">
              <h2 className="text-[18px] font-bold text-[#1f1b18] m-0">
                {editingId ? 'Editar Necesidad' : 'Añadir Necesidad'}
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
                  {CATEGORIES.filter(c => c !== 'Todas').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Cantidad Requerida</label>
                <input 
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all" 
                  type="number" min="1" value={cantidadRequerida} onChange={e => setCantidadRequerida(e.target.value)} required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Nivel Prioridad</label>
                <select 
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all appearance-none" 
                  value={nivelPrioridad} onChange={e => setNivelPrioridad(e.target.value)}
                >
                  <option value="ALTA">ALTA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="BAJA">BAJA</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Ubicación (Comuna)</label>
                <input 
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all" 
                  type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} required 
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
