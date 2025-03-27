import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../BD/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../BD/firebase-config';

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

  const handleNavigateToCorte = (tipo) => {
    navigate('/cortes', { state: { tipo } });
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

  const calcularTotalDelDia = async () => {
    try {

      let fechaActual; 

      const hoy = new Date();
    
      let day = hoy.getDate();
      let month = hoy.getMonth() + 1;
      let year = hoy.getFullYear();
    
      if(month < 10){
        if(day<10){
          fechaActual=year+"-0"+month+"-0"+day;
        }else{
          fechaActual=year+"-0"+month+"-"+day;
        }
     }else{
      if(day<10){
        fechaActual=year+"-"+month+"-0"+day;
      }else{
        fechaActual=year+"-"+month+"-"+day;
      }
      }

      // Crear la consulta para filtrar por la fecha actual
      const q = query(
        collection(db, 'Folios'),
        where('Fecha', '==', fechaActual)
      );
  
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);
  
      // Calcular la suma total del campo "Monto"
      let sumaTotal = 0;
      querySnapshot.forEach((doc) => {
        sumaTotal += doc.data().Monto || 0; // Asegurarse de que Monto no sea undefined
      });
  
      // Mostrar el total en un alert
      alert(`Hoy se lleva cobrado: $${sumaTotal}`);
    } catch (error) {
      console.error('Error al calcular el total del día:', error);
      alert('Hubo un error al calcular el total del día.');
    }
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
                <li className="list-group-item" onClick={calcularTotalDelDia}>Rápido</li>
                <li className="list-group-item" onClick={() =>handleNavigateToCorte('fecha')}>Por Fecha</li>
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