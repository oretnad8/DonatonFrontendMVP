import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Panel from "./pages/panel";
import Necesidades from "./pages/necesidades";
import Stock from "./pages/stock";
import Match from "./pages/match";
import Perfil from "./pages/perfil";
import Donante from "./pages/donante";
import Usuarios from "./pages/usuarios";
import "./styles/tokens.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"       element={<Login />} />
        <Route path="/panel"       element={<Panel />} />
        <Route path="/necesidades" element={<Necesidades />} />
        <Route path="/stock"       element={<Stock />} />
        <Route path="/match"       element={<Match />} />
        <Route path="/perfil"      element={<Perfil />} />
        <Route path="/donante"     element={<Donante />} />
        <Route path="/usuarios"    element={<Usuarios />} />
        <Route path="*"            element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
