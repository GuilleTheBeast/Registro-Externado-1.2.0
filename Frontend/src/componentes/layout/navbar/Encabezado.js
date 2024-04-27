import { Container, Navbar, Nav, Modal } from "react-bootstrap";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../AuthContext";
import Swal from "sweetalert2";
import "./nav.css";

const Encabezado = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const handleLogout = () => {
    // Muestra una alerta de cerrar sesión exitoso con SweetAlert
    Swal.fire({
      icon: "success",
      title: "Cierre de sesión exitoso",
      text: "¡Hasta luego!",
      showConfirmButton: false,
      timer: 2000, // Cierra automáticamente después de 2 segundos
    });
    // Limpia el token almacenado al cerrar sesión
    setToken(null);

    // Muestra la alerta
    //alert("token eliminado: " + authToken);

    // Redirige a la página de inicio después de 1 segundo (puedes ajustar el tiempo según tus necesidades)
    setTimeout(() => {
      navigate("/inicio");
    }, 1000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Navbar variant="dark" expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>Externado de San José</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/estudianteslista" className="opc-izq">
                1. Estudiantes
              </NavLink>
              <NavLink to="/representanteslista" className="opc-izq">
                2. Responsables
              </NavLink>
              <NavLink
                style={{ fontWeight: "100", transition: "font-weight 0.3s" }}
                className="opc-izq"
                onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
                onMouseLeave={(e) => (e.target.style.fontWeight = "100")}
                onClick={() => setShowModal(true)}
              >
                Indicaciones
              </NavLink>
            </Nav>
            <Nav className="ml-auto">
              <div className="cerrar-sesion-container">
                <NavLink className="blanco" to="/inicio" onClick={handleLogout}>
                  Cerrar sesión
                </NavLink>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal de Indicaciones */}
      <Modal show={showModal} onHide={handleCloseModal}
       size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Indicaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Contenido del modal */}
          <p>
            Primeramente debe de navegar en el menu de acuerdo al número de
            etiqueta, estudiantes y luego responsables
          </p>
          <p>Estudiantes:</p>
          <ul>
            <li>
              Para ingresar un estudiante, se deben de completar todos los
              campos obligatorios marcados con un * y presionar el botón de
              Guardar al final del formulario
            </li>
            <li>
              La generación de PDF será habilitada hasta que todos los campos
              marcados con un * en el formulario de estudiantes estén llenos y
              haya al menos un responsable registrado. Al cumplir con este
              requisito se habilitará el botón de Generar PDF Matrícula y PDF
              Registro al entrar al registro de un estudiante a través del botón
              Editar.
            </li>
            <li>
              Si desea editar la información de un estudiante, hacer click sobre
              el icono de Editar en el registro que se quiera modificar. Para
              cambiar la información deberá presionar el botón Guardar al final
              del formulario. Si los campos obligatorios no están llenos y
              todavía no hay un responsable registrado, no se podrán generar los
              PDF's.
            </li>
            <li>
              Se ofrece la opción de eliminar un registro de estudiante. En la
              tabla, ubicarse en la fila que contenga el estudiante a eliminar y
              hacer clic en el icono de Eliminar, se pedirá confirmación si
              realmente desea eliminar el registro, caso contrario, puede
              presionar el botón de Cancelar.
            </li>
          </ul>
          <p>Responsables:</p>
          <ul>
            <li>
              Para ingresar un responsable, se deben de completar todos los
              campos obligatorios marcados con un * y presionar el botón de
              Guardar al final del formulario
            </li>
            <li>
              Si desea editar la información de un responsable, hacer clic sobre
              el icono de Editar en el registro que se quiera modificar. Para
              cambiar la información deberá tener los campos obligatorios llenos
              y presionar el botón Guardar al final del formulario
            </li>
            <li>
              Se ofrece la opción de eliminar un registro de responsable. En la
              tabla, ubicarse en la fila que contenga el responsable a eliminar
              y hacer click en el icono de Eliminar, se pedirá confirmación si
              realmente desea eliminar el registro, caso contrario, puede
              presionar el botón de Cancelar.
            </li>
          </ul>
          {/* ... (añade el resto de las instrucciones) */}
        </Modal.Body>
        <Modal.Footer>
          <Link onClick={handleCloseModal} className="button-modal">
            Cerrar
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Encabezado;
