import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../BD/firebase-config';

function BusID() {

  const navigate = useNavigate(); // Hook para manejar la navegación 

  const [alumno, setAlumno] = useState('');

  const [datos, setDatos] = useState(
    {
      id: '',
      nombre: '',
      curso: '',
      horario: '',
      pendiente: '',
      pago: '',
      total: '',
      semana: '',
      pagos: '',
      monto: ''
    }
  );

  const BuscarID = async (idBuscado = alumno) => {

    const docRef = doc(db, "Alumnos", idBuscado);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      setDatos({
        id: docSnap.id,
        nombre: docSnap.data().Nombre,
        curso: docSnap.data().Curso,
        horario: docSnap.data().Horario,
        pendiente: docSnap.data().Deuda,
        pago: docSnap.data().Colegiatura,
        total: docSnap.data().Deuda * docSnap.data().Colegiatura
      });

    } else {
      alert("No existe un alumno con ese ID");
    }


  };

  const CobrarAlumno = async () => {
    if (
      !datos.pagos ||
      !datos.monto ||
      !datos.semana ||
      datos.pagos.toString().trim() === '' ||
      datos.monto.toString().trim() === '' ||
      datos.semana.toString().trim() === ''
    ) {
      alert("Por favor, completa todos los campos antes de proceder con el cobro.");

    } else {
      try {
        // Obtener el folio actual desde Firebase
        const matriculaDoc = await getDoc(doc(db, 'Matriculas', 'yezMAhyI2J0Yjhwe2BZL'));
        if (matriculaDoc.exists()) {
          let folioActual = matriculaDoc.data().Folio;

          folioActual = parseInt(folioActual);

          // Incrementar el folio
          const nuevoFolio = folioActual + 1;

          setDatos.pagos = parseInt(datos.pagos);
          setDatos.monto = parseFloat(datos.monto);
          setDatos.pago = parseFloat(datos.pago);
          let pagado = datos.pagos * datos.pago;
          const cambio = datos.monto - datos.pago * datos.pagos;

          // Actualizar la deuda del alumno
          const alumnoDocRef = doc(db, 'Alumnos', datos.id); // `datos.id` es la matrícula del alumno
          const alumnoDoc = await getDoc(alumnoDocRef);

          if (alumnoDoc.exists()) {
            const deudaActual = alumnoDoc.data().Deuda;

            // Restar los pagos realizados a la deuda
            const nuevaDeuda = deudaActual - datos.pagos;

            // Asegurarse de que la deuda no sea negativa
            await updateDoc(alumnoDocRef, {
              Deuda: nuevaDeuda
            });

            console.log(`Deuda actualizada: ${nuevaDeuda}`);
          } else {
            console.error('No se encontró el documento del alumno');
            alert('No se encontró el alumno en la base de datos');
            return;
          }

          const concepto = 'Colegiatura';

          // Redirigir a la página de ticket con los datos del cobro
          navigate(
            `/ticket?matricula=${encodeURIComponent(datos.id)}&nombre=${encodeURIComponent(datos.nombre)}&curso=${encodeURIComponent(datos.curso)}&tipo=colegiatura&folio=${nuevoFolio}&concepto=${concepto}&monto=${encodeURIComponent(datos.monto)}&pago=${encodeURIComponent(datos.pago)}&cambio=${cambio}&semana=${encodeURIComponent(datos.semana)}&pagos=${encodeURIComponent(datos.pagos)}&pagado=${encodeURIComponent(pagado)}`
          );
        } else {
          alert('No se encontró la matrícula actual');
        }
      } catch (error) {
        console.error('Error al registrar el cobro:', error);
        alert('Error al registrar el cobro');
      }
    }

  };



  return (

    <div className='container-fluid bg-dark text-white' style={{ minHeight: '100vh' }}>
      <div className='container'>

        <div className='d-flex flex-row justify-content-around flex-wrap'>




          <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5">

            <input
              type="number"
              value={alumno}
              onChange={(e) => {
                const valor = e.target.value;
                setAlumno(valor);
                if (valor.length === 4) {
                  BuscarID(valor); // Pasa el valor directamente
                }
              }}
              placeholder="Id del Alumno"
              className="form-control m-2 "
            />
            <button className="btn btn-primary m-2 w-100" onClick={BuscarID}>Buscar</button>

          </div>


          <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5">
            <div id="cardalumno" className="card m-2 w-100">
              <div className="card-body bg-secondary">

                <div className="d-flex flex-row">
                  <p className="card-text text-white"><strong>ID: </strong></p>
                  <p className="card-text text-white mx-2">{datos.id}</p>
                </div>

                <div className="d-flex flex-row">
                  <p className="card-text text-white"><strong>Nombre: </strong></p>
                  <p className="card-text text-white mx-2" >{datos.nombre}</p>
                </div>

                <div className="d-flex flex-row">
                  <p className="card-text text-white"><strong>Curso: </strong></p>
                  <p className="card-text text-white mx-2" >{datos.curso}</p>
                </div>

                <div className="d-flex flex-row">
                  <p className="card-text text-white"><strong>Horario: </strong></p>
                  <p className="card-text text-white mx-2" >{datos.horario}</p>
                </div>

                <div className="d-flex flex-row">
                  <p className="card-text text-white"><strong>Pagos pendientes: </strong></p>
                  <p className="card-text text-white mx-2">{datos.pendiente}</p>
                </div>

                <div className="d-flex flex-row">
                  <p className="card-text text-white"><strong>Costo: </strong></p>
                  <p className="card-text text-white mx-2" >{datos.pago}</p>
                </div>

                <div className="d-flex flex-row">
                  <p className="card-text text-white"><strong>Total: </strong></p>
                  <p className="card-text text-white mx-2">{datos.total}</p>
                </div>

                <input type="text"
                  placeholder="¿Qué semana o semanas se están pagando?"
                  className="form-control my-2"
                  value={datos.semana}
                  name='semana'
                  onChange={(e) => setDatos({ ...datos, [e.target.name]: e.target.value })}
                />


                <input type="number"
                  placeholder='¿Cuantos pagos se estan haciendo?'
                  className="form-control my-2"
                  value={datos.pagos}
                  name='pagos'
                  onChange={(e) => setDatos({ ...datos, [e.target.name]: e.target.value })}
                />

                <input type="number" placeholder="¿Con cuanto te estan pagando?"
                  className="form-control my-2 "
                  value={datos.monto}
                  name='monto'
                  onChange={(e) => setDatos({ ...datos, [e.target.name]: e.target.value })}
                />

                <button className="btn btn-primary my-2 w-100"
                  onClick={CobrarAlumno}
                >Cobrar</button>



              </div>
            </div>
          </div>


        </div>



      </div>

    </div>
  );
}

export default BusID;