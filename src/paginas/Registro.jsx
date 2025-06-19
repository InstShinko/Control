import React, { useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../BD/firebase-config';
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate


function Registro() {

  const navigate = useNavigate();

  const cursos = [
    { value: "Verano - Hacho Into the World", label: "Verano - Hacho Into the World" },
    { value: "Verano - Robótica e Impresión 3D", label: "Verano - Robótica e Impresión 3D" },
    { value: "Verano - Programación  de Videojuegos", label: "Verano - Programación  de Videojuegos" },
    { value: "Verano - Animación de  Caricaturas", label: "Verano - Animación de  Caricaturas" },
    { value: "Verano - Guitarra y  Producción", label: "Verano - Guitarra y  Producción" },

    { value: "Diseño Grafico Shinko", label: "Diseño Grafico Shinko" },
    { value: "Programación Shinko", label: "Programación Shinko" },
    { value: "Ofimatica Shinko", label: "Ofimatica Shinko" },
    { value: "Exploradores Shinko", label: "Exploradores Shinko" },
    { value: "Robótica Shinko", label: "Robótica Shinko" },
    { value: "Certificación Internacional CERTIPORT", label: "Certificación Internacional CERTIPORT" },
    { value: "Inglés Shinko", label: "Inglés Shinko" },
    { value: "Certificación Internacional Inglés", label: "Certificación Internacional Inglés" },
    { value: "Francés Shinko", label: "Francés Shinko" },
    { value: "Japonés Shinko", label: "Japonés Shinko" },
    { value: "Inglés Junior Shinko", label: "Inglés Junior Shinko" },
    { value: "Matemáticas Shinko", label: "Matemáticas Shinko" },
    { value: "Guitarra Shinko", label: "Guitarra Shinko" }
  ];

  const asesores = [
    { value: "Asesor 1", label: "Asesor 1" },
    { value: "Asesor 2", label: "Asesor 2" },
    { value: "Asesor 3", label: "Asesor 3" },
  ];

  const profesores = [
    { value: "ALINE ESMERALDA MALDONADO SAMPAYO", label: "ALINE ESMERALDA MALDONADO SAMPAYO" },
    { value: "ANGEL JOEL ALVAREZ CABALLERO", label: "ANGEL JOEL ALVAREZ CABALLERO" },
    { value: "DANIEL GARRIDO LUNA", label: "DANIEL GARRIDO LUNA" },
    { value: "JAEL ALVAREZ CABALLERO", label: "JAEL ALVAREZ CABALLERO" },
    { value: "GERARDO DIAZ ARROYO", label: "GERARDO DIAZ ARROYO" },
    { value: "JORGE IGNACIO MANRIQUEZ", label: "JORGE IGNACIO MANRIQUEZ" },
    { value: "LIZETH ALVAREZ CABALLERO", label: "LIZETH ALVAREZ CABALLERO" },
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
    profesor: ''
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

        // Registrar el nuevo alumno en la colección Alumnos
        await setDoc(doc(db, 'Alumnos', nuevaMatricula.toString()), {
          Nombre: datosAlumno.nombre,
          Telefono: datosAlumno.telefono,
          Direccion: datosAlumno.direccion,
          Correo: datosAlumno.correo,
          Curso: datosAlumno.curso,
          Horario: datosAlumno.horario,
          Colegiatura: parseInt(datosAlumno.colegiatura),
          Estado: "Activo",
          Deuda: 1,
          FechaR: new Date().toLocaleDateString(),
          Inscrito: datosAlumno.asesor,
          Promedio: 0,
          Profesor: datosAlumno.profesor
        });

        // Actualizar la matrícula y el folio en Firebase
        await updateDoc(doc(db, 'Matriculas', 'yezMAhyI2J0Yjhwe2BZL'), {
          NumMatricula: nuevaMatricula,
          Folio: nuevoFolio
        });

        const concepto = 'Inscripción';

        // Redirigir a la página de ticket con los datos del alumno
        navigate(`/ticket?matricula=${nuevaMatricula}&nombre=${encodeURIComponent(datosAlumno.nombre)}&telefono=${encodeURIComponent(datosAlumno.telefono)}&direccion=${encodeURIComponent(datosAlumno.direccion)}&correo=${encodeURIComponent(datosAlumno.correo)}&curso=${encodeURIComponent(datosAlumno.curso)}&horario=${encodeURIComponent(datosAlumno.horario)}&colegiatura=${encodeURIComponent(datosAlumno.colegiatura)}&asesor=${encodeURIComponent(datosAlumno.asesor)}&tipo=inscripcion&folio=${nuevoFolio}&concepto=${concepto}&monto=${datosAlumno.monto}&pago=${datosAlumno.pago}&cambio=${cambio}&pagado=${datosAlumno.monto}`);
      } else {
        alert('No se encontró la matrícula actual');
      }
    } catch (error) {
      console.error('Error al registrar el alumno:', error);
      alert('Error al registrar el alumno');
    }
  };

  // Resto del componente...


  return (
    <div className='container-fluid bg-dark text-white p-4' style={{ minHeight: '100vh' }}>
      <div className='container'>
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

        <div className='d-flex flex-row justify-content-center'>
          <h1 className='display-3'>Datos del Curso</h1>
        </div>

        <Select
          options={profesores}
          placeholder="¿Quien dara el curso?"
          className="form-select m-2"
          name="profesor"
          value={profesores.find(option => option.value === datosAlumno.profesor)}
          onChange={handleSelectChange}
        />

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
      </div>
    </div>
  );
}

export default Registro;