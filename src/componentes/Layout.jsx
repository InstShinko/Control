import React from 'react';
import { useLocation } from 'react-router-dom';
import Barra from './Barra';

function Layout({ children }) {
  const location = useLocation();
  return (
    <div style={styles.container}>
      <div style={styles.content}>
      {location.pathname !== '/login' && <Barra />}
      {<main style={styles.main}>{children}</main>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Ocupa toda la altura de la ventana
  },
  content: {
    display: 'flex',
    flex: 1, // Ocupa el espacio restante
  },
  main: {
    flex: 1,

    backgroundColor: '#f9f9f9',
  },
};

export default Layout;