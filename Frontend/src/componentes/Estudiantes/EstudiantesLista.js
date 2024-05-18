import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Form, Button, Col, Row, Container, Table } from "react-bootstrap";
import editar from "../imagenes/icons/boligrafo.png";
import eliminar from "../imagenes/icons/eliminar.png";
import "bootstrap-datepicker";
import { useNavigate } from "react-router-dom";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "../estilos/tabla.css";
import "../estilos/botones.css";
import "../estilos/estudianteslista.css";
import "../estilos/fondo.css";
import Swal from "sweetalert2";
import Footer from "../layout/footer/Footer";
import {
  useAuth,
  fetchEstudiantesPrev,
  deleteEstudianteById,
  editEstudianteById,
} from "../AuthContext";

//Crear un formulario 2 columnas para padres y representantes
function EstudiantesLista() {
  const [, setForceUpdate] = useState(false);
  const [componentKey, setComponentKey] = useState(0); // Agrega una clave de componente
  const [data, setData] = useState([]);
  const { authToken, setToken } = useAuth();
  const [estudiantesTabla, setEstudiantesTabla] = useState([]);
  const navigate = useNavigate();
  //console.log("Valor de setauthToken en EstudiantesLista:", setToken);

  const handleEditarEstudiante = (estudianteId, status) => () => {
    //console.log("Estudiante a editar:", estudianteId);
    if (status === true) {
      Swal.fire({
        title: "Proceso de matrícula finalizado",
        text: "El proceso de matrícula para este estudiante ya fue finalizado por parte de los administradores del sistema, volverá a estar disponible para modificación en el siguiente periodo de matrícula.",
        icon: "error",
        showCancelButton: false,

        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
      });
    } else {
      navigate(`/estudiantesUpdate/${estudianteId}`);
    }

    // //console.log("Estudiante a editar:", status);

    //navigate(`/estudiantesUpdate/${estudianteId}`);
  };

  const handleDeleteEstudiante = async (estudianteId) => {
    // Utilizar SweetAlert para mostrar un mensaje de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al estudiante. Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,

      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteEstudianteById(
          authToken,
          estudianteId
        );
        //console.log("Estudiante eliminado con éxito", deleteResult);

        // Actualizar la tabla de estudiantes después de la eliminación
        setEstudiantesTabla((prevEstudiantes) =>
          prevEstudiantes.filter((estudiante) => estudiante.id !== estudianteId)
        );

        // Mostrar un mensaje de éxito con SweetAlert
        // Mostrar un mensaje de éxito con SweetAlert
        await Swal.fire(
          "Eliminado",
          "El estudiante ha sido eliminado correctamente.",
          "success"
        );

        // Recargar la página después de que el usuario hace clic en "Aceptar"

        window.location.reload();
      } catch (error) {
        // Manejar el error según tus necesidades
        //console.error("Error al eliminar estudiante", error.message);
        // Mostrar un mensaje de error con SweetAlert
        Swal.fire("Error", "Hubo un error al eliminar el estudiante.", "error");
      }
    }
  };

  useEffect(() => {
    //("Valor de authToken:", authToken);

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
        //console.log("Entraste al if de rol 3");
      }else if (userRole === 4 || userRole === "4") {
        //console.log("Entraste al if de rol 4");
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
      //console.log("No se redirige, authToken tiene un valor.");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const estudiantesTablaData = await fetchEstudiantesPrev(authToken);
        //console.log("Datos de estudiantes tabla antes de la actualización:",estudiantesTablaData);
        setEstudiantesTabla(estudiantesTablaData);
        //console.log("Datos de estudiantes tabla después de la actualización:",estudiantesTablaData);
      } catch (error) {
        //console.error(error.message);
      }
    };
    //console.log("Token actual en Representantes Lista:", authToken);
    fetchData();
  }, [authToken]);

  // Renderiza la tabla solo si hay datos
  // Renderiza la tabla solo si hay datos en estudiantesTabla
  if (!estudiantesTabla || estudiantesTabla.length === 0) {
    return (
      <div className="site-container">
        <div className="main-container">
          <Container className="fondo" style={{ minHeight: "75vh" }}>
            <h4>Lista de estudiantes</h4>
            <div>
              <h5 style={{ marginTop: "20px" }}>Instrucciones:</h5>
              <ul>
                <li>
                  Para ingresar un estudiante, se debe de completar todos los
                  campos obligatorios marcados con un <span style={{ color: "red", fontWeight: "bold" }}>*</span> y presionar el botón de
                  Guardar al final del formulario
                </li>
                <li>
                  La generación de PDF será habilitada hasta que todos los
                  campos marcados con un <span style={{ color: "red", fontWeight: "bold" }}>*</span> en el formulario de estudiantes estén
                  llenos y haya al menos un responsable registrado. Al cumplir
                  con este requisito se habilitará el botón de Generar PDF
                  Matrícula y PDF Registro al entrar al registro de un
                  estudiante a través del botón Editar.
                </li>
                <li>
                  Si desea editar la información de un estudiante, hacer click
                  sobre el icono de Editar en el registro que se quiera
                  modificar. Para cambiar la información deberá presionar el
                  botón Guardar al final del formulario. Si los campos
                  obligatorios no están llenos y todavía no hay un responsable
                  registrado, no se podrán generar los PDF's.
                </li>
                <li>
                  Se ofrece la opción de eliminar un registro de estudiante. En
                  la tabla, ubicarse en la fila que contenga el estudiante a
                  eliminar y hacer clic en el icono de Eliminar, se pedirá
                  confirmación si realmente desea eliminar el registro, caso
                  contrario, puede presionar el botón de Cancelar.
                </li>
              </ul>
            </div>
            <p style={{ fontWeight: "400" }}>
              No hay estudiantes para mostrar. Presione el botón para comenzar
            </p>
            <div className="d-flex justify-content-center">
              <NavLink to="/estudiantes">
                <Button
                  variant="custom"
                  className="boton-guardar"
                  style={{ color: "#fff" }}
                >
                  Agregar estudiante
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
    <div className="site-container">
      <div className="main-container">
        <Container
          className="fondo"
          key={componentKey}
          style={{ minHeight: "72vh" }}
        >
          <h4>Lista de estudiantes</h4>
          <div>
            <h5 style={{ marginTop: "20px" }}>Instrucciones:</h5>
            <ul>
              <li>
                Para ingresar un estudiante, se debe de completar todos los
                campos obligatorios marcados con un <span style={{ color: "red", fontWeight: "bold" }}>*</span> y presionar el botón de
                Guardar al final del formulario
              </li>
              <li>
                La generación de PDF será habilitada hasta que todos los campos
                marcados con un <span style={{ color: "red", fontWeight: "bold" }}>*</span> en el formulario de estudiantes estén llenos y
                haya al menos un responsable registrado. Al cumplir con este
                requisito se habilitará el botón de Generar PDF Matrícula y PDF
                Registro al entrar al registro de un estudiante a través del
                botón Editar.
              </li>
              <li>
                Si desea editar la información de un estudiante, hacer click
                sobre el icono de Editar en el registro que se quiera modificar.
                Para cambiar la información deberá presionar el botón Guardar al
                final del formulario. Si los campos obligatorios no están llenos
                y todavía no hay un responsable registrado, no se podrán generar
                los PDF's.
              </li>
              <li>
                Se ofrece la opción de eliminar un registro de estudiante. En la
                tabla, ubicarse en la fila que contenga el estudiante a eliminar
                y hacer clic en el icono de Eliminar, se pedirá confirmación si
                realmente desea eliminar el registro, caso contrario, puede
                presionar el botón de Cancelar.
              </li>
            </ul>
          </div>

          <Table
            bordered
            hover
            className="custom-table"
            style={{ marginTop: "40px", width: "90%", margin: "0 auto" }}
          >
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th className="acciones-column-estudiantes-lista">Editar</th>
                <th className="acciones-column-estudiantes-lista">Eliminar</th>
              </tr>
            </thead>
            <tbody className="center-vertically">
              {estudiantesTabla.map((d, i) => (
                <tr key={i}>
                  <td>{d.externado_student_firstname}</td>
                  <td>{d.externado_student_lastname}</td>
                  <td
                    className="acciones-column-estudiantes-lista"
                    style={{ textAlign: "center" }}
                  >
                    <img
                      src={editar}
                      alt="Icono"
                      width="40px"
                      height="40px"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditarEstudiante(
                        d.idexternado_student,
                        d.externado_proccess_finished
                      )}
                    />
                  </td>
                  <td
                    className="acciones-column-estudiantes-lista"
                    style={{ textAlign: "center" }}
                  >
                    <img
                      src={eliminar}
                      alt="Icono Eliminar"
                      width="40px"
                      height="40px"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleDeleteEstudiante(d.idexternado_student)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <NavLink to="/estudiantes">
              <Button
                variant="custom"
                className="boton-guardar"
                style={{ color: "#fff", marginTop: "30px" }}
              >
                Agregar estudiante
              </Button>
            </NavLink>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default EstudiantesLista;
