import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../estilos/botones.css";
import { Form, Button, Col, Row, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import editar from "../imagenes/icons/boligrafo.png";
import eliminar from "../imagenes/icons/eliminar.png";
import "bootstrap-datepicker";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "../estilos/fondo.css";
import "../estilos/representatneslista.css";
import Swal from "sweetalert2";
import Footer from "../layout/footer/Footer";
import {
  useAuth,
  fetchResponsablesPrev,
  deleteResponsableById,
} from "../AuthContext";
//Crear un formulario 2 columnas para padres y representantes
function RepresentantesLista() {
  const [data, setData] = useState([]);
  const { authToken } = useAuth();
  const [responsablesTabla, setResponsablesTabla] = useState([]);
  const navigate = useNavigate();

  const handleAgregarResponsable = () => {
    //console.log("Cantidad de responsables:", responsablesTabla.length);
    if (responsablesTabla.length > 2) {
      Swal.fire({
        icon: "info",
        title: "Ya tienes el máximo de responsables agregados",
        text: "Elimina uno para agregar uno nuevo",
      });
    } else {
      //navegar a responsable
      navigate("/representantes");
    }
  };

  const handleDeleteResponsable = async (responsableId) => {
    // Utilizar SweetAlert para mostrar un mensaje de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al responsable. Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,

      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteResponsableById(
          authToken,
          responsableId
        );
        //console.log("Responsable eliminado con éxito", deleteResult);
        setResponsablesTabla((prevResponsables) =>
          prevResponsables.filter(
            (responsable) => responsable.id !== responsableId
          )
        );
        await Swal.fire(
          "Eliminado",
          "El responsable ha sido eliminado correctamente.",
          "success"
        );

        // Recargar la página después de que el usuario hace clic en "Aceptar"

        window.location.reload();
      } catch (error) {
        // Manejar el error según tus necesidades
        //console.error("Error al eliminar responsable", error.message);
        // Mostrar un mensaje de error con SweetAlert
        Swal.fire(
          "Error",
          "Hubo un error al eliminar el responsable.",
          "error"
        );
      }
    }
  };

  const handleEditarResponsable = (responsableId) => () => {
    //console.log("Responsable a editar:", responsableId);
    //alert("Responsabla a editar: " + responsableId);
    navigate(`/representantesUpdate/${responsableId}`);
  };

  /*const handleUpdateResponsable = async (responsableId) => {

      try {
        const dataResult = await fetchResponsableById(
          authToken,
          responsableId
        );
        
        //console.log("éxito data: ", dataResult);

        //abre nueva página y envía los datos del elemento seleccionado
        navigate("/responsableUpdate", {
          state: {
            dataResult,
          },
        });
      

        //window.location.reload();
      } catch (error) {
        // Manejar el error según tus necesidades
        //console.error("Error al editar responsable", error.message);
        // Mostrar un mensaje de error con SweetAlert
        Swal.fire(
          "Error",
          "Hubo un error al editar el responsable.",
          "error"
        );
      }
    
  };
*/

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
        navigate("/negado");
        return;
      } else if (userRole === 3 || userRole === "3") {
        //console.log("Entraste al if de rol 3 de representantes");
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsablesTablaData = await fetchResponsablesPrev(authToken);
        //console.log("Datos de responsables tabla:", responsablesTablaData);
        setResponsablesTabla(responsablesTablaData);
      } catch (error) {
        //console.error(error.message);
      }
    }; 
    //console.log("Token actual en Representantes Lista:", authToken);
    fetchData();
  }, [authToken]);

  // Renderiza la tabla solo si hay datos en estudiantesTabla
  if (!responsablesTabla || responsablesTabla.length === 0) {
    return (
      <div className="site-container">
        <div className="main-container">
          <Container className="fondo" style={{ minHeight: "72vh" }}>
            <h4>Lista de responsables</h4>
            <div>
              <h5 style={{ marginTop: "20px" }}>Instrucciones:</h5>
              <ul>
                <li>
                  Para ingresar un responsable, se deben de completar todos los
                  campos obligatorios marcados con un <span style={{ color: "red", fontWeight: "bold" }}>*</span> y presionar el botón de
                  Guardar al final del formulario
                </li>
                <li>
                  Si desea editar la información de un responsable, hacer clic
                  sobre el icono de Editar en el registro que se quiera
                  modificar. Para cambiar la información deberá tener los campos
                  obligatorios llenos y presionar el botón Guardar al final del
                  formulario
                </li>
                <li>
                  Se ofrece la opción de eliminar un registro de responsable. En
                  la tabla, ubicarse en la fila que contenga el responsable a
                  eliminar y hacer click en el icono de Eliminar, se pedirá
                  confirmación si realmente desea eliminar el registro, caso
                  contrario, puede presionar el botón de Cancelar.
                </li>
              </ul>
            </div>
            <p style={{ fontWeight: "400" }}>
              No hay responsables para mostrar. Presione el botón para comenzar.
            </p>
            <div className="d-flex justify-content-center">
              <NavLink to="/representantes">
                <Button
                  variant="custom"
                  className="boton-guardar"
                  style={{ color: "#fff" }}
                >
                  Agregar Responsable
                </Button>
              </NavLink>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="main-container">
      <Container className="fondo" style={{ minHeight: "72vh" }}>
        <h4>Lista de representantes</h4>
        <div>
          <h5 style={{ marginTop: "20px" }}>Instrucciones:</h5>
          <ul>
            <li>
              Para ingresar un responsable, se deben de completar todos los
              campos obligatorios marcados con un <span style={{ color: "red", fontWeight: "bold" }}>*</span> y presionar el botón de
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
        </div>
        <Table
          bordered
          hover
          className="custom-table"
          style={{ marginTop: "40px" }}
        >
          <thead>
            <tr>
              <th>DUI/PASAPORTE</th>
              <th>Apellido</th>
              <th>Relación con estudiante</th>
              <th className="acciones-column">Editar</th>
              <th className="acciones-column">Eliminar</th>
            </tr>
          </thead>
          <tbody className="center-vertically">
            {responsablesTabla.map((d, i) =>
              d.externado_responsible_type_id === 1 ? (
                <tr key={i}>
                  <td>{d.externado_id}</td>
                  <td>{d.externado_lastname}</td>
                  <td>Mamá</td>

                  <td
                    style={{ textAlign: "center" }}
                    className="acciones-column"
                  >
                    <img
                      src={editar}
                      alt="Icono"
                      width="40px"
                      height="40px"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditarResponsable(
                        d.idexternado_responsible
                      )}
                    />
                  </td>
                  <td
                    style={{ textAlign: "center" }}
                    className="acciones-column"
                  >
                    <img
                      src={eliminar}
                      alt="Icono Eliminar"
                      width="40px"
                      height="40px"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleDeleteResponsable(d.idexternado_responsible)
                      }
                    />
                  </td>
                </tr>
              ) : d.externado_responsible_type_id === 2 ? (
                <tr key={i}>
                  <td>{d.externado_id}</td>
                  <td>{d.externado_lastname}</td>
                  <td>Papá</td>

                  <td style={{ textAlign: "center" }}>
                    <img
                      src={editar}
                      alt="Icono"
                      width="40px"
                      height="40px"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditarResponsable(
                        d.idexternado_responsible
                      )}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <img
                      src={eliminar}
                      alt="Icono Eliminar"
                      width="40px"
                      height="40px"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleDeleteResponsable(d.idexternado_responsible)
                      }
                    />
                  </td>
                </tr>
              ) : d.externado_responsible_type_id === 3 ? (
                <tr key={i}>
                  <td>{d.externado_id}</td>
                  <td>{d.externado_lastname}</td>
                  <td>Tutor legal</td>

                  <td style={{ textAlign: "center" }}>
                    <img
                      src={editar}
                      alt="Icono"
                      width="40px"
                      height="40px"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditarResponsable(
                        d.idexternado_responsible
                      )}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <img
                      src={eliminar}
                      alt="Icono Eliminar"
                      width="40px"
                      height="40px"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleDeleteResponsable(d.idexternado_responsible)
                      }
                    />
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center">
          <Button
            variant="custom"
            className="boton-guardar"
            onClick={handleAgregarResponsable}
            style={{ color: "#fff" }}
          >
            Agregar responsable
          </Button>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default RepresentantesLista;
