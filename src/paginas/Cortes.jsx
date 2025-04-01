import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

function Cortes() {


const [fecha, setfecha] = useState('');


const navigate = useNavigate(); // Hook para manejar la navegación
  
const vercortefecha = () => {
  if (!fecha) {
    alert('Por favor, selecciona una fecha válida.');
    return;
  }

  // Redirigir a la página de cobranza con el parámetro de fecha
  navigate(`/cobranza?fecha=${encodeURIComponent(fecha)}`);
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