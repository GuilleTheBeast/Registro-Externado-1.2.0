import React from "react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useParams } from "react-router-dom";
import "../estilos/informacionestudiantes.css"; // Importa el archivo de estilos
import {
  Modal,
  Button,
  Table,
  Form,
  Pagination,
  Col,
  Row,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importar los estilos de los iconos
//importar EncabezadoAdmin
import EncabezadoAdmin from "../layout/navbar/Encabezadoadmin";
import EncabezadoAdmin2 from "../layout/navbar/Encabezadoadmin2";
import {
  fetchEstudianteInfo,
  fetchGrado,
  fetchDepartamentos,
  fetchReligion,
  fetchResponsableTipo,
} from "../AuthContext";

const Informacionestudiantes = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);

  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [encabezado, setEncabezado] = useState(null);
  const { id } = useParams();
  const [estudiante, setEstudiante] = useState("");
  const [gradoTemp, setGradoTemp] = useState("");

  const [grado, setGrado] = useState([]);
  const [departamento, setDepartamento] = useState([]);
  const [religion, setReligion] = useState([]);
  const [responsableTipo, setResponsableTipo] = useState([]);
  const [externado_proccess_finished, setProcessFinished] = useState();

  const [fechaN, setFechaN] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [name1Arr, setName1Arr] = useState([]);

  const [name1, setName1] = useState("");
  const [grade1, setGrade1] = useState("");

  const [name2, setName2] = useState("");
  const [grade2, setGrade2] = useState("");

  const [name3, setName3] = useState("");
  const [grade3, setGrade3] = useState("");

  const name1Ref = useRef();
  const name2Ref = useRef();
  const name3Ref = useRef();
  const grade1Ref = useRef();
  const grade2Ref = useRef();
  const grade3Ref = useRef();

  const processRef = useRef();

  useEffect(() => {
    //console.log("Valor de authToken:", authToken);

    if (
      authToken === null ||
      authToken === "" ||
      authToken === undefined ||
      authToken === "null"
    ) {
      // Muestra una alerta si el token está vacío, nulo o indefinido
      //console.log("Token vacío, nulo o indefinido");
      navigate("/caducado");
      return;
      // Redirige o toma otras acciones según sea necesario
      // Puedes agregar un redireccionamiento, por ejemplo: history.push('/login');
    } else {
      const payloadBase64 = authToken.split(".")[1];
      const payloadDecoded = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecoded);
      const userRole = parseInt(payloadJson.rol, 10);
      //console.log("El rol es " + payloadJson.rol);
      if (userRole === 1 || userRole === "1") {
        //console.log("Entraste al if de rol 1");
        //setEncabezado(<EncabezadoAdmin />);
      } else if (userRole === 2 || userRole === "2") {
        // console.log("Entraste al if de rol 2");
        //setEncabezado(<EncabezadoAdmin2 />);
      } else if (userRole === 3 || userRole === "3") {
        //console.log("Entraste al if de rol 3");
        navigate("/negado");
      }else if (userRole === 4 || userRole === "4") {
        //console.log("Entraste al if de rol 4");
        navigate("/negado");
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);

  const actual = new Date().getFullYear();
  const siguiente = actual + 1;
  const esCatolico = "Si";
  const tieneHermanos = "Si";
  const ambosPadres = "Si";
  const handleCancelar = () => {
    navigate("/estudiantessistema");
  };

  //?Obteniendo grados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradosData = await fetchGrado(authToken);
        //console.log("Datos de grados:", gradosData);
        setGrado(gradosData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  //?Obteniendo departamentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const departamentosData = await fetchDepartamentos(authToken);
        //console.log("Datos de departamentos:", departamentosData);
        setDepartamento(departamentosData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  //?Obteniendo religiones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const religionesData = await fetchReligion(authToken);
        //console.log("Datos de religiones:", religionesData);
        setReligion(religionesData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  //?Obteniendo tipo de responsable
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsablesTipoData = await fetchResponsableTipo(authToken);
        //console.log("Datos de tipo de responsable:", responsablesTipoData);
        setResponsableTipo(responsablesTipoData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  //?Obteniendo información del estudiante
  useEffect(() => {
    const fetchData = async () => {
      try {
        const estudianteData = await fetchEstudianteInfo(authToken, Number(id));
        //console.log("Datos de estudiante antes de la actualización:", id);
        setEstudiante(estudianteData);
        //console.log("Datos de estudiante después de la actualización:",estudianteData);
      } catch (error) {
        // console.error(error.message);
      }
    };
    //console.log("Token actual en Representantes Lista:", authToken);
    fetchData();
  }, [authToken, id]);

  const handleVerRepresentantes = () => {
    navigate(`/listarepresentantes/${estudiante.externado_user_id}`);
  };

  useEffect(() => {
    const newDate = estudiante.externado_student_birthdate;
    setFechaN(String(newDate));
    if (fechaN !== "null") {
      var arr = fechaN.split("T");
      var arr1 = arr[0];

      setFechaNacimiento(arr1);
    } else {
      setFechaNacimiento("");
    }
  }, [estudiante.externado_student_birthdate, fechaN, fechaNacimiento]);

  //?Obteniendo hermanos y grados
  useEffect(() => {
    if (estudiante.externado_student_has_siblings === true) {
      var arr = [];
      arr = estudiante.externado_student_siblings;

      var b = JSON.stringify(arr);
      setName1Arr(arr);

      var a = JSON.parse(arr);
      let copy = [];
      let copy2 = [];

      for (var item of a) {
        copy.push(item.name);
      }
      setName1(copy[0]);
      setName2(copy[1]);
      setName3(copy[2]);

      for (var item2 of a) {
        copy2.push(item2.grade);
      }
      setGrade1(copy2[0]);
      setGrade2(copy2[1]);
      setGrade3(copy2[2]);
    }
  }, [
    grade1,
    grade2,
    grade3,
    name1,
    name2,
    name3,
    estudiante.externado_student_resp_type_id,
    estudiante.externado_student_lives_with_parents,
    estudiante.externado_student_catholic,
    estudiante.externado_student_non_catholic_church_id,
    estudiante.externado_student_siblings,
    estudiante.externado_student_has_siblings,
    name1Arr,
  ]);

  if (estudiante.externado_student_has_siblings === false) {
    document.getElementById("hermano1").hidden = true;
    document.getElementById("hermano2").hidden = true;
    document.getElementById("hermano3").hidden = true;
  }

  if (
    estudiante.externado_student_has_siblings === true &&
    name2 === undefined
  ) {
    document.getElementById("hermano2").hidden = true;
  }

  if (
    estudiante.externado_student_has_siblings === true &&
    name3 === undefined
  ) {
    document.getElementById("hermano3").hidden = true;
  }

  if (
    estudiante.externado_student_has_siblings === true &&
    name3 === undefined
  ) {
    document.getElementById("hermano3").hidden = true;
  }

  if (
    estudiante.externado_student_resp_type_id < 4 &&
    estudiante.externado_student_resp_type_id >= 0
  ) {
    document.getElementById("labelResp").hidden = true;
    document.getElementById("nameDocRowID").hidden = true;
    document.getElementById("addressHWPhoneRowID").hidden = true;
    document.getElementById("emailMobileRowID").hidden = true;
  }

  const handleUpdateProcess = () => {
    const dataToSubmit = {
      idexternado_student: estudiante.idexternado_student,
      externado_proccess_finished: !processRef.current.checked,
      externado_student_active: true,
    };
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/api/v1/externado-admins/editStudentByAdmins", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json ; charset=UTF-8",
      },
      body: JSON.stringify(dataToSubmit),
    })
      .then((res) => res.json())
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Datos enviados",
          text: "Se ha actualizado el estado de proceso de matrácula del estudiante exitosamente",
        }).then(function () {
          navigate(-1);
        });
      });
  };

  /*const dataToSubmit = {
  idexternado_student: estudiante.idexternado_student,
  externado_proccess_finished: estudiante.externado_proccess_finished,
}
const token = localStorage.getItem("token");
fetch("http://localhost:3001/api/v1/externado-admins/editStudentByAdmins", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-type": "application/json ; charset=UTF-8",
  },
  body: JSON.stringify(dataToSubmit),
})
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    console.log("Data:", dataToSubmit);
  });*/

  return (
    <>
      <EncabezadoAdmin />
      <div className="system-parameters-container">
        <h2>Información de los estudiantes</h2>
        <>
          <h4>Indicaciones:</h4> {/* Subtítulo agregado aquí */}
          <ul>
            <li>
              Si el estado del proceso de matrícula del estudiante es
              finalizado, la información del estudiante ya no podrá ser
              modificada por su responsable.
            </li>
            <li>
              Al presionar "Ver responsables", se brinda el listado de los
              responsables del estudiante.
            </li>
          </ul>
        </>
        <div className="parameters-form">
          <Form>
            {/*Primera fila*/}
            <Row>
              <Col md={6}>
                <Form.Group controlId="estudio2022">
                  <Form.Label>
                    Escuela o colegio en el que estudió en el año escolar
                    anterior:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_last_school}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="grado2023">
                  <Form.Label>
                    Grado que cursará en el colegio en el siguiente año escolar:
                  </Form.Label>
                  {grado.map((level) =>
                    level.idexternado_level ===
                    estudiante.externado_student_current_level_id ? (
                      <Form.Control
                        type="text"
                        defaultValue={level.externado_level}
                        readOnly
                      />
                    ) : null
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Label style={{ marginTop: "10px" }}>
              <u>
                <strong>
                  Apellidos y nombres de estudiante según partida de nacimiento
                </strong>
              </u>
            </Form.Label>
            {/* Segunda fila */}
            <Row>
              <Col md={6}>
                <Form.Group controlId="nombres">
                  <Form.Label>Nombres:</Form.Label>
                  <Form.Control
                    style={{ paddingBottom: "10px" }}
                    type="text"
                    defaultValue={estudiante.externado_student_firstname}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="apellidos">
                  <Form.Label
                    id="apellidos-label"
                    className="apellidos-label-class"
                  >
                    Apellidos:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_lastname}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Tercera fila */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="direccionResidencia">
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Dirección de residencia:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_address}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="municipio">
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Municipio:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_town}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="departamento">
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Departamento:
                  </Form.Label>
                  {departamento.map((depto) =>
                    depto.idexternado_departments ===
                    estudiante.externado_student_department_id ? (
                      <Form.Control
                        type="text"
                        defaultValue={depto.externado_department}
                        readOnly
                      />
                    ) : null
                  )}
                </Form.Group>
              </Col>
            </Row>
            {/* Cuarta fila */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="direccionResidencia">
                  <Form.Label>Lugar de nacimiento:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_birthplace}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="municipio">
                  <Form.Label id="fechaNacimiento-label">
                    Fecha de nacimiento:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={fechaNacimiento}
                    disabled
                  >
                    {/* Opciones del select */}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="departamento">
                  <Form.Label id="nacionalidad-label">Nacionalidad:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_nationality}
                    disabled
                  >
                    {/* Opciones del select */}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* Quinta fila */}
            {/*Columna izquierda dividida en 2, columna derecha 1 completa*/}
            <Row className="mb-3">
              <Col md={6}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formSexo">
                      <Form.Label>Sexo:</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={
                          Number(estudiante.externado_student_gender) === 1
                            ? "Femenino"
                            : Number(estudiante.externado_student_gender) === 0
                            ? "Masculino"
                            : null
                        }
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formCelular">
                      <Form.Label id="numeroCelular-label">
                        Número de celular:
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        defaultValue={estudiante.externado_student_phone}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label id="correoElectronico-label">
                    Correo electrónico:
                  </Form.Label>
                  <Form.Control
                    type="email"
                    defaultValue={estudiante.externado_student_email}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Sexta fila */}

            <Row>
              <Col md={6}>
                <Form.Group controlId="estudio2022">
                  <Form.Label>
                    ¿El estudiante es cristiano católico?:
                  </Form.Label>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label="Sí"
                      name="esCatolico"
                      type="radio"
                      id={`inline-radio-1`}
                      value="Sí"
                      checked={
                        estudiante.externado_student_catholic === true
                          ? true
                          : false
                      }
                      disabled
                    />
                    <Form.Check
                      inline
                      label="No"
                      name="esCatolico"
                      type="radio"
                      id={`inline-radio-2`}
                      value="No"
                      checked={
                        estudiante.externado_student_catholic === false
                          ? true
                          : false
                      }
                      disabled
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="grado2023">
                  {/*Mostrando label*/}
                  {estudiante.externado_student_catholic === true ? (
                    <Form.Label hidden> </Form.Label>
                  ) : (
                    <Form.Label> Religión al no ser católico :</Form.Label>
                  )}

                  {/*Mostrando input*/}
                  {estudiante.externado_student_catholic === false &&
                  Number(estudiante.externado_student_non_catholic_church_id) >
                    0 &&
                  Number(estudiante.externado_student_non_catholic_church_id) <
                    9 ? (
                    religion.map((rel) =>
                      rel.idexternado_church ===
                      Number(
                        estudiante.externado_student_non_catholic_church_id
                      ) ? (
                        <Form.Control
                          type="text"
                          defaultValue={rel.externado_church_value}
                          readOnly
                        />
                      ) : null
                    )
                  ) : estudiante.externado_student_catholic === false &&
                    Number(
                      estudiante.externado_student_non_catholic_church_id
                    ) === 9 ? (
                    <Form.Control
                      type="text"
                      defaultValue={estudiante.externado_student_church_other}
                      readOnly
                    />
                  ) : estudiante.externado_student_catholic === true ? (
                    <Form.Control
                      hidden
                      type="text"
                      defaultValue={null}
                      readOnly
                    />
                  ) : (
                    <Form.Control type="text" defaultValue={null} readOnly />
                  )}
                </Form.Group>
              </Col>
            </Row>
            {/* Septima fila */}
            <Row>
              <Col md={6}>
                <Form.Group controlId="estudio2022">
                  <Form.Label>
                    ¿Alguno de sus hermanos estudia en el Externado?:
                  </Form.Label>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label="Sí"
                      name="hermanosExternado"
                      type="radio"
                      id={`inline-radio-1`}
                      value="Sí"
                      checked={
                        estudiante.externado_student_has_siblings === true
                          ? true
                          : false
                      }
                      disabled
                    />
                    <Form.Check
                      inline
                      label="No"
                      name="hermanosExternado"
                      type="radio"
                      id={`inline-radio-2`}
                      value="No"
                      checked={
                        estudiante.externado_student_has_siblings === false
                          ? true
                          : false
                      }
                      disabled
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {/*Mostrando label*/}
            {estudiante.externado_student_has_siblings === false ? (
              <Form.Label style={{ marginTop: "10px" }} hidden>
                {" "}
              </Form.Label>
            ) : (
              <Form.Label style={{ marginTop: "10px" }}>
                <u>
                  <strong>
                    Nombre de los/as hermanos/as y grado en que estudiarán en el
                    siguiente año escolar (en caso aplique):
                  </strong>
                </u>
              </Form.Label>
            )}
            {/* Octava fila */}

            <Row id="hermano1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Nombre completo del hermano/a 1:
                  </Form.Label>
                  <Form.Control type="text" defaultValue={name1} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Siguiente grado a cursar:
                  </Form.Label>

                  {grado.map((level) =>
                    level.idexternado_level === grade1 ? (
                      <Form.Control
                        type="text"
                        defaultValue={level.externado_level}
                        readOnly
                      />
                    ) : null
                  )}
                </Form.Group>
              </Col>
            </Row>
            {/* Novena fila */}
            <Row id="hermano2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Nombre completo del hermano/a 2:
                  </Form.Label>
                  <Form.Control type="text" defaultValue={name2} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Siguiente grado a cursar:
                  </Form.Label>
                  {grado.map((level) =>
                    level.idexternado_level === grade2 ? (
                      <Form.Control
                        type="text"
                        defaultValue={level.externado_level}
                        readOnly
                      />
                    ) : null
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Decima fila */}
            <Row id="hermano3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Nombre completo del hermano/a 3:
                  </Form.Label>
                  <Form.Control type="text" defaultValue={name3} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group c>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Siguiente grado a cursar:
                  </Form.Label>
                  {grado.map((level) =>
                    level.idexternado_level === grade3 ? (
                      <Form.Control
                        type="text"
                        defaultValue={level.externado_level}
                        readOnly
                      />
                    ) : null
                  )}
                </Form.Group>
              </Col>
            </Row>
            {/* Decima primera fila */}
            {/* Septima fila */}
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    ¿El estudiante vive con ambos padres?:
                  </Form.Label>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label="Sí"
                      type="radio"
                      id={`inline-radio-1`}
                      value="Sí"
                      checked={
                        estudiante.externado_student_lives_with_parents === true
                          ? true
                          : false
                      }
                      disabled
                    />
                    <Form.Check
                      inline
                      label="No"
                      type="radio"
                      id={`inline-radio-2`}
                      value="No"
                      checked={
                        estudiante.externado_student_lives_with_parents ===
                        false
                          ? true
                          : false
                      }
                      disabled
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {estudiante.externado_student_lives_with_parents === true ? (
              <Form.Label style={{ marginTop: "10px" }} hidden>
                {" "}
              </Form.Label>
            ) : (
              <Form.Label style={{ marginTop: "10px" }}>
                <u>
                  <strong>
                    Si la respuesta es no, ¿Con quién vive el alumno?:
                  </strong>
                </u>
              </Form.Label>
            )}
            {/* Decima segunda fila */}
            <Row>
              <Col md={6}>
                <Form.Group>
                  {estudiante.externado_student_lives_with_parents === true ? (
                    <Form.Label hidden> </Form.Label>
                  ) : (
                    <Form.Label>Nombre completo:</Form.Label>
                  )}

                  {estudiante.externado_student_lives_with_parents === true ? (
                    <Form.Control hidden></Form.Control>
                  ) : (
                    <Form.Control
                      style={{ paddingBottom: "10px" }}
                      type="text"
                      defaultValue={estudiante.externado_student_lives_with_who}
                      readOnly
                    />
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  {estudiante.externado_student_lives_with_parents === true ? (
                    <Form.Label hidden> </Form.Label>
                  ) : (
                    <Form.Label>
                      Parentesco que tiene con el estudiante:
                    </Form.Label>
                  )}
                  {estudiante.externado_student_lives_with_parents === true ? (
                    <Form.Control hidden></Form.Control>
                  ) : (
                    <Form.Control
                      style={{ paddingBottom: "10px" }}
                      type="text"
                      defaultValue={
                        estudiante.externado_student_lives_with_related
                      }
                      readOnly
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Label style={{ marginTop: "10px" }}>
              <u>
                <strong>
                  Contacto de emergencia (en caso no se pueda localizar a los
                  padres)
                </strong>
              </u>
            </Form.Label>
            {/* Decima tercera fila */}
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nombre de contacto de emergencia:</Form.Label>
                  <Form.Control
                    style={{ paddingBottom: "10px" }}
                    type="text"
                    defaultValue={estudiante.externado_student_emergency_name}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label id="apellidos-label">
                    Relación de contacto de emergencia con el estudiante:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={
                      estudiante.externado_student_emergency_relationship
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Decima cuarta fila */}
            <Row>
              <Col md={6}>
                <Form.Group controlId="direccion-emergencia">
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Dirección de contacto de emergencia:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={
                      estudiante.externado_student_emergency_address
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="telegfono-emergencia">
                  <Form.Label
                    style={{ paddingTop: "10px" }}
                    className="apellidos-label-class"
                  >
                    Número de teléfono de contacto de emergencia:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_emergency_phone}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Label style={{ marginTop: "10px" }}>
              <u>
                <strong>Responsable del estudiante en el colegio:</strong>
              </u>
            </Form.Label>
            {/* Decima quinta fila */}
            <Row>
              <Col md={6}>
                <Form.Group controlId="nombres">
                  <Form.Label>Responsable:</Form.Label>
                  {Number(estudiante.externado_student_resp_type_id) > 0 &&
                  Number(estudiante.externado_student_resp_type_id) < 5 ? (
                    responsableTipo.map((res) =>
                      res.idexternado_student_responsible_type ===
                      Number(estudiante.externado_student_resp_type_id) ? (
                        <Form.Control
                          type="text"
                          defaultValue={res.externado_student_responsible_type}
                          readOnly
                        />
                      ) : null
                    )
                  ) : (
                    <Form.Control type="text" defaultValue={""} readOnly />
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Label style={{ marginTop: "10px" }} id="labelResp">
              <u>
                <strong>
                  En caso de no ser ninguno de los padres el responsable:
                </strong>
              </u>
            </Form.Label>
            {/* Decima sexta fila */}
            <Row className="mb-3" id="nameDocRowID">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Nombre:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_rep_name}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Número de documento:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_rep_id}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Decima septima fila */}
            <Row className="mb-3" id="addressHWPhoneRowID">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Dirección de residencia:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_rep_address}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="municipio">
                  <Form.Label>Teléfono de casa:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_rep_homephone}
                    disabled
                  >
                    {/* Opciones del select */}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="departamento">
                  <Form.Label>Teléfono de trabajo:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_rep_work_phone}
                    disabled
                  >
                    {/* Opciones del select */}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* Decima octava fila */}
            <Row id="emailMobileRowID">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Correo electrónico:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_rep_email}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="telegfono-emergencia">
                  <Form.Label>Número de celular:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={estudiante.externado_student_rep_mobile_phone}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Décima novena fila */}
            <Row
              style={{
                marginTop: "30px",
                paddingTop: "10px",
                margin: "10px 0",
              }}
            >
              <Col
                md={6}
                style={{
                  marginTop: "30px",
                  paddingTop: "10px",
                  backgroundColor: "#e7f5ff",
                  border: "1px solid #bee3f8",
                  borderRadius: "5px",
                  margin: "10px 0",
                }}
              >
                <Form.Group>
                  <Form.Label
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1em",
                      color: "#000",
                    }}
                  >
                    ¿El proceso del estudiante está finalizado?:
                  </Form.Label>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      ref={processRef}
                      checked={
                        estudiante.externado_proccess_finished === true
                          ? true
                          : null
                      }
                      inline
                      label="Sí"
                      name="viveconAmbos"
                      type="radio"
                      id={`inline-radio-1`}
                      value="1"
                      // onChange={handleProcessStatus}
                    />
                    <Form.Check
                      ref={processRef}
                      checked={
                        estudiante.externado_proccess_finished === false
                          ? true
                          : null
                      }
                      inline
                      label="No"
                      name="viveconAmbos"
                      type="radio"
                      id={`inline-radio-2`}
                      value="0"
                      //onChange={handleProcessStatus}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Repetir Row y Col para otros campos */}
            <Row className="mb-3" style={{ paddingTop: "20px" }}>
              <Col md={6}>
                <Button
                  variant="custom"
                  className="btn-modal-cancelar"
                  onClick={handleCancelar}
                >
                  Cancelar
                </Button>
              </Col>
              <Col md={4}>
                <Button
                  variant="custom"
                  className="btn-modal-guardar"
                  onClick={handleVerRepresentantes}
                >
                  Ver responsables
                </Button>
              </Col>
              <Col md={2}>
                <Button
                  variant="custom"
                  className="btn-modal-guardar"
                  onClick={handleUpdateProcess}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Informacionestudiantes;
