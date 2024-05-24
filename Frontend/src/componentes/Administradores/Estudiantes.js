import React from "react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactDOM from "react-dom";
import "../estilos/estudiantes.css"; // Importa el archivo de estilos
import {
  Modal,
  Button,
  Table,
  Form,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importar los estilos de los iconos
//importar EncabezadoAdmin
import EncabezadoAdmin from "../layout/navbar/Encabezadoadmin";
import EncabezadoAdmin2 from "../layout/navbar/Encabezadoadmin2";
import {
  fetchEstudiantes,
  fetchUsuarios,
  fetchGrado,
  fetchUsuariosAdmin,
} from "../AuthContext";
import { isUndefined } from "util";

const Usuarios = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [estudiantesTabla, setEstudiantesTabla] = useState([]);
  const [usuariosTabla, setUsuariosTabla] = useState([]);
  const [gradosTabla, setGradosTabla] = useState([]);
  const [searchTermEstudiantes, setSearchTermEstudiantes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (estudianteId) => () => {
    navigate(`/infoestudiantes/${estudianteId}`);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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
        const fetchData = async () => {
          try {
            const usuariosTablaData = await fetchUsuarios(authToken);
            //console.log("Datos de usuarios tabla antes de la actualización:",usuariosTablaData);
            setUsuariosTabla(usuariosTablaData);
            //console.log("Datos de estudiantes tabla después de la actualización:", usuariosTablaData);
          } catch (error) {
            // console.error(error.message);
          }
        };
        //console.log("Token actual en Representantes Lista:", authToken);
        fetchData();
        //setEncabezado(<EncabezadoAdmin />);
      } else if (userRole === 2 || userRole === "2") {
        //console.log("Entraste al if de rol 2");

        //? Obteniendo USUARIOS

        const fetchData = async () => {
          try {
            const usuariosTablaData = await fetchUsuariosAdmin(authToken);
            //console.log("Datos de usuarios tabla antes de la actualización:",usuariosTablaData);
            setUsuariosTabla(usuariosTablaData);
            //console.log("Datos de estudiantes tabla después de la actualización:",usuariosTablaData);
          } catch (error) {
            //console.error(error.message);
          }
        };
        //console.log("Token actual en Representantes Lista:", authToken);
        fetchData();

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
  const handleCancelar = () => {
    navigate("/infoestudiantes");
  };

  //? Obteniendo ESTUDIANTES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const estudiantesTablaData = await fetchEstudiantes(authToken);
        //console.log("Datos de estudiantes tabla antes de la actualización:",estudiantesTablaData);
        setEstudiantesTabla(estudiantesTablaData);
        //console.log("Datos de estudiantes tabla después de la actualización:",estudiantesTablaData);
      } catch (error) {
        console.error(error.message);
      }
    };
    //console.log("Token actual en Representantes Lista:", authToken);
    fetchData();
  }, [authToken]);

  //? Obteniendo GRADOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradosTablaData = await fetchGrado(authToken);
        //console.log("Datos de grados tabla antes de la actualización:",gradosTablaData);
        setGradosTabla(gradosTablaData);
        //console.log("Datos de  grados tabla después de la actualización:",gradosTablaData);
      } catch (error) {
        console.error(error.message);
      }
    };
    //console.log("Token actual en Representantes Lista:", authToken);
    fetchData();
  }, [authToken]);

  //? Barra de búsqueda

  

  const filteredEstudiantes = estudiantesTabla?.filter((estudiante) => {
    const nombreMatch = estudiante.externado_student_firstname
      .toLowerCase()
      .includes(searchTermEstudiantes.toLowerCase());
    const apellidoMatch = estudiante.externado_student_lastname
      .toLowerCase()
      .includes(searchTermEstudiantes.toLowerCase());

    const emailMatch = usuariosTabla.map((item) =>
      item.idexternado_user === estudiante.externado_user_id
        ? item.externado_email
        : null
    );

    const gradosMatch = gradosTabla.map((item) =>
      item.idexternado_level === estudiante.externado_student_current_level_id
        ? item.externado_level
        : null
    );

    for (let i = 0; i <= emailMatch.length; i++) {
      if (emailMatch[i] !== null) {
        const email = emailMatch[i];

        for (let i = 0; i <= gradosMatch.length; i++) {
          if (gradosMatch[i] !== null) {
            if (gradosMatch[i] === undefined) {
              const grado = "";
              return (
                nombreMatch ||
                apellidoMatch ||
                email
                  .toLowerCase()
                  .includes(searchTermEstudiantes.toLowerCase()) ||
                grado
                  .toLowerCase()
                  .includes(searchTermEstudiantes.toLowerCase())
              );
            }
            const grado = gradosMatch[i];
            return (
              nombreMatch ||
              apellidoMatch ||
              email
                .toLowerCase()
                .includes(searchTermEstudiantes.toLowerCase()) ||
              grado.toLowerCase().includes(searchTermEstudiantes.toLowerCase())
            );
          }
        }
      }
    }
  });

  // Luego, recalcula el número total de páginas basado en los usuarios filtrados
  const pageCount = filteredEstudiantes
    ? Math.ceil(filteredEstudiantes.length / itemsPerPage)
    : 0;
  // Finalmente, selecciona los elementos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsFiltrados =
    filteredEstudiantes && Array.isArray(filteredEstudiantes)
      ? filteredEstudiantes.slice(indexOfFirstItem, indexOfLastItem)
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

  return (
    <>
      <EncabezadoAdmin />
      <div className="system-parameters-container">
        <h2>Información de los estudiantes</h2>
        <>
          <h4>Indicaciones:</h4> {/* Subtítulo agregado aquí */}
          <ul>
            <li>
              El buscador funciona para filtrar por nombre, apellido, grado
              actual o correo electrónico del responsable.
            </li>

            <li>
              Al presionar editar, se brinda la información del estudiante con
              la opción de modificar el estado de su proceso de matrícula.
            </li>
          </ul>
        </>
        <div className="parameters-form">
          <Form className="mb-3">
            <Form.Group
              controlId="searchEstudiantes"
              className="position-relative search-group"
            >
              <Form.Control
                type="text"
                placeholder="Buscar"
                className="search-input-user"
                value={searchTermEstudiantes}
                onChange={(e) => setSearchTermEstudiantes(e.target.value)}
              />
              <i className="bi bi-search icon-search-user"></i>
            </Form.Group>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre estudiante</th>
                <th>Apellido estudiante</th>
                <th>Grado actual </th>
                <th>Correo responsable</th>
                <th className="acciones-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de datos de usuarios */}

              {currentItemsFiltrados.map((d, index) => (
                <tr key={index}>
                  <td>{d.externado_student_firstname}</td>
                  <td>{d.externado_student_lastname}</td>
                  <td>
                    {gradosTabla.map((g, i) =>
                      d.externado_student_current_level_id ===
                      g.idexternado_level
                        ? g.externado_level
                        : null
                    )}
                  </td>

                  <td>
                    {usuariosTabla.map((u, i) =>
                      d.externado_user_id === u.idexternado_user
                        ? u.externado_email
                        : null
                    )}
                  </td>

                  <td
                    className="acciones-column"
                    style={{ textAlign: "center" }}
                  >
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={handleEditClick(d.idexternado_student)}
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
                placeholder="email@address.com"
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select>
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de usuario</Form.Label>
              <Form.Select>
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
            onClick={handleCloseEditModal}
          >
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Usuarios;
