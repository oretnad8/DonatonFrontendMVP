import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "../styles/app.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("VOLUNTARIO");
  const [estado, setEstado] = useState(true);

  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  };

  const loadUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = token ? decodeToken(token) : null;
      if (!decoded || decoded.rol !== "ADMIN_SENAPRED") {
        navigate("/panel");
        return;
      }

      const res = await axios.get('/api/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        navigate("/panel");
      }
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNombre("");
    setApellido("");
    setRut("");
    setEmail("");
    setPassword("");
    setRol("VOLUNTARIO");
    setEstado(true);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.id);
    setNombre(user.nombre);
    setApellido(user.apellido);
    setRut(user.rut);
    setEmail(user.email);
    setPassword(""); // Leave empty unless changing
    setRol(user.rol);
    setEstado(user.estado);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.delete(`/api/usuarios/${id}`);
        loadUsuarios();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { nombre, apellido, rut, email, rol, estado };
    if (password) {
      payload.password = password;
    }

    try {
      if (editingId) {
        await axios.put(`/api/usuarios/${editingId}`, payload);
      } else {
        // If creating a new user, password might be required
        if (!password) payload.password = "123456"; // default or prompt
        await axios.post('/api/usuarios', payload);
      }
      setShowModal(false);
      loadUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error guardando usuario");
    }
  };

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <h1 className="page-title">Gestión de Usuarios</h1>
        <p className="page-subtitle">Administra los accesos y roles del sistema.</p>

        <button type="button" className="btn-primary btn-full" onClick={openAddModal}>
          + Nuevo Usuario
        </button>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Usuarios</span>
            <span className="stat-value stat-primary">{usuarios.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Activos</span>
            <span className="stat-value stat-green">{usuarios.filter(u => u.estado).length}</span>
          </div>
        </div>

        <div className="nec-list" style={{ marginTop: '20px' }}>
          {usuarios.map((user) => (
            <div key={user.id} className="need-card">
              <div className="need-card-top">
                <span className="need-location">{user.rol}</span>
                <span className={`priority-badge ${user.estado ? 'priority-baja' : 'priority-alta'}`} style={{ backgroundColor: user.estado ? '#d4edda' : '#f8d7da', color: user.estado ? '#155724' : '#721c24' }}>
                  {user.estado ? 'ACTIVO' : 'INACTIVO'}
                </span>
                <div style={{ marginLeft: 'auto' }}>
                  <button style={{ marginRight: '5px', background: 'none', border: 'none', color: '#007bff' }} onClick={() => openEditModal(user)}>✏️</button>
                  <button style={{ background: 'none', border: 'none', color: '#dc3545' }} onClick={() => handleDelete(user.id)}>🗑️</button>
                </div>
              </div>
              <h2 className="need-name" style={{ fontSize: '18px' }}>{user.nombre} {user.apellido}</h2>
              <div className="need-card-bottom">
                <div className="need-required" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="need-required-label">{user.email}</span>
                  <span className="need-required-count" style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>RUT: {user.rut}</span>
                </div>
                <div className="need-icon-circle need-icon-gray">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" width="26" height="26">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-[#fff8f5] sticky top-0 z-10">
              <h2 className="text-[18px] font-bold text-[#1f1b18] m-0">
                {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button
                type="button"
                className="text-[#8a726c] hover:text-[#1f1b18] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
                onClick={() => setShowModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Nombre</label>
                <input
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all"
                  type="text" value={nombre} onChange={e => setNombre(e.target.value)} required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Apellido</label>
                <input
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all"
                  type="text" value={apellido} onChange={e => setApellido(e.target.value)} required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">RUT</label>
                <input
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all"
                  type="text" value={rut} onChange={e => setRut(e.target.value)} required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Email</label>
                <input
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all"
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Contraseña {editingId && "(Opcional)"}</label>
                <input
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all"
                  type="password" value={password} onChange={e => setPassword(e.target.value)} {...(!editingId && { required: true })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Rol</label>
                <select
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all appearance-none"
                  value={rol} onChange={e => setRol(e.target.value)}
                >
                  <option value="ADMIN_SENAPRED">Admin Senapred</option>
                  <option value="COORDINADOR_CENTRO">Coordinador Centro</option>
                  <option value="VOLUNTARIO">Voluntario</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">Estado</label>
                <select
                  className="w-full bg-[#fff8f5] border border-[#e0d8d5] rounded-xl px-4 py-3 text-[15px] text-[#1f1b18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a03f28]/20 focus:border-[#a03f28] transition-all appearance-none"
                  value={estado} onChange={e => setEstado(e.target.value === 'true')}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
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
