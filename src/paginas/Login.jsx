import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulamos una autenticación exitosa
    if (username === 'daniel' && password === 'mapache') {
      navigate('/home'); // Redirecciona a la pantalla principal
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className='container'>
    
      <input
        className='form-control m-2'
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className='form-control m-2'
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className='btn btn-primary w-100 m-2'>Iniciar sesión</button>
    </div>
  );
}

export default Login;