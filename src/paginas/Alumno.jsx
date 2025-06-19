import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../BD/firebase-config';
import { useNavigate } from 'react-router-dom';


function Alumno() {

  const navigate = useNavigate();

  const [datosAlumno, setDatosAlumno] = useState({
    id: '',
    nombre: '',
    telefono: '',
    correo: '',
    curso: '',
    horario: '',
    colegiatura: '',
    adeudos: '',
    estado: '',
    profesor: '',
    calificacion: '',
    materia: '',
    idcali: ''
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

  const profesores = [
    { value: "ALINE ESMERALDA MALDONADO SAMPAYO", label: "ALINE ESMERALDA MALDONADO SAMPAYO" },
    { value: "ANGEL JOEL ALVAREZ CABALLERO", label: "ANGEL JOEL ALVAREZ CABALLERO" },
    { value: "DANIEL GARRIDO LUNA", label: "DANIEL GARRIDO LUNA" },
    { value: "JAEL ALVAREZ CABALLERO", label: "JAEL ALVAREZ CABALLERO" },
    { value: "GERARDO DIAZ ARROYO", label: "GERARDO DIAZ ARROYO" },
    { value: "JORGE IGNACIO MANRIQUEZ", label: "JORGE IGNACIO MANRIQUEZ" },
    { value: "LIZETH ALVAREZ CABALLERO", label: "LIZETH ALVAREZ CABALLERO" },
    { value: "JPAOLA MONSERRATH ORTEGA SANCHEZ", label: "PAOLA MONSERRATH ORTEGA SANCHEZ" },
    { value: "SAUL JIMENEZ MERCADO", label: "SAUL JIMENEZ MERCADO" },
    { value: "VANESSA CARRASCO CERVANTES", label: "VANESSA CARRASCO CERVANTES" },
    { value: "PENDIENDTE", label: "PENDIENDTE" },
  ];


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

  const estados = [
    { value: "Activo", label: "Activo" },
    { value: "Baja", label: "Baja" },
    { value: "Egresado", label: "Egresado" },
  ];

  const materias = [
    { value: "Exploradores-Descubriendo la Tecnología Shinko", label: "Exploradores-Descubriendo la Tecnología Shinko" },
    { value: "Exploradores-Navegación Shinko", label: "Exploradores-Navegación Shinko" },
    { value: "Exploradores-Conexión Shinko", label: "Exploradores-Conexión Shinko" },
    { value: "Exploradores-Investigaciones Shinko", label: "Exploradores-Investigaciones Shinko" },
    { value: "Exploradores-Cálculos Shinko", label: "Exploradores-Cálculos Shinko" },
    { value: "Exploradores-Presentaciones Shinko", label: "Exploradores-Presentaciones Shinko" },
    { value: "Exploradores-Creatividad Digital Shinko", label: "Exploradores-Creatividad Digital Shinko" },
    { value: "Exploradores-Magia Digital Shinko", label: "Exploradores-Magia Digital Shinko" },
    { value: "Exploradores-Contenido audiovisual Shinko", label: "Exploradores-Contenido audiovisual Shinko" },
    { value: "Exploradores-Animación 2D Shinko", label: "Exploradores-Animación 2D Shinko" },
    { value: "Exploradores-Creación 3d Shinko", label: "Exploradores-Creación 3d Shinko" },
    { value: "Exploradores-IA Shinko", label: "Exploradores-IA Shinko" },
    { value: "Exploradores-Web Shinko", label: "Exploradores-Web Shinko" },
    { value: "Exploradores-Mecatrónica Shinko", label: "Exploradores-Mecatrónica Shinko" },
    { value: "Exploradores-Empresa Shinko", label: "Exploradores-Empresa Shinko" },
    { value: "Elemental-Redacción Shinko", label: "Elemental-Redacción Shinko" },
    { value: "Elemental-Control de datos Shinko", label: "Elemental-Control de datos Shinko" },
    { value: "Elemental-Ponencia Shinko", label: "Elemental-Ponencia Shinko" },
    { value: "Elemental-Imprenta básica Shinko", label: "Elemental-Imprenta básica Shinko" },
    { value: "Elemental-Edición Shinko", label: "Elemental-Edición Shinko" },
    { value: "Elemental-Mantenimiento Shinko", label: "Elemental-Mantenimiento Shinko" },
    { value: "Programación-Lógica deductiva Shinko", label: "Programación-Lógica deductiva Shinko" },
    { value: "Programación-Bases de Datos Shinko", label: "Programación-Bases de Datos Shinko" },
    { value: "Programación-Diseño UI / UX Shinko", label: "Programación-Diseño UI / UX Shinko" },
    { value: "Programación-Software Shinko", label: "Programación-Software Shinko" },
    { value: "Programación-Páginas web Shinko", label: "Programación-Páginas web Shinko" },
    { value: "Programación-Aplicaciones web Shinko", label: "Programación-Aplicaciones web Shinko" },
    { value: "Programación-Fundamentos de una Red Shinko", label: "Programación-Fundamentos de una Red Shinko" },
    { value: "Programación-Servidores Shinko", label: "Programación-Servidores Shinko" },
    { value: "Programación-Programación artificial Shinko", label: "Programación-Programación artificial Shinko" },
    { value: "Programación-Proyecto Laboral Shinko", label: "Programación-Proyecto Laboral Shinko" },
    { value: "Diseño-Teoría del diseño Shinko", label: "Diseño-Teoría del diseño Shinko" },
    { value: "Diseño-Creación de una Marca Shinko", label: "Diseño-Creación de una Marca Shinko" },
    { value: "Diseño-Revelado Shinko", label: "Diseño-Revelado Shinko" },
    { value: "Diseño-Composición Shinko", label: "Diseño-Composición Shinko" },
    { value: "Diseño-Editorial Shinko", label: "Diseño-Editorial Shinko" },
    { value: "Diseño-Producción de audio Shinko", label: "Diseño-Producción de audio Shinko" },
    { value: "Diseño-Animación Shinko", label: "Diseño-Animación Shinko" },
    { value: "Diseño-Video Shinko", label: "Diseño-Video Shinko" },
    { value: "Diseño-Post Producción Shinko", label: "Diseño-Post Producción Shinko" },
    { value: "Diseño-Diseño Web Shinko", label: "Diseño-Diseño Web Shinko" },
    { value: "Diseño-Diseño artificial Shinko", label: "Diseño-Diseño artificial Shinko" },
    { value: "Diseño-Proyecto Laboral Shinko", label: "Diseño-Proyecto Laboral Shinko" },
    { value: "A1 Junior-Optional Step 1", label: "A1 Junior-Optional Step 1" },
    { value: "A1 Junior-Optional Step 2", label: "A1 Junior-Optional Step 2" },
    { value: "A2 Junior-Starter's Step 1", label: "A2 Junior-Starter's Step 1" },
    { value: "A2 Junior-Starter's Step 2", label: "A2 Junior-Starter's Step 2" },
    { value: "B1 Junior-Adventure Step 1", label: "B1 Junior-Adventure Step 1" },
    { value: "B1 Junior-Adventure Step 2", label: "B1 Junior-Adventure Step 2" },
    { value: "B1 Junior-Eliter's Step 1", label: "B1 Junior-Eliter's Step 1" },
    { value: "B1 Junior-Eliter's Step 2", label: "B1 Junior-Eliter's Step 2" },
    { value: "A1 Senior-Optional Step 1", label: "A1 Senior-Optional Step 1" },
    { value: "A1 Senior-Optional Step 2", label: "A1 Senior-Optional Step 2" },
    { value: "A1 Senior-Optional Step 3", label: "A1 Senior-Optional Step 3" },
    { value: "A2 Senior-Preliminar Step 1", label: "A2 Senior-Preliminar Step 1" },
    { value: "A2 Senior-Preliminar Step 2", label: "A2 Senior-Preliminar Step 2" },
    { value: "A2 Senior-Preliminar Step 3", label: "A2 Senior-Preliminar Step 3" },
    { value: "B1 Senior-Introducer Step 1", label: "B1 Senior-Introducer Step 1" },
    { value: "B1 Senior-Introducer Step 2 ", label: "B1 Senior-Introducer Step 2" },
    { value: "B1 Senior-Introducer Step 3", label: "B1 Senior-Introducer Step 3" },
    { value: "B1+ Senior-Developer Step 1", label: "B1+ Senior-Developer Step 1" },
    { value: "B1+ Senior-Developer Step 2", label: "B1+ Senior-Developer Step 2" },
    { value: "B1+ Senior-Developer Step 3", label: "B1+ Senior-Developer Step 3" },
    { value: "B2 Senior-Master Step 1", label: "B2 Senior-Master Step 1" },
    { value: "B2 Senior-Master Step 2", label: "B2 Senior-Master Step 2" },
    { value: "B2 Senior-Master Step 3", label: "B2 Senior-Master Step 3" },
    { value: "A1 Premiere Pas 1", label: "A1 Premiere Pas 1" },
    { value: "A1 Premiere Pas 2", label: "A1 Premiere Pas 2" },
    { value: "A1 Premiere Pas 3", label: "A1 Premiere Pas 3" },
    { value: "A1 Pas Décisif 1", label: "A1 Pas Décisif 1" },
    { value: "A1 Pas Décisif 2", label: "A1 Pas Décisif 2" },
    { value: "A1 Pas Décisif 3", label: "A1 Pas Décisif 3" },
    { value: "B1 Pas en Avant 1", label: "A1 Pas en Avant 1" },
    { value: "B1 Pas en Avant 2", label: "A1 Pas en Avant 2" },
    { value: "B1 Pas en Avant 3", label: "A1 Pas en Avant 3" },
  ];


  const location = useLocation();
  const tipo = location.state?.tipo || 'modi'; // Valor predeterminado si no se pasa `tipo`




  const rellenarInfo = async () => {
    if (!datosAlumno.id) {
      alert('Por favor, ingresa un ID válido.');
      return;
    }

    try {
      const docRef = doc(db, 'Alumnos', datosAlumno.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const alumnoData = docSnap.data();
        setDatosAlumno((prevDatos) => ({
          ...prevDatos,
          nombre: alumnoData.Nombre || '',
          telefono: alumnoData.Telefono || '',
          correo: alumnoData.Correo || '',
          curso: alumnoData.Curso || '',
          horario: alumnoData.Horario || '',
          colegiatura: alumnoData.Colegiatura || '',
          adeudos: parseInt(alumnoData.Deuda) || 0,
          estado: alumnoData.Estado || '',
          profesor: alumnoData.Profesor || ''
        }));
      } else {
        alert('No se encontró un alumno con ese ID.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del alumno:', error);
      alert('Hubo un error al obtener los datos del alumno.');
    }
  };


  const actualizarInfo = async () => {
    const alumnoRef = doc(db, "Alumnos", datosAlumno.id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(alumnoRef, {
      Colegiatura: parseFloat(datosAlumno.colegiatura),
      Correo: datosAlumno.correo,
      Curso: datosAlumno.curso,
      Estado: datosAlumno.estado,
      Deuda: parseInt(datosAlumno.adeudos),
      Horario: datosAlumno.horario,
      Nombre: datosAlumno.nombre,
      Profesor: datosAlumno.profesor,
      Telefono: datosAlumno.telefono
    });

    alert("Datos actualizados exitosamente");
  };

  const cargarcali = async () => {
    if (!datosAlumno.id || !datosAlumno.materia || !datosAlumno.calificacion) {
      alert('Por favor, completa todos los campos antes de subir la calificación.');
      return;
    }

    try {
      // Referencia a la subcolección "Creditos" dentro del documento del alumno
      const creditosRef = collection(db, 'Alumnos', datosAlumno.id, 'Creditos');

      // Agregar un nuevo documento a la subcolección "Creditos"
      await addDoc(creditosRef, {
        Materia: datosAlumno.materia,
        Calificacion: parseFloat(datosAlumno.calificacion),
      });

      // Obtener todos los documentos de la subcolección "Creditos"
      const querySnapshot = await getDocs(creditosRef);

      // Calcular el promedio
      let sumaCalificaciones = 0;
      let totalDocumentos = 0;

      querySnapshot.forEach((doc) => {
        sumaCalificaciones += doc.data().Calificacion;
        totalDocumentos += 1;
      });

      const promedio = totalDocumentos > 0 ? sumaCalificaciones / totalDocumentos : 0;

      // Actualizar el campo "Promedio" en el documento del alumno
      const alumnoRef = doc(db, 'Alumnos', datosAlumno.id);
      await updateDoc(alumnoRef, {
        Promedio: promedio,
      });

      alert('Calificación subida y promedio actualizado exitosamente.');
    } catch (error) {
      console.error('Error al subir la calificación:', error);
      alert('Hubo un error al subir la calificación.');
    }
  };


  const vercali = () => {


    if (!datosAlumno.id) {
      alert('Por favor, ingresa un ID válido.');
      return;
    }

    // Navegar a la página Calificaciones con el parámetro de matrícula
    navigate(`/cali?matricula=${encodeURIComponent(datosAlumno.id)}`);
  };

  const updatecali = async () => {
    if (!datosAlumno.id || !datosAlumno.idcali || !datosAlumno.calificacion) {
      alert('Por favor, completa todos los campos antes de actualizar la calificación.');
      return;
    }

    try {
      // Referencia a la subcolección "Creditos" dentro del documento del alumno
      const creditosRef = collection(db, 'Alumnos', datosAlumno.id, 'Creditos');

      const alumnocali = doc(db, "Alumnos", datosAlumno.id, 'Creditos', datosAlumno.idcali);


      await updateDoc(alumnocali, {
        Calificacion: parseFloat(datosAlumno.calificacion)

      });



      // Obtener todos los documentos de la subcolección "Creditos"
      const querySnapshot = await getDocs(creditosRef);

      // Calcular el promedio
      let sumaCalificaciones = 0;
      let totalDocumentos = 0;

      querySnapshot.forEach((doc) => {
        sumaCalificaciones += doc.data().Calificacion;
        totalDocumentos += 1;
      });

      const promedio = totalDocumentos > 0 ? sumaCalificaciones / totalDocumentos : 0;

      // Actualizar el campo "Promedio" en el documento del alumno
      const alumnoRef = doc(db, 'Alumnos', datosAlumno.id);
      await updateDoc(alumnoRef, {
        Promedio: promedio,
      });

      alert('Calificación y promedio actualizado exitosamente.');
    } catch (error) {
      console.error('Error al subir la calificación:', error);
      alert('Hubo un error al subir la calificación.');
    }
  };


  const obtenerNombreAlumno = async () => {
    if (!datosAlumno.id) {
      alert('Por favor, ingresa un ID válido.');
      return;
    }

    try {
      const docRef = doc(db, 'Alumnos', datosAlumno.id); // Referencia al documento del alumno
      const docSnap = await getDoc(docRef); // Obtener el documento

      if (docSnap.exists()) {
        const alumnoData = docSnap.data(); // Obtener los datos del documento
        setDatosAlumno((prevDatos) => ({
          ...prevDatos,
          nombre: alumnoData.Nombre || '', // Actualizar el estado con el nombre del alumno
        }));
      } else {
        alert('No se encontró un alumno con ese ID.');
      }
    } catch (error) {
      console.error('Error al obtener el nombre del alumno:', error);
      alert('Hubo un error al obtener el nombre del alumno.');
    }
  };

  const eliminarcali = async () => {

    let confirmar = window.confirm("¿Estas seguro de eliminar la calificación?");
    if (confirmar === true) {
      if (!datosAlumno.id || !datosAlumno.idcali) {
        alert('Por favor, completa todos los campos antes de eliminar la calificación.');
      }
      else {
        await deleteDoc(doc(db, "Alumnos", datosAlumno.id, 'Creditos', datosAlumno.idcali));

        const creditosRef = collection(db, 'Alumnos', datosAlumno.id, 'Creditos');
        // Obtener todos los documentos de la subcolección "Creditos"
        const querySnapshot = await getDocs(creditosRef);

        // Calcular el promedio
        let sumaCalificaciones = 0;
        let totalDocumentos = 0;

        querySnapshot.forEach((doc) => {
          sumaCalificaciones += doc.data().Calificacion;
          totalDocumentos += 1;
        });

        const promedio = totalDocumentos > 0 ? sumaCalificaciones / totalDocumentos : 0;

        // Actualizar el campo "Promedio" en el documento del alumno
        const alumnoRef = doc(db, 'Alumnos', datosAlumno.id);
        await updateDoc(alumnoRef, {
          Promedio: promedio,
        });
        alert("Calificación eliminada exitosamente");
      }
    }
  };


  const renderContent = () => {
    switch (tipo) {
      case 'modi':
        return (
          <>
            <div className='container'>
              <div className='d-flex flex-row justify-content-center'>
                <h1 className='display-3'>Datos del Alumno</h1>
              </div>

              <div className='d-flex flex-row my-5'>

                <input
                  type="text"
                  placeholder="ID del Alumno"
                  className="form-control m-2"
                  name="id"
                  value={datosAlumno.id}
                  onChange={handleChange}
                />

                <button className="btn btn-primary m-2 w-25" onClick={rellenarInfo}>
                  Buscar Alumno
                </button>

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



              <div className='d-flex flex-row my-2'>

                <Select
                  options={profesores}
                  placeholder="¿Quien dara el curso?"
                  className="form-select m-2"
                  name="profesor"
                  value={profesores.find(option => option.value === datosAlumno.profesor)}
                  onChange={handleSelectChange}
                />

                <Select
                  options={cursos}
                  placeholder="Curso"
                  className="form-select m-2"
                  name="curso"
                  value={cursos.find(option => option.value === datosAlumno.curso)}
                  onChange={handleSelectChange}
                />


              </div>

              <div className='d-flex flex-row my-2'>
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

                <input
                  type="number"
                  placeholder="Numero de pagos pendientes"
                  className="form-control m-2"
                  name="adeudos"
                  value={datosAlumno.adeudos}
                  onChange={handleChange}
                />

                <Select
                  options={estados}
                  placeholder="Estado"
                  className="form-select m-2"
                  name="estado"
                  value={estados.find(option => option.value === datosAlumno.estado)}
                  onChange={handleSelectChange}
                />


              </div>

              <button className="btn btn-warning m-2 w-100" onClick={actualizarInfo}>Actualizar información</button>
            </div>
          </>
        );

      case 'cargar':
        return (
          <>
            <div className='container'>
              <div className='d-flex flex-row justify-content-center'>
                <h1 className='display-3'>Carga de calificaciones</h1>
              </div>

              <div className='d-flex flex-row m-2'>
                <input
                  type="text"
                  placeholder="ID del Alumno"
                  className="form-control m-2"
                  name="id"
                  value={datosAlumno.id}
                  onChange={handleChange}
                />


                <button className="btn btn-primary m-2 w-25" onClick={obtenerNombreAlumno}>Buscar</button>

              </div>



              <div className='d-flex flex-row m-3'>
                <h3>Nombre:  {datosAlumno.nombre}</h3>
              </div>


              <div className='d-flex flex-row my-2'>

                <Select
                  options={materias}
                  placeholder="Materia"
                  className="form-select m-2"
                  name="materia"
                  value={materias.find(option => option.value === datosAlumno.materia)}
                  onChange={handleSelectChange}
                />

                <input
                  type="number"
                  placeholder="Calificación"
                  className="form-control m-2"
                  name="calificacion"
                  value={datosAlumno.calificacion}
                  onChange={handleChange}
                />

              </div>

              <button className="btn btn-success m-2 w-100" onClick={cargarcali}>Subir Calificación</button>
            </div>
          </>
        );

      case 'ver':
        return (
          <>
            <div className='container'>
              <div className='d-flex flex-row justify-content-center'>
                <h1 className='display-3'>Ver calificaciones</h1>
              </div>



              <input
                type="text"
                placeholder="ID del Alumno"
                className="form-control m-2"
                name="id"
                value={datosAlumno.id}
                onChange={handleChange}
              />

              <button className="btn btn-primary m-2 w-100" onClick={vercali}>Revisar Calificaciónes</button>


            </div>
          </>
        );

      case 'modicali':
        return (
          <>
            <div className='container'>
              <div className='d-flex flex-row justify-content-center'>
                <h1 className='display-3'>Modificar calificación</h1>
              </div>

              <div className='d-flex flex-row m-2'>
                <input
                  type="text"
                  placeholder="ID del Alumno"
                  className="form-control m-2"
                  name="id"
                  value={datosAlumno.id}
                  onChange={handleChange}
                />


                <button className="btn btn-primary m-2 w-25" onClick={obtenerNombreAlumno}>Buscar</button>

              </div>



              <div className='d-flex flex-row m-3'>
                <h3>Nombre:  {datosAlumno.nombre}</h3>
              </div>

              <div className='d-flex flex-row my-2'>
                <input
                  type="text"
                  placeholder="ID de la calificación"
                  className="form-control m-2"
                  name="idcali"
                  value={datosAlumno.idcali}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  placeholder="Calificación"
                  className="form-control m-2"
                  name="calificacion"
                  value={datosAlumno.calificacion}
                  onChange={handleChange}
                />
              </div>
              <button className="btn btn-warning m-2 w-100" onClick={updatecali}>Actualizar Calificaciónes</button>


            </div>
          </>
        );

      case 'elicali':
        return (
          <>
            <div className='container'>
              <div className='d-flex flex-row justify-content-center'>
                <h1 className='display-3'>Borrar calificación</h1>
              </div>

              <div className='d-flex flex-row m-2'>
                <input
                  type="text"
                  placeholder="ID del Alumno"
                  className="form-control m-2"
                  name="id"
                  value={datosAlumno.id}
                  onChange={handleChange}
                />


                <button className="btn btn-primary m-2 w-25" onClick={obtenerNombreAlumno}>Buscar</button>

              </div>



              <div className='d-flex flex-row m-3'>
                <h3>Nombre:  {datosAlumno.nombre}</h3>
              </div>

              <div className='d-flex flex-row my-2'>
                <input
                  type="text"
                  placeholder="ID de la calificación"
                  className="form-control m-2"
                  name="idcali"
                  value={datosAlumno.idcali}
                  onChange={handleChange}
                />


              </div>
              <button className="btn btn-danger m-2 w-100" onClick={eliminarcali}>Borar Calificación</button>


            </div>
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

export default Alumno;