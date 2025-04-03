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
            <h2><strong>Concepto: Inscripción</strong></h2>
            <h2><strong>Curso:{datosAlumno.curso}</strong></h2>
            <h2><strong>{datosAlumno.curso}</strong></h2>
            <h2><strong>Monto de Inscripción: ${datosAlumno.monto}</strong></h2>
            <h2><strong>Pago de Inscripción: ${datosAlumno.pago}</strong></h2>
            <h2><strong>Cambio: ${datosAlumno.cambio}</strong></h2>
          </>
        );
      case 'colegiatura':
        return (
          <>
            <h2><strong>Concepto: Colegiatura</strong></h2>
            <h2><strong>Curso:</strong></h2>
            <h2><strong>{datosAlumno.curso}</strong></h2>
            <h2><strong>Semana:{datosAlumno.semana}</strong></h2>
            <h2><strong>Pagos:{datosAlumno.pagos}</strong></h2>
            <h2><strong>Colegiatura: ${datosAlumno.pago}</strong></h2>
            <h2><strong>Monto: ${datosAlumno.monto}</strong></h2>
            <h2><strong>Cambio: ${datosAlumno.cambio}</strong></h2>
          </>
        );
      case 'pagoExtra':
        return (
          <>
            <h2><strong>Curso:</strong></h2>
            <h2><strong>{datosAlumno.curso}</strong></h2>
            <h2><strong>Concepto:</strong></h2>
            <h2><strong>{datosAlumno.semana}</strong></h2>
            <h2><strong>Costo: ${datosAlumno.pago}</strong></h2>
            <h2><strong>Monto: ${datosAlumno.monto}</strong></h2>
            <h2><strong>Cambio: ${datosAlumno.cambio}</strong></h2>
          </>
        );
      default:
        return null;
    }
  };


  return (
    <div className='container-fluid bg-light p-4' style={{ minHeight: '100vh' }}>
      <div className='container'>
        
          <img src={logoN} className='w-50' alt='logotipo' />
          <h1>Recibo de Pago</h1>
        
        <div className='d-flex flex-column justify-content-center'>
          <h2><strong>Dirección: Av. Madero 203D,</strong></h2>
          <h2><strong>Colonia Centro, Pachuca Hidalgo,</strong></h2>
          <h2><strong>Cp:42000</strong></h2>
          <h2><strong>Telefono: 771-489-70-33</strong></h2>
          <h2><strong>RFC: GID030807AH1</strong></h2>
        </div>
            <div className="m-2 d-flex flex-row justify-content-center" align="center">
              <h2><strong>Folio:{datosAlumno.folio}</strong> </h2>
            </div>
            <h2><strong>Matrícula: {datosAlumno.matricula}</strong></h2>
            <h2><strong>Nombre:</strong></h2>
            <h2><strong>{datosAlumno.nombre}</strong></h2>
            {renderTicketContent()}
            <h2><strong>Fecha: {new Date().toLocaleDateString()}</strong></h2>
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