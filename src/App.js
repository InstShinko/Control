import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './paginas/Login';
import Home from './paginas/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para la pantalla de Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para la pantalla principal */}
        <Route path="/home" element={<Home />} />

        {/* Redirección por defecto (si el usuario va a la raíz "/") */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;