import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../BD/firebase-config';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Adeudos() {

  const [deudores, setdeudores] = useState([]);
  const [deudatotal, setdeudatotal] = useState(0);
  const [deudatotalG, setdeudatotalG] = useState(0);
  const [deudoresG, setdeudoresG] = useState([]);
  const [horario, sethorario] = useState('');
  const location = useLocation();
  const tipo = location.state?.tipo || 'general'; // Valor predeterminado si no se pasa `tipo`


  const handleBuscarH = async () => {
    if (horario) {
      const q = query(collection(db, 'Alumnos'),
        where("Deuda", ">=", 1),
        where("Horario", "==", horario),
        where("Estado", "==", "Activo"),
        orderBy("Profesor", "asc")
      );
      const querySnapshot = await getDocs(q);
      const deudoresList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().Nombre,
        telefono: doc.data().Telefono,
        adeudos: doc.data().Deuda,
        adeudo: doc.data().Deuda * doc.data().Colegiatura,
        curso: doc.data().Curso,
        horario: doc.data().Horario,
        profesor: doc.data().Profesor
      }));

      // Calcular la suma total del campo "adeudo"
      const sumaAdeudo = deudoresList.reduce((total, deudor) => total + deudor.adeudo, 0);
      setdeudatotal(sumaAdeudo); // Actualizar el estado con la suma total



      setdeudores(deudoresList);
    }
  };


  const handleBuscarG = async () => {

    const q = query(collection(db, 'Alumnos'),
      where("Deuda", ">=", 1),
      where("Estado", "==", "Activo"),
      orderBy("Profesor", "asc")
    );
    const querySnapshot = await getDocs(q);
    const deudoresList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().Nombre,
      telefono: doc.data().Telefono,
      adeudos: doc.data().Deuda,
      adeudo: doc.data().Deuda * doc.data().Colegiatura,
      curso: doc.data().Curso,
      horario: doc.data().Horario,
      profesor: doc.data().Profesor
    }));

    // Calcular la suma total del campo "adeudo"
    const sumaAdeudo = deudoresList.reduce((total, deudor) => total + deudor.adeudo, 0);
    setdeudatotalG(sumaAdeudo); // Actualizar el estado con la suma total


    setdeudoresG(deudoresList);

  };

    const DescargarG = async () => {

    const q = query(collection(db, 'Alumnos'),
      where("Deuda", ">=", 1),
      where("Estado", "==", "Activo"),
      orderBy("Profesor", "asc")
    );
    const querySnapshot = await getDocs(q);
    const deudoresList = querySnapshot.docs.map(doc => ({
      ID: doc.id,
      Nombre: doc.data().Nombre,
      Telefono: doc.data().Telefono,
      Adeudos: doc.data().Deuda,
      Adeudo: doc.data().Deuda * doc.data().Colegiatura,
      Curso: doc.data().Curso,
      Horario: doc.data().Horario,
      Profesor: doc.data().Profesor
    }));

   

      // 1. Convierte los datos a una hoja de Excel
  const worksheet = XLSX.utils.json_to_sheet(deudoresList);
  // 2. Crea un libro de Excel y agrega la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'AdeudosGenerales');
  // 3. Genera el archivo Excel en formato binario
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  // 4. Descarga el archivo usando file-saver
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'AdeudosGenerales.xlsx');

  };


      const DescargarH = async () => {

    if (horario) {
      const q = query(collection(db, 'Alumnos'),
        where("Deuda", ">=", 1),
        where("Horario", "==", horario),
        where("Estado", "==", "Activo"),
        orderBy("Profesor", "asc")
      );
      const querySnapshot = await getDocs(q);
      const deudoresList = querySnapshot.docs.map(doc => ({
        Id: doc.id,
        Nombre: doc.data().Nombre,
        Telefono: doc.data().Telefono,
        Adeudos: doc.data().Deuda,
        Adeudo: doc.data().Deuda * doc.data().Colegiatura,
        Curso: doc.data().Curso,
        Horario: doc.data().Horario,
        Profesor: doc.data().Profesor
      }));

 


          // 1. Convierte los datos a una hoja de Excel
  const worksheet = XLSX.utils.json_to_sheet(deudoresList);
  // 2. Crea un libro de Excel y agrega la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Adeudos por horario');
  // 3. Genera el archivo Excel en formato binario
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  // 4. Descarga el archivo usando file-saver
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'Adeudos por horario.xlsx');

    }

 
  };


  const renderContent = () => {
    switch (tipo) {
      case 'horario':
        return (
          <>
            <div className='d-flex flex-row justify-content-center'>
              <h1 className='display-3'>Adeudos por Horario</h1>
            </div>

            <div className="d-flex flex-row justify-content-between my-3" >
              <div className="col-8">
                <input type="text" placeholder="Horario"
                  className="form-control"
                  value={horario}
                  onChange={(e) => sethorario(e.target.value)}
                />
              </div>

              <div className="col-2 mx-2">
                <button className="btn btn-primary w-100" onClick={handleBuscarH}>Buscar</button>
              </div>

              <div className="col-2 mx-2">
                <button className="btn btn-success w-100" onClick={DescargarH}>Descargar</button>
              </div>
            </div>

            <h1><strong>Total:$</strong> {deudatotal}</h1>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Telefono</th>
                  <th>Numero de adeudos</th>
                  <th>Adeudo</th>
                  <th>Curso</th>
                  <th>Horario</th>
                  <th>Profesor</th>
                </tr>

              </thead>

              <tbody>

                {deudores.map((deudor, index) => (
                  <tr key={index}>
                    <td>{deudor.id}</td>
                    <td>{deudor.nombre}</td>
                    <td>{deudor.telefono}</td>
                    <td>{deudor.adeudos}</td>
                    <td>{deudor.adeudo}</td>
                    <td>{deudor.curso}</td>
                    <td>{deudor.horario}</td>
                    <td>{deudor.profesor}</td>
                  </tr>
                ))}

              </tbody>
            </table>

          </>
        );

      case 'general':
        return (
          <>
            <div className='d-flex flex-row justify-content-center'>
              <h1 className='display-3'>Adeudos Generales</h1>
            </div>


            <div className='d-flex flex-row justify-content-between' >
              <button className="btn btn-primary w-50 mx-2" onClick={handleBuscarG}>Ver Adeudos</button>
              <button className="btn btn-success w-50 mx-2" onClick={DescargarG}>Descargar Adeudos</button>

            </div>



            <h1><strong>Total:$</strong> {deudatotalG}</h1>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Telefono</th>
                  <th>Numero de adeudos</th>
                  <th>Adeudo</th>
                  <th>Curso</th>
                  <th>Horario</th>
                  <th>Profesor</th>
                </tr>

              </thead>

              <tbody>

                {deudoresG.map((deudor, index) => (
                  <tr key={index}>
                    <td>{deudor.id}</td>
                    <td>{deudor.nombre}</td>
                    <td>{deudor.telefono}</td>
                    <td>{deudor.adeudos}</td>
                    <td>{deudor.adeudo}</td>
                    <td>{deudor.curso}</td>
                    <td>{deudor.horario}</td>
                    <td>{deudor.profesor}</td>
                  </tr>
                ))}

              </tbody>
            </table>

          </>
        );
      default:
        return <p>Tipo no reconocido</p>;
    }
  };




  return (

    <div className='container-fluid bg-dark text-white' style={{ minHeight: '100vh' }} >
      <div className='container'>





        {renderContent()}



      </div>

    </div>
  );
}

export default Adeudos;