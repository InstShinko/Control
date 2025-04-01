import React from 'react';
import logoN from '../Vnegro.png';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../BD/firebase-config';

function Ticket() {
  const navigate = useNavigate(); // Hook para navegar entre páginas
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  let fechacom; 

  const hoy = new Date();

  let day = hoy.getDate();
  let month = hoy.getMonth() + 1;
  let year = hoy.getFullYear();

  if(month < 10){
    if(day<10){
      fechacom=year+"-0"+month+"-0"+day;
    }else{
      fechacom=year+"-0"+month+"-"+day;
    }
 }else{
  if(day<10){
    fechacom=year+"-"+month+"-0"+day;
  }else{
    fechacom=year+"-"+month+"-"+day;
  }
  }


  const datosAlumno = {
    matricula: searchParams.get('matricula'),
    nombre: searchParams.get('nombre'),
    curso: searchParams.get('curso'),
    monto: searchParams.get('monto'),
    cambio: searchParams.get('cambio'),
    tipo: searchParams.get('tipo'),
    folio: searchParams.get('folio'),
    pago: searchParams.get('pago'),
    pagos: searchParams.get('pagos'),
    semana: searchParams.get('semana'),
    concepto: searchParams.get('concepto'),
    fecha: fechacom
  };

  const guardarFolioEnFirebase = async () => {
    try {
      // Obtener el número de folio actual desde la colección Matriculas
      const matriculaDoc = await getDoc(doc(db, 'Matriculas', 'yezMAhyI2J0Yjhwe2BZL'));
      if (matriculaDoc.exists()) {
  


        
        // Guardar los datos del ticket en la colección Folios
        await setDoc(doc(db, 'Folios', datosAlumno.folio.toString()), {
          Folio: datosAlumno.folio,
          Matricula: datosAlumno.matricula,
          Nombre: datosAlumno.nombre,
          Monto: parseFloat(datosAlumno.pago),
          Cambio: parseFloat(datosAlumno.cambio),
          Concepto: datosAlumno.concepto,
        
          Fecha: datosAlumno.fecha
        }
      );


        // Actualizar el número de folio en la colección Matriculas
        await updateDoc(doc(db, 'Matriculas', 'yezMAhyI2J0Yjhwe2BZL'), {
          Folio: datosAlumno.folio
        });

        console.log('Folio guardado con éxito');
      } else {
        console.error('No se encontró el documento de Matriculas');
      }
    } catch (error) {
      console.error('Error al guardar el folio:', error);
    }
  };

  React.useEffect(() => {
    guardarFolioEnFirebase();
  });

  const renderTicketContent = () => {
    switch (datosAlumno.tipo) {
      case 'inscripcion':
        return (
          <>
            <p><strong>Concepto:</strong> Inscripción</p>
            <p><strong>Curso:</strong>{datosAlumno.curso}</p>
            <p><strong>Monto de Inscripción:</strong> ${datosAlumno.monto}</p>
            <p><strong>Pago de Inscripción:</strong> ${datosAlumno.pago}</p>
            <p><strong>Cambio:</strong> ${datosAlumno.cambio}</p>
          </>
        );
      case 'colegiatura':
        return (
          <>
            <p><strong>Concepto:</strong> Colegiatura</p>
            <p><strong>Curso:</strong>{datosAlumno.curso}</p>
            <p><strong>Semana:</strong>{datosAlumno.semana}</p>
            <p><strong>Pagos:</strong>{datosAlumno.pagos}</p>
            <p><strong>Colegiatura:</strong> ${datosAlumno.pago}</p>
            <p><strong>Monto:</strong> ${datosAlumno.monto}</p>
            <p><strong>Cambio:</strong> ${datosAlumno.cambio}</p>
          </>
        );
      case 'pagoExtra':
        return (
          <>
            <p><strong>Curso:</strong>{datosAlumno.curso}</p>
            <p><strong>Concepto:</strong>{datosAlumno.semana}</p>
            <p><strong>Costo:</strong> ${datosAlumno.pago}</p>
            <p><strong>Monto:</strong> ${datosAlumno.monto}</p>
            <p><strong>Cambio:</strong> ${datosAlumno.cambio}</p>
          </>
        );
      default:
        return null;
    }
  };


  return (
    <div className='container-fluid bg-light p-4' style={{ minHeight: '100vh' }}>
      <div className='container'>
        <div className='d-flex flex-column align-items-center'>
          <img src={logoN} className='w-50' alt='logotipo' />
          <h3>Recibo de Pago</h3>
        </div>
        <div className='d-flex flex-column justify-content-center'>
          <p><strong>Dirección:</strong> Av. Madero 203D, Colonia Centro, Pachuca Hidalgo, Cp:42000</p>
          <p><strong>Telefono:</strong> 771-489-70-33</p>
          <p><strong>RFC:</strong> GID030807AH1</p>
        </div>
            <div className="m-2 d-flex flex-row justify-content-center" align="center">
              <p><strong>Folio:</strong>{datosAlumno.folio} </p>
            </div>
            <p><strong>Matrícula:</strong> {datosAlumno.matricula}</p>
            <p><strong>Nombre:</strong> {datosAlumno.nombre}</p>
            {renderTicketContent()}
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
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

export default Ticket;