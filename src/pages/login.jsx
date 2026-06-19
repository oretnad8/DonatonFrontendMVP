import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/app.css";

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("voluntario");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Register state
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rut, setRut] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/panel");
      }
    } catch (err) {
      alert("Error en el inicio de sesión");
      console.error(err);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      // Map roles correctly to backend enums, typically uppercase
      const rolUpper = role === "admin" ? "ADMIN_SENAPRED" : role === "coordinador" ? "COORDINADOR_CENTRO" : "VOLUNTARIO";
      
      const response = await axios.post('/api/usuarios', {
        nombre,
        apellido,
        rut,
        email,
        password,
        rol: rolUpper,
        estado: true
      });
      if (response.status === 200 || response.status === 201) {
        alert("Registro exitoso, por favor inicie sesión.");
        setActiveTab("login");
      }
    } catch (err) {
      alert("Error en el registro");
      console.error(err);
    }
  }

  return (
    <div className="login-bg">
      <div className="login-header">
        <div className="login-logo-box">
          <img src="/corazon2.png" alt="Donaton" className="login-logo-img" />
        </div>
        <h1 className="login-brand">DONATON</h1>
        <p className="login-tagline">
          Juntos coordinamos la ayuda donde más se necesita.
        </p>
      </div>

      <div className="login-card">
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`login-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Registrarse
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLogin}>
            <label className="login-field-label">Email</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="input-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-pw-header">
              <label className="login-field-label">Contraseña</label>
              <a href="#" className="login-forgot">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="input-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>

            <button type="submit" className="login-submit">
              Ingresar al Sistema &nbsp;→
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <p className="login-field-label">Rol de Usuario</p>
            <div className="login-roles">
              <button
                type="button"
                className={`role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                <span>Admin</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === "voluntario" ? "active" : ""}`}
                onClick={() => setRole("voluntario")}
              >
                <span>Voluntario</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === "coordinador" ? "active" : ""}`}
                onClick={() => setRole("coordinador")}
              >
                <span>Coordinador</span>
              </button>
            </div>

            <label className="login-field-label">Nombre</label>
            <div className="login-input-wrap">
              <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            
            <label className="login-field-label">Apellido</label>
            <div className="login-input-wrap">
              <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} required />
            </div>
            
            <label className="login-field-label">RUT</label>
            <div className="login-input-wrap">
              <input type="text" placeholder="12345678-9" value={rut} onChange={e => setRut(e.target.value)} required />
            </div>

            <label className="login-field-label">Email</label>
            <div className="login-input-wrap">
              <input type="email" placeholder="nombre@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <label className="login-field-label">Contraseña</label>
            <div className="login-input-wrap">
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="login-submit">
              Registrarse &nbsp;→
            </button>
          </form>
        )}

        <div className="login-divider">
          <span>o</span>
        </div>

        <button type="button" className="login-google">
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}

export default Login;
