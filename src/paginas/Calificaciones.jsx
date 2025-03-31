import React, { useState, useEffect } from 'react';
import logoN from '../Vnegro.png';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../BD/firebase-config';

function Calificaciones() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para navegar entre páginas
  const searchParams = new URLSearchParams(location.search);

  const [califis, setcalifis] = useState([]);
  const mat = {
    matricula: searchParams.get('matricula'),
  };

  const [datosAlumno, setDatosAlumno] = useState({
    nombre: '',
    curso: '',
    promedio: '',
  });

  // Función para recuperar los datos del alumno y su subcolección Creditos
  const obtenerDatosAlumno = async () => {
    try {
      if (!mat.matricula) {
        alert('No se proporcionó una matrícula válida.');
        return;
      }

      // Referencia al documento del alumno
      const alumnoRef = doc(db, 'Alumnos', mat.matricula);
      const alumnoSnap = await getDoc(alumnoRef);

      if (alumnoSnap.exists()) {
        // Actualizar datosAlumno con los datos del documento
        const alumnoData = alumnoSnap.data();
        setDatosAlumno({
          nombre: alumnoData.Nombre || '',
          curso: alumnoData.Curso || '',
          promedio: alumnoData.Promedio || '',
        });

        // Referencia a la subcolección Creditos
        const creditosRef = collection(db, 'Alumnos', mat.matricula, 'Creditos');
        const creditosSnap = await getDocs(creditosRef);

        // Mapear los datos de la subcolección Creditos y ordenarlos alfabéticamente por materia
        const creditosList = creditosSnap.docs
          .map((doc) => ({
            id: doc.id,
            materia: doc.data().Materia || '',
            calificacion: doc.data().Calificacion || '',
          }))
          .sort((a, b) => a.materia.localeCompare(b.materia)); // Ordenar alfabéticamente por materia

        // Actualizar el estado califis con los datos de Creditos
        setcalifis(creditosList);
      } else {
        alert('No se encontró un alumno con esa matrícula.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del alumno:', error);
      alert('Hubo un error al obtener los datos del alumno.');
    }
  };

  // Llamar a la función obtenerDatosAlumno al cargar el componente
  useEffect(() => {
    obtenerDatosAlumno();
  }, []);

  return (
    <div className="container-fluid bg-light p-4" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="d-flex flex-column align-items-center">
          <img src={logoN} className="w-50" alt="logotipo" />
          <h3>Calificaciones de Pago</h3>
        </div>

        <div className="d-flex flex-row justify-content-end">
          <h3>Fecha: {new Date().toLocaleDateString()}</h3>
        </div>
        <div className="d-flex flex-column justify-content-center">
          <p>
            <strong>Nombre:</strong> {datosAlumno.nombre}
          </p>
          <p>
            <strong>Curso:</strong> {datosAlumno.curso}
          </p>
          <p>
            <strong>Promedio:</strong> {datosAlumno.promedio}
          </p>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th width="30%">ID</th>
              <th width="40%">Materia</th>
              <th width="30%">Calificaciones</th>
            </tr>
          </thead>

          <tbody>
            {califis.map((califi, index) => (
              <tr key={index}>
                <td>{califi.id}</td>
                <td>{califi.materia}</td>
                <td>{califi.calificacion}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón de regreso */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)} // Navega a la página anterior
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calificaciones;














