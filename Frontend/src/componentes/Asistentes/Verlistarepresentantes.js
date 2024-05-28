import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import ojo from "../imagenes/icons/ojo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import "../estilos/estudiantes.css"; // Importa el archivo de estilos
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
import { fetchEstudiantes } from "../AuthContext";

const Verlistarepresentantes = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);
  const [showEditModal, setShowEditModal] = useState(false);

  // Estado y funciones para manejar la paginación (ejemplo con estado estático)
  const [encabezado, setEncabezado] = useState(null);
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [responsable, setResponsable] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  const handleShowClick = (responsableId) => () => {
    navigate(`/verinforesponsables/${responsableId}`);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

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

  const handleCancelar = () => {
    navigate(-1);
  };

  useEffect(() => {
    axios
      .post(
        `http://localhost:3001/api/v1/externado-admins/responsiblesByStudent`,
        {
          externado_user_id: Number(id),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        var user = res.data;
        setResponsable(user);
      });
  }, []);

  //? Obteniendo ESTUDIANTES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const estudiantesData = await fetchEstudiantes(authToken);
        //console.log("Datos de estudiantes antes de la actualización:",estudiantesData);
        setEstudiantes(estudiantesData);
        //console.log("Datos de estudiantes después de la actualización:",estudiantesData);
      } catch (error) {
        //console.error(error.message);
      }
    };
    //console.log("Token actual en Representantes Lista:", authToken);
    fetchData();
  }, [authToken]);

  return (
    <>
      <EncabezadoAssistant />
      <div className="system-parameters-container">
        <h2>Lista de responsables</h2>
        <>
          <h4>Indicaciones:</h4> {/* Subtítulo agregado aquí */}
          <ul>
            <li>
              Al presionar el ícono del <strong>ojo</strong>, se brinda la información del
              responsable.
            </li>
          </ul>
        </>
        <div className="parameters-form">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>DUI / PASAPORTE</th>
                <th>Nombre</th>
                <th>PARENTESCO</th>
                <th className="acciones-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {responsable.map((d, index) => (
                <tr key={index}>
                  <td>{d.externado_id}</td>
                  <td>{d.externado_firstname}</td>
                  <td>{d.externado_responsible_relationship}</td>
                  <td
                    className="acciones-column"
                    style={{ textAlign: "center" }}
                  >
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={handleShowClick(d.idexternado_responsible)}
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
          <Row className="mb-3" style={{ paddingTop: "0px" }}>
            <Col md={6}>
              <Button
                variant="custom"
                className="btn-modal-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
            </Col>
            <Col md={4}></Col>
            <Col md={2}></Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Verlistarepresentantes;
