import React, { useState, useEffect, useRef } from "react";
import Joyride from "react-joyride";
import "../estilos/botones.css";
import { Form, Button, Col, Row, Container, Modal } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import {
  validateDocumentNumber,
  isDUI,
  validateEmail,
  validateDocument,
  validateNIT,
  validateDate,
  validateWorkTel,
  validateMobileTel,
  validateEmergencyTel,
  validateHomeTel,
} from "../validacion/validacion";
import { useNavigate } from "react-router-dom";
import "bootstrap-datepicker";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import $, { data } from "jquery";
import "../estilos/botones.css";
import "../estilos/fondo.css";
import "../estilos/forms.css";
import Footer from "../layout/footer/Footer";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import backgroundImg from "../imagenes/bg/bg5.png";
import {
  useAuth,
  fetchDepartamentos,
  fetchGrado,
  fetchReligion,
  fetchResponsableTipo,
  editEstudianteById,
} from "../AuthContext";

//Crear un formulario 2 columnas para padres y representantes
const EstudiantesForm = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([
    {
      target: ".step1-estudiantes-lista",
      disableBeacon: true,
      content: (
        <div  className="text-justify">
          <h4 className=" font-weight-bold">Bienvenido al formulario de registro general de estudiantes</h4>
          <p>Esta es una guía para entender el formulario de registro general de estudiantes. Por favor, completa todos los campos obligatorios marcados con un asterisco <span style={{ color: "red", fontWeight: "bold" }}>*</span>.</p>
          <p>Al completar todos los campos obligatorios, podrás guardar toda la información para la generacion de PDF de matricula y pasar a la siguiente fase.</p>
          <p>Si no terminas tu registro en este momento, puedes guardar tu información para continuar más tarde.</p>
          <p>Este formulario es fundamental para registrar tu información en nuestro sistema.</p>
        </div>
      ),
      placement: 'bottom', // Tooltip will appear to the right of the target
    },
    {
      target: ".step2-estudiantes-lista",
      content: (
        <div  className="text-justify">
          <h4 className=" font-weight-bold">Completa tus datos personales y de emergencia</h4>
          <p>El formulario está dividido en dos secciones. La primera sección se enfoca en tus datos personales, mientras que la segunda sección se centra en los datos de emergencia.</p>
          <p>Por favor, completa todos los campos obligatorios en ambas secciones para registrar tus datos de manera completa. Estos datos son importantes para asegurar la matrícula. </p>
        </div>
      ),
    },
    {
      target: ".step3-estudiantes-lista",
      content: (
        <div  className="text-justify">
          <h4 className=" font-weight-bold">Ingresa tus datos personales</h4>
          <p>Completa con cuidado todos los campos obligatorios con tus datos personales. </p>
          <p>Estos datos son esenciales para asegurar tu matrícula y brindarte una experiencia educativa. </p>
          <p> Todos los campos marcados con un asterisco <span style={{ color: "red", fontWeight: "bold" }}>*</span> son obligatorios. Una vez completados todos los campos, podrás revisar la información y avanzar al siguiente paso.</p>
        </div>
      ),
    },
    {
      target: ".step4-estudiantes-lista",
      content: (
        <div  className="text-justify">
          <h4 className=" font-weight-bold">Ingresa tus datos de emergencia</h4>
          <p>Ahora, ingresa tus datos de emergencia. Estos datos son importantes para poder contactarte en casos de emergencia de ser necesario</p>
          <p>Por favor, completa todos los campos obligatorios con la información requerida. Una vez completados todos los campos, podrás guardar la información y continuar con el proceso de registro.</p>
      
        </div>
      ),
    },
    {
      target: ".step5-estudiantes-lista",
      content: (
        <div  className="text-justify">
          <h4 className=" font-weight-bold">¡Listo para guardar!</h4>
          <p> Una vez que estés seguro, haz clic en el botón 'Guardar' para registrar tus datos.</p>
  
        </div>
      ),
    },
  ]);

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;

    if (status === "finished" || status === "skipped") {
      // When the tour is finished or skipped, set run to false
      setRun(false);
    }

    if (type === "step:after" || type === "target:not_found") {
      // Check if the step is not found, go to the next step
      data.action = "next";
    }
  };

  useEffect(() => {
    setRun(true);
  }, []);

  const handleRestartTour = () => {
    // Restart the tour
    setRun(true);
  };


  useEffect(() => {
    const handleScroll = () => {
      const button = document.getElementById('btn-tour-help');
      const footer = document.getElementsByClassName('footer-container')[0];  
      if (button && footer) {
        const buttonPosition = button.getBoundingClientRect().top + window.scrollY;
        const footerPosition = footer.getBoundingClientRect().top + window.scrollY;
  
        if (buttonPosition >= footerPosition) {
          button.classList.add('shadow-btn-help');
        } else {
          button.classList.remove('shadow-btn-help');
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const { id } = useParams();
  //modal
  const [showModal, setShowModal] = useState(false);

  const [suma, setSuma] = useState(0);
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [visiblePDF, setVisiblePDF] = useState(false);
  const [dataEstudiante, setDataEstudiante] = useState(null);
  const [dataResponsable, setDataResponsable] = useState(null);
  const [representanteSeleccionado, setRepresentanteSeleccionado] =
    useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [responsabletipo, setResponsabletipo] = useState([]);
  const [religiones, setReligiones] = useState([]);
  const [grado, setGrado] = useState([]);
  const { authToken } = useAuth();
  const [parentesco, setParentesco] = useState("Padre");
  const parentescoText =
    parentesco === "Padre"
      ? "Nombres y apellidos del padre"
      : parentesco === "Madre"
      ? "Nombres y apellidos de la madre"
      : "Nombres y apellidos del responsable";

  const [documentType, setDocumentType] = useState("DUI");
  const [externado_student_rep_id, setDocumentNumber] = useState("");

  //Validacion llenos
  const [isEscuelaRequired, setIsEscuelaRequired] = useState(true);
  const [isGradoSelected, setIsGradoSelected] = useState(false);
  const [isFirstNameRequired, setIsFirstNameRequired] = useState(true);
  const [isLastNameRequired, setIsLastNameRequired] = useState(true);
  const [isAddressRequired, setIsAddressRequired] = useState(true);
  const [isDepartamentoSelected, setIsDepartamentoSelected] = useState(false);
  const [isMunicipioRequired, setIsMunicipioRequired] = useState(true);
  const [isLugardeNacimientoRequired, setIsLugardeNacimientoRequired] =
    useState(true);
  const [isNacionalidadRequired, setIsNacionalidadRequired] = useState(true);
  const [isCatolicoSelected, setIsCatolicoSelected] = useState(false);
  const [isHermanosSelected, setIsHermanosSelected] = useState(false);
  const [isReligionSelected, setIsReligionSelected] = useState(false);
  const [religionInputValue, setReligionInputValue] = useState("");
  const [religionStatus, setReligionStatus] = useState(false);
  const [showReligionInput, setShowReligionInput] = useState(false);
  const [religionId, setReligionId] = useState(null);
  const [isAmbosPadresSelected, setIsAmbosPadresSelected] = useState(false);
  const [showAmbosPadresNombreInput, setShowAmbosPadresNombreInput] =
    useState(false);
  const [showAmbosPadresParentescoInput, setShowAmbosPadresParentescoInput] =
    useState(false);
  const [ambosStatus, setAmbosStatus] = useState(false);
  const [ambosInputNombreValue, setAmbosInputNombreValue] = useState("");
  const [ambosInputParentescoValue, setAmbosInputParentescoValue] =
    useState("");
  const [isNombreEmergenciaRequired, setIsNombreEmergenciaRequired] =
    useState(true);
  const [isRelacionEmergenciaRequired, setIsRelacionEmergenciaRequired] =
    useState(true);
  const [isDireccionEmergenciaRequired, setIsDireccionEmergenciaRequired] =
    useState(true);
  const [isTelefonoEmergenciaRequired, setIsTelefonoEmergenciaRequired] =
    useState(true);

  const [isResponsableSelected, setIsResponsableSelected] = useState(false);
  const [representanteInputNombreValue, setRepresentanteInputNombreValue] =
    useState("");
  const [
    representanteInputDireccionValue,
    setRepresentanteInputDireccionValue,
  ] = useState("");
  const [representanteInputDUIValue, setRepresentanteInputDUIValue] =
    useState("");
  const [
    representanteInputTelefonoCasaValue,
    setRepresentanteInputTelefonoCasaValue,
  ] = useState("");
  const [
    representanteInputTelefonoCelularValue,
    setRepresentanteInputTelefonoCelularValue,
  ] = useState("");
  const [representanteInputCorreoValue, setRepresentanteInputCorreoValue] =
    useState("");
  const [
    representanteInputTelefonoTrabajoValue,
    setRepresentanteInputTelefonoTrabajoValue,
  ] = useState("");
  const [representanteStatus, setRepresentanteStatus] = useState(false);
  const [hermano1InputValue, setHermano1InputValue] = useState("");
  const [hermano2InputValue, setHermano2InputValue] = useState("");
  const [hermano3InputValue, setHermano3InputValue] = useState("");
  const [isHermano1Selected, setIsHermano1Selected] = useState(false);
  const [isHermano2Selected, setIsHermano2Selected] = useState(false);
  const [isHermano3Selected, setIsHermano3Selected] = useState(false);

  //Contador
  const [camposValidos, setCamposValidos] = useState({
    escuela: 0,
    firstname: 0,
    lastname: 0,
    address: 0,
    municipio: 0,
    lugardenacimiento: 0,
    nacionalidad: 0,
    nombremergencia: 0,
    relacionemergencia: 0,
    direccionemergencia: 0,
    telefonoemergencia: 0,
    //  ...otros campos
  });

  //Agregando estudiante
  const [externado_student_last_school, setLastSchool] = useState("");
  const [externado_student_resp_type_id, setResponsible] = useState();
  const [externado_student_current_level_id, setCurrentLevelID] = useState();
  const [externado_student_firstname, setFirstName] = useState("");
  const [externado_student_lastname, setLastName] = useState("");
  const [externado_student_address, setAddress] = useState("");
  const [externado_student_department_id, setDepartmentId] = useState();
  const [externado_student_town, setTown] = useState("");
  const [externado_student_birthplace, setBirthplace] = useState("");
  const [externado_student_nationality, setNationality] = useState("");
  const [externado_student_gender, setGenderId] = useState();
  const [externado_student_phone, setPhone] = useState();
  const [externado_student_email, setEmail] = useState();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const [emailValido, setEmailValido] = useState(true); //Inicialmente, asumimos que el correo es valido
  const [externado_student_catholic, setCatholic] = useState();
  const [externado_student_lives_with_parents, setLivesWithParents] =
    useState();
  const [externado_student_rep_id_type, setRepIdType] = useState(0);
  const [externado_student_non_catholic_church_id, setNonCatholicId] =
    useState();
  const [externado_student_church_other, setChurchOther] = useState();
  const [externado_student_lives_with_who, setLivesWithWho] = useState("");
  const [externado_student_lives_with_related, setLivesWithRelated] =
    useState("");
  const [externado_student_emergency_name, setEmergencyName] = useState("");
  const [externado_student_emergency_address, setEmergencyAddress] =
    useState("");
  const [externado_student_emergency_relationship, setEmergencyRelationship] =
    useState("");
  let [externado_student_siblings, setStudentSiblings] = useState();

  const [externado_student_has_siblings, setHasSiblings] = useState();

  const [siblingName1, setSiblingName1] = useState("");
  const [siblingGrade1, setSiblingGrade1] = useState("");
  const [siblingName2, setSiblingName2] = useState("");
  const [siblingGrade2, setSiblingGrade2] = useState("");
  const [siblingName3, setSiblingName3] = useState("");
  const [siblingGrade3, setSiblingGrade3] = useState("");

  const [externado_student_birthdate, setStudentBirthdate] = useState(Date());
  const [fecha_actual, setFechaActual] = useState(Date());
  const [isBirthdateInputFilled, setIsBirthdateInputFilled] = useState("");

  const [externado_student_rep_name, setStudentRepName] = useState("");
  const [externado_student_lives_with_address, setLivesWithAddress] =
    useState();
  const [externado_student_emergency_phone, setEmergencyPhone] = useState("");
  const [externado_student_rep_address, setStudentRepAddress] = useState("");
  const [externado_student_rep_email, setStudentRepEmail] = useState();
  const [externado_student_rep_mobile_phone, setStudentRepMobilePhone] =
    useState();
  const [externado_student_rep_homephone, setStudentRepHomePhone] = useState();
  const [externado_student_rep_work_phone, setStudentRepWorkPhone] = useState();

  let [externado_form_valid, setExternadoFormValid] = useState(false);

  const [messageDate, setMessageDate] = useState("");
  const [messageDUI, setMessageDUI] = useState("");
  const [messageNIT, setMessageNIT] = useState("");
  const [messageEmail, setMessageEmail] = useState("");
  const [messageEmailRep, setMessageEmailRep] = useState("");
  const [messageWorkTel, setMessageWorkTel] = useState("");
  const [messageMobileTel, setMessageMobileTel] = useState("");
  const [messageEmergencyTel, setMessageEmergencyTel] = useState("");
  const [messageHomeTel, setMessageHomeTel] = useState("");
  const [messageMobileRepTel, setMessageMobileRepTel] = useState("");
  const dateRef = useRef();
  const duiRef = useRef();
  const nitRef = useRef();
  const emailRef = useRef();
  const emailRepRef = useRef();
  const telWorkRef = useRef();
  const telMobileRef = useRef();
  const telEmergencyRef = useRef();
  const telHomeRef = useRef();
  const telMobileRepRef = useRef();
  const repNameRef = useRef();
  const repAddressRef = useRef();
  const duiTypeRef = useRef();

  const responsibleTypeIdRef = useRef();

  const handleParentescoChange = (e) => {
    setParentesco(e.target.value);
  };

  //Almacenando valor de colegi en que estudió el año anterior
  const handleLastSchoolChange = (e) => {
    setLastSchool(e.target.value);
    setIsEscuelaRequired(e.target.value === "");
  };

  //Almacenando Id de grado que cursará
  const handleCurrentLevelIdChange = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de pep es: ", option);
    setCurrentLevelID(option);
    const selectedValue = event.target.value;
    if (selectedValue === "Favor seleccionar un valor") {
      setIsGradoSelected(false);
    } else {
      setIsGradoSelected(true);
    }
  };

  //Almacenando valor de nombres
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setIsFirstNameRequired(e.target.value === "");
  };

  //Almacenando valor de apellidos
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setIsLastNameRequired(e.target.value === "");
  };

  //Almacenando valor de dirección de residencia
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setIsAddressRequired(e.target.value === "");
  };

  //Almacenando Id de departamento
  const handleDepertmentIdChange = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de pep es: ", option);
    setDepartmentId(option);
    const selectedValue = event.target.value;
    if (selectedValue === "Favor seleccionar un valor") {
      setIsDepartamentoSelected(false);
    } else {
      setIsDepartamentoSelected(true);
    }
  };

  //Almacenando valor de municipio
  const handleTownChange = (e) => {
    setTown(e.target.value);
    setIsMunicipioRequired(e.target.value === "");
  };

  //Almacenando valor de lugar de nacimiento
  const handleBirthplaceChange = (e) => {
    setBirthplace(e.target.value);
    setIsLugardeNacimientoRequired(e.target.value === "");
  };

  //Almacenando valor de nacionalidad
  const handleNationalityChange = (e) => {
    setNationality(e.target.value);
    setIsNacionalidadRequired(e.target.value === "");
  };

  //Almacenando Id de sexo
  const handleGenderIdChange = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de pep es: ", option);
    setGenderId(option);
  };

  //Almacenando valor de celular de estudiante
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  //Almacenando valor email
  const handleStudentRepEmailChange = (e) => {
    const nuevoEmail = e.target.value;
    setStudentRepEmail(nuevoEmail);
    setEmailValido(emailRegex.test(nuevoEmail)); //Validamos el nuevo email
    //console.log("Nuevo email: ", nuevoEmail);
    const inputValue = e.target.value;
    setRepresentanteInputCorreoValue(inputValue);
  };

  //Almacenando valor email
  const handleEmailChange = (e) => {
    const nuevoEmail = e.target.value;
    setEmail(nuevoEmail);
    setEmailValido(emailRegex.test(nuevoEmail)); //Validamos el nuevo email
    //console.log("Nuevo email: ", nuevoEmail);
  };

  //Almacenando valor de religion es católico?
  const handleCatholicChange = (event) => {
    setCatholic(event.target.value);
    const catValue = event.target.value === "0";
    setReligionStatus(catValue);
    setIsCatolicoSelected(true);
    setShowReligionInput(catValue && religionId === "Otra");
    setIsReligionSelected(!catValue);
  };

  //Almacenando valor de tiene hermanos?
  const handleTieneHermanosChange = (event) => {
    setHasSiblings(event.target.value);
    setIsHermanosSelected(true);
  };

  const handleReligionInputValueChange = (event) => {
    const inputValue = event.target.value;
    setReligionInputValue(inputValue);
    setChurchOther(inputValue);
  };
  //Almacenando Id de religión (no católica)
  const handleNonCatholicIdChange = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de pep es: ", option);
    setNonCatholicId(option);
    const selectedValue = event.target.value;
    //Actualizar el estado para mostrar u ocultar el input segun la opcion seleccionada
    setShowReligionInput(selectedValue === "Otra" && religionStatus);
    if (selectedValue === "Favor seleccionar un valor") {
      setIsReligionSelected(false);
    } else if (
      selectedValue !== "Otra" &&
      selectedValue !== "Favor seleccionar un valor"
    ) {
      setReligionInputValue("");
      setIsReligionSelected(true);
    } else {
      setIsReligionSelected(true);
    }
  };

  const handleSiblingName1 = (event) => {
    setSiblingName1(event.target.value);
    const inputValue = event.target.value;
    setHermano1InputValue(inputValue);
  };
  const handleSiblingGrade1 = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id del grado es: ", option);
    setSiblingGrade1(option);
    const selectedValue = event.target.value;
    //Actualizar el estado para mostrar u ocultar el input segun la opcion seleccionada
    if (selectedValue === "Favor seleccionar un valor") {
      setIsHermano1Selected(false);
    } else {
      setIsHermano1Selected(true);
    }
  };

  const handleSiblingName2 = (event) => {
    setSiblingName2(event.target.value);
    const inputValue = event.target.value;
    setHermano2InputValue(inputValue);
  };
  const handleSiblingGrade2 = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id del grado es: ", option);
    setSiblingGrade2(option);

    const selectedValue = event.target.value;
    //Actualizar el estado para mostrar u ocultar el input segun la opcion seleccionada
    if (selectedValue === "Favor seleccionar un valor") {
      setIsHermano2Selected(false);
    } else {
      setIsHermano2Selected(true);
    }
  };

  const handleSiblingName3 = (event) => {
    setSiblingName3(event.target.value);
    const inputValue = event.target.value;
    setHermano3InputValue(inputValue);
  };
  const handleSiblingGrade3 = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id del grado es: ", option);
    setSiblingGrade3(option);

    const selectedValue = event.target.value;
    //Actualizar el estado para mostrar u ocultar el input segun la opcion seleccionada
    if (selectedValue === "Favor seleccionar un valor") {
      setIsHermano3Selected(false);
    } else {
      setIsHermano3Selected(true);
    }
  };

  //función para obtener el JSON de los hermanos del estudiante
  function studentSiblingsFinal() {
    let studentSiblings1 = "";
    let studentSiblings2 = "";
    let studentSiblings3 = "";

    if (siblingName1 === "" && siblingGrade1 === "") {
      const siblings = {};
      studentSiblings1 = JSON.stringify(siblings);
      //console.log("Hermanos JSON 1: ", studentSiblings1);
    } else if (siblingName1 !== "" && siblingGrade1 !== "") {
      const siblings = {
        name: siblingName1,
        grade: Number(siblingGrade1),
      };
      studentSiblings1 = JSON.stringify(siblings);
      //console.log("Hermanos JSON 1: ", studentSiblings1);
    } else if (siblingName1 !== "" && siblingGrade1 === "") {
      alert("Debe de ingresar el grado");
      return;
    } else if (siblingName1 === "" && siblingGrade1 !== "") {
      alert("Debe de ingresar el nombre");
      return;
    }

    if (siblingName2 === "" && siblingGrade2 === "") {
      const siblings = {};
      studentSiblings2 = JSON.stringify(siblings);
      //console.log("Hermanos JSON 2: ", studentSiblings2);
    } else if (siblingName2 !== "" && siblingGrade2 !== "") {
      const siblings = {
        name: siblingName2,
        grade: Number(siblingGrade2),
      };
      studentSiblings2 = JSON.stringify(siblings);
      //console.log("Hermanos JSON 2: ", studentSiblings2);
    } else if (siblingName2 !== "" && siblingGrade2 === "") {
      alert("Debe de ingresar el grado");
      return;
    } else if (siblingName2 === "" && siblingGrade2 !== "") {
      alert("Debe de ingresar el nombre");
      return;
    }

    if (siblingName3 === "" && siblingGrade3 === "") {
      const siblings = {};
      studentSiblings3 = JSON.stringify(siblings);
      //console.log("Hermanos JSON 3: ", studentSiblings3);
    } else if (siblingName3 !== "" && siblingGrade3 !== "") {
      const siblings = {
        name: siblingName3,
        grade: Number(siblingGrade3),
      };
      studentSiblings3 = JSON.stringify(siblings);
      //console.log("Hermanos JSON 3: ", studentSiblings3);
    } else if (siblingName3 !== "" && siblingGrade3 === "") {
      alert("Debe de ingresar el grado");
      return;
    } else if (siblingName3 === "" && siblingGrade3 !== "") {
      alert("Debe de ingresar el nombre");
      return;
    }
    const resultado =
      "[" +
      studentSiblings1 +
      "," +
      studentSiblings2 +
      "," +
      studentSiblings3 +
      "]";

    //console.log(resultado);
    setStudentSiblings(resultado);
    externado_student_siblings = resultado;
  }

  //Almacenando Id de responsable
  const handleResponsibleChange = (event) => {
    setRepresentanteSeleccionado(event.target.value);
    //console.log("El valor del select es:", event.target.value);
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de pep es: ", option);
    setResponsible(option);

    const selectedValue = event.target.value;
    if (selectedValue === "Favor seleccionar un valor") {
      setIsResponsableSelected(false);
    } else {
      setIsResponsableSelected(true);
    }
    setRepresentanteStatus(selectedValue === "Otro");
  };

  //Almacenando valor de vive con ambos padres?
  const handleLivesWithParents = (event) => {
    setIsAmbosPadresSelected(true);
    setLivesWithParents(event.target.value);
    const ambosValue = event.target.value === "0";
    setAmbosStatus(ambosValue);
    setShowAmbosPadresNombreInput(ambosValue);
    setShowAmbosPadresParentescoInput(ambosValue);
  };

  //Almacenando valor sino vive con padres, con quién?
  const handleLivesWithWhoChange = (event) => {
    setLivesWithWho(event.target.value);
    setLivesWithAddress(externado_student_address);
    const inputValue = event.target.value;
    setAmbosInputNombreValue(inputValue);
  };

  //Almacenando valor sino vive con padres, con quién parentesco?
  const handleLivesWithRelatedChange = (event) => {
    setLivesWithRelated(event.target.value);
    const inputValue = event.target.value;
    setAmbosInputParentescoValue(inputValue);
  };

  //Almacenando valor en caso de emergencia llamar a [nombre]
  const handleEmergencyNameChange = (event) => {
    setEmergencyName(event.target.value);

    setIsNombreEmergenciaRequired(event.target.value === "");
  };

  //Almacenando valor en caso de emergencia llamar a [dirección]
  const handleEmergencyAddressChange = (event) => {
    setEmergencyAddress(event.target.value);
    const inputValue = event.target.value;
    setIsDireccionEmergenciaRequired(inputValue === "");
  };

  //Almacenando valor en caso de emergencia llamar a [relación]
  const handleEmergencyRelationshipChange = (event) => {
    setEmergencyRelationship(event.target.value);
    const inputValue = event.target.value;
    setIsRelacionEmergenciaRequired(inputValue === "");
  };

  //Almacenando valor en caso de emergencia llamar a [teléfono]
  const handleEmergencyPhoneChange = (event) => {
    setEmergencyPhone(event.target.value);
    const inputValue = event.target.value;
    setIsTelefonoEmergenciaRequired(inputValue === "");
  };

  //Almacenando valor nombre de representante (Opción OTRO)
  const handleStudentRepNameChange = (event) => {
    setStudentRepName(event.target.value);
    const inputValue = event.target.value;
    setRepresentanteInputNombreValue(inputValue);
  };

  //Almacenando fecha de nacimiento
  const handleBirthdateChange = (event) => {
    //console.log(" Fecha de nacimiento: ", externado_student_birthdate);
    //console.log(" Fecha actual: ", fecha_actual);
  };

  //Almacenando valor de dirección de representante de estudiante (Opción OTRO)
  const handleStudentRepAddressChange = (event) => {
    setStudentRepAddress(event.target.value);
    const inputValue = event.target.value;
    setRepresentanteInputDireccionValue(inputValue);
  };

  //Almacenando valor de celular de representante de estudiante (Opción OTRO)
  const handleStudentRepMobilePhoneChange = (e) => {
    setStudentRepMobilePhone(e.target.value);
    const inputValue = e.target.value;
    setRepresentanteInputTelefonoCelularValue(inputValue);
  };
  //Almacenando valor de tel de casa de representante de estudiante (Opción OTRO)
  const handleStudentRepHomePhoneChange = (e) => {
    setStudentRepHomePhone(e.target.value);
    const inputValue = e.target.value;
    setRepresentanteInputTelefonoCasaValue(inputValue);
  };
  //Almacenando valor tel de trabajo de representante de estudiante (Opción OTRO)
  const handleStudentRepWorkPhoneChange = (e) => {
    setStudentRepWorkPhone(e.target.value);
    const inputValue = e.target.value;
    setRepresentanteInputTelefonoTrabajoValue(inputValue);
  };

  //Almacenando valor tel de tipo de documento de representante de estudiante (Opción OTRO)
  const handleStudentRepDocumentTypeChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de tipo de documento es: ", option);
    setRepIdType(option);
    //console.log("tipo de dato de id de tipo de documento es: ", option);
  };

  const handleVisiblesHermanos = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "0") {
      setVisible(false);
      setVisible2(false);
      setVisible3(false);
      setVisible4(false);
      setVisible5(false);
      setSuma(0);
      setShowButton(true);
    } else if (selectedValue === "1") {
      setVisible(true);
      setVisible2(false);
      setVisible3(false);
      setVisible4(false);
      setVisible5(false);
      setSuma(0);
      setShowButton(true);
    }
  };

  const handleDocumentNumberChange = (e) => {
    const newDocumentNumber = e.target.value;
    //console.log("newDocumentNumber:", newDocumentNumber);

    setDocumentNumber(newDocumentNumber);
    const inputValue = e.target.value;
    setRepresentanteInputDUIValue(inputValue);
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
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);

  const isDocumentNumberValid = validateDocumentNumber(
    documentType,
    externado_student_rep_id
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const departamentosData = await fetchDepartamentos(authToken);
        //console.log("Datos de departamentos:", departamentosData);
        setDepartamentos(departamentosData);
      } catch (error) {
        //  //console.error(error.message);
      }
    };
    //console.log("Token actual en EstudiantesFOrm:", authToken);
    fetchData();
  }, [authToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsabletipoData = await fetchResponsableTipo(authToken);
        //console.log("Datos de tipo de responsables:", responsabletipoData);
        setResponsabletipo(responsabletipoData);
      } catch (error) {
        //console.error(error.message);
      }
    };
    fetchData();
  }, [authToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradosData = await fetchGrado(authToken);
        //console.log("Datos de grados:", gradosData);
        setGrado(gradosData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  // editar estudiante
  useEffect(() => {
    //console.log("authToken:", authToken);
    //console.log("id:", id);

    //Convertir a int el id
    const idInt = parseInt(id, 10);

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/externado-student/pdfStudent",
          {
            idexternado_student: idInt,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        //console.log("Datos del estudiante:", response.data);
        setDataEstudiante(response.data);
        // Accede al campo externado_student_firstname
        const firstName = response.data.externado_student_firstname;
        // Muestra el valor en una alerta
        //alert(`Nombre del estudiante: ${firstName}`);
        const completo = response.data.externado_form_valid;
        if (completo === true) {
          /* alert();
          "El formulario no está completo, por favor llenar todos los campos obligatorios"*/
        } else {
          //setVisiblePDF(true);
        }
      } catch (error) {
        //console.error("Error al obtener datos del estudiante:", error.message);

        if (error.response) {
          //console.error("Response data:", error.response.data);
          //console.error("Status code:", error.response.status);
        }
      }
    };
    // Llama a la función para obtener los datos del estudiante
    fetchData();
  }, [authToken, id]);

  // imprimir pdf de responsable
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/externado-responsible/pdfResponsibles",
          null, // Pasa null como cuerpo si no estás enviando datos en el cuerpo
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setDataResponsable(response.data);
        //console.log("Datos del responsable:", response.data);
        // alert(          `Nombre del responsable: ${response.data[0].externado_firstname}`        );
        //   alert(          `Apellido del responsable: ${response.data[0].externado_lastname}`        );
      } catch (error) {
        //console.error("Error al obtener datos:", error.message);
      }
    };

    fetchData(); // Llamamos a la función para obtener los datos cuando el componente se monta

    // Si necesitas realizar alguna acción cuando el componente se desmonta, puedes devolver una función desde useEffect.
    return () => {
      // Acciones de limpieza si es necesario
    };
  }, [authToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const religionesData = await fetchReligion(authToken);
        //console.log("Datos de religiones:", religionesData);
        setReligiones(religionesData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  const handleAgregarHermano = () => {
    // Usar una función en lugar de un valor directo para obtener el valor actual de suma
    setSuma((prevSuma) => prevSuma + 1);
    // El valor de suma se actualizará correctamente en el primer clic

    if (suma + 1 === 1) {
      setVisible4(true);
    }

    if (suma + 1 === 2) {
      setVisible5(true);
    }

    if (suma + 1 >= 3) {
      setShowButton(false);
    }
    //console.log("suma:", suma + 1);
  };

  const handleQuitarHermano = () => {
    if (suma > 0) {
      setSuma((prevSuma) => prevSuma - 1);
    }
    if (suma === 2) {
      setVisible5(false);
    }
    if (suma === 1) {
      setVisible4(false);
    }
  };

  const actual = new Date().getFullYear();
  const siguiente = actual + 1;

  // Inicializa el Datepicker después de que el componente se monte
  useEffect(() => {
    $(".datepicker")
      .datepicker({
        type: "date",
        format: "yyyy-mm-dd", // Formato de fecha deseado
        autoclose: true, // Cierra el Datepicker al seleccionar una fecha
      })
      .on("changeDate", function (e) {
        //console.log("FECHA ACTUAL: ");
        var hoy = new Date();
        setFechaActual(hoy);
        //console.log(e.format());
        setStudentBirthdate(e.format());
        setIsBirthdateInputFilled(externado_student_birthdate.trim() !== "");
        //console.log(" Fecha de nacimiento: ", externado_student_birthdate);
      });
  }, []);

  //Campitos
  useEffect(() => {
    setCamposValidos((prevCampos) => ({
      ...prevCampos,
      escuela: externado_student_last_school.trim() === "" ? 1 : 0,
      firstname: externado_student_firstname.trim() === "" ? 1 : 0,
      lastname: externado_student_lastname.trim() === "" ? 1 : 0,
      address: externado_student_address.trim() === "" ? 1 : 0,
      municipio: externado_student_town.trim() === "" ? 1 : 0,
      lugardenacimiento: externado_student_birthplace.trim() === "" ? 1 : 0,
      nacionalidad: externado_student_nationality.trim() === "" ? 1 : 0,
      nombremergencia: externado_student_emergency_name.trim() === "" ? 1 : 0,
      relacionemergencia:
        externado_student_emergency_relationship.trim() === "" ? 1 : 0,
      direccionemergencia:
        externado_student_emergency_address.trim() === "" ? 1 : 0,
      telefonoemergencia:
        externado_student_emergency_phone.trim() === "" ? 1 : 0,
    }));
  }, [
    externado_student_last_school,
    externado_student_firstname,
    externado_student_lastname,
    externado_student_address,
    externado_student_town,
    externado_student_birthplace,
    externado_student_nationality,
    externado_student_emergency_name,
    externado_student_emergency_relationship,
    externado_student_emergency_address,
    externado_student_emergency_phone,
  ]);

  // Abriendo modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGenerarPDF2 = async () => {
    if (dataResponsable) {
      /*---------------------------------POSICION 1---------------------------------*/
      const nombreResponsable = dataResponsable[0].externado_firstname;
      //console.log("Nombre del responsable: ", nombreResponsable);
      const apellidoResponsable = dataResponsable[0].externado_lastname;
      const responsaleFechaNacimiento = dataResponsable[0].externado_birthdate;
      // Crear un objeto de fecha
      const fecha = new Date(responsaleFechaNacimiento);

      // Obtener el año, mes y día
      const año = fecha.getFullYear();
      const mes = fecha.getMonth() + 1; // ¡Recuerda que los meses comienzan en 0!
      const dia = fecha.getDate();

      // Formatear la fecha como una cadena YYYY-MM-DD
      const fechaFormateadaResponsable = `${año}-${
        mes < 10 ? "0" + mes : mes
      }-${dia < 10 ? "0" + dia : dia}`;

      const numeroduiResponsable = dataResponsable[0].externado_id;
      const numeronitResponsable = dataResponsable[0].externado_nit;
      const nacionalidadResponsable = dataResponsable[0].externado_nationality;
      const direccionResponsable = dataResponsable[0].externado_address;
      const municipioResponsable = dataResponsable[0].externado_town;
      const departamentoResponsable =
        dataResponsable[0].externadoDepartment.externado_department;
      let telefonotrabajoResponsable = dataResponsable[0].externado_work_phone;
      if (telefonotrabajoResponsable === null) {
        telefonotrabajoResponsable = "N/a";
      }
      const telefonoCelularResponsable =
        dataResponsable[0].externado_mobile_phone;
      const emailResponsable = dataResponsable[0].externado_email;
      const occupationResponsable = dataResponsable[0].externado_occupation;
      let lugartrabajoResponsable = dataResponsable[0].externado_workplace;
      if (lugartrabajoResponsable === null) {
        lugartrabajoResponsable = "N/a";
      }
      let posiciontrabajoResponsable = dataResponsable[0].externado_jobposition;
      if (posiciontrabajoResponsable === null) {
        posiciontrabajoResponsable = "N/a";
      }
      let espepResponsable = dataResponsable[0].externado_pep;
      if (espepResponsable === true) {
        espepResponsable = "Si";
      } else {
        espepResponsable = "No";
      }

      let pepoccupationResponsable;
      if (espepResponsable === "Si") {
        pepoccupationResponsable =
          dataResponsable[0].externadoPEP.externado_pep_value;
        if (pepoccupationResponsable === "Otro") {
          pepoccupationResponsable =
            dataResponsable[0].externado_pep_occupation_other;
        }
      }
      if (espepResponsable === "No") {
        pepoccupationResponsable = "N/a";
      }
      let espep3Responsable = dataResponsable[0].externado_pep_3years;
      if (espep3Responsable === true) {
        espep3Responsable = "Si";
      } else {
        espep3Responsable = "No";
      }
      let pepoccupation3Responsable;
      if (espep3Responsable === "Si") {
        pepoccupation3Responsable =
          dataResponsable[0].externado3yearsPEP.externado_pep_value;
        if (pepoccupation3Responsable === "Otro") {
          pepoccupation3Responsable =
            dataResponsable[0].externado_pep_3years_occupation_other;
        }
      }
      if (espep3Responsable === "No") {
        pepoccupation3Responsable = "N/a";
      }
      let incomingsResponsable =
        dataResponsable[0].externadoIncomings.externado_incomings_value;
      if (incomingsResponsable === "Otro") {
        incomingsResponsable = dataResponsable[0].externado_incomings_other;
      }
      let esexalumnoResponsable =
        dataResponsable[0].externado_former_externado_student;
      if (esexalumnoResponsable === true) {
        esexalumnoResponsable = "Si";
      } else {
        esexalumnoResponsable = "No";
      }
      let universidadResponsable =
        dataResponsable[0].externado_university_studies;
      if (universidadResponsable === null) {
        universidadResponsable = "N/a";
      }
      let relacionestudianteResponsable =
        dataResponsable[0].externado_responsible_relationship;
      let tipoResponsable =
        dataResponsable[0].externadoRespType.externado_responsible_type;
      let idtipoResponsable;
      /*---------------------------------FIN POSICION 1---------------------------------*/

      //DECLARAR TODAS LAS VARIABLES DE POSICION 2 AFUERA DEL IF
      let nombreResponsable2;
      let apellidoResponsable2;
      let responsaleFechaNacimiento2;
      let fecha2;
      let año2;
      let mes2;
      let dia2;
      let fechaFormateadaResponsable2;
      let numeroduiResponsable2;
      let numeronitResponsable2;
      let nacionalidadResponsable2;
      let direccionResponsable2;
      let municipioResponsable2;
      let departamentoResponsable2;
      let telefonotrabajoResponsable2;
      let telefonoCelularResponsable2;
      let emailResponsable2;
      let occupationResponsable2;
      let lugartrabajoResponsable2;
      let posiciontrabajoResponsable2;
      let espepResponsable2;
      let pepoccupationResponsable2;
      let espep3Responsable2;
      let pepoccupation3Responsable2;
      let incomingsResponsable2;
      let esexalumnoResponsable2;
      let universidadResponsable2;
      let relacionestudianteResponsable2;
      let tipoResponsable2;
      let idtipoResponsable2;

      // if(dataResponsable.length > 1)
      if (dataResponsable.length > 1) {
        /*---------------------------------POSICION 2------------------------------------*/
        nombreResponsable2 = dataResponsable[1].externado_firstname;
        //console.log("Nombre del responsable: ", nombreResponsable2);
        apellidoResponsable2 = dataResponsable[1].externado_lastname;
        responsaleFechaNacimiento2 = dataResponsable[1].externado_birthdate;
        // Crear un objeto de fecha
        fecha2 = new Date(responsaleFechaNacimiento2);

        // Obtener el año, mes y día
        año2 = fecha2.getFullYear();
        mes2 = fecha2.getMonth() + 1; // ¡Recuerda que los meses comienzan en 0!
        dia2 = fecha2.getDate();

        // Formatear la fecha como una cadena YYYY-MM-DD
        fechaFormateadaResponsable2 = `${año2}-${
          mes2 < 10 ? "0" + mes2 : mes2
        }-${dia2 < 10 ? "0" + dia2 : dia2}`;

        numeroduiResponsable2 = dataResponsable[1].externado_id;
        numeronitResponsable2 = dataResponsable[1].externado_nit;
        nacionalidadResponsable2 = dataResponsable[1].externado_nationality;
        direccionResponsable2 = dataResponsable[1].externado_address;
        municipioResponsable2 = dataResponsable[1].externado_town;
        departamentoResponsable2 =
          dataResponsable[1].externadoDepartment.externado_department;
        telefonotrabajoResponsable2 = dataResponsable[1].externado_work_phone;
        if (telefonotrabajoResponsable2 === null) {
          telefonotrabajoResponsable2 = "N/a";
        }
        telefonoCelularResponsable2 = dataResponsable[1].externado_mobile_phone;
        emailResponsable2 = dataResponsable[1].externado_email;
        occupationResponsable2 = dataResponsable[1].externado_occupation;
        lugartrabajoResponsable2 = dataResponsable[1].externado_workplace;
        if (lugartrabajoResponsable2 === null) {
          lugartrabajoResponsable2 = "N/a";
        }
        posiciontrabajoResponsable2 = dataResponsable[1].externado_jobposition;
        if (posiciontrabajoResponsable2 === null) {
          posiciontrabajoResponsable2 = "N/a";
        }
        espepResponsable2 = dataResponsable[1].externado_is_pep;

        if (espepResponsable2 === true) {
          espepResponsable2 = "Si";
        } else {
          espepResponsable2 = "No";
        }

        if (espepResponsable2 === "Si") {
          pepoccupationResponsable2 =
            dataResponsable[1].externadoPEP.externado_pep_value;
          if (pepoccupationResponsable2 === "Otro") {
            pepoccupationResponsable2 =
              dataResponsable[1].externado_pep_occupation_other;
          }
        }

        if (espepResponsable2 === "No") {
          pepoccupationResponsable2 = "N/a";
        }

        espep3Responsable2 = dataResponsable[1].externado_pep_3years;

        if (espep3Responsable2 === true) {
          espep3Responsable2 = "Si";
        } else {
          espep3Responsable2 = "No";
        }

        if (espep3Responsable2 === "Si") {
          pepoccupation3Responsable2 =
            dataResponsable[1].externado3yearsPEP.externado_pep_value;
          if (pepoccupation3Responsable2 === "Otro") {
            pepoccupation3Responsable2 =
              dataResponsable[1].externado_pep_3years_occupation_other;
          }
        }

        if (espep3Responsable2 === "No") {
          pepoccupation3Responsable2 = "N/a";
        }

        incomingsResponsable2 =
          dataResponsable[1].externadoIncomings.externado_incomings_value;
        if (incomingsResponsable2 === "Otro") {
          incomingsResponsable2 = dataResponsable[1].externado_incomings_other;
        }
        esexalumnoResponsable2 =
          dataResponsable[1].externado_former_externado_student;
        if (esexalumnoResponsable2 === true) {
          esexalumnoResponsable2 = "Si";
        } else {
          esexalumnoResponsable2 = "No";
        }
        universidadResponsable2 =
          dataResponsable[1].externado_university_studies;
        if (universidadResponsable2 === null) {
          universidadResponsable2 = "N/a";
        }
        relacionestudianteResponsable2 =
          dataResponsable[1].externado_responsible_relationship;
        tipoResponsable2 =
          dataResponsable[1].externadoRespType.externado_responsible_type;
      }

      /*---------------------------------FIN POSICION 2---------------------------------*/

      //DECLARAR TODAS LAS VARIABLES DE POSICION 3 AFUERA DEL IF
      let nombreResponsable3;
      let apellidoResponsable3;
      let responsaleFechaNacimiento3;
      let fecha3;
      let año3;
      let mes3;
      let dia3;
      let fechaFormateadaResponsable3;
      let numeroduiResponsable3;
      let numeronitResponsable3;
      let nacionalidadResponsable3;
      let direccionResponsable3;
      let municipioResponsable3;
      let departamentoResponsable3;
      let telefonotrabajoResponsable3;
      let telefonoCelularResponsable3;
      let emailResponsable3;
      let occupationResponsable3;
      let lugartrabajoResponsable3;
      let posiciontrabajoResponsable3;
      let espepResponsable3;
      let pepoccupationResponsable3;
      let espep3Responsable3;
      let pepoccupation3Responsable3;
      let incomingsResponsable3;
      let esexalumnoResponsable3;
      let universidadResponsable3;
      let relacionestudianteResponsable3;
      let tipoResponsable3;
      let idtipoResponsable3;

      // if(dataResponsable.length > 2)
      if (dataResponsable.length > 2) {
        /*---------------------------------POSICION 3---------------------------------*/
        nombreResponsable3 = dataResponsable[2].externado_firstname;
        //console.log("Nombre del responsable: ", nombreResponsable3);
        apellidoResponsable3 = dataResponsable[2].externado_lastname;
        responsaleFechaNacimiento3 = dataResponsable[2].externado_birthdate;
        // Crear un objeto de fecha
        fecha3 = new Date(responsaleFechaNacimiento3);

        // Obtener el año, mes y día
        año3 = fecha3.getFullYear();
        mes3 = fecha3.getMonth() + 1; // ¡Recuerda que los meses comienzan en 0!
        dia3 = fecha3.getDate();

        // Formatear la fecha como una cadena YYYY-MM-DD

        fechaFormateadaResponsable3 = `${año3}-${
          mes3 < 10 ? "0" + mes3 : mes3
        }-${dia3 < 10 ? "0" + dia3 : dia3}`;

        numeroduiResponsable3 = dataResponsable[2].externado_id;
        numeronitResponsable3 = dataResponsable[2].externado_nit;
        nacionalidadResponsable3 = dataResponsable[2].externado_nationality;
        direccionResponsable3 = dataResponsable[2].externado_address;
        municipioResponsable3 = dataResponsable[2].externado_town;
        departamentoResponsable3 =
          dataResponsable[2].externadoDepartment.externado_department;
        telefonotrabajoResponsable3 = dataResponsable[2].externado_work_phone;
        if (telefonotrabajoResponsable3 === null) {
          telefonotrabajoResponsable3 = "N/a";
        }
        telefonoCelularResponsable3 = dataResponsable[2].externado_mobile_phone;
        emailResponsable3 = dataResponsable[2].externado_email;
        occupationResponsable3 = dataResponsable[2].externado_occupation;
        lugartrabajoResponsable3 = dataResponsable[2].externado_workplace;
        if (lugartrabajoResponsable3 === null) {
          lugartrabajoResponsable3 = "N/a";
        }
        posiciontrabajoResponsable3 = dataResponsable[2].externado_jobposition;
        if (posiciontrabajoResponsable3 === null) {
          posiciontrabajoResponsable3 = "N/a";
        }
        espepResponsable3 = dataResponsable[2].externado_pep;

        if (espepResponsable3 === true) {
          espepResponsable3 = "Si";
        }
        if (espepResponsable3 === false) {
          espepResponsable3 = "No";
        }

        if (espepResponsable3 === "Si") {
          pepoccupationResponsable3 =
            dataResponsable[2].externadoPEP.externado_pep_value;
          if (pepoccupationResponsable3 === "Otro") {
            pepoccupationResponsable3 =
              dataResponsable[2].externado_pep_occupation_other;
          }
        }

        if (espepResponsable3 === "No") {
          pepoccupationResponsable3 = "N/a";
        }

        espep3Responsable3 = dataResponsable[2].externado_pep_3years;

        if (espep3Responsable3 === true) {
          espep3Responsable3 = "Si";
        }
        if (espep3Responsable3 === false) {
          espep3Responsable3 = "No";
        }

        if (espep3Responsable3 === "Si") {
          pepoccupation3Responsable3 =
            dataResponsable[2].externado3yearsPEP.externado_pep_value;
          if (pepoccupation3Responsable3 === "Otro") {
            pepoccupation3Responsable3 =
              dataResponsable[2].externado_pep_3years_occupation_other;
          }
        }

        if (espep3Responsable3 === "No") {
          pepoccupation3Responsable3 = "N/a";
        }

        incomingsResponsable3 =
          dataResponsable[2].externadoIncomings.externado_incomings_value;
        if (incomingsResponsable3 === "Otro") {
          incomingsResponsable3 = dataResponsable[2].externado_incomings_other;
        }
        esexalumnoResponsable3 =
          dataResponsable[2].externado_former_externado_student;
        if (esexalumnoResponsable3 === true) {
          esexalumnoResponsable3 = "Si";
        }
        if (esexalumnoResponsable3 === false) {
          esexalumnoResponsable3 = "No";
        }
        universidadResponsable3 =
          dataResponsable[2].externado_university_studies;
        if (universidadResponsable3 === null) {
          universidadResponsable3 = "N/a";
        }
        relacionestudianteResponsable3 =
          dataResponsable[2].externado_responsible_relationship;
        tipoResponsable3 =
          dataResponsable[2].externadoRespType.externado_responsible_type;

        /*---------------------------------FIN POSICION 3---------------------------------*/
      }
      //const tipoResponsable = dataResponsable[0].externadoRespType.externado_responsible_type;
      let pdf = new jsPDF();

      //escribir algo en el pdf
      const pageSize = pdf.internal.pageSize;
      const imgWidth = pageSize.getWidth() * 0.8;
      const { width: imgOrigWidth, height: imgOrigHeight } =
        await getImageProperties(backgroundImg);

      const imgHeight = (imgWidth * imgOrigHeight) / imgOrigWidth;

      const x = (pageSize.getWidth() - imgWidth) / 2;
      const y = (pageSize.getHeight() - imgHeight) / 2;
      /*---------------------------------PDF POSICION 1---------------------------------*/
      pdf.addImage(
        backgroundImg,
        "JPEG",
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
        0,
        1
      );

      // Título centrado y subrayado
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      const titulo = "Ficha de Registro ESJ";
      const tituloX = pageSize.getWidth() / 2;
      const tituloY = 25;
      const tituloWidth =
        pdf.getStringUnitWidth(titulo) * pdf.internal.getFontSize();
      pdf.text(titulo, tituloX, tituloY, { align: "center" });

      // Dibujar una línea justo debajo del texto para simular el subrayado
      pdf.setLineWidth(0.5);
      pdf.line(
        tituloX - tituloWidth / 2,
        tituloY + 2,
        tituloX + tituloWidth / 2,
        tituloY + 2
      );

      // Datos generales texto centrado sin negrita tamaño 15
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(0, 0, 0);
      const datosGenerales = "Datos Generales";
      const datosGeneralesX = pageSize.getWidth() / 2;
      const datosGeneralesY = 45;
      const datosGeneralesWidth =
        pdf.getStringUnitWidth(datosGenerales) * pdf.internal.getFontSize();
      pdf.text(datosGenerales, datosGeneralesX, datosGeneralesY, {
        align: "center",
      });

      // Establecer negrita solo para el texto quemado
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      // Imprimir datos en dos columnas
      pdf.text(`Nombres: ${nombreResponsable}`, 10, 60);
      pdf.text(
        `Apellidos: ${apellidoResponsable}`,
        pageSize.getWidth() / 2 + 10,
        60
      );

      // Parentesco con el alumno
      pdf.text(`Parentesco con el alumno: ${tipoResponsable}`, 10, 70);
      // Poner a la par de parentesco con el alumno solo si tipoResponsable === "Tutor Legal"
      if (tipoResponsable === "Tutor Legal") {
        pdf.text(
          `Relación con el alumno: ${relacionestudianteResponsable}`,
          pageSize.getWidth() / 2 + 10,
          70
        );
      }

      // Fecha de nacimiento
      pdf.text(`Fecha de nacimiento: ${fechaFormateadaResponsable}`, 10, 80);

      // Numero de documento a la par de fecha de nacimiento
      pdf.text(
        `Número de documento: ${numeroduiResponsable}`,
        pageSize.getWidth() / 2 + 10,
        80
      );

      // NIT
      pdf.text(`NIT: ${numeronitResponsable}`, 10, 90);

      // Nacionalidad a la par de NIT
      pdf.text(
        `Nacionalidad: ${nacionalidadResponsable}`,
        pageSize.getWidth() / 2 + 10,
        90
      );

      // Direccion y ver si se divide en 2 lineas
      const direccionTexto = `Dirección: ${direccionResponsable}`;
      const direccionFragmentos = pdf.splitTextToSize(
        direccionTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(direccionFragmentos, 10, 100);

      // Departamento, verificar antes si la direccion fue dividida en 2
      if (direccionFragmentos.length > 1) {
        pdf.text(`Departamento: ${departamentoResponsable}`, 10, 115);
      } else {
        pdf.text(`Departamento: ${departamentoResponsable}`, 10, 110);
      }

      // Municipio a la par de departamento a la misma altura, verficar direccion 2 lineas
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Municipio: ${municipioResponsable}`,
          pageSize.getWidth() / 2 + 10,
          115
        );
      } else {
        pdf.text(
          `Municipio: ${municipioResponsable}`,
          pageSize.getWidth() / 2 + 10,
          110
        );
      }

      // correo
      if (direccionFragmentos.length > 1) {
        pdf.text(`Correo: ${emailResponsable}`, 10, 125);
      } else {
        pdf.text(`Correo: ${emailResponsable}`, 10, 120);
      }

      // correo a la par de celular
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Teléfono celular: ${telefonoCelularResponsable}`,
          pageSize.getWidth() / 2 + 10,
          125
        );
      } else {
        pdf.text(
          `Teléfono celular: ${telefonoCelularResponsable}`,
          pageSize.getWidth() / 2 + 10,
          120
        );
      }

      // Ocupación
      if (direccionFragmentos.length > 1) {
        pdf.text(`Ocupación: ${occupationResponsable}`, 10, 135);
      } else {
        pdf.text(`Ocupación: ${occupationResponsable}`, 10, 130);
      }

      // Lugar de trabajo en 140 o 145
      if (direccionFragmentos.length > 1) {
        pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable}`, 10, 145);
      } else {
        pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable}`, 10, 140);
      }

      // Posicion de trabajo
      if (direccionFragmentos.length > 1) {
        pdf.text(`Posición de trabajo: ${posiciontrabajoResponsable}`, 10, 155);
      } else {
        pdf.text(`Posición de trabajo: ${posiciontrabajoResponsable}`, 10, 150);
      }

      // Teléfono de trabajo
      if (direccionFragmentos.length > 1) {
        pdf.text(`Teléfono de trabajo: ${telefonotrabajoResponsable}`, 10, 165);
      } else {
        pdf.text(`Teléfono de trabajo: ${telefonotrabajoResponsable}`, 10, 160);
      }

      // Es PEP
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable}`,
          10,
          175
        );
      } else {
        pdf.text(
          `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable}`,
          10,
          170
        );
      }
      //negrita
      pdf.setFont("helvetica", "bold");
      // Ocupación PEP
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
          10,
          185
        );
      } else {
        pdf.text(
          `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
          10,
          180
        );
      }
      //normal
      pdf.setFont("helvetica", "normal");
      // Ocupación PEP
      if (direccionFragmentos.length > 1) {
        pdf.text(`${pepoccupationResponsable}`, 10, 195);
      } else {
        pdf.text(`${pepoccupationResponsable}`, 10, 190);
      }

      // Es PEP 3 años
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable}`,
          10,
          205
        );
      } else {
        pdf.text(
          `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable}`,
          10,
          200
        );
      }

      //negrita
      pdf.setFont("helvetica", "bold");

      // Ocupación PEP 3 años, dividir en 2 lineas si llega al final del ancho del pdf, aplicar lo mismo que dirección
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Puesto que ocupó en caso de ser una Persona Políticamente Expuesta:`,
          10,
          215
        );
      } else {
        pdf.text(
          `Puesto que ocupó en caso de haber sido una Persona Políticamente Expuesta:`,
          10,
          210
        );
      }

      //normal
      pdf.setFont("helvetica", "normal");
      // Ocupación PEP 3 años
      if (direccionFragmentos.length > 1) {
        pdf.text(`${pepoccupation3Responsable}`, 10, 225);
      } else {
        pdf.text(`${pepoccupation3Responsable}`, 10, 220);
      }

      // Ingresos
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Rango de ingresos mensuales familiares: ${incomingsResponsable}`,
          10,
          235
        );
      } else {
        pdf.text(
          `Rango de ingresos mensuales familiares: ${incomingsResponsable}`,
          10,
          230
        );
      }
      /*---------------------------------FIN PDF POSICION 1---------------------------------*/

      /*---------------------------------PDF POSICION 2---------------------------------*/
      //Agregar pagina nueva si if (dataResponsable.length > 1)
      if (dataResponsable.length > 1) {
        pdf.addPage();
        pdf.addImage(
          backgroundImg,
          "JPEG",
          x,
          y,
          imgWidth,
          imgHeight,
          undefined,
          "FAST",
          0,
          1
        );

        // datos generales
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(15);
        pdf.setTextColor(0, 0, 0);
        const datosGenerales2 = "Datos Generales";
        const datosGeneralesX2 = pageSize.getWidth() / 2;
        const datosGeneralesY2 = 45;
        const datosGeneralesWidth2 =
          pdf.getStringUnitWidth(datosGenerales2) * pdf.internal.getFontSize();
        pdf.text(datosGenerales2, datosGeneralesX2, datosGeneralesY2, {
          align: "center",
        });

        // Establecer negrita solo para el texto quemado
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);

        // Imprimir datos en dos columnas
        pdf.text(`Nombres: ${nombreResponsable2}`, 10, 60);
        pdf.text(
          `Apellidos: ${apellidoResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          60
        );

        // Parentesco con el alumno
        pdf.text(`Parentesco con el alumno: ${tipoResponsable2}`, 10, 70);
        // Poner a la par de parentesco con el alumno solo si tipoResponsable === "Tutor Legal"
        if (tipoResponsable2 === "Tutor Legal") {
          pdf.text(
            `Relación con el alumno: ${relacionestudianteResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            70
          );
        }

        // Fecha de nacimiento
        pdf.text(`Fecha de nacimiento: ${fechaFormateadaResponsable2}`, 10, 80);

        // Numero de documento a la par de fecha de nacimiento
        pdf.text(
          `Número de documento: ${numeroduiResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          80
        );

        // NIT
        pdf.text(`NIT: ${numeronitResponsable2}`, 10, 90);

        // Nacionalidad a la par de NIT
        pdf.text(
          `Nacionalidad: ${nacionalidadResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          90
        );

        // Direccion y ver si se divide en 2 lineas
        const direccionTexto2 = `Dirección: ${direccionResponsable2}`;
        const direccionFragmentos2 = pdf.splitTextToSize(
          direccionTexto2,
          pageSize.getWidth() - 20
        );
        pdf.text(direccionFragmentos2, 10, 100);

        // Departamento, verificar antes si la direccion fue dividida en 2
        if (direccionFragmentos2.length > 1) {
          pdf.text(`Departamento: ${departamentoResponsable2}`, 10, 115);
        } else {
          pdf.text(`Departamento: ${departamentoResponsable2}`, 10, 110);
        }

        // Municipio a la par de departamento a la misma altura, verficar direccion 2 lineas
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Municipio: ${municipioResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            115
          );
        } else {
          pdf.text(
            `Municipio: ${municipioResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            110
          );
        }

        // correo
        if (direccionFragmentos2.length > 1) {
          pdf.text(`Correo: ${emailResponsable2}`, 10, 125);
        } else {
          pdf.text(`Correo: ${emailResponsable2}`, 10, 120);
        }

        // correo a la par de celular
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Teléfono celular: ${telefonoCelularResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            125
          );
        } else {
          pdf.text(
            `Teléfono celular: ${telefonoCelularResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            120
          );
        }

        // Ocupación
        if (direccionFragmentos2.length > 1) {
          pdf.text(`Ocupación: ${occupationResponsable2}`, 10, 135);
        } else {
          pdf.text(`Ocupación: ${occupationResponsable2}`, 10, 130);
        }

        // Lugar de trabajo en 140 o 145
        if (direccionFragmentos2.length > 1) {
          pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable2}`, 10, 145);
        } else {
          pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable2}`, 10, 140);
        }

        // Posicion de trabajo
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Posición de trabajo: ${posiciontrabajoResponsable2}`,
            10,
            155
          );
        } else {
          pdf.text(
            `Posición de trabajo: ${posiciontrabajoResponsable2}`,
            10,
            150
          );
        }

        // Teléfono de trabajo
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Teléfono de trabajo: ${telefonotrabajoResponsable2}`,
            10,
            165
          );
        } else {
          pdf.text(
            `Teléfono de trabajo: ${telefonotrabajoResponsable2}`,
            10,
            160
          );
        }

        // Es PEP
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable2}`,
            10,
            175
          );
        } else {
          pdf.text(
            `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable2}`,
            10,
            170
          );
        }

        //negrita
        pdf.setFont("helvetica", "bold");
        // Ocupación PEP
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
            10,
            185
          );
        } else {
          pdf.text(
            `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
            10,
            180
          );
        }

        //normal
        pdf.setFont("helvetica", "normal");
        // Ocupación PEP
        if (direccionFragmentos2.length > 1) {
          pdf.text(`${pepoccupationResponsable2}`, 10, 195);
        } else {
          pdf.text(`${pepoccupationResponsable2}`, 10, 190);
        }

        // Es PEP 3 años
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable2}`,
            10,
            205
          );
        } else {
          pdf.text(
            `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable2}`,
            10,
            200
          );
        }

        //negrita
        pdf.setFont("helvetica", "bold");

        // Ocupación PEP 3 años, dividir en 2 lineas si llega al final del ancho del pdf, aplicar lo mismo que dirección
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Puesto que ocupó en caso de ser una Persona Políticamente Expuesta:`,
            10,
            215
          );
        } else {
          pdf.text(
            `Puesto que ocupó en caso de haber sido una Persona Políticamente Expuesta:`,
            10,
            210
          );
        }

        //normal
        pdf.setFont("helvetica", "normal");
        // Ocupación PEP 3 años
        if (direccionFragmentos2.length > 1) {
          pdf.text(`${pepoccupation3Responsable2}`, 10, 225);
        } else {
          pdf.text(`${pepoccupation3Responsable2}`, 10, 220);
        }

        // Ingresos
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Rango de ingresos mensuales familiares: ${incomingsResponsable2}`,
            10,
            235
          );
        } else {
          pdf.text(
            `Rango de ingresos mensuales familiares: ${incomingsResponsable2}`,
            10,
            230
          );
        }
      }
      /*---------------------------------FIN PDF POSICION 2---------------------------------*/

      /*---------------------------------PDF POSICION 3---------------------------------*/
      //Agregar pagina nueva si if (dataResponsable.length > 2)
      if (dataResponsable.length > 2) {
        pdf.addPage();
        pdf.addImage(
          backgroundImg,
          "JPEG",
          x,
          y,
          imgWidth,
          imgHeight,
          undefined,
          "FAST",
          0,
          1
        );

        // datos generales
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(15);
        pdf.setTextColor(0, 0, 0);
        const datosGenerales3 = "Datos Generales";
        const datosGeneralesX3 = pageSize.getWidth() / 2;
        const datosGeneralesY3 = 45;
        const datosGeneralesWidth3 =
          pdf.getStringUnitWidth(datosGenerales3) * pdf.internal.getFontSize();
        pdf.text(datosGenerales3, datosGeneralesX3, datosGeneralesY3, {
          align: "center",
        });

        // Establecer negrita solo para el texto quemado
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);

        // Imprimir datos en dos columnas
        pdf.text(`Nombres: ${nombreResponsable3}`, 10, 60);
        pdf.text(
          `Apellidos: ${apellidoResponsable3}`,
          pageSize.getWidth() / 2 + 10,
          60
        );

        // Parentesco con el alumno
        pdf.text(`Parentesco con el alumno: ${tipoResponsable3}`, 10, 70);
        // Poner a la par de parentesco con el alumno solo si tipoResponsable === "Tutor Legal"
        if (tipoResponsable3 === "Tutor Legal") {
          pdf.text(
            `Relación con el alumno: ${relacionestudianteResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            70
          );
        }

        // Fecha de nacimiento
        pdf.text(`Fecha de nacimiento: ${fechaFormateadaResponsable3}`, 10, 80);

        // Numero de documento a la par de fecha de nacimiento
        pdf.text(
          `Número de documento: ${numeroduiResponsable3}`,
          pageSize.getWidth() / 2 + 10,
          80
        );

        // NIT
        pdf.text(`NIT: ${numeronitResponsable3}`, 10, 90);

        // Nacionalidad a la par de NIT
        pdf.text(
          `Nacionalidad: ${nacionalidadResponsable3}`,
          pageSize.getWidth() / 2 + 10,
          90
        );

        // Direccion y ver si se divide en 2 lineas
        const direccionTexto3 = `Dirección: ${direccionResponsable3}`;
        const direccionFragmentos3 = pdf.splitTextToSize(
          direccionTexto3,
          pageSize.getWidth() - 20
        );
        pdf.text(direccionFragmentos3, 10, 100);

        // Departamento, verificar antes si la direccion fue dividida en 2
        if (direccionFragmentos3.length > 1) {
          pdf.text(`Departamento: ${departamentoResponsable3}`, 10, 115);
        } else {
          pdf.text(`Departamento: ${departamentoResponsable3}`, 10, 110);
        }

        // Municipio a la par de departamento a la misma altura, verficar direccion 2 lineas
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Municipio: ${municipioResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            115
          );
        } else {
          pdf.text(
            `Municipio: ${municipioResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            110
          );
        }

        // correo
        if (direccionFragmentos3.length > 1) {
          pdf.text(`Correo: ${emailResponsable3}`, 10, 125);
        } else {
          pdf.text(`Correo: ${emailResponsable3}`, 10, 120);
        }

        // correo a la par de celular
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Teléfono celular: ${telefonoCelularResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            125
          );
        } else {
          pdf.text(
            `Teléfono celular: ${telefonoCelularResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            120
          );
        }

        // Ocupación
        if (direccionFragmentos3.length > 1) {
          pdf.text(`Ocupación: ${occupationResponsable3}`, 10, 135);
        } else {
          pdf.text(`Ocupación: ${occupationResponsable3}`, 10, 130);
        }

        // Lugar de trabajo en 140 o 145
        if (direccionFragmentos3.length > 1) {
          pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable3}`, 10, 145);
        } else {
          pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable3}`, 10, 140);
        }

        // Posicion de trabajo
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Posición de trabajo: ${posiciontrabajoResponsable3}`,
            10,
            155
          );
        } else {
          pdf.text(
            `Posición de trabajo: ${posiciontrabajoResponsable3}`,
            10,
            150
          );
        }

        // Teléfono de trabajo
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Teléfono de trabajo: ${telefonotrabajoResponsable3}`,
            10,
            165
          );
        } else {
          pdf.text(
            `Teléfono de trabajo: ${telefonotrabajoResponsable3}`,
            10,
            160
          );
        }

        // Es PEP
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable3}`,
            10,
            175
          );
        } else {
          pdf.text(
            `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable3}`,
            10,
            170
          );
        }

        //negrita
        pdf.setFont("helvetica", "bold");
        // Ocupación PEP
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
            10,
            185
          );
        } else {
          pdf.text(
            `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
            10,
            180
          );
        }

        //normal
        pdf.setFont("helvetica", "normal");
        // Ocupación PEP
        if (direccionFragmentos3.length > 1) {
          pdf.text(`${pepoccupationResponsable3}`, 10, 195);
        } else {
          pdf.text(`${pepoccupationResponsable3}`, 10, 190);
        }

        // Es PEP 3 años
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable3}`,
            10,
            205
          );
        } else {
          pdf.text(
            `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable3}`,
            10,
            200
          );
        }

        //negrita
        pdf.setFont("helvetica", "bold");

        // Ocupación PEP 3 años, dividir en 2 lineas si llega al final del ancho del pdf, aplicar lo mismo que dirección
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Puesto que ocupó en caso de ser una Persona Políticamente Expuesta:`,
            10,
            215
          );
        } else {
          pdf.text(
            `Puesto que ocupó en caso de haber sido una Persona Políticamente Expuesta:`,
            10,
            210
          );
        }

        //normal
        pdf.setFont("helvetica", "normal");
        // Ocupación PEP 3 años
        if (direccionFragmentos3.length > 1) {
          pdf.text(`${pepoccupation3Responsable3}`, 10, 225);
        } else {
          pdf.text(`${pepoccupation3Responsable3}`, 10, 220);
        }

        // Ingresos
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Rango de ingresos mensuales familiares: ${incomingsResponsable3}`,
            10,
            235
          );
        } else {
          pdf.text(
            `Rango de ingresos mensuales familiares: ${incomingsResponsable3}`,
            10,
            230
          );
        }

        /*---------------------------------FIN PDF POSICION 3---------------------------------*/
      }
      // Agregar una nueva página
      pdf.addPage();
      pdf.addImage(
        backgroundImg,
        "JPEG",
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
        0,
        1
      );
      //Imprimir titular como Datos Generales, ahora llamado Datos de Emergencia
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(0, 0, 0);
      const datosEmergencia = "Declaración Jurada";
      const datosEmergenciaX = pageSize.getWidth() / 2;
      let datosEmergenciaY = 30;
      const datosEmergenciaWidth =
        pdf.getStringUnitWidth(datosEmergencia) * pdf.internal.getFontSize();
      pdf.text(datosEmergencia, datosEmergenciaX, datosEmergenciaY, {
        align: "center",
      });
      pdf.setFontSize(12);

      // imprimir el siguiente texto
      const margin = 10;
      const columnWidth = pageSize.getWidth() - 2 * margin;

      // Cambio para dividir el texto en líneas
      const textoLargo =
        "Yo, _____________________________________________, declaro bajo juramento que la información " +
        "proporcionada es correcta y autorizamos a FUNDACIÓN EXTERNADO DE SAN JOSÉ para que confirme su veracidad. " +
        "Nos comprometemos a mantener actualizada la información. Declaro que no estoy incluido/a en cualquier " +
        "lista de control relacionada al Lavado de Dinero y de Activos y/o de Financiamiento " +
        "al Terrorismo, o en alguna de carácter nacional y/o internacional en la que se publiquen " +
        "los datos de las personas a quienes se les haya iniciado proceso judicial, actuación administrativa " +
        "o que hayan sido sancionadas y/o condenadas por las autoridades nacionales e internacionales, " +
        "de manera directa o indirecta, con actividades ilegales, tales como narcotráfico, terrorismo " +
        "o su financiación, lavado de dinero y activos, tráfico de estupefacientes, secuestro, extorsiones y trata de personas, entre otras. " +
        "Y para que así conste a los efectos oportunos, firmo la presente declaración jurada de información en ____________________   a los ______ días del mes de _____ de _______.";

      pdf.text(textoLargo, margin, 50, {
        align: "left",
        maxWidth: columnWidth,
      });

      //Firma _________________
      pdf.text(`Firma: _____________________`, 10, 115);

      // Agregar una nueva página
      pdf.addPage();
      pdf.addImage(
        backgroundImg,
        "JPEG",
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
        0,
        1
      );
      //Imprimir titular como Datos Generales, ahora llamado Para Uso Exclusivo de la Fundación
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(0, 0, 0);
      const datosExclusivos = "Para Uso Exclusivo de la Fundación";
      const datosExclusivosX = pageSize.getWidth() / 2;
      let datosExclusivosY = 30;
      const datosExclusivosWidth =
        pdf.getStringUnitWidth(datosExclusivos) * pdf.internal.getFontSize();
      pdf.text(datosExclusivos, datosExclusivosX, datosExclusivosY, {
        align: "center",
      });
      pdf.setFontSize(12);

      // Imprimir el siguiente texto
      /* Para efectos de tener por conocida y aceptada toda la información antes proporcionada,
       se relacionan los siguientes nombres, firmas y sellos respectivos.*/
      const textoExclusivo =
        "Para efectos de tener por conocida y aceptada toda la información antes proporcionada, " +
        "se relacionan los siguientes nombres, firmas y sellos respectivos.";
      pdf.text(textoExclusivo, margin, 50, {
        align: "left",
        maxWidth: columnWidth,
      });
      // Imprimir Firma y Designado de en dos columnas al centro
      const firmaColumn1 = "Firma";
      const firmaColumn2 = "Firma";
      const designadoColumn1 = "Designado de Cumplimiento";
      const designadoColumn2 = "Miembro del Directorio";

      const fontSize = 12;
      const lineHeight = 7; // Puedes ajustar el interlineado según tu preferencia
      const column1X = pageSize.getWidth() / 4;
      const column2X = (pageSize.getWidth() * 3) / 4;

      pdf.setFontSize(fontSize);
      pdf.setTextColor(0, 0, 0);
      const offsetY = 60;
      const offsetY2 = 30;
      // Imprimir en dos columnas al centro
      pdf.text(firmaColumn1, column1X, 150 - offsetY, { align: "center" });
      pdf.text(firmaColumn2, column2X, 150 - offsetY, { align: "center" });

      pdf.text(designadoColumn1, column1X, 160 - offsetY, { align: "center" });
      pdf.text(designadoColumn2, column2X, 160 - offsetY, { align: "center" });

      const sello1 = "Sello";
      const sello2 = "Sello";

      pdf.text(sello1, column1X, 170 - offsetY2, { align: "center" });
      pdf.text(sello2, column2X, 170 - offsetY2, { align: "center" });

      pdf.save("formulario.pdf");

      //cerrar modal
      setShowModal(false);
    }
  };

  const handleGenerarPDF1 = async () => {
    // Lógica para generar el PDF según el tipo (Matricula o Registro)
    if (dataEstudiante) {
      const nombreEstudiante = dataEstudiante.externado_student_firstname;
      const apellidoEstudiante = dataEstudiante.externado_student_lastname;
      const lugarNacimiento = dataEstudiante.externado_student_birthplace;
      const fechaNacimiento = dataEstudiante.externado_student_birthdate;
      // Crear un objeto de fecha
      const fecha = new Date(fechaNacimiento);

      // Obtener el año, mes y día
      const año = fecha.getFullYear();
      const mes = fecha.getMonth() + 1; // ¡Recuerda que los meses comienzan en 0!
      const dia = fecha.getDate();

      // Formatear la fecha como una cadena YYYY-MM-DD
      const fechaFormateada = `${año}-${mes < 10 ? "0" + mes : mes}-${
        dia < 10 ? "0" + dia : dia
      }`;

      const nacionalidadEstudiante =
        dataEstudiante.externado_student_nationality;
      let generoEstudiante = dataEstudiante.externado_student_gender;
      if (generoEstudiante === true) {
        //Asignar a generoEstudiante el valor de Femenino
        generoEstudiante = "Femenino";
      } else {
        generoEstudiante = "Masculino";
      }
      //alert("Genero: " + generoEstudiante);
      //console.log("Genero: " + generoEstudiante);
      const direccionEstudiante = dataEstudiante.externado_student_address;
      const municipioEstudiante = dataEstudiante.externado_student_town;
      const departamentoEstudiante =
        dataEstudiante.externadoDepartment.externado_department;
      const celularEstudiante = dataEstudiante.externado_student_phone;
      const correoEstudiante = dataEstudiante.externado_student_email;
      const ultimaescuelaEstudiante =
        dataEstudiante.externado_student_last_school;
      const gradoEstudiante = dataEstudiante.externadoLevel.externado_level;
      let hermanosEstudiante = dataEstudiante.externado_student_has_siblings;
      if (hermanosEstudiante === true) {
        hermanosEstudiante = "Si";
      } else {
        hermanosEstudiante = "No";
      }
      //Arreglo de hermanos
      const hermanosEstudianteString =
        dataEstudiante.externado_student_siblings;
      let hermanosEstudianteArray = [];

      // Declarar un objeto para almacenar las variables de los hermanos
      let hermanosVariables = {};
      // declarando los let de cada hermano
      let hermano1nombreEstudiante;
      let hermano1gradoEstudiante;
      let hermano2nombreEstudiante;
      let hermano2gradoEstudiante;
      let hermano3nombreEstudiante;
      let hermano3gradoEstudiante;

      try {
        // Intentar analizar la cadena JSON
        hermanosEstudianteArray = JSON.parse(hermanosEstudianteString);

        if (hermanosEstudianteArray.length > 0) {
          // La matriz de hermanos no está vacía

          // Iterar sobre los hermanos y obtener información
          hermanosEstudianteArray.forEach((hermano, index) => {
            const nombreKey = `hermano${index + 1}nombreEstudiante`;
            const gradoKey = `hermano${index + 1}gradoEstudiante`;

            const nombreEstudiante = hermano.name || "N/a";
            const gradoEstudiante = hermano.grade || "N/a";

            // Guardar en el objeto de variables
            hermanosVariables[nombreKey] = nombreEstudiante;
            hermanosVariables[gradoKey] = gradoEstudiante;
          });
        } else {
          // La matriz de hermanos está vacía
          //console.log("No tiene hermanos.");
        }

        // Asignando a cada let de estudiantes el valor de cada hermano
        hermano1nombreEstudiante = hermanosVariables.hermano1nombreEstudiante;
        hermano1gradoEstudiante = hermanosVariables.hermano1gradoEstudiante;
        hermano2nombreEstudiante = hermanosVariables.hermano2nombreEstudiante;
        hermano2gradoEstudiante = hermanosVariables.hermano2gradoEstudiante;
        hermano3nombreEstudiante = hermanosVariables.hermano3nombreEstudiante;
        hermano3gradoEstudiante = hermanosVariables.hermano3gradoEstudiante;

        //(0,'Favor seleccionar un valor'),(1,'Preparatoria'),(2,'Primero'),(3,'Segundo'),(4,'Tercero'),(5,'Cuarto Matutino'),(6,'Cuarto Vespertino'),
        //(7,'Quinto Matutino'),(8,'Quinto Vespertino'),(9,'Sexto Matutino'),(10,'Sexto Vespertino'),(11,'Séptimo Matutino'),(12,'Séptimo Vespertino'),
        //(13,'Octavo Matutino'),(14,'Octavo Vespertino'),(15,'Noveno Matutino'),(16,'Noveno Vespertino'),(17,'Primero de Bachillerato'),(18,'Segundo de Bachillerato');
        if (hermano1gradoEstudiante === "1") {
          hermano1gradoEstudiante = "Preparatoria";
        } else if (hermano1gradoEstudiante === "2") {
          hermano1gradoEstudiante = "Primero";
        } else if (hermano1gradoEstudiante === "3") {
          hermano1gradoEstudiante = "Segundo";
        } else if (hermano1gradoEstudiante === "4") {
          hermano1gradoEstudiante = "Tercero";
        } else if (hermano1gradoEstudiante === "5") {
          hermano1gradoEstudiante = "Cuarto Matutino";
        } else if (hermano1gradoEstudiante === "6") {
          hermano1gradoEstudiante = "Cuarto Vespertino";
        } else if (hermano1gradoEstudiante === "7") {
          hermano1gradoEstudiante = "Quinto Matutino";
        } else if (hermano1gradoEstudiante === "8") {
          hermano1gradoEstudiante = "Quinto Vespertino";
        } else if (hermano1gradoEstudiante === "9") {
          hermano1gradoEstudiante = "Sexto Matutino";
        } else if (hermano1gradoEstudiante === "10") {
          hermano1gradoEstudiante = "Sexto Vespertino";
        } else if (hermano1gradoEstudiante === "11") {
          hermano1gradoEstudiante = "Séptimo Matutino";
        } else if (hermano1gradoEstudiante === "12") {
          hermano1gradoEstudiante = "Séptimo Vespertino";
        } else if (hermano1gradoEstudiante === "13") {
          hermano1gradoEstudiante = "Octavo Matutino";
        } else if (hermano1gradoEstudiante === "14") {
          hermano1gradoEstudiante = "Octavo Vespertino";
        } else if (hermano1gradoEstudiante === "15") {
          hermano1gradoEstudiante = "Noveno Matutino";
        } else if (hermano1gradoEstudiante === "16") {
          hermano1gradoEstudiante = "Noveno Vespertino";
        } else if (hermano1gradoEstudiante === "17") {
          hermano1gradoEstudiante = "Primero de Bachillerato";
        } else if (hermano1gradoEstudiante === "18") {
          hermano1gradoEstudiante = "Segundo de Bachillerato";
        }

        if (hermano2gradoEstudiante === "1") {
          hermano2gradoEstudiante = "Preparatoria";
        } else if (hermano2gradoEstudiante === "2") {
          hermano2gradoEstudiante = "Primero";
        } else if (hermano2gradoEstudiante === "3") {
          hermano2gradoEstudiante = "Segundo";
        } else if (hermano2gradoEstudiante === "4") {
          hermano2gradoEstudiante = "Tercero";
        } else if (hermano2gradoEstudiante === "5") {
          hermano2gradoEstudiante = "Cuarto Matutino";
        } else if (hermano2gradoEstudiante === "6") {
          hermano2gradoEstudiante = "Cuarto Vespertino";
        } else if (hermano2gradoEstudiante === "7") {
          hermano2gradoEstudiante = "Quinto Matutino";
        } else if (hermano2gradoEstudiante === "8") {
          hermano2gradoEstudiante = "Quinto Vespertino";
        } else if (hermano2gradoEstudiante === "9") {
          hermano2gradoEstudiante = "Sexto Matutino";
        } else if (hermano2gradoEstudiante === "10") {
          hermano2gradoEstudiante = "Sexto Vespertino";
        } else if (hermano2gradoEstudiante === "11") {
          hermano2gradoEstudiante = "Séptimo Matutino";
        } else if (hermano2gradoEstudiante === "12") {
          hermano2gradoEstudiante = "Séptimo Vespertino";
        } else if (hermano2gradoEstudiante === "13") {
          hermano2gradoEstudiante = "Octavo Matutino";
        } else if (hermano2gradoEstudiante === "14") {
          hermano2gradoEstudiante = "Octavo Vespertino";
        } else if (hermano2gradoEstudiante === "15") {
          hermano2gradoEstudiante = "Noveno Matutino";
        } else if (hermano2gradoEstudiante === "16") {
          hermano2gradoEstudiante = "Noveno Vespertino";
        } else if (hermano2gradoEstudiante === "17") {
          hermano2gradoEstudiante = "Primero de Bachillerato";
        } else if (hermano2gradoEstudiante === "18") {
          hermano2gradoEstudiante = "Segundo de Bachillerato";
        }

        if (hermano3gradoEstudiante === "1") {
          hermano3gradoEstudiante = "Preparatoria";
        }
        if (hermano3gradoEstudiante === "2") {
          hermano3gradoEstudiante = "Primero";
        }
        if (hermano3gradoEstudiante === "3") {
          hermano3gradoEstudiante = "Segundo";
        }
        if (hermano3gradoEstudiante === "4") {
          hermano3gradoEstudiante = "Tercero";
        }
        if (hermano3gradoEstudiante === "5") {
          hermano3gradoEstudiante = "Cuarto Matutino";
        }
        if (hermano3gradoEstudiante === "6") {
          hermano3gradoEstudiante = "Cuarto Vespertino";
        }
        if (hermano3gradoEstudiante === "7") {
          hermano3gradoEstudiante = "Quinto Matutino";
        }
        if (hermano3gradoEstudiante === "8") {
          hermano3gradoEstudiante = "Quinto Vespertino";
        }
        if (hermano3gradoEstudiante === "9") {
          hermano3gradoEstudiante = "Sexto Matutino";
        }
        if (hermano3gradoEstudiante === "10") {
          hermano3gradoEstudiante = "Sexto Vespertino";
        }
        if (hermano3gradoEstudiante === "11") {
          hermano3gradoEstudiante = "Séptimo Matutino";
        }
        if (hermano3gradoEstudiante === "12") {
          hermano3gradoEstudiante = "Séptimo Vespertino";
        }
        if (hermano3gradoEstudiante === "13") {
          hermano3gradoEstudiante = "Octavo Matutino";
        }
        if (hermano3gradoEstudiante === "14") {
          hermano3gradoEstudiante = "Octavo Vespertino";
        }
        if (hermano3gradoEstudiante === "15") {
          hermano3gradoEstudiante = "Noveno Matutino";
        }
        if (hermano3gradoEstudiante === "16") {
          hermano3gradoEstudiante = "Noveno Vespertino";
        }
        if (hermano3gradoEstudiante === "17") {
          hermano3gradoEstudiante = "Primero de Bachillerato";
        }
        if (hermano3gradoEstudiante === "18") {
          hermano3gradoEstudiante = "Segundo de Bachillerato";
        }
      } catch (error) {
        // Error al analizar la cadena JSON
        //console.error("Error al analizar la cadena JSON de hermanos.", error);
      }

      //Imprimir en consola los hermanos del estudiante y su grado en una sola linea por cada uno
      /* //console.log(
        "Hermano 1: " +
          hermano1nombreEstudiante +
          " Grado: " +
          hermano1gradoEstudiante
      );
      //console.log(
        "Hermano 2: " +
          hermano2nombreEstudiante +
          " Grado: " +
          hermano2gradoEstudiante
      );
      //console.log(
        "Hermano 3: " +
          hermano3nombreEstudiante +
          " Grado: " +
          hermano3gradoEstudiante
      ); */

      let viveconAmbosEstudiante =
        dataEstudiante.externado_student_lives_with_parents;
      let viveconQuienEstudiante = "N/a"; // Declaración fuera del bloque if
      let parentescoEstudiante = "N/a"; // Declaración fuera del bloque if
      if (viveconAmbosEstudiante === true) {
        viveconAmbosEstudiante = "Si";
      } else {
        viveconAmbosEstudiante = "No";
        viveconQuienEstudiante =
          dataEstudiante.externado_student_lives_with_who;
        parentescoEstudiante =
          dataEstudiante.externado_student_lives_with_related;
      }
      let estudianteCatolico = dataEstudiante.externado_student_catholic;
      let religionEstudiante; // Declaración fuera del bloque if
      let religionotrosEstudiante; // Declaración fuera del bloque if
      if (estudianteCatolico === true) {
        estudianteCatolico = "Si";
      } else if (
        estudianteCatolico === false &&
        dataEstudiante.externadoChurch.externado_church_value === "Otra"
      ) {
        estudianteCatolico = "No";
        religionEstudiante =
          dataEstudiante.externadoChurch.externado_student_church_other;
      } else {
        estudianteCatolico = "No";
        religionEstudiante =
          dataEstudiante.externadoChurch.externado_church_value;
      }
      const nombreEmergencia = dataEstudiante.externado_student_emergency_name;
      const relacionEmergencia =
        dataEstudiante.externado_student_emergency_relationship;
      const direccionEmergencia =
        dataEstudiante.externado_student_emergency_address;
      const telefonoEmergencia =
        dataEstudiante.externado_student_emergency_phone;
      let responsableEstudiante = dataEstudiante.externado_student_resp_type_id;
      let nombreResponsable = "N/a"; // Declaración fuera del bloque if
      let direccionResponsable = "N/a"; // Declaración fuera del bloque if
      let telefonoCasaResponsable = "N/a"; // Declaración fuera del bloque if
      let telefonoTrabajoResponsable = "N/a"; // Declaración fuera del bloque if
      let telefonoCelularResponsable = "N/a"; // Declaración fuera del bloque if
      let correoResponsable = "N/a"; // Declaración fuera del bloque if
      let duiResponsable = "N/a"; // Declaración fuera del bloque if
      if (responsableEstudiante === 1) {
        responsableEstudiante = "Mamá";
      } else if (responsableEstudiante === 2) {
        responsableEstudiante = "Papá";
      } else if (responsableEstudiante === 3) {
        responsableEstudiante = "Mamá y Papá";
      } else {
        responsableEstudiante = "Otro";
        nombreResponsable = dataEstudiante.externado_student_rep_name;
        direccionResponsable = dataEstudiante.externado_student_rep_address;
        telefonoCasaResponsable =
          dataEstudiante.externado_student_rep_homephone;
        telefonoTrabajoResponsable =
          dataEstudiante.externado_student_rep_work_phone;
        telefonoCelularResponsable =
          dataEstudiante.externado_student_rep_mobile_phone;
        correoResponsable = dataEstudiante.externado_student_rep_email;
        duiResponsable = dataEstudiante.externado_student_rep_id;
      }
      const pdf = new jsPDF();
      const pageSize = pdf.internal.pageSize;
      const imgWidth = pageSize.getWidth() * 0.8;
      const { width: imgOrigWidth, height: imgOrigHeight } =
        await getImageProperties(backgroundImg);

      const imgHeight = (imgWidth * imgOrigHeight) / imgOrigWidth;

      const x = (pageSize.getWidth() - imgWidth) / 2;
      const y = (pageSize.getHeight() - imgHeight) / 2;

      pdf.addImage(
        backgroundImg,
        "JPEG",
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
        0,
        1
      );

      // Título centrado y subrayado
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      const titulo = "Ficha de Matrícula ESJ";
      const tituloX = pageSize.getWidth() / 2;
      const tituloY = 25;
      const tituloWidth =
        pdf.getStringUnitWidth(titulo) * pdf.internal.getFontSize();
      pdf.text(titulo, tituloX, tituloY, { align: "center" });

      // Dibujar una línea justo debajo del texto para simular el subrayado
      pdf.setLineWidth(0.5);
      pdf.line(
        tituloX - tituloWidth / 2,
        tituloY + 2,
        tituloX + tituloWidth / 2,
        tituloY + 2
      );

      // Datos generales texto centrado sin negrita tamaño 15
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(0, 0, 0);
      const datosGenerales = "Datos Generales";
      const datosGeneralesX = pageSize.getWidth() / 2;
      const datosGeneralesY = 45;
      const datosGeneralesWidth =
        pdf.getStringUnitWidth(datosGenerales) * pdf.internal.getFontSize();
      pdf.text(datosGenerales, datosGeneralesX, datosGeneralesY, {
        align: "center",
      });

      // Establecer negrita solo para el texto quemado
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      // Imprimir datos en dos columnas
      pdf.text(`Nombres: ${nombreEstudiante}`, 10, 60);
      pdf.text(
        `Apellidos: ${apellidoEstudiante}`,
        pageSize.getWidth() / 2 + 10,
        60
      );
      // dirección de residencia
      const direccionTexto = `Dirección: ${direccionEstudiante}`;
      const direccionFragmentos = pdf.splitTextToSize(
        direccionTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(direccionFragmentos, 10, 70);

      // Aumentar el espacio vertical entre líneas
      const espacioVertical = 10;

      // Departamento
      const departamentoTexto = `Departamento: ${departamentoEstudiante}`;
      let departamentoPosicionY = 80; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1) {
        departamentoPosicionY = 85;
      }

      const departamentoFragmentos = pdf.splitTextToSize(
        departamentoTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(departamentoFragmentos, 10, departamentoPosicionY);

      // Calcular el espacio vertical necesario para el fragmento de departamento
      const espacioDepartamento =
        departamentoFragmentos.length * espacioVertical;

      // Municipio
      const municipioTexto = `Municipio: ${municipioEstudiante}`;
      let municipioPosicionY = 80; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1) {
        municipioPosicionY = 85;
      }

      const municipioFragmentos = pdf.splitTextToSize(
        municipioTexto,
        pageSize.getWidth() / 2 - 20
      );
      pdf.text(
        municipioFragmentos,
        pageSize.getWidth() / 2 + 10,
        municipioPosicionY
      );

      //lugar de nacimiento
      const lugardenacimientoTexto = `Lugar de nacimiento: ${lugarNacimiento}`;
      let lugardenacimientoPosicionY = 90; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1) {
        lugardenacimientoPosicionY = 95;
      }

      const lugardenacimientoFragmentos = pdf.splitTextToSize(
        lugardenacimientoTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(lugardenacimientoFragmentos, 10, lugardenacimientoPosicionY);

      // Fecha de nacimiento a la par de lugar de nacimiento
      const fechanacimientoTexto = `Fecha de nacimiento: ${fechaFormateada}`;
      let fechanacimientoPosicionY = 90; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1) {
        fechanacimientoPosicionY = 95;
      }

      const fechanacimientoFragmentos = pdf.splitTextToSize(
        fechanacimientoTexto,
        pageSize.getWidth() / 2 - 20
      );
      pdf.text(
        fechanacimientoFragmentos,
        pageSize.getWidth() / 2 + 10,
        fechanacimientoPosicionY
      );

      //Nacionalidad
      const nacionalidadTexto = `Nacionalidad: ${nacionalidadEstudiante}`;
      let nacionalidadPosicionY = 100; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1) {
        nacionalidadPosicionY = 105;
      }

      const nacionalidadFragmentos = pdf.splitTextToSize(
        nacionalidadTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(nacionalidadFragmentos, 10, nacionalidadPosicionY);

      // Genero a la par de Nacionalidad
      const generoTexto = `Género: ${generoEstudiante}`;
      let generoPosicionY = 100; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1) {
        generoPosicionY = 105;
      }

      const generoFragmentos = pdf.splitTextToSize(
        generoTexto,
        pageSize.getWidth() / 2 - 20
      );
      pdf.text(generoFragmentos, pageSize.getWidth() / 2 + 10, generoPosicionY);

      // Celular
      const celularTexto = `Teléfono celular: ${celularEstudiante}`;
      let celularPosicionY = 110; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1) {
        celularPosicionY = 115;
      }

      const celularFragmentos = pdf.splitTextToSize(
        celularTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(celularFragmentos, 10, celularPosicionY);

      // Correo a la par de celular
      const correoTexto = `Correo: ${correoEstudiante}`;
      let correoPosicionY = 110; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1) {
        correoPosicionY = 115;
      }

      const correoFragmentos = pdf.splitTextToSize(
        correoTexto,
        pageSize.getWidth() / 2 - 20
      );
      pdf.text(correoFragmentos, pageSize.getWidth() / 2 + 10, correoPosicionY);

      // Posición inicial de los campos después de la pregunta sobre la religión

      // El estudiante es catolico
      const catolicoTexto = `¿El estudiante es católico?: ${estudianteCatolico}`;
      let catolicoPosicionY = 120; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentos.length > 1 || celularFragmentos.length > 1) {
        catolicoPosicionY = 125; // Ajustar la posición si se dividió el texto
      }

      const catolicoFragmentos = pdf.splitTextToSize(
        catolicoTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(catolicoFragmentos, 10, catolicoPosicionY);

      // Declarar religionFragmentos fuera de los bloques if
      let religionFragmentos;

      // Si el estudiante no es catolico, poner a la par Religion: a la misma altura que ¿El estudiante es católico?:
      if (estudianteCatolico === "No") {
        // Religion
        const religionTexto = `Otra religión: ${religionEstudiante}`;
        let religionPosicionY = 120; // Posición predeterminada

        // Verificar si el texto de dirección se dividió en dos líneas
        if (
          direccionFragmentos.length > 1 ||
          celularFragmentos.length > 1 ||
          catolicoFragmentos.length > 1
        ) {
          religionPosicionY = 125; // Ajustar la posición si se dividió el texto
        }

        religionFragmentos = pdf.splitTextToSize(
          religionTexto,
          pageSize.getWidth() / 2 - 20
        );
        pdf.text(
          religionFragmentos,
          pageSize.getWidth() / 2 + 10,
          religionPosicionY
        );
      }

      // Si el estudiante si es catolico, colocar Religion: N/a a la par de ¿El estudiante es católico?
      if (estudianteCatolico === "Si") {
        // Religion
        const religionTexto = `Otra religión: N/a`;
        let religionPosicionY = 120; // Posición predeterminada

        // Verificar si el texto de dirección se dividió en dos líneas
        if (
          direccionFragmentos.length > 1 ||
          celularFragmentos.length > 1 ||
          catolicoFragmentos.length > 1
        ) {
          religionPosicionY = 125; // Ajustar la posición si se dividió el texto
        }

        religionFragmentos = pdf.splitTextToSize(
          religionTexto,
          pageSize.getWidth() / 2 - 20
        );
        pdf.text(
          religionFragmentos,
          pageSize.getWidth() / 2 + 10,
          religionPosicionY
        );
      }

      // Escuela anterior
      const escuelaTexto = `Escuela o colegio en el que estudió en el anterior año escolar: ${ultimaescuelaEstudiante}`;
      let escuelaPosicionY = 130; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        escuelaPosicionY = 135; // Ajustar la posición si se dividió el texto
      }

      //Imprimir escuela anterior
      pdf.text(escuelaTexto, 10, escuelaPosicionY);

      // Grado
      const gradoTexto = `Grado que cursará en el siguiente año escolar: ${gradoEstudiante}`;
      let gradoPosicionY = 140; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        gradoPosicionY = 145; // Ajustar la posición si se dividió el texto
      }

      //Imprimir grado
      pdf.text(gradoTexto, 10, gradoPosicionY);

      // Tiene Hermanos
      const hermanosTexto = `¿Tiene hermanos en el colegio?: ${hermanosEstudiante}`;
      let hermanosPosicionY = 150; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hermanosPosicionY = 155; // Ajustar la posición si se dividió el texto
      }

      //Imprimir tiene hermanos
      pdf.text(hermanosTexto, 10, hermanosPosicionY);
      // Nombre de los hermanos y grado que estudiaran en el 2024 en el colegio si se tienen (imprimir un texto) en negrita
      pdf.setFont("helvetica", "bold");
      let hermanosPosicionY2 = 160; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hermanosPosicionY2 = 165; // Ajustar la posición si se dividió el texto
      }

      pdf.text(
        `Nombre y Grado que cursarán los hermanos (en caso se tengan) en el ${siguiente}`,
        10,
        hermanosPosicionY2
      );

      pdf.setFont("helvetica", "normal");
      // Imprimir a los 3 hermanos y sus grados en una fila cada uno separado por Nombres y Grado en 2 columnas
      // Hermano 1
      const hemano1Texto = `Nombre: ${hermano1nombreEstudiante}`;
      let hemano1PosicionY = 170; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hemano1PosicionY = 175; // Ajustar la posición si se dividió el texto
      }

      //Imprimir hermano 1
      pdf.text(hemano1Texto, 10, hemano1PosicionY);

      // Grado hermano 1 a la misma altura
      const hemano1GradoTexto = `Grado: ${hermano1gradoEstudiante}`;
      let hemano1GradoPosicionY = 170; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hemano1GradoPosicionY = 175; // Ajustar la posición si se dividió el texto
      }

      //Imprimir grado hermano 1
      pdf.text(
        hemano1GradoTexto,
        pageSize.getWidth() / 2 + 10,
        hemano1GradoPosicionY
      );

      // Hermano 2
      const hemano2Texto = `Nombre: ${hermano2nombreEstudiante}`;
      let hemano2PosicionY = 180; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hemano2PosicionY = 185; // Ajustar la posición si se dividió el texto
      }

      //Imprimir hermano 2
      pdf.text(hemano2Texto, 10, hemano2PosicionY);

      // Grado hermano 2 a la misma altura
      const hemano2GradoTexto = `Grado: ${hermano2gradoEstudiante}`;
      let hemano2GradoPosicionY = 180; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hemano2GradoPosicionY = 185; // Ajustar la posición si se dividió el texto
      }

      //Imprimir grado hermano 2
      pdf.text(
        hemano2GradoTexto,
        pageSize.getWidth() / 2 + 10,
        hemano2GradoPosicionY
      );

      // Hermano 3
      const hemano3Texto = `Nombre: ${hermano3nombreEstudiante}`;
      let hemano3PosicionY = 190; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hemano3PosicionY = 195; // Ajustar la posición si se dividió el texto
      }

      //Imprimir hermano 3
      pdf.text(hemano3Texto, 10, hemano3PosicionY);

      // Grado hermano 3 a la misma altura
      const hemano3GradoTexto = `Grado: ${hermano3gradoEstudiante}`;
      let hemano3GradoPosicionY = 190; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hemano3GradoPosicionY = 195; // Ajustar la posición si se dividió el texto
      }

      //Imprimir grado hermano 3
      pdf.text(
        hemano3GradoTexto,
        pageSize.getWidth() / 2 + 10,
        hemano3GradoPosicionY
      );

      // Vive con ambos padres
      const viveconambosTexto = `¿Vive con ambos padres?: ${viveconAmbosEstudiante}`;
      let viveconambosPosicionY = 200; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        viveconambosPosicionY = 205; // Ajustar la posición si se dividió el texto
      }

      //Imprimir vive con ambos padres
      pdf.text(viveconambosTexto, 10, viveconambosPosicionY);

      // Imprimir Si la respuesta es no, ¿Con quién vive el alumno/a? en negrita
      pdf.setFont("helvetica", "bold");
      let viveconambosPosicionY2 = 210; // Posición predeterminada

      // Verificar si los textos estan divididos en 2 lineas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        viveconambosPosicionY2 = 215; // Ajustar la posición si se dividió el texto
      }

      pdf.text(
        `Si la respuesta es no, ¿Con quién vive el alumno/a?`,
        10,
        viveconambosPosicionY2
      );

      pdf.setFont("helvetica", "normal");

      // Vive con quien
      const viveconquienTexto = `Nombre: ${viveconQuienEstudiante}`;
      let viveconquienPosicionY = 220; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        viveconquienPosicionY = 225; // Ajustar la posición si se dividió el texto
      }

      //Imprimir vive con quien
      pdf.text(viveconquienTexto, 10, viveconquienPosicionY);

      // Parentesco a la par de vive con quien a la misma altura
      const parentescoTexto = `Parentesco: ${parentescoEstudiante}`;
      let parentescoPosicionY = 220; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        parentescoPosicionY = 225; // Ajustar la posición si se dividió el texto
      }

      //Imprimir parentesco
      pdf.text(
        parentescoTexto,
        pageSize.getWidth() / 2 + 10,
        parentescoPosicionY
      );

      // Validar si el texto de dirección se dividió en dos líneas

      // Agregar una nueva página
      pdf.addPage();
      pdf.addImage(
        backgroundImg,
        "JPEG",
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
        0,
        1
      );
      //Imprimir titular como Datos Generales, ahora llamado Datos de Emergencia
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(0, 0, 0);
      const datosEmergencia = "Datos de Emergencia";
      const datosEmergenciaX = pageSize.getWidth() / 2;
      let datosEmergenciaY = 30;
      const datosEmergenciaWidth =
        pdf.getStringUnitWidth(datosEmergencia) * pdf.internal.getFontSize();
      pdf.text(datosEmergencia, datosEmergenciaX, datosEmergenciaY, {
        align: "center",
      });

      // Datos de emergencia

      pdf.setFontSize(12);

      //Imprimir texto como anteriores en negrita que diga Contacto de emergencia (en caso de que no se pueda localizar a los padres):
      pdf.setFont("helvetica", "bold");

      pdf.text(
        `Contacto de emergencia (en caso de que no se pueda localizar a los padres):`,
        10,
        40
      );
      pdf.setFont("helvetica", "normal");
      // Nombre de emergencia
      const nombreEmergenciaTexto = `Nombre: ${nombreEmergencia}`;
      let nombreEmergenciaPosicionY = 50; // Posición predeterminada

      // imprimir nombre de emergencia
      pdf.text(nombreEmergenciaTexto, 10, nombreEmergenciaPosicionY);

      // Parentesco de emergencia a la par de nombre de emergencia a la misma altura
      const relacionEmergenciaTexto = `Parentesco: ${relacionEmergencia}`;
      let relacionEmergenciaPosicionY = 50; // Posición predeterminada

      // imprimir parentesco de emergencia
      pdf.text(
        relacionEmergenciaTexto,
        pageSize.getWidth() / 2 + 10,
        relacionEmergenciaPosicionY
      );

      // Direccion de emergencia
      const direccionEmergenciaTexto = `Dirección: ${direccionEmergencia}`;
      let direccionEmergenciaPosicionY = 60; // Posición predeterminada

      // En caso sea extensa, partir en 2 lineas
      const direccionEmergenciaFragmentos = pdf.splitTextToSize(
        direccionEmergenciaTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(direccionEmergenciaFragmentos, 10, direccionEmergenciaPosicionY);

      // Numero emergencia
      const telefonoEmergenciaTexto = `Teléfono: ${telefonoEmergencia}`;
      let telefonoEmergenciaPosicionY = 70; // Posición predeterminada

      // Verificar si el texto de direccion de emergencia se divide en 2
      if (direccionEmergenciaFragmentos.length > 1) {
        telefonoEmergenciaPosicionY = 75; // Ajustar la posición si se dividió el texto
      }

      // imprimir numero de emergencia
      pdf.text(telefonoEmergenciaTexto, 10, telefonoEmergenciaPosicionY);

      // Imprimir Responsable del Estudiante al centro asi como Datos de Emergencia
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(0, 0, 0);
      const responsableEstudianteTexto = "Responsable del Estudiante";
      const responsableEstudianteTextoX = pageSize.getWidth() / 2;
      let responsableEstudianteTextoY = 90;
      const responsableEstudianteTextoWidth =
        pdf.getStringUnitWidth(responsableEstudianteTexto) *
        pdf.internal.getFontSize();

      //Validar si direccion emergencia se divide en 2 lineas
      if (direccionEmergenciaFragmentos.length > 1) {
        responsableEstudianteTextoY = 95;
      }

      pdf.text(
        responsableEstudianteTexto,
        responsableEstudianteTextoX,
        responsableEstudianteTextoY,
        {
          align: "center",
        }
      );
      pdf.setFontSize(12);
      // Imprimir texto en negrita que diga Responsable del estudiante en el colegio

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      // Imprimir nombre del responsable
      const responsableTexto = `Responsable: ${responsableEstudiante}`;
      let nombreResponsablePosicionY = 110; // Posición predeterminada

      // imprimir nombre del responsable
      pdf.text(responsableTexto, 10, nombreResponsablePosicionY);

      // Imprimir nombre del responsable
      const nombreResponsableTexto = `Nombre: ${nombreResponsable}`;
      let nombreResponsableTextoPosicionY = 120; // Posición predeterminada

      // imprimir nombre del responsable
      pdf.text(nombreResponsableTexto, 10, nombreResponsableTextoPosicionY);

      // Imprimir direccion del responsable
      const direccionResponsableTexto = `Dirección: ${direccionResponsable}`;
      let direccionResponsablePosicionY = 130; // Posición predeterminada

      // En caso sea extensa, partir en 2 lineas
      const direccionResponsableFragmentos = pdf.splitTextToSize(
        direccionResponsableTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(
        direccionResponsableFragmentos,
        10,
        direccionResponsablePosicionY
      );

      // Imprimir numero de DUI del responsable
      const duiResponsableTexto = `Número de DUI o Pasaporte: ${duiResponsable}`;
      let duiResponsablePosicionY = 140; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        duiResponsablePosicionY = 145; // Ajustar la posición si se dividió el texto
      }

      // imprimir DUI del responsable
      pdf.text(duiResponsableTexto, 10, duiResponsablePosicionY);

      // Imprimir telefono de casa del responsable a la par del numero de dui
      const telefonoCasaResponsableTexto = `Teléfono de casa: ${telefonoCasaResponsable}`;
      let telefonoCasaResponsablePosicionY = 140; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        telefonoCasaResponsablePosicionY = 145; // Ajustar la posición si se dividió el texto
      }

      // imprimir telefono de casa del responsable
      pdf.text(
        telefonoCasaResponsableTexto,
        pageSize.getWidth() / 2 + 10,
        telefonoCasaResponsablePosicionY
      );

      // Imprimir el telefono de trabajo del responsable
      const telefonoTrabajoResponsableTexto = `Teléfono de trabajo: ${telefonoTrabajoResponsable}`;
      let telefonoTrabajoResponsablePosicionY = 150; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        telefonoTrabajoResponsablePosicionY = 155; // Ajustar la posición si se dividió el texto
      }

      // imprimir telefono de trabajo del responsable
      pdf.text(
        telefonoTrabajoResponsableTexto,
        10,
        telefonoTrabajoResponsablePosicionY
      );

      // Imprimir el telefono celular del responsable a la par del telefono de trabajo
      const telefonoCelularResponsableTexto = `Teléfono celular: ${telefonoCelularResponsable}`;
      let telefonoCelularResponsablePosicionY = 150; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        telefonoCelularResponsablePosicionY = 155; // Ajustar la posición si se dividió el texto
      }

      // imprimir telefono celular del responsable
      pdf.text(
        telefonoCelularResponsableTexto,
        pageSize.getWidth() / 2 + 10,
        telefonoCelularResponsablePosicionY
      );

      // Imprimir el correo electronico del responsable
      const correoResponsableTexto = `Correo electrónico: ${correoResponsable}`;
      let correoResponsablePosicionY = 160; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        correoResponsablePosicionY = 165; // Ajustar la posición si se dividió el texto
      }

      // imprimir correo electronico del responsable
      pdf.text(correoResponsableTexto, 10, correoResponsablePosicionY);

      // Imprimir Nombre y firma de la persona que entrega este documento
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(
        `Nombre y firma de la persona que entrega este documento:`,
        10,
        180
      );

      // Imprimir Nombre:
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(
        `Nombre: ______________________________________________`,
        10,
        195
      );

      // Imprimir Firma:
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(`Firma: _________________________`, 10, 205);
      // Guardar o mostrar el PDF
      pdf.save("formulario.pdf");

      handleCloseModal();
    }
  };
  const getImageProperties = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = url;
    });
  };

  //Agregando estudiante
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const algunCampoVacio = Object.values(camposValidos).some(
      (estado) => estado === 1
    );

    if (
      validateDate(externado_student_birthdate) === false &&
      dateRef.current.value !== ""
    ) {
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageDUI("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageDate("Debe ingresar una fecha de nacimiento válida");
      dateRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmail(externado_student_email) === false &&
      emailRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");
      setMessageEmail("Debe ingresar un correo electrónico válido");
      emailRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmergencyTel(externado_student_emergency_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageEmergencyTel("Debe ingresar un número de teléfono válido");
      telEmergencyRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateDocument(
        externado_student_rep_id,
        externado_student_rep_id_type
      ) === false
    ) {
      setMessageDate("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");

      if (externado_student_rep_id_type === "1") {
        setMessageDUI("Debe ingresar un número de pasaporte válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      } else {
        setMessageDUI("Debe ingresar un número de DUI válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      }
    } else if (
      externado_student_resp_type_id === "4" &&
      validateHomeTel(externado_student_rep_homephone) === false &&
      telHomeRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageHomeTel("Debe ingresar un número de teléfono válido");
      telHomeRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateWorkTel(externado_student_rep_work_phone) === false &&
      telWorkRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");
      setMessageWorkTel("Debe ingresar un número de trabajo válido");
      telWorkRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateEmail(externado_student_rep_email) === false &&
      emailRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageEmail("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("Debe ingresar un correo electrónico válido");
      emailRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateMobileTel(externado_student_rep_mobile_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("Debe ingresar un número de celular válido");
      telMobileRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (algunCampoVacio) {
      Swal.fire({
        icon: "info",
        title: "Campos obligatorios sin llenar",
        text: "Para habilitar la generacion de PDF, debes llenar todos los campos obligatorios. ¿Deseas guardar de todas maneras?",
        showCancelButton: true,
        confirmButtonText: `Guardar`,
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Datos enviados",
            text: "Se ha registrado al estudiante exitosamente",
          }).then(function () {
            window.location = "/estudianteslista";
          });

          validateEmail(externado_student_email);
          //console.log("tipo de rep: ", externado_student_resp_type_id);

          //console.log("birthdate value: ", externado_student_birthdate);
          if (externado_student_resp_type_id === "4") {
            validateEmail(externado_student_rep_email);
          }

          studentSiblingsFinal();

          const dataToSubmit = {
            externado_student_last_school,
            externado_student_resp_type_id: Number(
              responsibleTypeIdRef.current.selectedIndex
            ),
            externado_student_current_level_id: Number(
              externado_student_current_level_id
            ),
            externado_student_firstname,
            externado_student_lastname,
            externado_student_address,
            externado_student_department_id: Number(
              externado_student_department_id
            ),
            externado_student_town,
            externado_student_birthplace,
            externado_student_nationality,
            externado_student_gender: Boolean(Number(externado_student_gender)),
            externado_student_phone,
            externado_student_email:
              emailRef.current.value !== "" ? emailRef.current.value : null,
            externado_student_catholic: Boolean(
              Number(externado_student_catholic)
            ),
            externado_student_lives_with_parents: Boolean(
              Number(externado_student_lives_with_parents)
            ),
            externado_student_non_catholic_church_id: Number(
              externado_student_non_catholic_church_id
            ),
            externado_student_lives_with_who,
            externado_student_lives_with_related,
            externado_student_emergency_name,
            externado_student_emergency_address,
            externado_student_emergency_relationship,
            externado_student_emergency_phone,
            externado_student_siblings,
            externado_student_birthdate:
              dateRef.current.value !== "" ? externado_student_birthdate : null,
            externado_student_rep_name:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (repNameRef.current = null)
                : repNameRef.current.value,
            externado_student_rep_id:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (duiRef.current = null)
                : duiRef.current.value,
            externado_student_rep_address:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (repAddressRef.current = null)
                : repAddressRef.current.value,
            externado_student_rep_email:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (emailRepRef.current = null)
                : emailRepRef.current.value === ""
                ? null
                : emailRepRef.current.value,
            externado_student_rep_mobile_phone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telMobileRepRef.current = null)
                : telMobileRepRef.current.value,
            externado_student_rep_homephone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telHomeRef.current = null)
                : telHomeRef.current.value,
            externado_student_rep_work_phone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telWorkRef.current = null)
                : telWorkRef.current.value,
            externado_student_has_siblings: Boolean(
              Number(externado_student_has_siblings)
            ),
            externado_student_lives_with_address,
            externado_student_rep_id_type:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (duiTypeRef.current = null)
                : Number(duiTypeRef.current.selected),
            externado_student_church_other,
            externado_form_valid,
          };

          const token = localStorage.getItem("token");
          fetch(
            "http://localhost:3001/api/v1/externado-student/registerStudent",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json ; charset=UTF-8",
              },
              body: JSON.stringify(dataToSubmit),
            }
          )
            .then((res) => res.json())
            .then((res) => {
              //console.log(res);
              //console.log("Data:", dataToSubmit);
            });

          return;
        } else {
          // Bloque de código si el usuario hace clic en "Cancelar"
          return;
        }
      });
    } else if (
      validateDate(externado_student_birthdate) === false &&
      dateRef.current.value !== ""
    ) {
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageDUI("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageDate("Debe ingresar una fecha de nacimiento válida");
      dateRef.current.focus(); //enfoca campo de error
      return;
    } else if (validateMobileTel(externado_student_phone) === false) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageMobileTel("Debe ingresar un número de celular válido");
      telMobileRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmail(externado_student_email) === false &&
      emailRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");
      setMessageEmail("Debe ingresar un correo electrónico válido");
      emailRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmergencyTel(externado_student_emergency_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageEmergencyTel("Debe ingresar un número de teléfono válido");
      telEmergencyRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateDocument(
        externado_student_rep_id,
        externado_student_rep_id_type
      ) === false
    ) {
      setMessageDate("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");

      if (externado_student_rep_id_type === "1") {
        setMessageDUI("Debe ingresar un número de pasaporte válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      } else {
        setMessageDUI("Debe ingresar un número de DUI válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      }
    } else if (
      externado_student_resp_type_id === "4" &&
      validateHomeTel(externado_student_rep_homephone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageHomeTel("Debe ingresar un número de teléfono válido");
      telHomeRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateWorkTel(externado_student_rep_work_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");
      setMessageWorkTel("Debe ingresar un número de trabajo válido");
      telWorkRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateEmail(externado_student_rep_email) === false &&
      emailRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageEmail("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("Debe ingresar un correo electrónico válido");
      emailRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateMobileTel(externado_student_rep_mobile_phone) === false &&
      telMobileRepRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("Debe ingresar un número de celular válido");
      telMobileRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      !isGradoSelected ||
      !isDepartamentoSelected ||
      !isCatolicoSelected ||
      !isHermanosSelected ||
      (visible3 && (!isHermano1Selected || !hermano1InputValue)) ||
      (visible4 && (!isHermano2Selected || !hermano2InputValue)) ||
      (visible5 && (!isHermano3Selected || !hermano3InputValue)) ||
      (!isCatolicoSelected && religionStatus) ||
      (religionStatus && !isReligionSelected) ||
      (showReligionInput && !religionInputValue) ||
      (!isAmbosPadresSelected && ambosStatus) ||
      (showAmbosPadresNombreInput && !ambosInputNombreValue) ||
      (showAmbosPadresParentescoInput && !ambosInputParentescoValue) ||
      !isResponsableSelected ||
      (representanteStatus && !representanteInputNombreValue) ||
      (representanteStatus && !representanteInputDireccionValue) ||
      (representanteStatus && !representanteInputDUIValue) ||
      (representanteStatus && !representanteInputTelefonoCasaValue) ||
      (representanteStatus && !representanteInputTelefonoCelularValue) ||
      (representanteStatus && !representanteInputCorreoValue) ||
      (representanteStatus && !representanteInputTelefonoTrabajoValue)
    ) {
      Swal.fire({
        icon: "info",
        title: "Campos obligatorios sin llenar",
        text: "Para habilitar la generacion de PDF, debes llenar todos los campos obligatorios. ¿Deseas guardar de todas maneras?",
        showCancelButton: true,
        confirmButtonText: `Guardar`,
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Datos enviados",
            text: "Se ha registrado al estudiante exitosamente",
          }).then(function () {
            window.location = "/estudianteslista";
          });

          validateEmail(externado_student_email);
          //console.log("tipo de rep: ", externado_student_resp_type_id);

          //console.log("birthdate value: ", externado_student_birthdate);
          if (externado_student_resp_type_id === "4") {
            validateEmail(externado_student_rep_email);
          }

          studentSiblingsFinal();

          const dataToSubmit = {
            externado_student_last_school,
            externado_student_resp_type_id: Number(
              responsibleTypeIdRef.current.selectedIndex
            ),
            externado_student_current_level_id: Number(
              externado_student_current_level_id
            ),
            externado_student_firstname,
            externado_student_lastname,
            externado_student_address,
            externado_student_department_id: Number(
              externado_student_department_id
            ),
            externado_student_town,
            externado_student_birthplace,
            externado_student_nationality,
            externado_student_gender: Boolean(Number(externado_student_gender)),
            externado_student_phone,
            externado_student_email:
              emailRef.current.value !== "" ? emailRef.current.value : null,
            externado_student_catholic: Boolean(
              Number(externado_student_catholic)
            ),
            externado_student_lives_with_parents: Boolean(
              Number(externado_student_lives_with_parents)
            ),
            externado_student_non_catholic_church_id: Number(
              externado_student_non_catholic_church_id
            ),
            externado_student_lives_with_who,
            externado_student_lives_with_related,
            externado_student_emergency_name,
            externado_student_emergency_address,
            externado_student_emergency_relationship,
            externado_student_emergency_phone,
            externado_student_siblings,
            externado_student_birthdate:
              dateRef.current.value !== "" ? externado_student_birthdate : null,
            externado_student_rep_name:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (repNameRef.current = null)
                : repNameRef.current.value,
            externado_student_rep_id:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (duiRef.current = null)
                : duiRef.current.value,
            externado_student_rep_address:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (repAddressRef.current = null)
                : repAddressRef.current.value,
            eexternado_student_rep_email:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (emailRepRef.current = null)
                : emailRepRef.current.value === ""
                ? null
                : emailRepRef.current.value,
            externado_student_rep_mobile_phone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telMobileRepRef.current = null)
                : telMobileRepRef.current.value,
            externado_student_rep_homephone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telHomeRef.current = null)
                : telHomeRef.current.value,
            externado_student_rep_work_phone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telWorkRef.current = null)
                : telWorkRef.current.value,
            externado_student_has_siblings: Boolean(
              Number(externado_student_has_siblings)
            ),
            externado_student_lives_with_address,
            externado_student_rep_id_type:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (duiTypeRef.current = null)
                : Number(duiTypeRef.current.selected),
            externado_student_church_other,
            externado_form_valid,
          };

          const token = localStorage.getItem("token");
          fetch(
            "http://localhost:3001/api/v1/externado-student/registerStudent",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json ; charset=UTF-8",
              },
              body: JSON.stringify(dataToSubmit),
            }
          )
            .then((res) => res.json())
            .then((res) => {
              //console.log(res);
              //console.log("Data:", dataToSubmit);
            });

          return;
        } else {
          // Bloque de código si el usuario hace clic en "Cancelar"
          return;
        }
      });
    }
    if (
      validateDate(externado_student_birthdate) === false &&
      dateRef.current.value !== ""
    ) {
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageDUI("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageDate("Debe ingresar una fecha de nacimiento válida");
      dateRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateMobileTel(externado_student_phone) === false &&
      telMobileRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageMobileTel("Debe ingresar un número de celular válido");
      telMobileRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmail(externado_student_email) === false &&
      emailRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");
      setMessageEmail("Debe ingresar un correo electrónico válido");
      emailRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmergencyTel(externado_student_emergency_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageEmergencyTel("Debe ingresar un número de teléfono válido");
      telEmergencyRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateDocument(
        externado_student_rep_id,
        externado_student_rep_id_type
      ) === false
    ) {
      setMessageDate("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");

      if (externado_student_rep_id_type === "1") {
        setMessageDUI("Debe ingresar un número de pasaporte válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      } else {
        setMessageDUI("Debe ingresar un número de DUI válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      }
    } else if (
      externado_student_resp_type_id === "4" &&
      validateHomeTel(externado_student_rep_homephone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageHomeTel("Debe ingresar un número de teléfono válido");
      telHomeRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateWorkTel(externado_student_rep_work_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");
      setMessageWorkTel("Debe ingresar un número de trabajo válido");
      telWorkRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateEmail(externado_student_rep_email) === false &&
      emailRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageEmail("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("Debe ingresar un correo electrónico válido");
      emailRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateMobileTel(externado_student_rep_mobile_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("Debe ingresar un número de celular válido");
      telMobileRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (algunCampoVacio) {
      Swal.fire({
        icon: "info",
        title: "Campos obligatorios sin llenar",
        text: "Para habilitar la generacion de PDF, debes llenar todos los campos obligatorios. ¿Deseas guardar de todas maneras?",
        showCancelButton: true,
        confirmButtonText: `Guardar`,
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Datos enviados",
            text: "Se ha registrado al estudiante exitosamente",
          }).then(function () {
            window.location = "/estudianteslista";
          });

          validateEmail(externado_student_email);
          //console.log("tipo de rep: ", externado_student_resp_type_id);

          //console.log("birthdate value: ", externado_student_birthdate);
          if (externado_student_resp_type_id === "4") {
            validateEmail(externado_student_rep_email);
          }

          studentSiblingsFinal();

          const dataToSubmit = {
            externado_student_last_school,
            externado_student_resp_type_id: Number(
              responsibleTypeIdRef.current.selectedIndex
            ),
            externado_student_current_level_id: Number(
              externado_student_current_level_id
            ),
            externado_student_firstname,
            externado_student_lastname,
            externado_student_address,
            externado_student_department_id: Number(
              externado_student_department_id
            ),
            externado_student_town,
            externado_student_birthplace,
            externado_student_nationality,
            externado_student_gender: Boolean(Number(externado_student_gender)),
            externado_student_phone,
            externado_student_email:
              emailRef.current.value !== "" ? emailRef.current.value : null,
            externado_student_catholic: Boolean(
              Number(externado_student_catholic)
            ),
            externado_student_lives_with_parents: Boolean(
              Number(externado_student_lives_with_parents)
            ),
            externado_student_non_catholic_church_id: Number(
              externado_student_non_catholic_church_id
            ),
            externado_student_lives_with_who,
            externado_student_lives_with_related,
            externado_student_emergency_name,
            externado_student_emergency_address,
            externado_student_emergency_relationship,
            externado_student_emergency_phone,
            externado_student_siblings,
            externado_student_birthdate:
              dateRef.current.value !== "" ? externado_student_birthdate : null,
            externado_student_rep_name:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (repNameRef.current = null)
                : repNameRef.current.value,
            externado_student_rep_id:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (duiRef.current = null)
                : duiRef.current.value,
            externado_student_rep_address:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (repAddressRef.current = null)
                : repAddressRef.current.value,
            externado_student_rep_email:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (emailRepRef.current = null)
                : emailRepRef.current.value === ""
                ? null
                : emailRepRef.current.value,
            externado_student_rep_mobile_phone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telMobileRepRef.current = null)
                : telMobileRepRef.current.value,
            externado_student_rep_homephone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telHomeRef.current = null)
                : telHomeRef.current.value,
            externado_student_rep_work_phone:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (telWorkRef.current = null)
                : telWorkRef.current.value,
            externado_student_has_siblings: Boolean(
              Number(externado_student_has_siblings)
            ),
            externado_student_lives_with_address,
            externado_student_rep_id_type:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (duiTypeRef.current = null)
                : Number(duiTypeRef.current.selected),
            externado_student_church_other,
            externado_form_valid,
          };

          const token = localStorage.getItem("token");
          fetch(
            "http://localhost:3001/api/v1/externado-student/registerStudent",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json ; charset=UTF-8",
              },
              body: JSON.stringify(dataToSubmit),
            }
          )
            .then((res) => res.json())
            .then((res) => {
              //console.log(res);
              //console.log("Data:", dataToSubmit);
            });

          return;
        } else {
          // Bloque de código si el usuario hace clic en "Cancelar"
          return;
        }
      });
    } else if (
      validateDate(externado_student_birthdate) === false &&
      dateRef.current.value !== ""
    ) {
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageDUI("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageDate("Debe ingresar una fecha de nacimiento válida");
      dateRef.current.focus(); //enfoca campo de error
      return;
    } else if (validateMobileTel(externado_student_phone) === false) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageMobileTel("Debe ingresar un número de celular válido");
      telMobileRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmail(externado_student_email) === false &&
      emailRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");
      setMessageEmail("Debe ingresar un correo electrónico válido");
      emailRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmergencyTel(externado_student_emergency_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageEmergencyTel("Debe ingresar un número de teléfono válido");
      telEmergencyRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateDocument(
        externado_student_rep_id,
        externado_student_rep_id_type
      ) === false
    ) {
      setMessageDate("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");

      if (externado_student_rep_id_type === "1") {
        setMessageDUI("Debe ingresar un número de pasaporte válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      } else {
        setMessageDUI("Debe ingresar un número de DUI válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      }
    } else if (
      externado_student_resp_type_id === "4" &&
      validateHomeTel(externado_student_rep_homephone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageHomeTel("Debe ingresar un número de teléfono válido");
      telHomeRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateWorkTel(externado_student_rep_work_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("");
      setMessageWorkTel("Debe ingresar un número de trabajo válido");
      telWorkRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateEmail(externado_student_rep_email) === false &&
      emailRef.current.value !== ""
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmergencyTel("");
      setMessageEmail("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("Debe ingresar un correo electrónico válido");
      emailRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      externado_student_resp_type_id === "4" &&
      validateMobileTel(externado_student_rep_mobile_phone) === false
    ) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageEmergencyTel("");
      setMessageHomeTel("");
      setMessageEmailRep("");
      setMessageMobileRepTel("Debe ingresar un número de celular válido");
      telMobileRepRef.current.focus(); //enfoca campo de error
      return;
    } else {
      Swal.fire({
        icon: "success",
        title: "Datos enviados",
        text: "Se ha registrado al estudiante exitosamente",
      }).then(function () {
        // window.location = "/estudianteslista";
        setVisiblePDF(true);
        window.location = "/estudianteslista";
      });

      validateEmail(externado_student_email);
      //console.log("tipo de rep: ", externado_student_resp_type_id);

      //console.log("birthdate value: ", externado_student_birthdate);
      if (externado_student_resp_type_id === "4") {
        validateEmail(externado_student_rep_email);
      }

      studentSiblingsFinal();

      //insertando true en externado_form_valid cuando todos los campos estén correctamente ingresados
      externado_form_valid = true;

      const dataToSubmit = {
        externado_student_last_school,
        externado_student_resp_type_id: Number(
          responsibleTypeIdRef.current.selectedIndex
        ),
        externado_student_current_level_id: Number(
          externado_student_current_level_id
        ),
        externado_student_firstname,
        externado_student_lastname,
        externado_student_address,
        externado_student_department_id: Number(
          externado_student_department_id
        ),
        externado_student_town,
        externado_student_birthplace,
        externado_student_nationality,
        externado_student_gender: Boolean(Number(externado_student_gender)),
        externado_student_phone,
        externado_student_email:
          emailRef.current.value !== "" ? emailRef.current.value : null,
        externado_student_catholic: Boolean(Number(externado_student_catholic)),
        externado_student_lives_with_parents: Boolean(
          Number(externado_student_lives_with_parents)
        ),
        externado_student_non_catholic_church_id: Number(
          externado_student_non_catholic_church_id
        ),
        externado_student_lives_with_who,
        externado_student_lives_with_related,
        externado_student_emergency_name,
        externado_student_emergency_address,
        externado_student_emergency_relationship,
        externado_student_emergency_phone,
        externado_student_siblings,
        externado_student_birthdate:
          dateRef.current.value !== "" ? externado_student_birthdate : null,
        externado_student_rep_name:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (repNameRef.current = null)
            : repNameRef.current.value,
        externado_student_rep_id:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (duiRef.current = null)
            : duiRef.current.value,
        externado_student_rep_address:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (repAddressRef.current = null)
            : repAddressRef.current.value,
        externado_student_rep_email:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (emailRepRef.current = null)
            : emailRepRef.current.value === ""
            ? null
            : emailRepRef.current.value,
        externado_student_rep_mobile_phone:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (telMobileRepRef.current = null)
            : telMobileRepRef.current.value,
        externado_student_rep_homephone:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (telHomeRef.current = null)
            : telHomeRef.current.value,
        externado_student_rep_work_phone:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (telWorkRef.current = null)
            : telWorkRef.current.value,
        externado_student_has_siblings: Boolean(
          Number(externado_student_has_siblings)
        ),
        externado_student_lives_with_address,
        externado_student_rep_id_type:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (duiTypeRef.current = null)
            : Number(duiTypeRef.current.selected),
        externado_student_church_other,
        externado_form_valid,
      };

      const token = localStorage.getItem("token");
      fetch("http://localhost:3001/api/v1/externado-student/registerStudent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json ; charset=UTF-8",
        },
        body: JSON.stringify(dataToSubmit),
      })
        .then((res) => res.json())
        .then((res) => {
          //console.log(res);
          //console.log("Data:", dataToSubmit);
        });
    }
  };

  return (
    <div className="div-principal">
      <Container className="fondo">
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          hideCloseButton
          run={run}
          scrollToFirstStep
          showProgress
          disableOverlayClose={true}
          showSkipButton={true} // Hide the skip button
          steps={steps}
          styles={{
            options: {
              zIndex: 10000, // existing style
              width: 900,
            },
            tooltip: {},
            buttonBack: {
              backgroundColor: '#008000', // change the back button text color
              color: '#ffffff', // change the back button text color
            },
            buttonClose: {
              backgroundColor: '#008000' // change the close button text color
            },
            buttonNext: {
              backgroundColor: '#008000' // change the next button text color
            },
            buttonSkip: {
              backgroundColor: '#008000' ,// change the skip button text color
              color: '#ffffff', // change the back button text color
            },
          }}
          locale={{
            back: 'Atrás', // Text for the back button
            close: 'Cerrar', // Text for the close button
            last: 'Finalizar', // Text for the last button
            next: 'Siguiente', // Text for the next button
            skip: 'Omitir guia', // Text for the skip button
          }}
        />
         <button 
          id="btn-tour-help"
          onClick={handleRestartTour} 
          className="btn-tour-help"
        >
          ?
        </button>
        <h4 className="step1-estudiantes-lista">Información general de los estudiantes</h4>
        <p >
          Los campos con el{" "}
          <span style={{ color: "red", fontWeight: "bold" }}> * </span>
          son de caracter{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            obligatorio
          </span>{" "}
          para Guardar{" "}
        </p>
        <Form method="post" onSubmit={handleFormSubmit} className="step2-estudiantes-lista">
          <div className="step3-estudiantes-lista">
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>
                  Escuela o colegio en el que estudió en el año escolar
                  anterior:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={120}
                  type="text"
                  placeholder=""
                  onChange={handleLastSchoolChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>
                  Grado que cursará en el siguiente año escolar:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control as="select" onChange={handleCurrentLevelIdChange}>
                  {grado?.map((level) => (
                    <option
                      id={level.idexternado_level}
                      key={level.idexternado_level}
                      value={level.externado_level}
                    >
                      {level.externado_level}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Label style={{ marginTop: "10px" }}>
            <u>
              <strong>
                Apellidos y nombres de estudiante según partida de nacimiento,
                colocar tildes y revisar escritura:
              </strong>
            </u>
          </Form.Label>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>
                  Nombres:{" "}
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={60}
                  type="text"
                  placeholder=""
                  onChange={handleFirstNameChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>
                  Apellidos:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={60}
                  type="text"
                  placeholder=""
                  onChange={handleLastNameChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  Dirección de residencia:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={120}
                  type="text"
                  placeholder=""
                  onChange={handleAddressChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{ marginTop: "10px" }}>
                  Departamento:
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        marginLeft: "5px",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control as="select" onChange={handleDepertmentIdChange}>
                  {departamentos?.map((departamento) => (
                    <option
                      id={departamento.idexternado_departments}
                      key={departamento.idexternado_departments}
                      value={departamento.externado_department}
                    >
                      {departamento.externado_department}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{ marginTop: "10px" }}>
                  Municipio:
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        marginLeft: "5px",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={30}
                  type="text"
                  placeholder=""
                  onChange={handleTownChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  Lugar de nacimiento:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={120}
                  type="text"
                  placeholder=""
                  onChange={handleBirthplaceChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{ marginTop: "10px" }}>
                  Fecha de nacimiento:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <div className="input-group date datepicker">
                  <Form.Control
                    ref={dateRef}
                    type="text"
                    placeholder="Fecha de Nacimiento"
                    data-format="yyyy-MM-dd hh:mm:ss"
                    onChange={handleBirthdateChange}
                  />
                  <p className="error-message">{messageDate}</p>
                  <div className="input-group-addon">
                    <span className="glyphicon glyphicon-th"></span>
                  </div>
                </div>
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{ marginTop: "10px" }}>
                  {" "}
                  Nacionalidad:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={30}
                  type="text"
                  placeholder=""
                  onChange={handleNationalityChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={3}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{ marginTop: "10px" }}>Sexo:</Form.Label>
                <Form.Control
                  style={{ marginTop: "0px" }}
                  as="select"
                  onChange={handleGenderIdChange}
                >
                  <option id="0" value="Masculino">
                    Masculino
                  </option>
                  <option id="1" value="Femenino">
                    Femenino
                  </option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <Form.Label style={{ marginTop: "10px" }}>
                {" "}
                Número de celular:
              </Form.Label>
              <Form.Control
                ref={telMobileRef}
                maxLength={20}
                type="text"
                placeholder=""
                onChange={handlePhoneChange}
              />
              <p className="error-message">{messageMobileTel}</p>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  Correo electrónico:
                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={60}
                  ref={emailRef}
                  placeholder="ej: minombre@ejemplo.com"
                  onChange={handleEmailChange}
                  className={'form-control ${!emailValido ? "is-invalid" : ""}'}
                />
                <p className="error-message">{messageEmail}</p>
                {!emailValido && (
                  <div className="invalid-feedback">
                    El correo electrónico es inválido
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  ¿El estudiante es cristiano católico?:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <div className="form-group row">
                  <div className="col-sm-2 mt-2">
                    Si{" "}
                    <input
                      type="radio"
                      name="pep1"
                      value="1"
                      className="mx-2"
                      onClick={() => setReligionStatus(false)}
                      onChange={handleCatholicChange}
                    />
                  </div>
                  <div className="col-sm-2 mt-2">
                    No{" "}
                    <input
                      type="radio"
                      name="pep1"
                      value="0"
                      className="mx-2"
                      onClick={() => setReligionStatus(true)}
                      onChange={handleCatholicChange}
                    />
                  </div>
                </div>
              </Form.Group>
            </Col>
            {religionStatus && (
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label style={{ marginTop: "10px" }}>
                    {" "}
                    Si no es cristiano católico, ¿a qué religión pertenece?:
                      <span
                        style={{
                          color: "red",
                          marginLeft: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        *
                      </span>
                  </Form.Label>

                  <Form.Control
                    as="select"
                    onChange={handleNonCatholicIdChange}
                  >
                    {religiones?.map((religion) => (
                      <option
                        id={religion.idexternado_church}
                        key={religion.idexternado_church}
                        value={religion.externado_church_value}
                      >
                        {religion.externado_church_value}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            )}
          </Row>
          {religionStatus && showReligionInput && (
            <>
              <Row>
                <Col></Col>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Si seleccionó otro, por favor especifique:
                      {showReligionInput && !religionInputValue ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}
                          *
                        </span>
                      ) : null}
                    </Form.Label>
                    <Form.Control
                      maxLength={45}
                      type="text"
                      placeholder=""
                      onChange={handleReligionInputValueChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  ¿Alguno de sus hermanos estudia en el Externado?:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <div className="form-group row">
                  <div className="col-sm-2 mt-2">
                    Si{" "}
                    <input
                      type="radio"
                      name="pep3"
                      value="1"
                      className="mx-2"
                      onClick={() => setVisible3(true)}
                      onChange={handleTieneHermanosChange}
                    />
                  </div>
                  <div className="col-sm-2 mt-2">
                    No{" "}
                    <input
                      type="radio"
                      name="pep3"
                      value="0"
                      className="mx-2"
                      onClick={handleVisiblesHermanos}
                      onChange={handleTieneHermanosChange}
                    />
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>
          {visible3 && (
            <div>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Label style={{ marginTop: "10px" }}>
                    <u>
                      <strong>
                        Detalle el nombre de los/as hermanos/as y grado en que
                        estudiarán en el siguiente año escolar:
                      </strong>
                    </u>
                  </Form.Label>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Nombre completo:
                        <span
                          style={{
                            color: "red",
                            marginLeft: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          *
                        </span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={60}
                      placeholder=""
                      onChange={handleSiblingName1}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Siguiente grado a cursar:
                      {!isHermano1Selected && (
                        <span
                          style={{
                            color: "red",
                            marginLeft: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control as="select" onChange={handleSiblingGrade1}>
                      {grado?.map((level) => (
                        <option
                          id={level.idexternado_level}
                          key={level.idexternado_level}
                          value={level.externado_level}
                        >
                          {level.externado_level}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  {!visible4 && (
                    <Col style={{ paddingTop: "30px" }}>
                      {suma <= 1 && (
                        <Button
                          variant="custom"
                          className="boton-mas"
                          style={{
                            color: "white",
                          }}
                          onClick={handleAgregarHermano}
                        >
                          <span>+</span>
                        </Button>
                      )}
                    </Col>
                  )}
                </Col>
              </Row>
            </div>
          )}

          {visible4 && (
            <div>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Nombre completo:
                        <span
                          style={{
                            color: "red",
                            marginLeft: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          *
                        </span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={60}
                      placeholder=""
                      onChange={handleSiblingName2}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Siguiente grado a cursar:
                      {!isHermano2Selected && (
                        <span
                          style={{
                            color: "red",
                            marginLeft: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control as="select" onChange={handleSiblingGrade2}>
                      {grado?.map((level) => (
                        <option
                          id={level.idexternado_level}
                          key={level.idexternado_level}
                          value={level.externado_level}
                        >
                          {level.externado_level}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3} style={{ paddingTop: "30px" }}>
                  {suma <= 1 && (
                    <Button
                      variant="custom"
                      className="boton-mas"
                      style={{
                        color: "white",
                      }}
                      onClick={handleAgregarHermano}
                    >
                      <span>+</span>
                    </Button>
                  )}

                  {suma > 0 && !visible5 && (
                    <Button
                      variant="custom"
                      className="boton-menos "
                      onClick={handleQuitarHermano}
                    >
                      <span>-</span>
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          )}
          {visible5 && (
            <div>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Nombre completo:
                        <span
                          style={{
                            color: "red",
                            marginLeft: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          *
                        </span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={60}
                      placeholder=""
                      onChange={handleSiblingName3}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Siguiente grado a cursar:
                      {!isHermano3Selected && (
                        <span
                          style={{
                            color: "red",
                            marginLeft: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control as="select" onChange={handleSiblingGrade3}>
                      {grado?.map((level) => (
                        <option
                          id={level.idexternado_level}
                          key={level.idexternado_level}
                          value={level.externado_level}
                        >
                          {level.externado_level}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3} style={{ paddingTop: "30px" }}>
                  {suma > 0 && (
                    <Button
                      variant="custom"
                      className="boton-menos"
                      onClick={handleQuitarHermano}
                    >
                      <span>-</span>
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          )}
          {visible3 && (
            <Row>
              <Col className="text-center" style={{ marginTop: "15px" }}></Col>
              <Col className="text-center" style={{ marginTop: "15px" }}></Col>
            </Row>
          )}

          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  ¿El estudiante vive con ambos padres?:
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <div className="form-group row">
                  <div className="col-sm-2 mt-2">
                    Si{" "}
                    <input
                      type="radio"
                      name="pep2"
                      value="1"
                      className="mx-2"
                      onClick={() => setAmbosStatus(false)}
                      onChange={handleLivesWithParents}
                    />
                  </div>
                  <div className="col-sm-2 mt-2">
                    No{" "}
                    <input
                      type="radio"
                      name="pep2"
                      value="0"
                      className="mx-2"
                      onClick={() => setAmbosStatus(true)}
                      onChange={handleLivesWithParents}
                    />
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>
          {ambosStatus && (
            <div>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Label style={{ marginTop: "10px" }}>
                    <u>
                      <strong>
                        Si la respuesta es no, ¿Con quién vive el alumno/a?
                      </strong>
                    </u>
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Nombre completo:
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                    </Form.Label>
                    <Form.Control
                      maxLength={60}
                      type="text"
                      placeholder=""
                      onChange={handleLivesWithWhoChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Parentesco que tiene con el estudiante:
                      {!ambosInputParentescoValue && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      maxLength={45}
                      type="text"
                      placeholder=""
                      onChange={handleLivesWithRelatedChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
          </div>
          <div className="step4-estudiantes-lista">
          <Form.Label style={{ marginTop: "10px" }}>
            <u>
              <strong>
                Contacto de emergencia (en caso de que no se pueda localizar a
                los padres):
              </strong>
            </u>
          </Form.Label>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  Nombre de contacto de emergencia:
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        paddingLeft: "5px",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={60}
                  type="text"
                  placeholder=""
                  onChange={handleEmergencyNameChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{ marginTop: "10px" }}>
                  {" "}
                  Relación de contacto de emergencia con el estudiante:
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        paddingLeft: "5px",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={45}
                  type="text"
                  placeholder="Tio, abuela, primo, etc."
                  onChange={handleEmergencyRelationshipChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  Dirección de contacto de emergencia:
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        paddingLeft: "5px",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  maxLength={120}
                  type="text"
                  placeholder=""
                  onChange={handleEmergencyAddressChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{ marginTop: "10px" }}>
                  {" "}
                  Número de teléfono de contacto de emergencia:
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        paddingLeft: "5px",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  ref={telEmergencyRef}
                  maxLength={20}
                  type="text"
                  placeholder="Ej. 62345678"
                  onChange={handleEmergencyPhoneChange}
                />
                <p className="error-message">{messageEmergencyTel}</p>
              </Form.Group>
            </Col>
          </Row>
          <Form.Label style={{ marginTop: "10px" }}>
            <u>
              <strong>Responsable del estudiante en el colegio:</strong>
            </u>
          </Form.Label>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={{ marginTop: "10px" }}>
                  Seleccione el responsable:
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        paddingLeft: "5px",
                      }}
                    >
                      *
                    </span>
                </Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleResponsibleChange}
                  ref={responsibleTypeIdRef}
                >
                  {responsabletipo?.map((rst) => (
                    <option
                      id={rst.idexternado_student_responsible_type}
                      key={rst.idexternado_student_responsible_type}
                      value={rst.externado_student_responsible_type}
                    >
                      {rst.externado_student_responsible_type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col></Col>
          </Row>
          {representanteStatus && (
            <>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Nombre:
                      {!representanteInputNombreValue && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      ref={repNameRef}
                      maxLength={60}
                      type="text"
                      placeholder=""
                      onChange={handleStudentRepNameChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "5px" }}>
                      Tipo de documento:
                    </Form.Label>
                    <Form.Control
                      style={{ marginTop: "3px" }}
                      as="select"
                      onChange={handleStudentRepDocumentTypeChange}
                    >
                      <option ref={duiTypeRef} id="0" value="DUI">
                        DUI
                      </option>
                      <option ref={duiTypeRef} id="1" value="Pasaporte">
                        Pasaporte
                      </option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "5px" }}>
                      Número de documento:
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                    </Form.Label>
                    <Form.Control
                      ref={duiRef}
                      maxLength={20}
                      type="text"
                      placeholder=""
                      onChange={handleDocumentNumberChange}
                      style={{ marginTop: "3px" }}
                    />
                    <p className="error-message">{messageDUI}</p>
                    {/* Marcar como inválido si la validación falla */}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Direccion de residencia:
                      {!representanteInputDireccionValue && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      ref={repAddressRef}
                      maxLength={120}
                      type="text"
                      placeholder=""
                      onChange={handleStudentRepAddressChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Teléfono de casa:
                      {!representanteInputTelefonoCasaValue && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      maxLength={20}
                      ref={telHomeRef}
                      type="text"
                      placeholder="22222222"
                      onChange={handleStudentRepHomePhoneChange}
                    />
                    <p className="error-message">{messageHomeTel}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "10px" }}>
                      {" "}
                      Teléfono de trabajo:
                      {!representanteInputTelefonoTrabajoValue && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      maxLength={20}
                      ref={telWorkRef}
                      type="text"
                      placeholder="22222222"
                      onChange={handleStudentRepWorkPhoneChange}
                    />
                    <p className="error-message">{messageWorkTel}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Correo electrónico:
                      {!representanteInputCorreoValue && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={60}
                      ref={emailRepRef}
                      placeholder="ej: minombre@ejemplo.com"
                      onChange={handleStudentRepEmailChange}
                      className={
                        'form-control ${!emailValido ? "is-invalid" : ""}'
                      }
                    />
                    <p className="error-message">{messageEmailRep}</p>
                    {!emailValido && (
                      <div className="invalid-feedback">
                        El correo electrónico es inválido
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{ marginTop: "10px" }}>
                      {" "}
                      Número de celular:
                      {!representanteInputTelefonoCelularValue && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      ref={telMobileRepRef}
                      maxLength={20}
                      type="text"
                      placeholder="Número de celular"
                      onChange={handleStudentRepMobilePhoneChange}
                    />
                    <p className="error-message">{messageMobileRepTel}</p>
                  </Form.Group>
                </Col>
                <Col xs={6} sm={3}></Col>
              </Row>
            </>
          )}

          {/* Botón "Atrás" */}
          <NavLink to="/estudianteslista">
            <Button
              type="button"
              style={{
                marginTop: "20px",
                float: "left",
                marginLeft: "0px", // Agregado para espacio entre botones
                marginRight: "10px",
              }}
              variant="custom"
              className="boton-atras"
            >
              Atrás
            </Button>
          </NavLink>

          {/* Botón "Guardar" */}
          <Button
            type="submit"
            style={{
              marginTop: "20px",
              float: "right",
              color: "white",
              marginRight: "0px", // Agregado para espacio entre botones
            }}
            variant="custom"
            className="boton-guardar step5-estudiantes-lista"
          >
            Guardar
          </Button>
          {/* Botón "Generar PDF" */}
          {visiblePDF && (
            <Button
              type="button"
              style={{
                marginTop: "20px",
                float: "right",
                marginLeft: "10px", // Agregado para espacio entre botones
                color: "white",
              }}
              variant="custom"
              className="boton-guardar"
              onClick={handleShowModal}
            >
              Generar PDF
            </Button>
          )}
          </div>
        </Form>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Selecciona el tipo de PDF</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Utiliza la clase 'd-flex flex-column' y 'text-center' para centrar vertical y horizontalmente */}
            <div className="d-flex flex-column align-items-center">
              <Button
                variant="custom"
                onClick={() => handleGenerarPDF1("Matricula")}
                size="m"
                className="mb-2 boton-guardar"
                style={{ color: "white" }} // Agregado para establecer un margen inferior entre los botones
              >
                PDF Matricula
              </Button>
              <Button
                variant="custom"
                onClick={() => handleGenerarPDF2("Registro")}
                size="m"
                className=" boton-guardar"
                style={{ color: "white" }}
              >
                PDF Registro
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
      <Footer />
    </div>
  );
};

export default EstudiantesForm;
