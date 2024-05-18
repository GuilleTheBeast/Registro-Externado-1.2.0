import React from "react";
import { useEffect, useState } from "react";
import { useAuth, fetchActualPeriod, fetchHistorico } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../estilos/sistemaadmin.css"; // Importa el archivo de estilos
import { Modal, Button, Table, Form, Pagination } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importar los estilos de los iconos
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons"; // Importa los íconos de Bootstrap
import Swal from "sweetalert2";
//importar EncabezadoAdmin
import EncabezadoAdmin from "../layout/navbar/Encabezadoadmin";
import axios from "axios";

const Sistemaadmin = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showHistorico, setShowHistorico] = useState(false);
  const [datosHistorico, setDatosHistorico] = useState([]);
  const [validacionFallida, setValidacionFallida] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  // Aquí es donde debes calcular los filteredItems
  const filteredItems = datosHistorico?.filter(
    (item) =>
      item.externado_range_period
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.externado_generic_pass
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  const pageCount = Math.ceil(datosHistorico?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [contrasenia, setContrasenia] = useState(""); // Suponiendo que manejas el estado de la contraseña
  const [periodoActual, setPeriodoActual] = useState({
    idexternado_admin_system: null,
    externado_generic_pass: "",
    externado_range_period: "",
    externado_active_period: false,
    externado_system_closed: false,
  });
  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  //obtener periodo actual

  const handleOpenModal = () => {
    setShowModal(true);
    setContrasenia(""); // Resetear la contraseña al abrir el modal
  };
  const handleCloseModal = () => setShowModal(false);
  const handleOpenHistorico = () => setShowHistorico(true);
  const handleCloseHistorico = () => setShowHistorico(false);

  const handleSave = async () => {
    const nombrePeriodo = document.getElementById("formNombrePeriodo").value;
    const contrasenia = document.getElementById("formContrasenia").value;
    // Restablecer el estado de validación fallida a false cada vez que se intenta guardar
    setValidacionFallida(false);
    //Validar que los campos no estén vacíos
    if (nombrePeriodo === "" || contrasenia === "") {
      Swal.fire(
        "Error",
        "Los campos no pueden estar vacíos. Por favor, verifica la información.",
        "error"
      );
      return;
    }
    // Validar formato del periodo
    const regexPeriodo = /^20\d{2}-20\d{2}$/;
    if (!regexPeriodo.test(nombrePeriodo)) {
      Swal.fire(
        "Error",
        "El formato del periodo no es válido (ej. 2023-2024).",
        "error"
      );
      return;
    }

    // Validar que el segundo año sea exactamente un año mayor que el primero
    const [inicio, fin] = nombrePeriodo.split("-").map(Number);
    if (fin !== inicio + 1) {
      Swal.fire(
        "Error",
        "El periodo debe ser de un año (ej. 2023-2024).",
        "error"
      );
      return;
    }
    // Validar formato de la contraseña
    const regexContrasenia = /^[A-Z0-9]{6,}$/;
    if (!regexContrasenia.test(contrasenia)) {
      Swal.fire(
        "Error",
        "La clave debe tener al menos 6 caracteres, incluyendo solo mayúsculas y números.",
        "error"
      );
      setValidacionFallida(true); // Activar la bandera de validación fallida
      //console.log("Validacion", validacionFallida);
      return;
    }

    const data = {
      externado_generic_pass: contrasenia,
      externado_range_period: nombrePeriodo,
    };

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas guardar los cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, guardar",
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/externado-admin-system/createSystemConf",
          data,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        //console.log(response.data);
        Swal.fire(
          "¡Éxito!",
          "El nuevo periodo ha sido agregado correctamente.",
          "success"
        ).then(() => {
          handleCloseModal();
          obtenerPeriodoActual(); // Llamada a la función para actualizar los datos
        });
        // Actualizar la información del periodo actual, por ejemplo, llamar a una función que haga esto.
      } catch (error) {
        // Manejar errores específicos del servidor
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          Swal.fire("Error", error.response.data.message, "error");
        } else {
          // Manejar otros errores
          //  console.error("Error al guardar el periodo:", error);
          Swal.fire(
            "Error",
            "No se pudo guardar la información del nuevo periodo.",
            "error"
          );
        }
      }
    } else {
      Swal.fire("Cancelado", "No se guardaron los cambios.", "error");
    }
  };

  const handleCancel = () => {
    // Lógica para cancelar los cambios
    //console.log("Cancelar cambios");
    handleCloseModal();
  };

  const { authToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // console.log("Valor de authToken:", authToken);

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
      // console.log("El rol es " + payloadJson.rol);
      if (userRole === 1 || userRole === "1") {
        //console.log("Entraste al if de rol 1");
      } else if (userRole === 3 || userRole === "3") {
        //console.log("Entraste al if de rol 3");
        navigate("/negado");
      } else if (userRole === 4 || userRole === "4") {
        //console.log("Entraste al if de rol 4");
        navigate("/negado");
      }else if (userRole === 2 || userRole === "2") {
        //console.log("Entraste al if de rol 2");
        navigate("/negado");
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);
  //Obtener periodo actual
  useEffect(() => {
    obtenerPeriodoActual();
  }, [authToken]); // Asegúrate de que fetchActualPeriod es una función que no cambia entre renders o inclúyela en el array de dependencias si es necesario.

  const obtenerPeriodoActual = async () => {
    try {
      const periodoActualData = await fetchActualPeriod(authToken);
      // console.log("Datos de periodo actual:", periodoActualData);
      setPeriodoActual(periodoActualData);
    } catch (error) {
      // console.error("Error al obtener el periodo actual:", error);
      // Aquí puedes decidir si quieres mostrar un error con Swal o no
    }
    //Buscador
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Vuelve a la primera página cuando se busca
  };

  const handleGuardarCambios = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas guardar los cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, guardar",
    });

    if (result.isConfirmed) {
      const estadoPeriodo =
        document.getElementById("period-status").value === "active";
      const estadoSistema =
        document.getElementById("system-status").value === "active";
      const data = {
        idexternado_admin_system: periodoActual.idexternado_admin_system,
        externado_active_period: estadoPeriodo,
        externado_system_closed: estadoSistema,
      };

      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/externado-admin-system/updateSystemConf",
          data,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPeriodoActual((prevState) => ({
          ...prevState,
          externado_active_period: estadoPeriodo,
          externado_system_closed: estadoSistema,
        }));

        //console.log(response.data);
        Swal.fire(
          "¡Éxito!",
          "La configuración del sistema ha sido actualizada.",
          "success"
        );
        obtenerPeriodoActual(); // Llamada a la función para actualizar los datos
      } catch (error) {
        //console.error("Error al actualizar la configuración:", error);
        Swal.fire(
          "Error",
          "No se pudo actualizar la configuración del sistema.",
          "error"
        );
      }
    }
  };

  //Obtener historico
  useEffect(() => {
    const fetchData = async () => {
      try {
        const historicoData = await fetchHistorico(authToken);
        //console.log("Datos de historico:", historicoData);
        setDatosHistorico(historicoData); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  return (
    <>
      <EncabezadoAdmin />
      <div className="system-parameters-container">
        <h2>Parámetros de sistema</h2>
        <h4>Indicaciones:</h4> {/* Subtítulo agregado aquí */}
        <ul>
          <li>
            Se puede activar y desactivar ya sea el estado del periodo o el
            estado del sistema seleccionando la opción que se desea y luego
            presionando Guardar cambios.
          </li>
          <li>
            Para agregar un nuevo periodo es necesario primero desactivar el
            estado del periodo.
          </li>
        </ul>
        <div className="parameters-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="current-period">Periodo actual:</label>
              <input
                type="text"
                id="current-period"
                value={periodoActual.externado_range_period}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="period-status">Estado periodo:</label>
              <select
                id="period-status"
                value={
                  periodoActual.externado_active_period ? "active" : "inactive"
                }
                onChange={(e) =>
                  setPeriodoActual((prevState) => ({
                    ...prevState,
                    externado_active_period: e.target.value === "active",
                  }))
                }
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="form-group button-group">
              <button className="add-period-btn" onClick={handleOpenModal}>
                Agregar nuevo periodo
              </button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="generic-password">Clave del periodo:</label>
              <input
                type="text"
                id="generic-password"
                value={periodoActual.externado_generic_pass}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="system-status">Estado sistema:</label>
              <select
                id="system-status"
                value={
                  periodoActual.externado_system_closed ? "active" : "inactive"
                }
                onChange={(e) =>
                  setPeriodoActual((prevState) => ({
                    ...prevState,
                    externado_system_closed: e.target.value === "active",
                  }))
                }
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="form-group button-group">
              <button className="history-btn" onClick={handleOpenHistorico}>
                Histórico de periodos
              </button>
            </div>
          </div>
        </div>
        <div className="form-row button-row">
          <div className="form-spacer"></div>
          <div className="form-spacer"></div>
          <button className="save-changes-btn" onClick={handleGuardarCambios}>
            Guardar cambios
          </button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nuevo periodo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombrePeriodo">
              <Form.Label>Nombre del periodo:</Form.Label>
              <Form.Control type="text" placeholder="Ej. 2024 - 2025" />
            </Form.Group>
            <Form.Group controlId="formContrasenia">
              <Form.Label style={{ paddingTop: "10px" }}>Clave:</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={mostrarContrasena ? "text" : "text"}
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                  placeholder="Clave"
                />
              </div>
              <div
                className={`text-muted texto-indicaciones ${
                  validacionFallida ? "error" : ""
                }`}
              >
                <strong>
                  * La clave debe tener al menos 6 caracteres.
                  <br />
                  * Solo deben ser mayúsculas.
                  <br />
                  * Debe tener al menos un número.
                  <br />* No puede ser la misma de periodos pasados.
                </strong>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="btn-modal-cancelar"
            onClick={handleCloseModal}
            style={{ marginBottom: "10px" }}
          >
            Cancelar
          </Button>
          <Button
            variant="custom"
            className="btn-modal-guardar"
            onClick={handleSave}
            style={{ marginBottom: "10px" }}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showHistorico} onHide={handleCloseHistorico} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Histórico de periodos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="searchHistorico" className="position-relative">
            <Form.Control
              type="text"
              placeholder="Buscar"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <i className="bi bi-search icon-search"></i> {/* Ícono de lupa */}
          </Form.Group>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Clave del periodo</th>
              </tr>
            </thead>
            <tbody>
              {currentItems
                ?.filter((historico) => {
                  const searchTermLower = searchTerm.toLowerCase();
                  return (
                    historico.externado_range_period
                      .toLowerCase()
                      .includes(searchTermLower) ||
                    historico.externado_generic_pass
                      .toLowerCase()
                      .includes(searchTermLower)
                  );
                })
                .map((historico, index) => (
                  <tr key={index}>
                    <td>{historico.externado_range_period}</td>
                    <td>{historico.externado_generic_pass}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: pageCount }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === pageCount}
            />
            <Pagination.Last
              onClick={() => paginate(pageCount)}
              disabled={currentPage === pageCount}
            />
          </Pagination>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="btn-modal-guardar"
            onClick={handleCloseHistorico}
          >
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Sistemaadmin;
