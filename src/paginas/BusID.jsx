import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { doc, getDoc } from "firebase/firestore";
import { db } from '../BD/firebase-config';

function BusID() {
  
 const [alumno, setAlumno] = useState('');

  const [datos, setDatos] = useState(
    {
      id: '',
      nombre: '',
      curso: '',
      horario: '',
      pendiente: '',
      pago: '',
      total: ''
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
        pendiente: docSnap.data().Deuda,
        pago: docSnap.data().Colegiatura,
        total: docSnap.data().Deuda*docSnap.data().Colegiatura
      });

    } else {
     alert("No existe un alumno con ese ID");
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


                  <div className="d-flex flex-row align-items-center">
                     <p className="card-text text-white"><strong>Semana: </strong></p>
                     <input type="text" placeholder="¿Qué semana o semanas se están pagando?"   className="form-control m-2" />
                     </div>
            
               <div className="d-flex flex-row">
                     <p className="card-text text-white"><strong>Numero de pagos: </strong></p>
                     <input type="number" value={1}  className="form-control m-2" />
               </div>

               <div className="d-flex flex-row">
                     <p className="card-text text-white"><strong>Con cuanto pagan: </strong></p>
                     <input type="number" placeholder="Monto de pago"   className="form-control m-2 " />
               </div>
           
     
   
               </div>
          </div>
      </div>


      </div>

    
   
    </div>

    </div>
  );
}

export default BusID;