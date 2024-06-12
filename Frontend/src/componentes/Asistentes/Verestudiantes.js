import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import ojo from "../imagenes/icons/ojo.png";
import axios from "axios";
import "../estilos/estudiantes.css"; // Importa el archivo de estilos
import { Modal, Button, Table, Form, Pagination } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importar los estilos de los iconos
//importar EncabezadoAssistant
import EncabezadoAssistant from "../layout/navbar/Encabezadoassistant";
import {
  fetchEstudiantes,
  fetchEstudiantesA,
  fetchUsuarios,
  fetchGrado,
  fetchUsuariosAdmin,
  fetchAssistant,
} from "../AuthContext";

const Verusuarios = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, [setShowNavbar]);

  const [searchType, setSearchType] = useState("name");
  const [showEditModal, setShowEditModal] = useState(false);
  const [estudiantesTabla, setEstudiantesTabla] = useState([]);
  const [usuariosTabla, setUsuariosTabla] = useState([]);
  const [gradosTabla, setGradosTabla] = useState([]);
  const [searchTermEstudiantes, setSearchTermEstudiantes] = useState("");
  const [searchTermEstudiantesA, setSearchTermEstudiantesA] = useState("");
  const [currentPage, setCurrentPage] = useState({
    currentPage: 1,
    perPage: 10,
    totalPages: 1,
  });
  const [selectedGrade, setSelectedGrade] = useState("");
  const handleGradeChange = (e) => {
    setSelectedGrade(e.target.value);
  };
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/caducado");
      return;
    }

    const fetchData = async () => {
      try {
        const payloadBase64 = authToken.split(".")[1];
        const payloadDecoded = atob(payloadBase64);
        const payloadJson = JSON.parse(payloadDecoded);
        const userRole = parseInt(payloadJson.rol, 10);

        let usuariosTablaData;
        if (userRole === 1) {
          usuariosTablaData = await fetchUsuarios(authToken);
        } else if (userRole === 2) {
          usuariosTablaData = await fetchUsuariosAdmin(authToken);
        } else if (userRole === 4) {
          usuariosTablaData = await fetchAssistant(authToken);
        } else {
          navigate("/negado");
          return;
        }

        setUsuariosTabla(usuariosTablaData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [authToken, navigate]);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  
  useEffect(() => {
    const fetchData = async () => {
      let pagination = {
        page: currentPage.currentPage,
        limit: currentPage.perPage,
        paginated: true,
      };

      try {
        const estudiantesTablaData = await fetchEstudiantes(
          authToken,
          pagination,
          searchTermEstudiantes,
          selectedGrade,
        );
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

    fetchData();
  }, [
    authToken,
    currentPage.currentPage,
    currentPage.perPage,
    selectedGrade,
  ]);


  useEffect(() => {
    const fetchData = async () => {
      let pagination = {
        page: currentPage.currentPage,
        limit: currentPage.perPage,
        paginated: true,
      };

      try {
        const estudiantesTablaData = await fetchEstudiantes(
          authToken,
          pagination,
          searchTermEstudiantes,
        );
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

    fetchData();
  }, [
    authToken,
    currentPage.currentPage,
    currentPage.perPage,
    searchTermEstudiantes,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      let pagination = {
        page: currentPage.currentPage,
        limit: currentPage.perPage,
        paginated: true,
      };

      try {
        const estudiantesTablaData = await fetchEstudiantesA(
          authToken,
          pagination,
          searchTermEstudiantesA
        );
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

    fetchData();
  }, [
    authToken,
    currentPage.currentPage,
    currentPage.perPage,
    searchTermEstudiantesA,
  ]);

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

  useEffect(() => {
    setSearchTermEstudiantes("");
    setSearchTermEstudiantesA("");
    setSelectedGrade("");
    setCurrentPage({ ...currentPage, currentPage: 1 });
    // Se actualiza la lista de estudiantes cuando cambia el tipo de búsqueda
    const fetchData = async () => {
      let pagination = {
        page: 1,
        limit: currentPage.perPage,
        paginated: true,
      };

      try {
        const estudiantesTablaData = searchType === 'name' 
          ? await fetchEstudiantes(authToken, pagination, "") 
          : searchType === 'surname'
          ? await fetchEstudiantesA(authToken, pagination, "")
          : await fetchEstudiantes(authToken, pagination, "", selectedGrade);
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

    fetchData();
  }, [searchType, authToken]);

  return (
    <>
      <EncabezadoAssistant />
      <div className="system-parameters-container">
        <h2>Lista de Estudiantes</h2>
        <h4>Indicaciones:</h4>
        <ul>
          <li>
            El buscador funciona para filtrar por nombre, apellido, grado actual
            o correo electrónico del responsable.
          </li>
          <li>
            Al presionar <b>mostrar</b>, se visualiza toda la información del
            estudiante.
          </li>
        </ul>
        <div className="parameters-form">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>
              <input
                type="radio"
                value="name"
                checked={searchType === "name"}
                onChange={handleSearchTypeChange}
                style={{ marginRight: "5px" }}
              />
              Buscar por <b>nombre</b>
            </label>
            <label>
              <input
                type="radio"
                value="surname"
                checked={searchType === "surname"}
                onChange={handleSearchTypeChange}
                style={{ marginRight: "5px" }}
              />
              Buscar por <b>apellido</b>
            </label>
            <label>
              <input
                type="radio"
                value="grade"
                checked={searchType === "grade"}
                onChange={handleSearchTypeChange}
                style={{ marginRight: "5px" }}
              />
              Buscar por <b>grado</b>
            </label>
          </div>

          {searchType === "name" && (
            <Form className="mb-3" onKeyDown={handleKeyDown}>
              <Form.Group
                controlId="searchEstudiantes"
                className="position-relative search-group"
              >
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre"
                  className="search-input-user"
                  value={searchTermEstudiantes}
                  onChange={(e) => setSearchTermEstudiantes(e.target.value)}
                />
                <i className="bi bi-search icon-search-user"></i>
              </Form.Group>
            </Form>
          )}

          {searchType === "surname" && (
            <Form className="mb-3" onKeyDown={handleKeyDown}>
              <Form.Group
                controlId="searchEstudiantes"
                className="position-relative search-group"
              >
                <Form.Control
                  type="text"
                  placeholder="Buscar por apellido"
                  className="search-input-user"
                  value={searchTermEstudiantesA}
                  onChange={(e) => setSearchTermEstudiantesA(e.target.value)}
                />
                <i className="bi bi-search icon-search-user"></i>
              </Form.Group>
            </Form>
          )}

          {searchType === "grade" && (
            <Form.Group controlId="gradeSelect" className="mb-3">
              <Form.Control
                as="select"
                value={selectedGrade}
                onChange={handleGradeChange}
                className="grade-dropdown"
              >
                <option value="">Seleccione un grado</option>
                {gradosTabla.map((g, i) => (
                  <option key={i} value={g.idexternado_level}>
                    {g.externado_level}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre estudiante</th>
                <th>Apellido estudiante</th>
                <th>Grado actual</th>
                <th>Correo responsable</th>
                <th className="show-column">Mostrar</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesTabla.map((d, index) => (
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
                  <td className="show-column" style={{ textAlign: "center" }}>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() =>
                        navigate(`/verinfoestudiantes/${d.idexternado_student}`)
                      }
                    >
                      <i>
                        <img
                          src={ojo}
                          alt="Icono Mostrar"
                          width="20px"
                          height="20px"
                          style={{ cursor: "pointer" }}
                        />
                      </i>
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
              onClick={() =>
                setCurrentPage({
                  ...currentPage,
                  currentPage: currentPage.currentPage - 1,
                })
              }
              disabled={currentPage.currentPage === 1}
            />

            {[...Array(currentPage.totalPages).keys()].map((number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage.currentPage}
                onClick={() =>
                  setCurrentPage({ ...currentPage, currentPage: number + 1 })
                }
              >
                {number + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() =>
                setCurrentPage({
                  ...currentPage,
                  currentPage: currentPage.currentPage + 1,
                })
              }
              disabled={currentPage.currentPage === currentPage.totalPages}
            />
            <Pagination.Last
              onClick={() =>
                setCurrentPage({
                  ...currentPage,
                  currentPage: currentPage.totalPages,
                })
              }
              disabled={currentPage.currentPage === currentPage.totalPages}
            />
          </Pagination>
        </div>
      </div>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
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
            onClick={() => setShowEditModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="custom"
            className="btn-modal-guardar"
            onClick={() => setShowEditModal(false)}
          >
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Verusuarios;