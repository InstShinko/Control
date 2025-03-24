import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './BD/AuthContext';
import Layout from './componentes/Layout';
import Login from './paginas/Login';
import Home from './paginas/Home';
import Cobro from './paginas/Cobro';
import BusID from './paginas/BusID';
import Registro from './paginas/Registro';
import Ticket from './paginas/Ticket';
import Adeudos from './paginas/Adeudos';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cobro" element={<Cobro />} />
            <Route path="/busID" element={<BusID />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/adeudos" element={<Adeudos />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;