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
      }else if (userRole === 4 || userRole === "4") {
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
                <Form.Group controlId="direccionResidencia">
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Dirección de residencia:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={responsable.externado_address}
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
            <Row className="mb-3">
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
                <Form.Group controlId="nacionalidad">
                  <Form.Label id="nacionalidad-label">Nacionalidad:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={responsable.externado_nationality}
                    disabled
                  >
                    {/* Opciones del select */}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="direccionResidencia">
                  <Form.Label>Correo electrónico:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={responsable.externado_email}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Quinta fila */}
            {/*Columna izquierda dividida en 2, columna derecha 1 completa*/}
            <Row className="mb-3">
              <Col md={6}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formtipodocumento">
                      <Form.Label>Tipo de documento:</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={
                          Number(responsable.externado_id_type) === 0
                            ? "DUI"
                            : Number(responsable.externado_id_type) === 1
                            ? "Pasaporte"
                            : ""
                        }
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formnumerodocumento">
                      <Form.Label id="numeroDocumento-label">
                        Número de documento:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={responsable.externado_id}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formtipodocumento">
                      <Form.Label>Número de NIT:</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={responsable.externado_nit}
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

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formtipodocumento">
                  <Form.Label>Profesión:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={responsable.externado_occupation}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formtipodocumento">
                  <Form.Label>Lugar de trabajo:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={responsable.externado_workplace}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formtipodocumento">
                  <Form.Label>Cargo que desempeña:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={responsable.externado_jobposition}
                    readOnly
                  />
                </Form.Group>
              </Col>

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
                </Row>
              </Col>
            </Row>

            {/* Sexta fila */}

            <Row>
              <Col md={6}>
                <Form.Group controlId="estudio2022">
                  <Form.Label>¿Es exalumno del Externado?:</Form.Label>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label="Sí"
                      type="radio"
                      id={`inline-radio-1`}
                      value="Sí"
                      checked={
                        responsable.externado_former_externado_student === true
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
                        responsable.externado_former_externado_student === false
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
                  <Form.Label>¿En qué universidad estudió?:</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={responsable.externado_university_studies}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="estudio2022">
                  <Form.Label style={{ marginTop: "10px" }}>
                    ¿Es usted actualmente una Persona Políticamente Expuesta
                    (PEP´s)?:
                  </Form.Label>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label="Sí"
                      type="radio"
                      id={`inline-radio-1`}
                      value="Sí"
                      checked={
                        responsable.externado_pep === true ? true : false
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
                        responsable.externado_pep === false ? true : false
                      }
                      disabled
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="grado2023">
                  {responsable.externado_pep === false ? (
                    <Form.Label hidden> </Form.Label>
                  ) : (
                    <Form.Label style={{ marginTop: "10px" }}>
                      Si usted es una Persona Políticamente Expuesta, por favor
                      seleccionar según corresponda:
                    </Form.Label>
                  )}

                  {responsable.externado_pep === false ? (
                    <Form.Control hidden></Form.Control>
                  ) : Number(responsable.externado_pep_occupation_id) > 0 &&
                    Number(responsable.externado_pep_occupation_id) < 11 ? (
                    pep.map((puesto) =>
                      puesto.idexternado_pep ===
                      Number(responsable.externado_pep_occupation_id) ? (
                        <Form.Control
                          type="text"
                          defaultValue={puesto.externado_pep_value}
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
            <Row>
              <Col></Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="pepOtherId">
                  {responsable.externado_pep === false ||
                  (Number(responsable.externado_pep_occupation_id) >= 0 &&
                    Number(responsable.externado_pep_occupation_id) < 10) ? (
                    <Form.Label hidden> </Form.Label>
                  ) : (
                    <Form.Label>
                      Si seleccionó otro, por favor especifique:
                    </Form.Label>
                  )}
                  {responsable.externado_pep === false ||
                  (Number(responsable.externado_pep_occupation_id) >= 0 &&
                    Number(responsable.externado_pep_occupation_id) < 10) ? (
                    <Form.Control hidden></Form.Control>
                  ) : Number(responsable.externado_pep_occupation_id) === 10 ? (
                    <Form.Control
                      type="text"
                      defaultValue={responsable.externado_pep_occupation_other}
                      readOnly
                    />
                  ) : (
                    <Form.Control type="text" defaultValue={""} readOnly />
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="estudio2022">
                  <Form.Label style={{ marginTop: "20px" }}>
                    ¿Ha sido usted una Persona Políticamente Expuesta (PEP´s)?
                    en los últimos 3 años?:
                  </Form.Label>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label="Sí"
                      type="radio"
                      id={`inline-radio-1`}
                      value="Sí"
                      checked={
                        responsable.externado_pep_3years === true ? true : false
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
                        responsable.externado_pep_3years === false
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
                  {responsable.externado_pep_3years === false ? (
                    <Form.Label hidden> </Form.Label>
                  ) : (
                    <Form.Label style={{ marginTop: "20px" }}>
                      Si usted es una Persona Políticamente Expuesta, por favor
                      seleccionar según corresponda:
                    </Form.Label>
                  )}

                  {responsable.externado_pep_3years === false ? (
                    <Form.Control hidden></Form.Control>
                  ) : Number(responsable.externado_pep_3years_occupation_id) >
                      0 &&
                    Number(responsable.externado_pep_3years_occupation_id) <
                      11 ? (
                    pep.map((puesto) =>
                      puesto.idexternado_pep ===
                      Number(responsable.externado_pep_3years_occupation_id) ? (
                        <Form.Control
                          type="text"
                          defaultValue={puesto.externado_pep_value}
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
            <Row>
              <Col></Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="pepOtherId">
                  {responsable.externado_pep_3years === false ||
                  (Number(responsable.externado_pep_3years_occupation_id) >=
                    0 &&
                    Number(responsable.externado_pep_3years_occupation_id) <
                      10) ? (
                    <Form.Label hidden> </Form.Label>
                  ) : (
                    <Form.Label>
                      Si seleccionó otro, por favor especifique:
                    </Form.Label>
                  )}
                  {responsable.externado_pep_3years === false ||
                  (Number(responsable.externado_pep_3years_occupation_id) >=
                    0 &&
                    Number(responsable.externado_pep_3years_occupation_id) <
                      10) ? (
                    <Form.Control hidden></Form.Control>
                  ) : Number(responsable.externado_pep_3years_occupation_id) ===
                    10 ? (
                    <Form.Control
                      style={{ marginBottom: "20px" }}
                      type="text"
                      defaultValue={
                        responsable.externado_pep_3years_occupation_other
                      }
                      readOnly
                    />
                  ) : (
                    <Form.Control type="text" defaultValue={""} readOnly />
                  )}
                </Form.Group>
              </Col>
            </Row>
            {/* Septima fila */}

            {/* Octava fila */}
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Rango promedio de sus ingresos mensuales familiares (acá
                    incluye su salario, recepción de remesas, pensiones,
                    ganancias de su negocio, etc.) Si su rango es superior a
                    $3,000 dólares mensuales, por favor especifique un monto
                    aproximado
                  </Form.Label>
                  {incoming.map((salario) =>
                    salario.idexternado_incomings ===
                    Number(responsable.externado_incomings_id) ? (
                      <Form.Control
                        type="text"
                        defaultValue={salario.externado_incomings_value}
                        readOnly
                      />
                    ) : null
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Decima quinta fila */}
            <Row>
              <Col md={6}>
                <Form.Group controlId="nombres">
                  {Number(responsable.externado_incomings_id) === 7 ? (
                    <Form.Label style={{ marginTop: "20px" }}>
                      Responsable:
                    </Form.Label>
                  ) : (
                    <Form.Label
                      hidden
                      style={{ marginTop: "20px" }}
                    ></Form.Label>
                  )}

                  {Number(responsable.externado_incomings_id) === 7 ? (
                    <Form.Control
                      style={{ paddingBottom: "10px" }}
                      type="text"
                      defaultValue={responsable.externado_incomings_other}
                      readOnly
                    />
                  ) : null}
                </Form.Group>
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
