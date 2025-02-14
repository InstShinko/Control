import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>Menú</h2>
      <ul style={styles.menu}>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/Registro">Registro</Link>
        </li>
        <li>
          <Link to="/Pago">Pagos</Link>
        </li>
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '200px',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    height: '100vh',
  },
  menu: {
    listStyle: 'none',
    padding: 0,
  },
};

export default Sidebar;