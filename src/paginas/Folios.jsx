import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../BD/firebase-config';

function Folios() {



 
    const [fecha, setfecha] = useState('');
    const [alumno, setalumno] = useState('');
    const [idfolio, setidfolio]=useState('');
    const [datafolio, setdatafolio]= useState({
        folio: '',
       concepto: '',
        monto: '',
        fecha: '',
       nombre: '',
       matricula:''
      });

    const [datosfolio, setdatosfolio] = useState([]);

    const location = useLocation();
    const tipo = location.state?.tipo || 'general'; // Valor predeterminado si no se pasa `tipo`
  




    const renderContent = () => {
      switch (tipo) {
        case 'fecha':
          return (
          <>

<div className='d-flex flex-row justify-content-center'>
            <h1 className='display-3'>Busqueda por Fecha</h1>
          </div>

        <div className="d-flex flex-row justify-content-between my-3" >
                  <div className="col-9">
                    <input type="date" 
                      className="form-control"
                      value={fecha}
                      onChange={(e) => setfecha(e.target.value)}
                      />
                  </div>

                  <div className="col-3 mx-2">
                    <button className="btn btn-primary w-100" onClick={buscarfecha}>Buscar</button>
                  </div>
        </div>

        <table className="table">
                <thead>
                    <tr>
                       <th>Folio</th>
                       <th>Concepto</th>
                       <th>Monto</th>
                       <th>Fecha</th>
                       <th>Alumno</th>
                       <th>ID del Alumno</th>
                    </tr>
                    
                </thead>
                
                <tbody>
                
              {datosfolio.map((deudor, index) => (
                <tr key={index}>
                      <td>{deudor.folio}</td>
                      <td>{deudor.concepto}</td>
                      <td>{deudor.monto}</td>
                      <td>{deudor.fecha}</td>
                      <td>{deudor.nombre}</td>
                      <td>{deudor.matricula}</td>
                </tr>
              ))}
         
                </tbody>
        </table>
  

          </>
          );

        case 'idalumno':
          return (
            <>
    <div className='d-flex flex-row justify-content-center'>
            <h1 className='display-3'>Busqueda por Alumno</h1>
          </div>


<div className="d-flex flex-row justify-content-between my-3" >
                  <div className="col-9">
                    <input type="text" placeholder="Id del Alumno"
                      className="form-control"
                      value={alumno}
                      onChange={(e) => setalumno(e.target.value)}
                      />
                  </div>
  
     
                  <div className="col-3 mx-2">
              <button className="btn btn-primary w-100" onClick={buscaralu}>Buscar</button>
                  </div>
   </div>
  
   <table className="table">
                <thead>
                    <tr>
                       <th>Folio</th>
                       <th>Concepto</th>
                       <th>Monto</th>
                       <th>Fecha</th>
                       <th>Alumno</th>
                       <th>ID del Alumno</th>
                    </tr>
                    
                </thead>
                
                <tbody>
                
              {datosfolio.map((deudor, index) => (
                <tr key={index}>
                      <td>{deudor.folio}</td>
                      <td>{deudor.concepto}</td>
                      <td>{deudor.monto}</td>
                      <td>{deudor.fecha}</td>
                      <td>{deudor.nombre}</td>
                      <td>{deudor.matricula}</td>
                </tr>
              ))}
         
                </tbody>
             </table>
            </>
            );


        case 'idfolio':
                return (
                  <>
                      <div className='d-flex flex-row justify-content-center'>
            <h1 className='display-3'>Busqueda por Folio</h1>
          </div>
                  <div className="d-flex flex-row justify-content-between my-3" >
          <div className="col-9">
                    <input type="text" placeholder="Folio"
                      className="form-control"
                      value={idfolio}
                      onChange={(e) => setidfolio(e.target.value)}
                      />
        </div>

        <div className="col-3 mx-2">
                    <button className="btn btn-primary w-100" onClick={buscarfolio}>Buscar</button>
                </div>        
                    </div>                 
        
                    <table className="table">
                <thead>
                    <tr>
                       <th>Folio</th>
                       <th>Concepto</th>
                       <th>Monto</th>
                       <th>Fecha</th>
                       <th>Alumno</th>
                       <th>ID del Alumno</th>
                    </tr>
                    
                </thead>
                
                <tbody>
                
              
                <tr >
                      <td>{datafolio.folio}</td>
                      <td>{datafolio.concepto}</td>
                      <td>{datafolio.monto}</td>
                      <td>{datafolio.fecha}</td>
                      <td>{datafolio.nombre}</td>
                      <td>{datafolio.matricula}</td>
                </tr>
        
         
                </tbody>
             </table>
        
                  </>
                  );

        default:
          return <p>Tipo no reconocido</p>;
      }
    };


    const buscarfecha = async () => {

           const a = query(collection(db, 'Folios'), 
                  where("Fecha", "==", fecha),
                );

            const querySnapshot = await getDocs(a);
            const fechasList = querySnapshot.docs.map(doc => ({
                        folio: doc.id,
                        cambio: doc.data().Cambio,
                        concepto: doc.data().Concepto,
                        fecha:doc.data().Fecha,
                        matricula: doc.data().Matricula,
                        monto: doc.data().Monto,
                        nombre: doc.data().Nombre,
                      }));    

            setdatosfolio(fechasList);

  };

  const buscaralu = async () => {
        
    const b = query(collection(db, 'Folios'), 
    where("Matricula", "==", alumno),
  );

const querySnapshot = await getDocs(b);
const alumnosList = querySnapshot.docs.map(doc => ({
          folio: doc.id,
          cambio: doc.data().Cambio,
          concepto: doc.data().Concepto,
          fecha:doc.data().Fecha,
          matricula: doc.data().Matricula,
          monto: doc.data().Monto,
          nombre: doc.data().Nombre,
        }));    

setdatosfolio(alumnosList);
    

};

const buscarfolio = async () => {
    try {
      if (!idfolio) {
        alert('Por favor, ingresa un folio válido.');
        return;
      }
  
      // Referencia al documento en la colección "Folios" con el ID proporcionado
      const folioRef = doc(db, 'Folios', idfolio);
      const folioSnap = await getDoc(folioRef);
  
      if (folioSnap.exists()) {
        // Actualizar el estado con los datos del documento
        const folioData = folioSnap.data();
        setdatafolio({
          folio: idfolio,
          concepto: folioData.Concepto || '',
          monto: folioData.Monto || '',
          fecha: folioData.Fecha || '',
          nombre: folioData.Nombre || '',
          matricula:folioData.Matricula || '',
        });
      } else {
        alert('No se encontró un folio con ese ID.');
      }
    } catch (error) {
      console.error('Error al buscar el folio:', error);
      alert('Hubo un error al buscar el folio.');
    }
  };



  return (

    <div className='container-fluid bg-dark text-white' style={{ minHeight: '100vh' }} >
            <div className='container'> 
  
   

   
    
              {renderContent()}
   

             
    
   
             </div>

    </div>
  );
}

export default Folios;