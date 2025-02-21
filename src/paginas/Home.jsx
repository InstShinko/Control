import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
      total: ''
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
            <div id="cursosmultiples" className="m-2">
              {cursosMultiples.map((curso, index) => (
                <div key={index} className="card m-2">
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


                  <div className="d-flex flex-row align-items-center">
                     <p className="card-text text-white"><strong>Semana: </strong></p>
                     <input type="text" placeholder="¿Qué semana o semanas se están pagando?"   className="form-control m-2" />
                     </div>
            
               <div className="d-flex flex-row">
                     <p className="card-text text-white"><strong>Numero de pagos: </strong></p>
                     <input type="number" value={1}   className="form-control m-2" />
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

export default Home;