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
            <p><strong>Concepto: Inscripción</strong></p>
            <p><strong>Curso:{datosAlumno.curso}</strong></p>
            <p><strong>Monto de Inscripción: ${datosAlumno.monto}</strong></p>
            <p><strong>Pago de Inscripción: ${datosAlumno.pago}</strong></p>
            <p><strong>Cambio: ${datosAlumno.cambio}</strong></p>
          </>
        );
      case 'colegiatura':
        return (
          <>
            <p><strong>Concepto: Colegiatura</strong></p>
            <p><strong>Curso:{datosAlumno.curso}</strong></p>
            <p><strong>Semana:{datosAlumno.semana}</strong></p>
            <p><strong>Pagos:{datosAlumno.pagos}</strong></p>
            <p><strong>Colegiatura: ${datosAlumno.pago}</strong></p>
            <p><strong>Monto: ${datosAlumno.monto}</strong></p>
            <p><strong>Cambio: ${datosAlumno.cambio}</strong></p>
          </>
        );
      case 'pagoExtra':
        return (
          <>
            <p><strong>Curso:{datosAlumno.curso}</strong></p>
            <p><strong>Concepto:{datosAlumno.semana}</strong></p>
            <p><strong>Costo: ${datosAlumno.pago}</strong></p>
            <p><strong>Monto: ${datosAlumno.monto}</strong></p>
            <p><strong>Cambio: ${datosAlumno.cambio}</strong></p>
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
          <p><strong>Dirección: Av. Madero 203D, Colonia Centro,</strong></p>
          <p><strong>Pachuca Hidalgo, Cp:42000</strong></p>
          <p><strong>Telefono: 771-489-70-33</strong></p>
          <p><strong>RFC: GID030807AH1</strong></p>
        </div>
            <div className="m-2 d-flex flex-row justify-content-center" align="center">
              <p><strong>Folio:{datosAlumno.folio}</strong> </p>
            </div>
            <p><strong>Matrícula: {datosAlumno.matricula}</strong></p>
            <p><strong>Nombre: {datosAlumno.nombre}</strong></p>
            {renderTicketContent()}
            <p><strong>Fecha: {new Date().toLocaleDateString()}</strong></p>
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