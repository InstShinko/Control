import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offcanvas, Button, Accordion } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../BD/AuthContext';

function Barra() {
  const [show, setShow] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigateToCobro = () => {
    navigate('/cobro');
    handleClose();
  };

  const handleNavigateToNom = () => {
    navigate('/Home');
    handleClose();
  };

  const handleNavigateToBusID = () => {
    navigate('/busID');
    handleClose();
  };

  const handleNavigateToRegistro = () => {
    navigate('/registro');
    handleClose();
  };



  const CerrarSesion = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/Login');
        handleClose();
      })
      .catch((error) => {
        // An error happened.
      });
  };

  // Condicionar el renderizado de la barra basado en la ruta actual
  if (!currentUser || location.pathname === '/ticket') {
    return null; // No renderizar el componente Barra si no hay usuario autenticado o si la ruta es /ticket
  }

  return (
    <div>
      <Button variant="primary m-3" onClick={handleShow}>
        Menú
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="list-group">
            <li className="list-group-item" onClick={handleNavigateToRegistro}>Registro</li>

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
                    <li className="list-group-item" >Ver Adeudos por Horario</li>
                    <li className="list-group-item">Adeudos Generales</li>
                   
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Adeudos</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    <li className="list-group-item">Ver por horario</li>
                    <li className="list-group-item">Ver por profesor</li>
                    <li className="list-group-item">Ver adeudos generales</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Alumnos</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    <li className="list-group-item">Opción de Pago 1</li>
                    <li className="list-group-item">Opción de Pago 2</li>
                    <li className="list-group-item">Opción de Pago 3</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>


            <Accordion>
              <Accordion.Item eventKey="">
                <Accordion.Header>Folios</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    <li className="list-group-item">Opción de Pago 1</li>
                    <li className="list-group-item">Opción de Pago 2</li>
                    <li className="list-group-item">Opción de Pago 3</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion>
              <Accordion.Item eventKey="3">
                <Accordion.Header>Cortes</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    <li className="list-group-item">Opción de Pago 1</li>
                    <li className="list-group-item">Opción de Pago 2</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

           <div className='my-5'>
           <li className="list-group-item bg-success text-white my-2">
              Comenzar Semana
            </li>

            <li className="list-group-item bg-danger text-white my-2" onClick={CerrarSesion}>
              Cerrar Sesión
            </li>

           </div>

       

          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Barra;