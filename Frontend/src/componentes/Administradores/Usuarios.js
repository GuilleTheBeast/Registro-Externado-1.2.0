import React from "react";
import { useEffect, useState } from "react";
import { useAuth, fetchAllUsersSup, fetchAllUsersAdmin} from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../estilos/usuarios.css"; // Importa el archivo de estilos
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
import Swal from "sweetalert2"; // Importar Sweetalert2
import axios from "axios"; // Importar axios
//importar EncabezadoAdmin
import EncabezadoAdmin from "../layout/navbar/Encabezadoadmin";

const Usuarios = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showModalSuper, setShowEditModalSuper] = useState(false);
  const [showModalSuper2, setShowEditModalSuper2] = useState(false);
  const [banderaSuper, setBanderaSuper] = useState(false);
  const [banderaAdmin, setBanderaAdmin] = useState(false);
  const [rol, setRol] = useState(null);
  // Agregar nuevos estados para la información del usuario seleccionado y su ID
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { authToken } = useAuth();
  const [usuariosSuperTabla, setUsuarioSuperTabla] = useState([]);
  const navigate = useNavigate();
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserActive, setSelectedUserActive] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    id: null,
    email: "",
    userType: "",
    isActive: "",
    firstName: "",
    lastName: "",
    carnet: "",
  });
  const [searchTermUsuarios, setSearchTermUsuarios] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  // Calcula el número total de páginas

  // Obtiene los ítems de la página actual

  // Cambia la página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getUserInfo = async (userId, authToken) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/externado-users/getUserInfoSuper/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const userData = response.data[0]; // asumiendo que la respuesta es un array con un solo objeto
      //console.log("Datos del administrador:", userData);
      setSelectedUser({
        id: userData.idexternado_user,
        email: userData.externado_email,
        userType:
          userData.externado_user_type_id === 2 ? "Administrador" :
            userData.externado_user_type_id === 3 ? "Responsable" :
              "Asistente",
        isActive: userData.externado_active_user === 1 ? "Activo" : "Inactivo",
        firstName: userData.externado_admin_firstname || "",
        lastName: userData.externado_admin_lastname || "",
        carnet: userData.externado_carnet || "",
      });
    } catch (error) {
      // console.error("Error al obtener la información del usuario:", error);
      // Puedes mostrar un mensaje de error si es necesario
    }
  };

  const filteredUsuarios = usuariosSuperTabla?.filter((usuario) => {
    const emailMatch = usuario.externado_email
      .toLowerCase()
      .includes(searchTermUsuarios.toLowerCase());
    const tipoUsuarioMatch = (
      usuario.externado_user_type_id === 2 ? "Administrador" :
        usuario.externado_user_type_id === 3 ? "Responsable" :
          "Asistente"
    )
      .toLowerCase()
      .includes(searchTermUsuarios.toLowerCase());
    const estadoMatch = (usuario.externado_active_user ? "Activo" : "Inactivo")
      .toLowerCase()
      .includes(searchTermUsuarios.toLowerCase());

    return emailMatch || tipoUsuarioMatch || estadoMatch;
  });

  // Luego, recalcula el número total de páginas basado en los usuarios filtrados
  const pageCount = filteredUsuarios
    ? Math.ceil(filteredUsuarios.length / itemsPerPage)
    : 0;
  // Finalmente, selecciona los elementos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsFiltrados =
    filteredUsuarios && Array.isArray(filteredUsuarios)
      ? filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem)
      : [];
  // Estado y funciones para manejar la paginación (ejemplo con estado estático)
  const [active, setActive] = useState(1);
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => setActive(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    //console.log("Valor de authToken:", authToken);
    if (!authToken) {
      navigate("/caducado");
      return;
    }
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
        //console.log("Entraste al if de rol 2");
        // setEncabezado(<EncabezadoAdmin2 />);
      } else if (userRole === 4 || userRole === "4") {
        //console.log("Entraste al if de rol 4");
        navigate("/negado");
      } else if (userRole === 3 || userRole === "3") {
        //console.log("Entraste al if de rol 3");
        navigate("/negado");
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);

  // Obtener rol y datos según el rol del usuario
  useEffect(() => {
    const obtenerRolYDatos = async () => {
      if (!authToken || authToken === "null" || authToken === "") {
        //console.log("Token vacío, nulo o indefinido");
        navigate("/caducado");
        return;
      }

      try {
        const payloadBase64 = authToken.split(".")[1];
        if (!payloadBase64) {
          throw new Error("Token no válido");
        }
        const payloadDecoded = atob(payloadBase64);
        const payloadJson = JSON.parse(payloadDecoded);
        const userRole = parseInt(payloadJson.rol, 10);

        setRol(userRole); // Establece el rol en el estado para uso futuro

        if (userRole === 1) {
          // Obtener datos de superusuario
          const usuariosSuperData = await fetchAllUsersSup(authToken);
          setBanderaSuper(true);
          setUsuarioSuperTabla(usuariosSuperData);
        } else if (userRole === 2) {
          // Obtener datos de admin
          const usuariosAdminData = await fetchAllUsersAdmin(authToken);
          setUsuarioSuperTabla(usuariosAdminData);
          setBanderaAdmin(true);
        } else {
          navigate("/negado");
        }
      } catch (error) {
        //console.error("Error al procesar el token:", error);
        navigate("/caducado");
      }
    };

    obtenerRolYDatos();
  }, [authToken, navigate]);

  // Funciones para manejar clic en editar y cerrar modal
  const handleEditClick = (usuario) => {
    // Dependiendo del rol, abre el modal correspondiente
    if (rol === 1) {
      if (usuario.externado_user_type_id === 3) {
        setShowEditModalSuper2(true);
        getUserInfo(usuario.idexternado_user, authToken);
        //console.log("Entraste al if de rol 1 y tipo 3");
      } else if (usuario.externado_user_type_id === 2) {
        // Asumiendo que aquí pones los datos del usuario seleccionado en algún estado
        setShowEditModalSuper(true);
        getUserInfo(usuario.idexternado_user, authToken);
        //console.log("Entraste al if de rol 1 y tipo 2");
      } else if (usuario.externado_user_type_id === 4) {
        // Asumiendo que aquí pones los datos del usuario seleccionado en algún estado
        setShowEditModalSuper2(true);
        getUserInfo(usuario.idexternado_user, authToken);
        //console.log("Entraste al if de rol 1 y tipo 4");
      }
    } else if (rol === 2) {
      // Guardar el ID del usuario seleccionado
      setSelectedUserId(usuario.idexternado_user);
      setSelectedUserEmail(usuario.externado_email);
      setSelectedUserActive(usuario.externado_active_user);
      setSelectedUserType(
        usuario.externado_user_type_id === 2 ? "Administrador" :
          usuario.externado_user_type_id === 3 ? "Responsable" :
            "Asistente"
      );
      // Asumiendo que aquí pones los datos del usuario seleccionado en algún estado
      setShowEditModal(true);
      //console.log("Abriste el modal del rol 2");
    }
  };
  // Suponiendo que tienes una función para hacer la llamada a la API
  const updateStatus = async (authToken, userId, isActive) => {
    // Pregunta si realmente quiere guardar los cambios
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres guardar los cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/externado-admins/editStatusResponsible",
          {
            idexternado_user: userId,
            externado_active_user: isActive,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Manejar la respuesta, por ejemplo cerrar el modal y actualizar la tabla
        handleCloseEditModal();
        // Refrescar datos de la tabla aquí o mostrar un mensaje de éxito
        await cargarDatosUsuarios(); // Recargar los datos después de la actualización

        Swal.fire(
          "¡Éxito!",
          "El estado del usuario ha sido actualizado.",
          "success"
        );
      } catch (error) {
        // Manejar errores aquí
        //console.error("Error al actualizar el estado:", error);
        Swal.fire(
          "Error",
          "No se pudo actualizar el estado del usuario.",
          "error"
        );
      }
    } else {
      // El usuario canceló la operación
      Swal.fire("Cancelado", "Los cambios no fueron guardados", "error");
    }
  };

  let item = false;
  const handleSaveChanges = () => {
    updateStatus(authToken, selectedUserId, selectedUserActive);
  };

  const handleCloseEditModal = () => {
    setShowEditModalSuper(false);
    setShowEditModal(false);
    setShowEditModalSuper2(false);
  };

  const cargarDatosUsuarios = async () => {
    if (!authToken) {
      navigate("/caducado");
      return;
    }

    try {
      let data;
      if (rol === 1) {
        data = await fetchAllUsersSup(authToken);
      } else if (rol === 2) {
        data = await fetchAllUsersAdmin(authToken);
      }
      setUsuarioSuperTabla(data);
    } catch (error) {
      // Comprobar si el error es debido a un token vencido o un problema de autorización
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/caducado");
      } else if (!error.response) {
        navigate("/caducado");
      } else {
        //console.error("Error al cargar los datos:", error);
        // Aquí puedes manejar otros tipos de errores si lo necesitas
      }
    }
  };

  const handleEditarAdministrador = async () => {
    // Pregunta si realmente quiere guardar los cambios
    if (
      !/^[A-Za-z ]*$/.test(selectedUser.firstName) ||
      !/^[A-Za-z ]*$/.test(selectedUser.lastName)
    ) {
      Swal.fire(
        "Error",
        "Nombres y apellidos solo debe contener letras y espacios",
        "error"
      );
      return;
    }
    //testear que solo sean numeros en el carnet
    if (!/^[0-9]*$/.test(selectedUser.carnet)) {
      Swal.fire("Error", "El carnet solo debe contener números", "error");
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres guardar los cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const adminData = {
        externado_user_id: selectedUser.id,
        externado_admin_firstname: selectedUser.firstName,
        externado_admin_lastname: selectedUser.lastName,
        externado_carnet: selectedUser.carnet,
        externado_admin_active: selectedUser.isActive === "Activo",
        externado_user_type_id:
          selectedUser.userType === "Administrador" ? 2 :
            selectedUser.userType === "Asistente" ? 4 : 3,
      };

      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/externado-admins/createEditAdmin",
          adminData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Manejar la respuesta aquí si es necesario
        //console.log(response.data);

        // Cerrar el modal y recargar los datos
        handleCloseEditModal();
        // Aquí deberías llamar a la función que recarga los datos de la tabla
        // por ejemplo: cargarDatosUsuarios();

        Swal.fire(
          "¡Éxito!",
          "El usuario ha sido actualizado correctamente.",
          "success"
        );
        cargarDatosUsuarios();
      } catch (error) {
        //console.error("Error al actualizar el administrador:", error);
        Swal.fire(
          "Error",
          "No se pudo actualizar la información del administrador.",
          "error"
        );
      }
    } else {
      // El usuario canceló la operación
      Swal.fire("Cancelado", "Los cambios no fueron guardados", "error");
    }
  };
  const handleEditarResponsable = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres guardar los cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const adminData = {
        externado_user_id: selectedUser.id,
        externado_admin_firstname: selectedUser.firstName || "",
        externado_admin_lastname: selectedUser.lastName || "",
        externado_carnet: selectedUser.carnet || "",
        externado_admin_active: selectedUser.isActive === "Activo",
        externado_user_type_id:
          selectedUser.userType === "Administrador" ? 2 :
            selectedUser.userType === "Asistente" ? 4 : 3,
      };

      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/externado-admins/createEditAdmin",
          adminData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Manejar la respuesta aquí si es necesario
        //console.log(response.data);

        // Cerrar el modal y recargar los datos
        handleCloseEditModal();
        // Aquí deberías llamar a la función que recarga los datos de la tabla
        // por ejemplo: cargarDatosUsuarios();

        Swal.fire(
          "¡Éxito!",
          "El usuario ha sido actualizado correctamente.",
          "success"
        );
        cargarDatosUsuarios();
      } catch (error) {
        //console.error("Error al actualizar el administrador:", error);
        Swal.fire(
          "Error",
          "No se pudo actualizar la información del responsable.",
          "error"
        );
      }
    } else {
      // El usuario canceló la operación
      Swal.fire("Cancelado", "Los cambios no fueron guardados", "error");
    }
  };

  const handleEditarAsistente = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres guardar los cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const adminData = {
        externado_user_id: selectedUser.id,
        externado_admin_firstname: selectedUser.firstName || "",
        externado_admin_lastname: selectedUser.lastName || "",
        externado_carnet: selectedUser.carnet || "",
        externado_admin_active: selectedUser.isActive === "Activo",
        externado_user_type_id:
          selectedUser.userType === "Administrador" ? 2 :
            selectedUser.userType === "Asistente" ? 4 : 3,
      };

      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/externado-admins/createEditAdmin",
          adminData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Manejar la respuesta aquí si es necesario
        //console.log(response.data);

        // Cerrar el modal y recargar los datos
        handleCloseEditModal();
        // Aquí deberías llamar a la función que recarga los datos de la tabla
        // por ejemplo: cargarDatosUsuarios();

        Swal.fire(
          "¡Éxito!",
          "El usuario ha sido actualizado correctamente.",
          "success"
        );
        cargarDatosUsuarios();
      } catch (error) {
        //console.error("Error al actualizar el administrador:", error);
        Swal.fire(
          "Error",
          "No se pudo actualizar la información del asistente.",
          "error"
        );
      }
    } else {
      // El usuario canceló la operación
      Swal.fire("Cancelado", "Los cambios no fueron guardados", "error");
    }
  };


  useEffect(() => {
    cargarDatosUsuarios(); // Llamada inicial para cargar los datos
  }, [authToken, rol]); // Dependencias del useEffect

  return (
    <>
      <EncabezadoAdmin />
      <div className="system-parameters-container">
        <h2>Usuarios del sistema</h2>

        <>
          <h4>Indicaciones:</h4> {/* Subtítulo agregado aquí */}
          <ul>
            <li>
              El buscador funciona para filtrar por correo electrónico, tipo de
              usuario o el estado de usuario
            </li>
            {banderaSuper && (
              <li>
                Al presionar editar, se brinda la opción de modificar los
                nombres del usuario, apellidos, carnet de trabajo, tipo de
                usuario y estado del usuario seleccionado
              </li>
            )}
            {banderaAdmin && (
              <li>
                Al presionar editar, se brinda la opción de modificar el estado
                del usuario seleccionado
              </li>
            )}
            <li>
              Si se desactiva un usuario, este ya no podrá ingresar al sistema
              hasta que vuelva a ser activado
            </li>
          </ul>
        </>
        <div className="parameters-form">
          <Form className="mb-3">
            <Form.Group
              controlId="searchUsuarios"
              className="position-relative search-group"
            >
              <Form.Control
                type="text"
                placeholder="Buscar"
                className="search-input-user"
                value={searchTermUsuarios}
                onChange={(e) => setSearchTermUsuarios(e.target.value)}
              />
              <i className="bi bi-search icon-search-user"></i>
            </Form.Group>
          </Form>
          <div>
            {" "}
            {/* Ajusta la altura según necesites */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Correo electrónico</th>
                  <th>Tipo de usuario</th>
                  <th>Estado</th>
                  <th className="acciones-column">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItemsFiltrados.map((usuario, index) => (
                  <tr key={index}>
                    <td>{usuario.externado_email}</td>
                    <td>
                      {usuario.externado_user_type_id === 2 ? "Administrador" :
                        usuario.externado_user_type_id === 3 ? "Responsable" :
                          "Asistente"}
                    </td>
                    <td>
                      {usuario.externado_active_user ? "Activo" : "Inactivo"}
                    </td>
                    <td
                      className="acciones-column"
                      style={{ textAlign: "center" }}
                    >
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleEditClick(usuario)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {[...Array(pageCount).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => setCurrentPage(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pageCount}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(pageCount)}
                disabled={currentPage === pageCount}
              />
            </Pagination>
          </div>
        </div>
      </div>
      {/* Modal para editar usuario */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                readOnly // Quitar readOnly si quieres permitir editar
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={selectedUserActive ? "Activo" : "Inactivo"}
                onChange={(e) =>
                  setSelectedUserActive(e.target.value === "Activo")
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de usuario</Form.Label>
              <Form.Select
                value={selectedUserType}
                disabled
                onChange={(e) => setSelectedUserType(e.target.value)}
              >
                <option>Responsable</option>
                <option>Administrador</option>
                <option>Asistente</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="btn-modal-cancelar"
            onClick={handleCloseEditModal}
          >
            Cancelar
          </Button>
          <Button
            variant="custom"
            className="btn-modal-guardar"
            onClick={handleSaveChanges}
          >
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar usuario super con todos los datos editables */}
      <Modal show={showModalSuper} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombres"
                    value={selectedUser.firstName}
                    maxLength={60}
                    pattern="[A-Za-z ]+"
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        firstName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apellidos"
                    maxLength={60}
                    pattern="[A-Za-z ]+"
                    value={selectedUser.lastName}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        lastName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email@address.com"
                    disabled
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Carnet de trabajo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Carnet de trabajo"
                    maxLength={45}
                    pattern="\d*"
                    value={selectedUser.carnet}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        carnet: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={selectedUser.isActive}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        isActive: e.target.value,
                      })
                    }
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de usuario</Form.Label>
                  <Form.Select
                    value={selectedUser.userType}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        userType: e.target.value,
                      })
                    }
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Responsable">Responsable</option>
                    <option value="Asistente">Asistente</option>
                    {/* Agregar más opciones según sea necesario */}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="btn-modal-cancelar"
            onClick={handleCloseEditModal}
            style={{ marginBottom: "10px" }}
          >
            Cancelar
          </Button>
          <Button
            variant="custom"
            className="btn-modal-guardar"
            onClick={handleEditarAdministrador}
            style={{ marginBottom: "10px" }}
          >
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar usuario super con campos disabled */}
      <Modal show={showModalSuper2} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombres"
                    disabled
                    value={selectedUser.firstName}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        firstName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apellidos"
                    disabled
                    value={selectedUser.lastName}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        lastName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email@address.com"
                    disabled
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Carnet de trabajo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Carnet de trabajo"
                    disabled
                    value={selectedUser.carnet}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        carnet: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={selectedUser.isActive}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        isActive: e.target.value,
                      })
                    }
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de usuario</Form.Label>
                  <Form.Select
                    value={selectedUser.userType}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        userType: e.target.value,
                      })
                    }
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Responsable">Responsable</option>
                    <option value="Asistente">Asistente</option>
                    {/* Agregar más opciones según sea necesario */}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="btn-modal-cancelar"
            onClick={handleCloseEditModal}
            style={{ marginBottom: "10px" }}
          >
            Cancelar
          </Button>
          <Button
            variant="custom"
            className="btn-modal-guardar"
            onClick={handleEditarResponsable}
            style={{ marginBottom: "10px" }}
          >
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Usuarios;
