import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Offcanvas, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../BD/AuthContext';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../BD/firebase-config';
import tachuela from '../clavo.png';

function Barra() {
  const [isChecked, setIsChecked] = useState(false); // Estado para controlar el checkbox

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const [show, setShow] = useState(false); // Estado para controlar el Offcanvas
  const [ancho, setancho] = useState(100);

  const handleClose = () => setShow(false); // Cerrar el Offcanvas
  const handleShow = () => setShow(true); // Mostrar el Offcanvas


  const handleNavigateToCobro = () => {
    navigate('/cobro');
  };

  const handleNavigateToNom = () => {
    navigate('/Home');
  };

  const handleNavigateToBusID = () => {
    navigate('/busID');
  };

  const handleNavigateToRegistro = (tipo) => {
    navigate('/registro', { state: { tipo } });
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

      if (month < 10) {
        if (day < 10) {
          fechaActual = year + "-0" + month + "-0" + day;
        } else {
          fechaActual = year + "-0" + month + "-" + day;
        }
      } else {
        if (day < 10) {
          fechaActual = year + "-" + month + "-0" + day;
        } else {
          fechaActual = year + "-" + month + "-" + day;
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

  const aumentardeuda = async () => {
    try {
      // Mostrar un cuadro de confirmación
      const confirmacion = window.confirm('¿Estás seguro de que deseas aumentar la deuda de todos los alumnos activos en 1?');
      if (!confirmacion) {
        return; // Salir de la función si el usuario cancela
      }

      // Crear una consulta para obtener solo los documentos con Estado "Activo"
      const alumnosRef = collection(db, 'Alumnos');
      const q = query(alumnosRef, where('Estado', '==', 'Activo'));
      const querySnapshot = await getDocs(q);

      // Iterar sobre cada documento y aumentar el valor de "Deuda" en 1
      querySnapshot.forEach(async (doc) => {
        const deudaActual = doc.data().Deuda || 0; // Asegurarse de que "Deuda" no sea undefined
        const alumnoRef = doc.ref; // Referencia al documento actual

        // Actualizar el campo "Deuda"
        await updateDoc(alumnoRef, {
          Deuda: deudaActual + 1,
        });
      });

      alert('Se ha iniciado la semana correctamente');
    } catch (error) {
      console.error('Error al aumentar la deuda:', error);
      alert('Hubo un error al aumentar la deuda.');
    }
  };



  const reducirdeuda = async () => {
    try {
      // Mostrar un cuadro de confirmación
      const confirmacion = window.confirm('¿Estás seguro de que deseas reducir la deuda, ocupalo solo en caso de haber puesto una semana adicional por error?');
      if (!confirmacion) {
        return; // Salir de la función si el usuario cancela
      }

      // Crear una consulta para obtener solo los documentos con Estado "Activo"
      const alumnosRef = collection(db, 'Alumnos');
      const q = query(alumnosRef, where('Estado', '==', 'Activo'));
      const querySnapshot = await getDocs(q);

      // Iterar sobre cada documento y reducir el valor de "Deuda" en 1
      querySnapshot.forEach(async (doc) => {
        const deudaActual = doc.data().Deuda || 0; // Asegurarse de que "Deuda" no sea undefined
        const alumnoRef = doc.ref; // Referencia al documento actual

        // Actualizar el campo "Deuda"
        await updateDoc(alumnoRef, {
          Deuda: deudaActual - 1,
        });
      });

      alert('Se ha reducido la deuda de todos los alumnos activos en 1.');
    } catch (error) {
      console.error('Error al reducir la deuda:', error);
      alert('Hubo un error al reducir la deuda.');
    }
  };

  // Condicionar el renderizado de la barra basado en la ruta actual
  if (!currentUser || location.pathname === '/ticket') {
    return null; // No renderizar el componente Barra si no hay usuario autenticado o si la ruta es /ticket
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Alternar el estado entre true y false
    if (isChecked) {
      setancho(100); // Cambiar el ancho a 100px
    } else {
      setancho(300); // Cambiar el ancho a 100px
    }
  };

  const mostrarBarra = () => {
    if (isChecked) {

      return (
        <>
          <ul className="list-group">


            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Registros</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    <li className="list-group-item" onClick={() => handleNavigateToRegistro('add')}>
                      Hacer Registro
                    </li>
                    <li className="list-group-item" onClick={() => handleNavigateToRegistro('ver')}>
                      Informe de Registros
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>


            <Accordion>
              <Accordion.Item eventKey="1">
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
              <Accordion.Item eventKey="2">
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
              <Accordion.Item eventKey="3">
                <Accordion.Header>Alumnos</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    <li className="list-group-item" onClick={() => handleNavigateToAlumno('modi')}>Modificar información</li>
                    <li className="list-group-item" onClick={() => handleNavigateToAlumno('ver')}>Ver calificaciónes</li>
                    <li className="list-group-item" onClick={() => handleNavigateToAlumno('cargar')}>Cargar calificación</li>
                    <li className="list-group-item" onClick={() => handleNavigateToAlumno('modicali')}>Modificar calificación</li>
                    <li className="list-group-item" onClick={() => handleNavigateToAlumno('elicali')}>Borrar calificación</li>
                    <li className="list-group-item" onClick={() => handleNavigateToAlumno('bajas')}>Ver Bajas</li>
                    <li className="list-group-item" onClick={() => handleNavigateToAlumno('egre')}>Ver Egresados</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion>
              <Accordion.Item eventKey="4">
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
              <Accordion.Item eventKey="5">
                <Accordion.Header>Cortes</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    <li className="list-group-item" onClick={calcularTotalDelDia}>Rápido</li>
                    <li className="list-group-item" onClick={() => handleNavigateToCorte('fecha')}>Por Fecha</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>


            <Accordion>
              <Accordion.Item eventKey="6">
                <Accordion.Header>Semana</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    <li className="list-group-item" onClick={aumentardeuda}>Comenzar Semana</li>
                    <li className="list-group-item" onClick={reducirdeuda}>Reducir</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="my-5">

              <li className="btn btn-danger text-white my-2 w-100" onClick={CerrarSesion}>
                Cerrar Sesión
              </li>
            </div>
          </ul>
        </>
      );

    } else {

      return (
        <>
          <Button variant="primary" className="m-3" onClick={handleShow}>
            Menú
          </Button>
          {/* Offcanvas para la barra lateral */}
          <Offcanvas show={show} onHide={handleClose} placement="start">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>

              <ul className="list-group">


                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Registros</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-group">
                        <li className="list-group-item" onClick={() => handleNavigateToRegistro('add')}>
                          Hacer Registro
                        </li>
                        <li className="list-group-item" onClick={() => handleNavigateToRegistro('ver')}>
                          Informe de Registros
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>


                <Accordion>
                  <Accordion.Item eventKey="1">
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
                  <Accordion.Item eventKey="2">
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
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Alumnos</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-group">
                        <li className="list-group-item" onClick={() => handleNavigateToAlumno('modi')}>Modificar información</li>
                        <li className="list-group-item" onClick={() => handleNavigateToAlumno('ver')}>Ver calificaciónes</li>
                        <li className="list-group-item" onClick={() => handleNavigateToAlumno('cargar')}>Cargar calificación</li>
                        <li className="list-group-item" onClick={() => handleNavigateToAlumno('modicali')}>Modificar calificación</li>
                        <li className="list-group-item" onClick={() => handleNavigateToAlumno('elicali')}>Borrar calificación</li>
                        <li className="list-group-item" onClick={() => handleNavigateToAlumno('bajas')}>Ver Bajas</li>
                        <li className="list-group-item" onClick={() => handleNavigateToAlumno('egre')}>Ver Egresados</li>
                        <li className="list-group-item" onClick={()=> handleNavigateToAlumno('activos')}>Ver Activos</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion>
                  <Accordion.Item eventKey="4">
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
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>Cortes</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-group">
                        <li className="list-group-item" onClick={calcularTotalDelDia}>Rápido</li>
                        <li className="list-group-item" onClick={() => handleNavigateToCorte('fecha')}>Por Fecha</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>


                <Accordion>
                  <Accordion.Item eventKey="6">
                    <Accordion.Header>Semana</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-group">
                        <li className="list-group-item" onClick={aumentardeuda}>Comenzar Semana</li>
                        <li className="list-group-item" onClick={reducirdeuda}>Reducir</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <div className="my-5">

                  <li className="btn btn-danger text-white my-2 w-100" onClick={CerrarSesion}>
                    Cerrar Sesión
                  </li>
                </div>
              </ul>
            </Offcanvas.Body>
          </Offcanvas>
        </>
      );
    }
  }



  return (


    <div className="bg-light border-end" style={{ width: ancho, minHeight: '100vh', position: 'fixed' }}>

      <div class="form-check m-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="checkbarra"
          checked={isChecked} // Vincular el estado al atributo checked
          onChange={handleCheckboxChange} // Actualizar el estado al cambiar
          value={isChecked ? 'Activo' : 'Inactivo'} // Cambiar el valor dinámicamente
        />

        <img src={tachuela} className='mx-auto d-block' width="20" alt='logotipo' />
      </div>

      {mostrarBarra()}


    </div>
  );
}

export default Barra;