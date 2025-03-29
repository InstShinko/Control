import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../BD/firebase-config';

function Home() {
const [cursosMultiples, setCursosMultiples] = useState([]);
 const [alumno, setAlumno] = useState('');
 const [alumnosOptions, setAlumnosOptions] = useState([]);
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



  useEffect(() => {
      const fetchAlumnos = async () => {
      const q = query(collection(db, 'Alumnos'), where('Estado', '==', 'Activo'));
      const querySnapshot = await getDocs(q);
      const alumnosList = querySnapshot.docs.map(doc => ({
        value: doc.data().Nombre,
        label: doc.data().Nombre
       
      }));
      
            // Ordenar alfabéticamente
            alumnosList.sort((a, b) => a.label.localeCompare(b.label));

      setAlumnosOptions(alumnosList);
    };

    fetchAlumnos();
  }, []);

  const handleSelectChange = async (selectedOption) => {
    setAlumno(selectedOption ? selectedOption.value : '');

    if (selectedOption) {
      
      const q = query(collection(db, 'Alumnos'), where('Nombre', '==', selectedOption.value));
      const querySnapshot = await getDocs(q);
    
      querySnapshot.forEach((doc) => {
        setDatos({
          id: doc.id,
          nombre: doc.data().Nombre,
          curso: doc.data().Curso,
          horario: doc.data().Horario,
          pendiente: doc.data().Deuda,
          pago: doc.data().Colegiatura,
          total: doc.data().Deuda*doc.data().Colegiatura
        })
      });
    }
  };

  const handleVerCursosMultiples = async () => {
      if (alumno) {
        const q = query(collection(db, 'Alumnos'), where('Nombre', '==', alumno));
        const querySnapshot = await getDocs(q);
        const cursosList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().Nombre,
          curso: doc.data().Curso,
          horario: doc.data().Horario,
        }));
        setCursosMultiples(cursosList);
      }
    };

  const BuscarID = async (identificador) => {

    const docRef = doc(db, "Alumnos", identificador);
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


  const CobrarAlumno = async () => {
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
  
        const cambio = datos.monto - datos.pago * datos.pagos;
  
        // Actualizar la deuda del alumno
        const alumnoDocRef = doc(db, 'Alumnos', datos.id); // `datos.id` es la matrícula del alumno
        const alumnoDoc = await getDoc(alumnoDocRef);
  
        if (alumnoDoc.exists()) {
          const deudaActual = alumnoDoc.data().Deuda;
  
          // Restar 1 a la deuda
          const nuevaDeuda = deudaActual - datos.pagos;
  
          // Actualizar el campo "Deuda"
          await updateDoc(alumnoDocRef, {
            Deuda: nuevaDeuda,
          });
  
          console.log(`Deuda actualizada: ${nuevaDeuda}`);
        } else {
          console.error('No se encontró el documento del alumno');
          alert('No se encontró el alumno en la base de datos');
          return;
        }
  
        const concepto = 'Colegiatura';
  
        // Obtener la URL base de la aplicación
        const baseUrl = `${window.location.origin}/Control`; // Incluye el basename configurado en BrowserRouter
  
        // Crear una URL con los datos del alumno y el tipo de ticket
        const ticketUrl = `${baseUrl}/ticket?matricula=${encodeURIComponent(datos.id)}&nombre=${encodeURIComponent(datos.nombre)}&curso=${encodeURIComponent(datos.curso)}&tipo=colegiatura&folio=${nuevoFolio}&concepto=${concepto}&monto=${encodeURIComponent(datos.monto)}&pago=${encodeURIComponent(datos.pago)}&cambio=${cambio}&semana=${encodeURIComponent(datos.semana)}&pagos=${encodeURIComponent(datos.pagos)}`;
  
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
              <Select
              options={alumnosOptions}
              onChange={handleSelectChange}
              placeholder="Nombre del Alumno"
              className="form-control m-2 w-100"
              isClearable
              />
<button className="btn btn-primary m-2 w-100" onClick={handleVerCursosMultiples}>Ver Ids de Cursos Multiples</button>
            <div className="m-2">
              {cursosMultiples.map((curso, index) => (
                <div key={index} className="card m-2" onClick={BuscarID.bind(this, curso.id)}>
                  <div className="card-body bg-light">
                    <div className="d-flex flex-row">
                      <p className="card-text"><strong>ID: </strong></p>
                      <p className="card-text mx-2">{curso.id}</p>
                    </div>
                    <div className="d-flex flex-row">
                      <p className="card-text "><strong>Nombre: </strong></p>
                      <p className="card-text  mx-2">{curso.nombre}</p>
                    </div>
                    <div className="d-flex flex-row">
                      <p className="card-text "><strong>Curso: </strong></p>
                      <p className="card-text mx-2">{curso.curso}</p>
                    </div>
                    <div className="d-flex flex-row">
                      <p className="card-text "><strong>Horario: </strong></p>
                      <p className="card-text  mx-2">{curso.horario}</p>
                    </div>
     
                  </div>
                </div>
              ))}
            </div>

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

export default Home;