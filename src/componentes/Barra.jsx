import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../BD/AuthContext';

function Barra() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const handleNavigateToCobro = () => {
    navigate('/cobro');
  };

  const handleNavigateToNom = () => {
    navigate('/Home');
  };

  const handleNavigateToBusID = () => {
    navigate('/busID');
  };

  const handleNavigateToRegistro = () => {
    navigate('/registro');
  };

  const handleNavigateToAdeudos = (tipo) => {
    navigate('/adeudos', { state: { tipo } });
  };


  const handleNavigateToAlumno = (tipo) => {
    navigate('/alumno', { state: { tipo } });
  };

  const handleNavigateToFolio = (tipo) => {
    navigate('/folios', { state: { tipo } });
  };

  const CerrarSesion = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/Login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  // Condicionar el renderizado de la barra basado en la ruta actual
  if (!currentUser || location.pathname === '/ticket') {
    return null; // No renderizar el componente Barra si no hay usuario autenticado o si la ruta es /ticket
  }

  return (
    <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh', position: 'fixed' }}>
      <h4 className="text-center py-3">Menú</h4>
      <ul className="list-group">
        <li className="list-group-item" onClick={handleNavigateToRegistro}>
          Registro
        </li>

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Pagos</Accordion.Header>
            <Accordion.Body>
              <ul className="list-group">
                <li className="list-group-item" onClick={handleNavigateToBusID}>
                  Colegiatura por ID
                </li>
                <li className="list-group-item" onClick={handleNavigateToNom}>
                  Colegiatura por Nombre
                </li>
                <li className="list-group-item" onClick={handleNavigateToCobro}>
                  Pago Extra
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Adeudos</Accordion.Header>
            <Accordion.Body>
              <ul className="list-group">
                <li className="list-group-item" onClick={() => handleNavigateToAdeudos('horario')}>
                  Ver por horario
                </li>
                <li className="list-group-item" onClick={() => handleNavigateToAdeudos('general')}>
                  Ver adeudos generales
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Alumnos</Accordion.Header>
            <Accordion.Body>
              <ul className="list-group">
                <li className="list-group-item"  onClick={() => handleNavigateToAlumno('modi')}>Modificar información</li>
                <li className="list-group-item"  onClick={() => handleNavigateToAlumno('ver')}>Ver calificaciónes</li>
                <li className="list-group-item"  onClick={() => handleNavigateToAlumno('cargar')}>Cargar calificación</li>
                <li className="list-group-item"  onClick={() => handleNavigateToAlumno('modicali')}>Modificar calificación</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Folios</Accordion.Header>
            <Accordion.Body>
              <ul className="list-group">
                <li className="list-group-item" onClick={() => handleNavigateToFolio('fecha')}>Buscar por Fecha</li>
                <li className="list-group-item" onClick={() => handleNavigateToFolio('idalumno')}>Buscar por Id del alumno</li>
                <li className="list-group-item" onClick={() => handleNavigateToFolio('idfolio')}>Buscar por folio</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion>
          <Accordion.Item eventKey="4">
            <Accordion.Header>Cortes</Accordion.Header>
            <Accordion.Body>
              <ul className="list-group">
                <li className="list-group-item">Opción de Pago 1</li>
                <li className="list-group-item">Opción de Pago 2</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <div className="my-5">
          <li className="btn btn-success text-white my-2 w-100">Comenzar Semana</li>
          <li className="btn btn-danger text-white my-2 w-100" onClick={CerrarSesion}>
            Cerrar Sesión
          </li>
        </div>
      </ul>
    </div> 
  );
}

export default Barra;