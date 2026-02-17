import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../BD/firebase-config';
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
function Registro() {

  const location = useLocation();
  const tipo = location.state?.tipo || 'add'; // Valor predeterminado si no se pasa `tipo`

  const [topeMatricula, setTopeMatricula] = useState(null);

  const [matriculaInicio, setMatriculaInicio] = useState('');
  const [registros, setRegistros] = useState([]);

  const handleMatriculaChange = (e) => {
    setMatriculaInicio(e.target.value);
  };


  const navigate = useNavigate();

  const cursos = [
    { value: "Bachillerato CUG", label: "Bachillerato CUG" },

    { value: "Diseño Grafico Shinko", label: "Diseño Grafico Shinko" },
    { value: "Programación Shinko", label: "Programación Shinko" },
    { value: "Ofimatica Shinko", label: "Ofimatica Shinko" },
    { value: "Exploradores Shinko", label: "Exploradores Shinko" },
    { value: "Robótica Shinko", label: "Robótica Shinko" },
    { value: "Robótica Niños Shinko", label: "Robótica Niño Shinko" },
    { value: "Certificación Internacional CERTIPORT", label: "Certificación Internacional CERTIPORT" },
    { value: "Inglés Shinko", label: "Inglés Shinko" },
    { value: "Certificación Internacional Inglés", label: "Certificación Internacional Inglés" },
    { value: "Diplomado IA Shinko", label: "Diplomado IA Shinko" },
    { value: "Diplomado Excel Pro Shinko", label: "Diplomado Excel Pro Shinko" },
    { value: "Inglés Junior Shinko", label: "Inglés Junior Shinko" },
    { value: "Matemáticas Shinko", label: "Matemáticas Shinko" },
    { value: "Guitarra Shinko", label: "Guitarra Shinko" }
  ];

  const asesores = [
    { value: "Comisionista", label: "Comisionista" },
    { value: "Shinko", label: "Shinko" },
  ];

  const profesores = [
    { value: "ANGEL JOEL ALVAREZ CABALLERO", label: "ANGEL JOEL ALVAREZ CABALLERO" },
    { value: "DANIEL GARRIDO LUNA", label: "DANIEL GARRIDO LUNA" },
    { value: "JAEL ALVAREZ CABALLERO", label: "JAEL ALVAREZ CABALLERO" },
    { value: "GERARDO DIAZ ARROYO", label: "GERARDO DIAZ ARROYO" },
    { value: "IGNACIO SAMAEL MUÑOZ MEYER", label: "IGNACIO SAMAEL MUÑOZ MEYER"},
    { value: "JORGE IGNACIO MANRIQUEZ", label: "JORGE IGNACIO MANRIQUEZ" },
    { value: "LIZETH ALVAREZ CABALLERO", label: "LIZETH ALVAREZ CABALLERO" },
    { value: "LIZBETH YUNUEN MARTINEZ HERRERA", label: "LIZBETH YUNUEN MARTINEZ HERRERA" },
    { value: "PAOLA MONSERRATH ORTEGA SANCHEZ", label: "PAOLA MONSERRATH ORTEGA SANCHEZ" },
    { value: "SAUL JIMENEZ MERCADO", label: "SAUL JIMENEZ MERCADO" },
    { value: "VANESSA CARRASCO CERVANTES", label: "VANESSA CARRASCO CERVANTES" },
    { value: "PENDIENDTE", label: "PENDIENDTE" },
  ];

  const [datosAlumno, setDatosAlumno] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    correo: '',
    curso: '',
    horario: '',
    colegiatura: '',
    asesor: '',
    monto: '',
    pago: '',
    profesor: '',
    fechaInicio: ''
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosAlumno((prevDatos) => ({
      ...prevDatos,
      [name]: value
    }));
  };



  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setDatosAlumno((prevDatos) => ({
      ...prevDatos,
      [name]: selectedOption ? selectedOption.value : ''
    }));
  };

  function calcularAdeudoInicial(fechaInicioStr) {
    if (!fechaInicioStr) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaInicio = new Date(fechaInicioStr);
    fechaInicio.setHours(0, 0, 0, 0);

    // Último domingo antes o igual a hoy
    const ultimoDomingoHoy = new Date(hoy);
    ultimoDomingoHoy.setDate(hoy.getDate() - hoy.getDay());

    // Si la fecha de inicio es antes o igual al último domingo, calcula adeudo positivo
    if (fechaInicio <= ultimoDomingoHoy) {
      const msPorSemana = 7 * 24 * 60 * 60 * 1000;
      const semanas = Math.floor((ultimoDomingoHoy - fechaInicio) / msPorSemana) + 1;
      return semanas;
    }

    // Si la fecha de inicio es después del último domingo, calcula adeudo negativo
    // ¿Cuántos domingos hay entre hoy y la fecha de inicio?
    const msPorSemana = 7 * 24 * 60 * 60 * 1000;
    // Próximo domingo igual o después de la fecha de inicio
    const proximoDomingoInicio = new Date(fechaInicio);
    proximoDomingoInicio.setDate(fechaInicio.getDate() + (7 - fechaInicio.getDay()) % 7);

    // Si hoy está antes del próximo domingo de inicio, semanasNegativas será 0, pero debe ser -1
    // Si hoy está después, será -2, -3, etc.
    const semanasNegativas = Math.ceil((hoy - proximoDomingoInicio) / msPorSemana);
    return semanasNegativas;
  }

  const handleRegistrarAlumno = async () => {
    try {
      // Obtener la matrícula y el folio actual desde Firebase
      const matriculaDoc = await getDoc(doc(db, 'Matriculas', 'yezMAhyI2J0Yjhwe2BZL'));
      if (matriculaDoc.exists()) {
        let matriculaActual = matriculaDoc.data().NumMatricula;
        let folioActual = matriculaDoc.data().Folio;

        matriculaActual = parseInt(matriculaActual);
        folioActual = parseInt(folioActual);

        // Incrementar la matrícula y el folio
        const nuevaMatricula = matriculaActual + 1;
        const nuevoFolio = folioActual + 1;

        const cambio = datosAlumno.pago - datosAlumno.monto;
        const adeudoInicial = calcularAdeudoInicial(datosAlumno.fechaInicio);

        // Registrar el nuevo alumno en la colección Alumnos
        await setDoc(doc(db, 'Alumnos', nuevaMatricula.toString()), {
          Nombre: datosAlumno.nombre,
          Telefono: datosAlumno.telefono,

          Correo: datosAlumno.correo,
          Curso: datosAlumno.curso,
          Horario: datosAlumno.horario,
          Colegiatura: parseInt(datosAlumno.colegiatura),
          Estado: "Activo",
          Deuda: adeudoInicial,
          FechaR: new Date().toLocaleDateString(),
          FechaI: datosAlumno.fechaInicio,
          Inscrito: datosAlumno.asesor,
          Promedio: 0,
          Profesor: datosAlumno.profesor,
          MontoIns: parseInt(datosAlumno.monto)
        });

        // Actualizar la matrícula y el folio en Firebase
        await updateDoc(doc(db, 'Matriculas', 'yezMAhyI2J0Yjhwe2BZL'), {
          NumMatricula: nuevaMatricula,
          Folio: nuevoFolio
        });

        const concepto = 'Inscripción';

        // Redirigir a la página de ticket con los datos del alumno
        navigate(`/ticket?matricula=${nuevaMatricula}&nombre=${encodeURIComponent(datosAlumno.nombre)}&telefono=${encodeURIComponent(datosAlumno.telefono)}&correo=${encodeURIComponent(datosAlumno.correo)}&curso=${encodeURIComponent(datosAlumno.curso)}&horario=${encodeURIComponent(datosAlumno.horario)}&colegiatura=${encodeURIComponent(datosAlumno.colegiatura)}&asesor=${encodeURIComponent(datosAlumno.asesor)}&tipo=inscripcion&folio=${nuevoFolio}&concepto=${concepto}&monto=${datosAlumno.monto}&pago=${datosAlumno.pago}&cambio=${cambio}&pagado=${datosAlumno.monto}`);
      } else {
        alert('No se encontró la matrícula actual');
      }
    } catch (error) {
      console.error('Error al registrar el alumno:', error);
      alert('Error al registrar el alumno');
    }
  };





  const buscarAlumnosPorArreglo = async () => {
    const arreglo = [];
    let inicio, final;
    inicio = parseInt(matriculaInicio);
    final = parseInt(topeMatricula);
    for (let i = inicio; i <= final; i++) {
      arreglo.push(i);
    }
    const resultados = [];

    for (let i = 0; i < arreglo.length; i++) {
      const id = arreglo[i].toString();
      const alumnoDoc = await getDoc(doc(db, 'Alumnos', id));
      if (alumnoDoc.exists()) {
        const data = alumnoDoc.data();
        resultados.push({
          id,
          Nombre: data.Nombre || '',
          Horario: data.Horario || '',
          Curso: data.Curso || '',
          Colegiatura: data.Colegiatura || '',
          FechaI: data.FechaI || '',
          FechaR: data.FechaR || '',
          Inscrito: data.Inscrito || '',
          MontoIns: data.MontoIns || '',
        });
      }
    }
    setRegistros(resultados);


  };

  const DescargarInforme = async () => {
    const arreglo = [];
    let inicio, final;
    inicio = parseInt(matriculaInicio);
    final = parseInt(topeMatricula);
    for (let i = inicio; i <= final; i++) {
      arreglo.push(i);
    }
    const resultados = [];

    for (let i = 0; i < arreglo.length; i++) {
      const id = arreglo[i].toString();
      const alumnoDoc = await getDoc(doc(db, 'Alumnos', id));
      if (alumnoDoc.exists()) {
        const data = alumnoDoc.data();
        resultados.push({
          id,
          Nombre: data.Nombre || '',
          Horario: data.Horario || '',
          Colegiatura: data.Colegiatura || '',
          FechaI: data.FechaI || '',
          FechaR: data.FechaR || '',
          Inscrito: data.Inscrito || '',
          MontoIns: data.MontoIns || '',
        });
      }
    }
    setRegistros(resultados);

    // 1. Convierte los datos a una hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(registros);
    // 2. Crea un libro de Excel y agrega la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'InforrmeRegistros');
    // 3. Genera el archivo Excel en formato binario
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // 4. Descarga el archivo usando file-saver
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'InforrmeRegistros.xlsx');

  };

  const obtenerTopeMatricula = async () => {
    try {
      const matriculaDoc = await getDoc(doc(db, 'Matriculas', 'yezMAhyI2J0Yjhwe2BZL'));
      if (matriculaDoc.exists()) {
        setTopeMatricula(matriculaDoc.data().NumMatricula);
      } else {
        alert('No se encontró el tope de matrícula');
      }
    } catch (error) {
      alert('Error al recuperar el tope de matrícula');
      console.error(error);
    }
  };

  // Puedes llamarla al montar el componente:
  useEffect(() => {
    obtenerTopeMatricula();
  }, []);

  // Resto del componente...
  const renderContent = () => {
    switch (tipo) {

      case 'add':
        return (
          <>
            <div className='d-flex flex-row justify-content-center'>
              <h1 className='display-3'>Datos del Alumno</h1>
            </div>

            <input
              type="text"
              placeholder="Nombre completo del Alumno"
              className="form-control m-2"
              name="nombre"
              value={datosAlumno.nombre}
              onChange={handleChange}
            />

            <div className='d-flex flex-row my-2'>

              <input
                type="number"
                placeholder="Numero de contacto del Alumno"
                className="form-control m-2"
                name="telefono"
                value={datosAlumno.telefono}
                onChange={handleChange}
              />

              <input
                type="text"
                placeholder="Correo electronico del Alumno"
                className="form-control m-2"
                name="correo"
                value={datosAlumno.correo}
                onChange={handleChange}
              />

            </div>

            <div className='d-flex flex-row my-2'>
              <Select
                options={profesores}
                placeholder="¿Quien dara el curso?"
                className="form-select m-2"
                name="profesor"
                value={profesores.find(option => option.value === datosAlumno.profesor)}
                onChange={handleSelectChange}
              />

              <input
                type="date"
                placeholder="Fecha de inicio del curso"
                className="form-control m-2"
                name="fechaInicio"
                value={datosAlumno.fechaInicio}
                onChange={handleChange}
              />

            </div>
            <div className='d-flex flex-row my-2'>
              <Select
                options={cursos}
                placeholder="Curso"
                className="form-select m-2"
                name="curso"
                value={cursos.find(option => option.value === datosAlumno.curso)}
                onChange={handleSelectChange}
              />

              <input
                type="text"
                placeholder="Horario del Curso"
                className="form-control m-2"
                name="horario"
                value={datosAlumno.horario}
                onChange={handleChange}
              />
              <input
                type="number"
                placeholder="Colegiatura del Curso"
                className="form-control m-2"
                name="colegiatura"
                value={datosAlumno.colegiatura}
                onChange={handleChange}
              />
            </div>

            <div className='d-flex flex-row my-2'>
              <Select
                options={asesores}
                placeholder="¿Quien atendio?"
                className="form-select m-2"
                name="asesor"
                value={asesores.find(option => option.value === datosAlumno.asesor)}
                onChange={handleSelectChange}
              />

              <input
                type="number"
                placeholder="Costo de inscripción"
                className="form-control m-2"
                name="monto"
                value={datosAlumno.monto}
                onChange={handleChange}
              />

              <input
                type="number"
                placeholder="Pago de la inscripción"
                className="form-control m-2"
                name="pago"
                value={datosAlumno.pago}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary m-2 w-100" onClick={handleRegistrarAlumno}>Registrar Alumno</button>







          </>
        );

      case 'ver':
        return (
          <>
            <div className='d-flex flex-row justify-content-center'>
              <h1 className='display-3'>Informe de Registros</h1>
            </div>

            <div className="d-flex flex-row justify-content-between my-3" >
              <div className="col-8 m-2">
                <input
                  type="text"
                  placeholder="Matricula de inicio"
                  className="form-control"
                  value={matriculaInicio}
                  onChange={handleMatriculaChange}
                />
              </div>



              <div className="col-2 m-2">
                <button className="btn btn-primary w-100" onClick={buscarAlumnosPorArreglo}>
                  Buscar
                </button>
              </div>

              <div className="col-2 m-2">
                <button className="btn btn-success w-100" onClick={DescargarInforme} >Descargar</button>
              </div>
            </div>


            <table className="table m-2">
              <thead>
                <tr>
                  <th>Matricula</th>
                  <th>Nombre</th>
                  <th>Horario</th>
                  <th>Especialidad</th>
                  <th>Costo de Colegiatura</th>
                  <th>Pago de Inscripción</th>
                  <th>Fecha de Inscripción</th>
                  <th>Fecha de Inicio</th>
                  <th>Asesor</th>

                </tr>

              </thead>

              <tbody>
                {registros.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>{alumno.id}</td>
                    <td>{alumno.Nombre}</td>
                    <td>{alumno.Horario}</td>
                    <td>{alumno.Curso}</td>
                    <td>{alumno.Colegiatura}</td>
                    <td>{alumno.MontoIns}</td>
                    <td>{alumno.FechaR}</td>
                    <td>{alumno.FechaI}</td>
                    <td>{alumno.Inscrito}</td>
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
    <div className='container-fluid bg-dark text-white p-4' style={{ minHeight: '100vh' }}>
      <div className='container'>
        {renderContent()}

      </div>
    </div>
  );
}

export default Registro;