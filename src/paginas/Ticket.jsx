import React from 'react';
import logoN from '../Vnegro.png';
import { useLocation } from 'react-router-dom';

function Ticket() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const datosAlumno = {
    matricula: searchParams.get('matricula'),
    nombre: searchParams.get('nombre'),
    telefono: searchParams.get('telefono'),
    direccion: searchParams.get('direccion'),
    correo: searchParams.get('correo'),
    curso: searchParams.get('curso'),
    horario: searchParams.get('horario'),
    colegiatura: searchParams.get('colegiatura'),
    asesor: searchParams.get('asesor'),
    tipo: searchParams.get('tipo'),
    folio: searchParams.get('folio'),
    monto: searchParams.get('monto'),
    pago: searchParams.get('pago'),
    cambio: searchParams.get('cambio')
  };

  const renderTicketContent = () => {
    switch (datosAlumno.tipo) {
      case 'inscripcion':
        return (
          <>
            <p><strong>Concepto:</strong> Inscripción</p>
            <p><strong>Monto de Inscripción:</strong> ${datosAlumno.monto}</p>
            <p><strong>Pago de Inscripción:</strong> ${datosAlumno.pago}</p>
            <p><strong>Cambio:</strong> ${datosAlumno.cambio}</p>
          </>
        );
      case 'colegiatura':
        return (
          <>
            <p><strong>Concepto:</strong> Colegiatura</p>
            <p><strong>Monto:</strong> ${datosAlumno.colegiatura}</p>
          </>
        );
      case 'pagoExtra':
        return (
          <>
            <p><strong>Concepto:</strong> Pago Extra</p>
            <p><strong>Monto:</strong> ${datosAlumno.pagoExtra}</p>
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
        
        
      </div>
    </div>
  );
}

export default Ticket;