import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { doc, getDoc} from "firebase/firestore";
import { db } from '../BD/firebase-config';

function Cobro() {
  
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

  const BuscarID = async () => {

    const docRef = doc(db, "Alumnos", alumno);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    
      setDatos({
        id: docSnap.id,
        nombre: docSnap.data().Nombre,
        curso: docSnap.data().Curso,
        horario: docSnap.data().Horario,
      });

    } else {
     alert("No existe un alumno con ese ID");
}
   

  };

  const CobrarAlumno = async () => {
    try {
      // Obtener el folio actual desde Firebase
      const matriculaDoc = await getDoc(doc(db, 'Matriculas', 'yezMAhyI2J0Yjhwe2BZL'));
      if (matriculaDoc.exists()) {
        let folioActual = matriculaDoc.data().Folio;
  
        folioActual = parseInt(folioActual);
  
        // Incrementar el folio
        const nuevoFolio = folioActual + 1;
  
        setDatos.monto = parseFloat(datos.monto);
        setDatos.pago = parseFloat(datos.pago);
  
        const cambio = datos.monto - datos.pago;
  
        const concepto = datos.semana;
  
        // Obtener la URL base de la aplicación
        const baseUrl = `${window.location.origin}/Control`; // Incluye el basename configurado en BrowserRouter
  
        // Crear una URL con los datos del alumno y el tipo de ticket
        const ticketUrl = `${baseUrl}/ticket?matricula=${encodeURIComponent(datos.id)}&nombre=${encodeURIComponent(datos.nombre)}&curso=${encodeURIComponent(datos.curso)}&tipo=pagoExtra&concepto=${concepto}&folio=${nuevoFolio}&monto=${encodeURIComponent(datos.monto)}&pago=${encodeURIComponent(datos.pago)}&cambio=${cambio}&semana=${encodeURIComponent(datos.semana)}`;
  
        // Abrir la URL en una nueva pestaña
        window.open(ticketUrl, '_blank');
      } else {
        alert('No se encontró la matrícula actual');
      }
    } catch (error) {
      console.error('Error al registrar el alumno:', error);
      alert('Error al registrar el alumno');
    }
  };


  return (

    <div className='container-fluid bg-dark text-white'  style={{ minHeight: '100vh' }}>
    <div className='container'> 
  
      <div className='d-flex flex-row justify-content-around flex-wrap'>
        



              <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5">
  
              <input type="number" 
              value={alumno}
              onChange={(e) => setAlumno(e.target.value)}
              placeholder="Id del Alumno"  
              className="form-control m-2 " />
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



               <input type="text"
                     placeholder="¿Qué te estan pagando?"   
                     className="form-control my-2" 
                     value={datos.semana}
                     name='semana'
                     onChange={(e) => setDatos({ ...datos, [e.target.name]: e.target.value })}
                     />
                 
                 <input type="text"
                     placeholder="¿Cuanto se tiene que pagar?"   
                     className="form-control my-2" 
                     value={datos.pago}
                     name='pago'
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

export default Cobro;