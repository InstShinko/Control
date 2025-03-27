import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Cortes() {


const [fecha, setfecha] = useState('');

const vercortefecha = () => {
        
  const Desfecha = `/cobranza?fecha=${encodeURIComponent(fecha)}`;
  
  // Abrir la URL en una nueva pestaña
  window.open(Desfecha, '_blank');
  
    };







  return (

    <div className='container-fluid bg-dark text-white' style={{ minHeight: '100vh' }} >
          <div className='container'>
        <div className='d-flex flex-row justify-content-center'>
          <h1 className='display-3'>Corte por fecha</h1>
        </div>

        <div className='d-flex flex-row my-5'>
            
        <input
          type="date"
          className="form-control m-2"
          name="fecha"
          value={fecha}
          onChange={(e) => setfecha(e.target.value)}
        />

      <button className="btn btn-primary m-2 w-25" onClick={vercortefecha}>
       Ver Corte
      </button>
            
        </div>


     
    </div>

    </div>
  );
}

export default Cortes;