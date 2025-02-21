import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth} from '../BD/firebase-config';
import {signInWithEmailAndPassword } from "firebase/auth";
import logo from '../logo.png';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {

    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        navigate('/home'); // Redirecciona a la pantalla principal
      })
      .catch((error) => {
       alert('Error al iniciar sesión: ' +  error.message);
      });

  };

  return (
    <div className='container-fluid bg-dark text-white p-4 '  style={{ minHeight: '100vh' }}>
    


      <div className='container'> 


      <img src={logo}  className='img-fluid mx-auto d-block' alt='logotipo' />

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
      
    </div>
  );
}

export default Login;