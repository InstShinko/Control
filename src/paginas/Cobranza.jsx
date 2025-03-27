import React, { useState, useEffect } from 'react';
import logoN from '../Vnegro.png';
import { useLocation } from 'react-router-dom';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '../BD/firebase-config';

function Cobranza() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

     const [cobros, setcobros] = useState([]);
     const [total, settotal] = useState(0);
  const mat = {
    fecha: searchParams.get('fecha'),
  };





  // Función para recuperar los datos del alumno y su subcolección Creditos
  const obtenerDatosCobros = async () => {
    try {
      if (!mat.fecha) {
        alert('No se proporcionó una fecha válida.');
        return;
      }
  
      // Crear la consulta para filtrar por la fecha proporcionada
      const q = query(
        collection(db, 'Folios'),
        where('Fecha', '==', mat.fecha)
      );
  
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);
  
      // Mapear los datos necesarios
      const cobrosList = querySnapshot.docs.map((doc) => ({
        folio: doc.id,
        matricula: doc.data().Matricula || '',
        concepto: doc.data().Concepto || '',
        monto: doc.data().Monto || 0,
      }));
  
      // Calcular el total de los montos
      const totalCobros = cobrosList.reduce((total, cobro) => total + cobro.monto, 0);
  
      // Actualizar los estados
      setcobros(cobrosList);
      settotal(totalCobros);
    } catch (error) {
      console.error('Error al obtener los datos de cobros:', error);
      alert('Hubo un error al obtener los datos de cobros.');
    }
  };

  // Llamar a la función obtenerDatosAlumno al cargar el componente
  useEffect(() => {
    obtenerDatosCobros();
  });


  return (
    <div className='container-fluid bg-light p-4' style={{ minHeight: '100vh' }}>
      <div className='container'>
        <div className='d-flex flex-column align-items-center'>
          <img src={logoN} className='w-50' alt='logotipo' />
          
        </div>

        <div className='d-flex flex-row justify-content-end'>
             <h3>Fecha: {mat.fecha}</h3>
        </div>
        <div className='d-flex flex-column justify-content-center'>
          <p><strong>Total:</strong>$ {total}</p>
        </div>
       
        <table className="table">
                <thead>
                    <tr>
                       <th width="15%" >Folio</th>
                       <th width="30%">Matricula</th>
                       <th width="40%">Concepto</th>
                       <th width="15%">Monto</th>
                    </tr>
                    
                </thead>
                
                <tbody>
                
                {cobros.map((cobro, index) => (
                <tr key={index}>
                      <td>{cobro.folio}</td>
                      <td>{cobro.matricula}</td>
                      <td>{cobro.concepto}</td>
                      <td>{cobro.monto}</td>
                </tr>
              ))}
         
                </tbody>
        </table>
      
        
      </div>
    </div>
  );
}

export default Cobranza;

