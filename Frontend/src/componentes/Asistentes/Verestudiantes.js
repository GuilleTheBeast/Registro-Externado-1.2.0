import React from "react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import ojo from "../imagenes/icons/ojo.png";
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
//importar EncabezadoAssistant
import EncabezadoAssistant from "../layout/navbar/Encabezadoassistant";
import {
  fetchEstudiantes,
  fetchUsuarios,
  fetchGrado,
  fetchUsuariosAdmin,
  fetchAssistant,
} from "../AuthContext";
import { isUndefined } from "util";

const Verusuarios = ({ setShowNavbar }) => {
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
  const [currentPage, setCurrentPage] = useState({
    currentPage: 1,
    perPage: 10,
    totalPages: 1,
  });


  const handleShowClick = (estudianteId) => () => {
    navigate(`/verinfoestudiantes/${estudianteId}`);
  };
 
  const handleShowCloseEditModal = () => {
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
      } else if (userRole === 4 || userRole === "4") {
        const fetchData = async () => {
          try {
            const usuariosTablaData = await fetchAssistant(authToken);
            //console.log("Datos de usuarios tabla antes de la actualización:",usuariosTablaData);
            setUsuariosTabla(usuariosTablaData);
            //console.log("Datos de estudiantes tabla después de la actualización:",usuariosTablaData);
          } catch (error) {
            //console.error(error.message);
          }
        };
        //console.log("Token actual en Representantes Lista:", authToken);
        fetchData();
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);
  const handleCancelar = () => { 
    navigate("/verinfoestudiantes");
  };

  //? Obteniendo ESTUDIANTES
  useEffect(() => {
    const fetchData = async () => {
      let pagination = {
        page: currentPage.currentPage,
        limit: currentPage.perPage,
        paginated: true
      };

      try {
        const estudiantesTablaData = await fetchEstudiantes(authToken, pagination, searchTermEstudiantes);
        setEstudiantesTabla(estudiantesTablaData.data);
        setCurrentPage({
          currentPage: estudiantesTablaData.currentPage,
          perPage: estudiantesTablaData.perPage,
          totalPages: estudiantesTablaData.totalPages,
        });
      } catch (error) {
        console.error(error.message);
      }
    };
    //console.log("Token actual en Representantes Lista:", authToken);
    fetchData();
  }, [authToken, currentPage.currentPage, currentPage.perPage, searchTermEstudiantes]);

  //? Obteniendo GRADOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradosTablaData = await fetchGrado(authToken);
        setGradosTabla(gradosTablaData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [authToken]);



  return (
    <>
      <EncabezadoAssistant />
      <div className="system-parameters-container">
        <h2>Lista de Estudiantes</h2>
        <>
          <h4>Indicaciones:</h4> {/* Subtítulo agregado aquí */}
          <ul>
            <li>
              El buscador funciona para filtrar por nombre, apellido, grado
              actual o correo electrónico del responsable.
            </li>

            <li>
              Al presionar <b>mostrar</b>, se visualiza toda la información del estudiante.
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
                <th className="show-column">Mostar</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de datos de usuarios */}

              {estudiantesTabla && estudiantesTabla.map((d, index) => (
                <tr key={index}>
                  <td>{d.externado_student_firstname}</td>
                  <td>{d.externado_student_lastname}</td>
                  <td>
                    {gradosTabla && gradosTabla.map((g, i) =>
                      d.externado_student_current_level_id ===
                        g.idexternado_level
                        ? g.externado_level
                        : null
                    )}
                  </td>

                  <td>
                    {usuariosTabla && usuariosTabla.map((u, i) =>
                      d.externado_user_id === u.idexternado_user
                        ? u.externado_email
                        : null
                    )}
                  </td>
                  <td
                    className="show-column"
                    style={{ textAlign: "center" }}
                  >
                    <Button
                    ssrc={ojo}
                      variant="link"
                      className="p-0"
                      onClick={handleShowClick(d.idexternado_student)}
                    >
                      <i><img
                      src={ojo}
                      alt="Icono Mostrar"
                      width="20px"
                      height="20px"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleShowClick(d.idexternado_student)
                      }
                    /></i>
                    </Button>
                  </td>

                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage({ ...currentPage, currentPage: 1 })}
              disabled={currentPage.currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage({ ...currentPage, currentPage: currentPage.currentPage - 1 })}
              disabled={currentPage.currentPage === 1}
            />

            {[...Array(currentPage.totalPages).keys()].map((number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage.currentPage}
                onClick={() => setCurrentPage({ ...currentPage, currentPage: number + 1 })}
              >
                {number + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => setCurrentPage({ ...currentPage, currentPage: currentPage.currentPage + 1 })}
              disabled={currentPage.currentPage === currentPage.totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage({ ...currentPage, currentPage: currentPage.totalPages })}
              disabled={currentPage.currentPage === currentPage.totalPages}
            />
          </Pagination>
        </div>
      </div>
        {/* Modal para editar usuario */}
      <Modal show={showEditModal} onHide={handleShowCloseEditModal}>
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
            onClick={handleShowCloseEditModal}
          >
            Cancelar
          </Button>
          <Button
            variant="custom"
            className="btn-modal-guardar"
            onClick={handleShowCloseEditModal}
          >
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Verusuarios;
