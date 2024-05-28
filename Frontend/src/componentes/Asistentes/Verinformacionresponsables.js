import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";
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
//importar EncabezadoAssistant
import EncabezadoAssistant from "../layout/navbar/Encabezadoassistant";
import {
  fetchDepartamentos,
  fetchResponsableTipo,
  fetchResponsableInfo,
  fetchPuestostrabajo,
  fetchSalarios,
} from "../AuthContext";

const Verinformacionresponsables = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);
  const { id } = useParams();
  const [responsable, setResponsable] = useState("");
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [encabezado, setEncabezado] = useState(null);

  const [departamento, setDepartamento] = useState([]);
  const [pep, setPep] = useState([]);
  const [incoming, setIncoming] = useState([]);

  const [fechaN, setFechaN] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  useEffect(() => {
    //console.log("Valor de authToken:", authToken);

    if (
      authToken === null ||
      authToken === "" ||
      authToken === undefined ||
      authToken === "null"
    ) {
      // Muestra una alerta si el token está vacío, nulo o indefinido
      // console.log("Token vacío, nulo o indefinido");
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
        //console.log("Entraste al if de rol 2");
        //setEncabezado(<EncabezadoAdmin2 />);
      } else if (userRole === 3 || userRole === "3") {
        //console.log("Entraste al if de rol 3");
        navigate("/negado");
      } else if (userRole === 4 || userRole === "4") {
        //console.log("Entraste al if de rol 4");

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
    navigate(-1);
  };
  const handleShowRepresentantes = () => {
    navigate("/verlistarepresentantes");
  };

  //?Obteniendo departamentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const departamentosData = await fetchDepartamentos(authToken);
        //console.log("Datos de departamentos:", departamentosData);
        setDepartamento(departamentosData);
      } catch (error) {
        // console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  //?Obteniendo pep
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pepData = await fetchPuestostrabajo(authToken);
        //console.log("Datos de pep:", pepData);
        setPep(pepData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  //?Obteniendo incomings list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomingsData = await fetchSalarios(authToken);
        //console.log("Datos de incomings:", incomingsData);
        setIncoming(incomingsData);
      } catch (error) {
        // console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  //?Obteniendo información del responsable
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsableData = await fetchResponsableInfo(
          authToken,
          Number(id)
        );
        //console.log("Datos de responsable antes de la actualización:",id);
        setResponsable(responsableData);
        //console.log("Datos de responsable después de la actualización:",responsableData);
      } catch (error) {
        // console.error(error.message);
      }
    };
    //console.log("Token actual en Representantes Lista:", authToken);
    fetchData();
  }, [authToken, id]);

  //? Fecha de nacimiento
  useEffect(() => {
    const newDate = responsable.externado_birthdate;
    setFechaN(String(newDate));
    if (fechaN !== "null") {
      var arr = fechaN.split("T");
      var arr1 = arr[0];

      setFechaNacimiento(arr1);
    } else {
      setFechaNacimiento("");
    }
  }, [responsable.externado_birthdate, fechaN, fechaNacimiento]);

  return (
    <>
      <EncabezadoAssistant />
      <div className="system-parameters-container">
        <h2>Información general de los padres de familia o apoderado</h2>
        <div className="parameters-form">
          <Form>
            {/*Primera fila*/}
            <Row>
              <Col md={6}>
                <Form.Group controlId="estudio2022">
                  <Form.Label>Parentesco con el/la alumno/a:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={
                      responsable.externado_responsible_relationship
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Label style={{ marginTop: "10px" }}>
              <u>
                <strong>
                  Nombres y apellidos del padre según documento de
                  identificación
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
                    defaultValue={responsable.externado_firstname}
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
                    defaultValue={responsable.externado_lastname}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Tercera fila */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="direccionResidencia" style={{ marginTop: '10px' }}>
                  <Form.Label>Correo electrónico:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={responsable.externado_email}
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
                    defaultValue={responsable.externado_town}
                    disabled
                  >
                    {/* Opciones del select */}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="departamento">
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Departamento:
                  </Form.Label>
                  {departamento.map((depto) =>
                    depto.idexternado_departments ===
                      responsable.externado_department_id ? (
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

            {/* Quinta fila */}
            {/*Columna izquierda dividida en 2, columna derecha 1 completa*/}
            <Row className="mb-3">
              <Col md={6}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formtipodocumento">
                      <Form.Label>Teléfono de trabajo:</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={responsable.externado_work_phone}
                        readOnly
                      />
                    </Form.Group>

                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="formnumerodocumento">
                      <Form.Label id="numeroDocumento-label">
                        Número de celular:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={responsable.externado_mobile_phone}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Repetir Row y Col para otros campos */}
            <Row
              className="mb-3"
              style={{ paddingTop: "20px", marginTop: "50px" }}
            >
              <Col md={6}>
                <Button
                  variant="custom"
                  className="btn-modal-cancelar"
                  onClick={handleCancelar}
                >
                  Cancelar
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Verinformacionresponsables;
