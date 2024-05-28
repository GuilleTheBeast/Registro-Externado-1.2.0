import { Navigate } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Inicio from "./componentes/inicio/Inicio";
import "bootstrap/dist/css/bootstrap.min.css";
import Registro from "./componentes/registro/Registro";
import Representantes from "./componentes/Representantes/RepresentantesForm";
import React from "react";
import Layout from "./componentes/layout/Layout";
import Encabezado from "./componentes/layout/navbar/Encabezado";
import Admin from "./componentes/Administradores/Admin";
import Usuarios from "./componentes/Administradores/Usuarios";
import Cambiar from "./componentes/inicio/CambiarcontraPrimera";
import Recuperar from "./componentes/inicio/Recuperarcontra";
import Contra from "./componentes/inicio/Cambiarcontra";
import Listarepresentantesadmin from "./componentes/Administradores/Listarepresentantes";
import Caducado from "./componentes/inicio/Caducado";
import Error from "./componentes/inicio/Error";
import Informacionestudiantes from "./componentes/Administradores/Informacionestudiantes";
import Informacionresponsables from "./componentes/Administradores/Informacionresponsables";
import Negado from "./componentes/validacion/Usuarionegado";
import Estudiantessistema from "./componentes/Administradores/Estudiantes";
import Estudiantes from "./componentes/Estudiantes/EstudiantesForm";
import Sistemaadmin from "./componentes/Administradores/Sistema";
import RepresentantesLista from "./componentes/Representantes/RepresentantesLista";
import RepresentantesUpdate from "./componentes/Representantes/RepresentantesUpdate";
import EstudiantesUpdate from "./componentes/Estudiantes/EstudiantesUpdate";
import EstudiantesLista from "./componentes/Estudiantes/EstudiantesLista";
import Verificacion from "./componentes/inicio/Cuentaverificada";
import { AuthProvider } from "./componentes/AuthContext";
import Listarepresentantes from "./componentes/Administradores/Listarepresentantes";
import ExportModule from "./componentes/Administradores/reportes"
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Students from "./componentes/Asistentes/Verestudiantes";
import Infostudents from "./componentes/Asistentes/Verinformacionestudiantes";
import Listresponsible from "./componentes/Asistentes/Verlistarepresentantes";
import Inforesponsible from "./componentes/Asistentes/Verinformacionresponsables";

function App() {
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <AuthProvider>
      <div>
        {/* Renderizar Encabezado solo si showNavbar es verdadero */}
        {showNavbar && <Encabezado />}

        <Routes>
          <Route path="/" element={<Inicio setShowNavbar={setShowNavbar} />} />
          <Route
            path="/login"
            element={<Inicio setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/inicio"
            element={<Inicio setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/registro"
            element={<Registro setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/recuperar"
            element={<Recuperar setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/representantes"
            element={<Representantes setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/representantes/:id"
            element={<Representantes setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/estudiantes"
            element={<Estudiantes setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/estudiantes/:id"
            element={<Estudiantes setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/representanteslista"
            element={<RepresentantesLista setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/estudianteslista"
            element={<EstudiantesLista setShowNavbar={setShowNavbar} />}
          />

          <Route
            path="/verificarCuenta"
            element={<Verificacion setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/cambiar"
            element={<Cambiar setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/contra"
            element={<Contra setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/caducado"
            element={<Caducado setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/admin"
            element={<Admin setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/usuarios"
            element={<Usuarios setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/sistema" 
            element={<Sistemaadmin setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/consultarinfo"
            element={<Students setShowNavbar={setShowNavbar} />}
          />
            <Route
            path="/reportes"
            element={<ExportModule setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/verinfoestudiantes/:id"
            element={<Infostudents setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/verlistarepresentantes"
            element={<Listresponsible setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/verlistarepresentantes/:id"
            element={<Listresponsible setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/verinforesponsables/:id"
            element={<Inforesponsible setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/listarepresentantes"
            element={<Listarepresentantesadmin setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/estudiantessistema"
            element={<Estudiantessistema setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/inforesponsables/:id"
            element={<Informacionresponsables setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/negado"
            element={<Negado setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/representantesUpdate/:id"
            element={<RepresentantesUpdate setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/representantes/:id"
            element={<Representantes setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/estudiantesUpdate/:id"
            element={<EstudiantesUpdate setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/infoestudiantes/:id"
            element={<Informacionestudiantes setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/listarepresentantes/:id"
            element={<Listarepresentantesadmin setShowNavbar={setShowNavbar} />}
          />
          <Route
            path="/error"
            element={<Error setShowNavbar={setShowNavbar} />}
          />
          <Route path="*" element={<MatchAllRoute />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

function MatchAllRoute() {
  return (
    <body
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "75vh",
      }}
    >
      <div
        class="error-container"
        style={{
          textAlign: "center",
          borderRadius: "5px",
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "5rem",
            color: "black",
          }}
        >
          {" "}
          404{" "}
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            color: "#333",
            marginBottom: "60px",
          }}
        >
          Oops ¡Lo sentimos! No encontramos la página que estas buscando.
        </p>
        <Link to="/estudiantesLista" className="button">
          Regresar
        </Link>
      </div>
    </body>
  );
}

export default App;
