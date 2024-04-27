import React, { useState, useEffect, useRef } from "react";
import "../estilos/botones.css";
import Joyride from "react-joyride";
import { Form, Button, Col, Row, Container, Modal } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import props from "prop-types";
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
  validateEmailRep,
  validateHomeTel,
  validateEmpty,
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
  const { id } = useParams();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([
    {
      target: ".step1-estudiantes-lista",
      disableBeacon: true,
      content: (
        <div className="text-justify">
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
        <div className="text-justify">
          <h4 className=" font-weight-bold">Completa los datos personales y de emergencia del estudiante</h4>
          <p>El formulario está dividido en dos secciones. La primera sección se enfoca en los datos personales del estudiante, mientras que la segunda sección se centra en los datos de emergencia del estudiante.</p>
          <p>Por favor, completa todos los campos obligatorios en ambas secciones para registrar los datos del estudiante de manera completa. Estos datos son importantes para asegurar la matrícula. </p>
        </div>
      ),
    },
    {
      target: ".step3-estudiantes-lista",
      content: (
        <div className="text-justify">
          <h4 className=" font-weight-bold">Ingresa los datos personales del estudiante</h4>
          <p>Completa con cuidado todos los campos obligatorios. </p>
          <p>Estos datos son esenciales para asegurar el proceso de matricula del estudiante. </p>
          <p> Todos los campos marcados con un asterisco <span style={{ color: "red", fontWeight: "bold" }}>*</span> son obligatorios. Una vez completados todos los campos, podrás revisar la información y avanzar al siguiente paso.</p>
        </div>
      ),
    },
    {
      target: ".step4-estudiantes-lista",
      content: (
        <div className="text-justify">
          <h4 className=" font-weight-bold">Ingresa los datos de emergencia del estudiante</h4>
          <p>Ahora, ingresa tus datos de emergencia. Estos datos son importantes para poder contactarte en casos de emergencia de ser necesario</p>
          <p>Por favor, completa todos los campos obligatorios con la información requerida. Una vez completados todos los campos, podrás guardar la información y continuar con el proceso de registro.</p>

        </div>
      ),
    },
    {
      target: ".step5-estudiantes-lista",
      content: (
        <div className="text-justify">
          <h4 className=" font-weight-bold">¡Listo para guardar!</h4>
          <p> Una vez que estés seguro, haz clic en el botón 'Guardar' para registrar los datos.</p>
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
    setRun(false);
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

  //* VALIDANDO LLENOS

  const [isEscuelaRequired, setIsEscuelaRequired] = useState(true);
  const [isGradoSelected, setIsGradoSelected] = useState(false);
  const [isFirstNameRequired, setIsFirstNameRequired] = useState(true);
  const [isLastNameRequired, setIsLastNameRequired] = useState(true);
  const [isAddressRequired, setIsAddressRequired] = useState(true);
  const [isDepartamentoSelected, setIsDepartamentoSelected] = useState(false);
  const [isMunicipioRequired, setIsMunicipioRequired] = useState(true);
  const [isLugardeNacimientoRequired, setIsLugardeNacimientoRequired] =
    useState(true);
  const [isBirthdateInputFilled, setIsBirthdateInputFilled] = useState("");
  const [isNacionalidadRequired, setIsNacionalidadRequired] = useState(true);
  const [isCatolicoSelected, setIsCatolicoSelected] = useState(false);
  const [isReligionSelected, setIsReligionSelected] = useState(false);
  const [isReligionOtherRequired, setIsReligionOtherRequired] = useState("");
  //? Hermanos
  const [isHermanosSelected, setIsHermanosSelected] = useState(false);
  const [isHermano1Required, setisHermano1Required] = useState("");
  const [isgrado1Required, setisGrado1Required] = useState(false);
  const [isHermano2Required, setisHermano2Required] = useState("");
  const [isgrado2Required, setisGrado2Required] = useState(false);
  const [isHermano3Required, setisHermano3Required] = useState("");
  const [isgrado3Required, setisGrado3Required] = useState(false);

  const [isAmbosPadresSelected, setIsAmbosPadresSelected] = useState(false);
  const [isLivesWithNameRequired, setIsLivesWithNameRequired] = useState("");
  const [isLivesWithRelated, setIsLivesWithRelated] = useState("");
  const [isNombreEmergenciaRequired, setIsNombreEmergenciaRequired] =
    useState(true);
  const [isRelacionEmergenciaRequired, setIsRelacionEmergenciaRequired] =
    useState(true);
  const [isDireccionEmergenciaRequired, setIsDireccionEmergenciaRequired] =
    useState(true);
  const [isTelefonoEmergenciaRequired, setIsTelefonoEmergenciaRequired] =
    useState(true);
  const [isResponsableSelected, setIsResponsableSelected] = useState(false);
  //?Responsable (otro)
  const [isRepNameRequired, setIsRepNameRequired] = useState("");
  const [isDocumentRequired, setIsDocumentRequired] = useState("");
  const [isRepAddressRequired, setIsRepAddressRequired] = useState("");
  const [isTelHomeRequired, setIsTelHomeRequired] = useState("");
  const [isRepWorkTelRequired, setIsRepWorkTelRequired] = useState("");
  const [isTelMobileRepRequired, setIsTelMobileRepRequired] = useState("");
  const [isEmailRepRequired, setIsEmailRepRequired] = useState("");

  //* FIN VALIDANDO LLENOS

  const [religionInputValue, setReligionInputValue] = useState("");
  const [religionStatus, setReligionStatus] = useState(false);
  const [showReligionInput, setShowReligionInput] = useState(false);
  const [religionId, setReligionId] = useState(null);

  const [showAmbosPadresNombreInput, setShowAmbosPadresNombreInput] =
    useState(false);
  const [showAmbosPadresParentescoInput, setShowAmbosPadresParentescoInput] =
    useState(false);
  const [ambosStatus, setAmbosStatus] = useState(false);
  const [ambosInputNombreValue, setAmbosInputNombreValue] = useState("");
  const [ambosInputParentescoValue, setAmbosInputParentescoValue] =
    useState("");

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

  const [messageLastSchool, setMessageLastSchool] = useState("");
  const [messageCurrentLevel, setMessageCurrentLevel] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorCode, setErrorCode] = useState("");

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
  const [estudiante, setEstudiante] = useState("");

  const [fechaN, setFechaN] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [messageErrorNameSibling1, setMessageErrorNameSibling1] = useState("");
  const [messageErrorNameSibling2, setMessageErrorNameSibling2] = useState("");
  const [messageErrorNameSibling3, setMessageErrorNameSibling3] = useState("");
  const [messageErrorGradeSibling1, setMessageErrorGradeSibling1] =
    useState("");
  const [messageErrorGradeSibling2, setMessageErrorGradeSibling2] =
    useState("");
  const [messageErrorGradeSibling3, setMessageErrorGradeSibling3] =
    useState("");

  const [name1, setName1] = useState("");
  const [grade1, setGrade1] = useState("");

  const [name2, setName2] = useState("");
  const [grade2, setGrade2] = useState("");

  const [name3, setName3] = useState("");
  const [grade3, setGrade3] = useState("");

  const name1Ref = useRef();
  const name2Ref = useRef();
  const name3Ref = useRef();
  const grade1Ref = useRef();
  const grade2Ref = useRef();
  const grade3Ref = useRef();

  const [name1Arr, setName1Arr] = useState([]);

  const responsibleTypeIdRef = useRef();
  const lastSchoolRef = useRef();
  const currentLevelRef = useRef();

  const namesRef = useRef();
  const lastNamesRef = useRef();
  const addressRef = useRef();
  const townRef = useRef();
  const birthPlaceRef = useRef();
  const nationalityRef = useRef();
  const genderRef = useRef();
  const departmentRef = useRef();

  const eNameRef = useRef();
  const eRelationshipRef = useRef();
  const eAddressRef = useRef();
  const livesWithRef = useRef();
  const livesWithWhoRef = useRef();
  const livesWithRelatedRef = useRef();
  const isCatholicRef = useRef();
  const nonCatholicIdRef = useRef();
  const churchOtherRef = useRef();
  const hasSiblingsRef = useRef();

  const duiRef = useRef();
  const duiTypeRef = useRef();
  const repAddressRef = useRef();
  const repNameRef = useRef();
  const emailRepRef = useRef();
  const telWorkRef = useRef();
  const telMobileRef = useRef();
  const telHomeRef = useRef();

  const dateRef = useRef();

  const nitRef = useRef();
  const emailRef = useRef();
  const telEmergencyRef = useRef();

  const telMobileRepRef = useRef();

  const generarPDFRef = useRef();
  const guardarRef = useRef();

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
    setIsEmailRepRequired(inputValue);
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
    setIsReligionOtherRequired(inputValue);
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
    setisHermano1Required(inputValue);
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
      setisGrado1Required(false);
    } else {
      setisGrado1Required(true);
    }
  };

  const handleSiblingName2 = (event) => {
    setSiblingName2(event.target.value);
    const inputValue = event.target.value;
    setHermano2InputValue(inputValue);
    setisHermano2Required(inputValue);
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
      setisGrado2Required(false);
    } else {
      setisGrado2Required(true);
    }
  };

  const handleSiblingName3 = (event) => {
    setSiblingName3(event.target.value);
    const inputValue = event.target.value;
    setHermano3InputValue(inputValue);
    setisHermano3Required(inputValue);
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
      setisGrado3Required(false);
    } else {
      setisGrado3Required(true);
    }
  };

  //función para obtener el JSON de los hermanos del estudiante
  function studentSiblingsFinal() {
    let studentSiblings1 = "";
    let studentSiblings2 = "";
    let studentSiblings3 = "";

    if (
      (name1Ref.current === null || name1Ref.current === undefined) &&
      (grade1Ref.current === null || grade1Ref.current === undefined)
    ) {
      const siblings = {};
      studentSiblings1 = JSON.stringify(siblings);
    } else {
      const siblings = {
        name: name1Ref.current.value,
        grade: Number(grade1Ref.current.selectedIndex),
      };
      studentSiblings1 = JSON.stringify(siblings);
    }

    if (
      (name2Ref.current === null || name2Ref.current === undefined) &&
      (grade2Ref.current === null || grade2Ref.current === undefined)
    ) {
      const siblings = {};
      studentSiblings2 = JSON.stringify(siblings);
    } else {
      const siblings = {
        name: name2Ref.current.value,
        grade: Number(grade2Ref.current.selectedIndex),
      };
      studentSiblings2 = JSON.stringify(siblings);
    }
    if (
      (name3Ref.current === null || name3Ref.current === undefined) &&
      (grade3Ref.current === null || grade3Ref.current === undefined)
    ) {
      const siblings = {};
      studentSiblings3 = JSON.stringify(siblings);
    } else {
      const siblings = {
        name: name3Ref.current.value,
        grade: Number(grade3Ref.current.selectedIndex),
      };
      studentSiblings3 = JSON.stringify(siblings);
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
    setIsLivesWithNameRequired(inputValue);
  };

  //Almacenando valor sino vive con padres, con quién parentesco?
  const handleLivesWithRelatedChange = (event) => {
    setLivesWithRelated(event.target.value);
    const inputValue = event.target.value;
    setAmbosInputParentescoValue(inputValue);
    setIsLivesWithRelated(inputValue);
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

    setIsRepNameRequired(inputValue);
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
    setIsRepAddressRequired(inputValue);
  };

  //Almacenando valor de celular de representante de estudiante (Opción OTRO)
  const handleStudentRepMobilePhoneChange = (e) => {
    setStudentRepMobilePhone(e.target.value);
    const inputValue = e.target.value;
    setRepresentanteInputTelefonoCelularValue(inputValue);
    setIsTelMobileRepRequired(inputValue);
  };
  //Almacenando valor de tel de casa de representante de estudiante (Opción OTRO)
  const handleStudentRepHomePhoneChange = (e) => {
    setStudentRepHomePhone(e.target.value);
    const inputValue = e.target.value;
    setRepresentanteInputTelefonoCasaValue(inputValue);
    setIsTelHomeRequired(inputValue);
  };
  //Almacenando valor tel de trabajo de representante de estudiante (Opción OTRO)
  const handleStudentRepWorkPhoneChange = (e) => {
    setStudentRepWorkPhone(e.target.value);
    const inputValue = e.target.value;
    setRepresentanteInputTelefonoTrabajoValue(inputValue);
    setIsRepWorkTelRequired(inputValue);
  };

  //Almacenando valor tel de tipo de documento de representante de estudiante (Opción OTRO)
  const handleStudentRepDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
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
    setIsDocumentRequired(inputValue);
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
        //console.error(error.message);
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
        if (completo === false) {
          //console.log("El formulario no está completo, por favor llenar todos los campos obligatorios");
        } else {
          setVisiblePDF(true);
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

  useEffect(() => {
    axios
      .post(
        `http://localhost:3001/api/v1/auth/student`,
        {
          idexternado_student: Number(id),
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
        setEstudiante(user);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //console.log("1", error.response.data);
          //console.log("2", error.response.status);
          //console.log("3", error.response.headers);

          let hasError = error.response.data;
          let messageError = hasError.message;

          let hasError2 = error.response.data;
          let nameError = hasError2.error;

          let hasError3 = error.response.data;
          let codeError = hasError3.statusCode;

          setErrorMessage(messageError);
          setErrorName(nameError);
          setErrorCode(codeError);
          //console.log("este es el set del error", messageError);
          //console.log("este es el codigo del error", codeError);
          //console.log("este es el nombre del error", nameError);

          navigate("/error", {
            state: { message: messageError, name: nameError, code: codeError },
          });
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //console.log("4", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          //console.log("Error5", error.message);
        }
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
    //Cargar datos estudiante tambien
    let nombreEstudiante;
    let apellidoEstudiante;
    let lugardenacimientoEstudiante;
    let fechaNacimientoEstudiante;
    let fechaEstudiante;
    let fechaFormateadaEstudiante;
    let edadEstudiantepd2;
    let nacionalidadEstudiante;
    let generoEstudiante;
    let direccionEstudiante;
    let municipioEstudiante;
    let departamentoEstudiante;
    let celularEstudiante;
    let correoEstudiante;
    let ultimaescuelaEstudiante;
    let gradoEstudiante;
    let hermanosEstudiante;
    let hermanosEstudianteString;
    let hermanosEstudianteArray;
    let hermanosVariables = {};
    let hermano1nombreEstudiante;
    let hermano1gradoEstudiante;
    let hermano2nombreEstudiante;
    let hermano2gradoEstudiante;
    let hermano3nombreEstudiante;
    let hermano3gradoEstudiante;
    let viveconambosEstudiante;
    let viveconQuienEstudiante;
    let parentescoEstudiante;

    if (dataEstudiante) {
      nombreEstudiante = dataEstudiante.externado_student_firstname;
      apellidoEstudiante = dataEstudiante.externado_student_lastname;
      lugardenacimientoEstudiante = dataEstudiante.externado_student_birthplace;
      // Suponiendo que dataEstudiante.externado_student_birthdate ya está definido y es una fecha válida
      let fechaNacimientoEstudiante =
        dataEstudiante.externado_student_birthdate;

      // Crear un objeto de fecha a partir de la fecha de nacimiento
      let fechaEstudiante = new Date(fechaNacimientoEstudiante);

      // Obtener el año, mes y día de la fecha de nacimiento
      let añoEstudiante = fechaEstudiante.getFullYear();
      let mesEstudiante = fechaEstudiante.getMonth() + 1; // Ajustar porque los meses comienzan en 0
      let diaEstudiante = fechaEstudiante.getDate();

      // Formatear la fecha de nacimiento como una cadena YYYY-MM-DD
      fechaFormateadaEstudiante = `${mesEstudiante < 10 ? "0" + mesEstudiante : mesEstudiante
        }-${diaEstudiante < 10 ? "0" + diaEstudiante : diaEstudiante
        }-${añoEstudiante}`;

      // Crear un objeto de fecha para la fecha actual
      const fechaActual = new Date();

      // Calcular la diferencia en años inicialmente
      edadEstudiantepd2 =
        fechaActual.getFullYear() - fechaEstudiante.getFullYear();

      // Verificar si el cumpleaños de este año ya pasó
      const cumpleañosEsteAño = new Date(
        fechaActual.getFullYear(),
        fechaEstudiante.getMonth(),
        fechaEstudiante.getDate()
      );

      if (cumpleañosEsteAño > fechaActual) {
        edadEstudiantepd2--; // Si el cumpleaños de este año no ha ocurrido aún, restar un año a la edad
      }

      console.log(edadEstudiantepd2); // Esto debería imprimir la edad calculada

      nacionalidadEstudiante = dataEstudiante.externado_student_nationality;
      generoEstudiante = dataEstudiante.externado_student_gender;
      if (generoEstudiante === true) {
        //Asignar a generoEstudiante el valor de Femenino
        generoEstudiante = "Femenino";
      } else {
        generoEstudiante = "Masculino";
      }
      //alert("Genero: " + generoEstudiante);
      //console.log("Genero: " + generoEstudiante);
      direccionEstudiante = dataEstudiante.externado_student_address;
      municipioEstudiante = dataEstudiante.externado_student_town;
      departamentoEstudiante =
        dataEstudiante.externadoDepartment.externado_department;
      celularEstudiante = dataEstudiante.externado_student_phone;
      correoEstudiante = dataEstudiante.externado_student_email;
      ultimaescuelaEstudiante = dataEstudiante.externado_student_last_school;
      gradoEstudiante = dataEstudiante.externadoLevel.externado_level;
      hermanosEstudiante = dataEstudiante.externado_student_has_siblings;
      if (hermanosEstudiante === true) {
        hermanosEstudiante = "Si";
      } else {
        hermanosEstudiante = "No";
      }
      //Arreglo de hermanos
      hermanosEstudianteString = dataEstudiante.externado_student_siblings;
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

        //(0,'Favor seleccionar un valor'),(1,'Parvularia 4'),(2,'Parvularia 5'),
        //(3,'Preparatoria'),(4,'Primero'),(5,'Segundo'),(6,'Tercero'),(7,'Cuarto Matutino')
        //,(8,'Cuarto Vespertino'),(9,'Quinto Matutino'),(10,'Quinto Vespertino'),(11,'Sexto Matutino'),
        //(12,'Sexto Vespertino'),(13,'Séptimo Matutino'),(14,'Séptimo Vespertino'),(15,'Octavo Matutino'),
        //(16,'Octavo Vespertino'),(17,'Noveno Matutino'),(18,'Noveno Vespertino'),(19,'Primero de Bachillerato'),(20,'Segundo de Bachillerato');
        if (hermano1gradoEstudiante === 1) {
          hermano1gradoEstudiante = "Parvularia 4";
        } else if (hermano1gradoEstudiante === 2) {
          hermano1gradoEstudiante = "Parvularia 5";
        } else if (hermano1gradoEstudiante === 3) {
          hermano1gradoEstudiante = "Preparatoria";
        } else if (hermano1gradoEstudiante === 4) {
          hermano1gradoEstudiante = "Primero";
        } else if (hermano1gradoEstudiante === 5) {
          hermano1gradoEstudiante = "Segundo";
        } else if (hermano1gradoEstudiante === 6) {
          hermano1gradoEstudiante = "Tercero";
        } else if (hermano1gradoEstudiante === 7) {
          hermano1gradoEstudiante = "Cuarto Matutino";
        } else if (hermano1gradoEstudiante === 8) {
          hermano1gradoEstudiante = "Cuarto Vespertino";
        } else if (hermano1gradoEstudiante === 9) {
          hermano1gradoEstudiante = "Quinto Matutino";
        } else if (hermano1gradoEstudiante === 10) {
          hermano1gradoEstudiante = "Quinto Vespertino";
        } else if (hermano1gradoEstudiante === 11) {
          hermano1gradoEstudiante = "Sexto Matutino";
        } else if (hermano1gradoEstudiante === 12) {
          hermano1gradoEstudiante = "Sexto Vespertino";
        } else if (hermano1gradoEstudiante === 13) {
          hermano1gradoEstudiante = "Séptimo Matutino";
        } else if (hermano1gradoEstudiante === 14) {
          hermano1gradoEstudiante = "Séptimo Vespertino";
        } else if (hermano1gradoEstudiante === 15) {
          hermano1gradoEstudiante = "Octavo Matutino";
        } else if (hermano1gradoEstudiante === 16) {
          hermano1gradoEstudiante = "Octavo Vespertino";
        } else if (hermano1gradoEstudiante === 17) {
          hermano1gradoEstudiante = "Noveno Matutino";
        } else if (hermano1gradoEstudiante === 18) {
          hermano1gradoEstudiante = "Noveno Vespertino";
        } else if (hermano1gradoEstudiante === 19) {
          hermano1gradoEstudiante = "Primero de Bachillerato";
        } else if (hermano1gradoEstudiante === 20) {
          hermano1gradoEstudiante = "Segundo de Bachillerato";
        }

        if (hermano2gradoEstudiante === 1) {
          hermano2gradoEstudiante = "Parvularia 4";
        } else if (hermano2gradoEstudiante === 2) {
          hermano2gradoEstudiante = "Parvularia 5";
        } else if (hermano2gradoEstudiante === 3) {
          hermano2gradoEstudiante = "Preparatoria";
        } else if (hermano2gradoEstudiante === 4) {
          hermano2gradoEstudiante = "Primero";
        } else if (hermano2gradoEstudiante === 5) {
          hermano2gradoEstudiante = "Segundo";
        } else if (hermano2gradoEstudiante === 6) {
          hermano2gradoEstudiante = "Tercero";
        } else if (hermano2gradoEstudiante === 7) {
          hermano2gradoEstudiante = "Cuarto Matutino";
        } else if (hermano2gradoEstudiante === 8) {
          hermano2gradoEstudiante = "Cuarto Vespertino";
        } else if (hermano2gradoEstudiante === 9) {
          hermano2gradoEstudiante = "Quinto Matutino";
        } else if (hermano2gradoEstudiante === 10) {
          hermano2gradoEstudiante = "Quinto Vespertino";
        } else if (hermano2gradoEstudiante === 11) {
          hermano2gradoEstudiante = "Sexto Matutino";
        } else if (hermano2gradoEstudiante === 12) {
          hermano2gradoEstudiante = "Sexto Vespertino";
        } else if (hermano2gradoEstudiante === 13) {
          hermano2gradoEstudiante = "Séptimo Matutino";
        } else if (hermano2gradoEstudiante === 14) {
          hermano2gradoEstudiante = "Séptimo Vespertino";
        } else if (hermano2gradoEstudiante === 15) {
          hermano2gradoEstudiante = "Octavo Matutino";
        } else if (hermano2gradoEstudiante === 16) {
          hermano2gradoEstudiante = "Octavo Vespertino";
        } else if (hermano2gradoEstudiante === 17) {
          hermano2gradoEstudiante = "Noveno Matutino";
        } else if (hermano2gradoEstudiante === 18) {
          hermano2gradoEstudiante = "Noveno Vespertino";
        } else if (hermano2gradoEstudiante === 19) {
          hermano2gradoEstudiante = "Primero de Bachillerato";
        } else if (hermano2gradoEstudiante === 20) {
          hermano2gradoEstudiante = "Segundo de Bachillerato";
        }

        if (hermano3gradoEstudiante === 1) {
          hermano3gradoEstudiante = "Parvularia 4";
        } else if (hermano3gradoEstudiante === 2) {
          hermano3gradoEstudiante = "Parvularia 5";
        } else if (hermano3gradoEstudiante === 3) {
          hermano3gradoEstudiante = "Preparatoria";
        } else if (hermano3gradoEstudiante === 4) {
          hermano3gradoEstudiante = "Primero";
        } else if (hermano3gradoEstudiante === 5) {
          hermano3gradoEstudiante = "Segundo";
        } else if (hermano3gradoEstudiante === 6) {
          hermano3gradoEstudiante = "Tercero";
        } else if (hermano3gradoEstudiante === 7) {
          hermano3gradoEstudiante = "Cuarto Matutino";
        } else if (hermano3gradoEstudiante === 8) {
          hermano3gradoEstudiante = "Cuarto Vespertino";
        } else if (hermano3gradoEstudiante === 9) {
          hermano3gradoEstudiante = "Quinto Matutino";
        } else if (hermano3gradoEstudiante === 10) {
          hermano3gradoEstudiante = "Quinto Vespertino";
        } else if (hermano3gradoEstudiante === 11) {
          hermano3gradoEstudiante = "Sexto Matutino";
        } else if (hermano3gradoEstudiante === 12) {
          hermano3gradoEstudiante = "Sexto Vespertino";
        } else if (hermano3gradoEstudiante === 13) {
          hermano3gradoEstudiante = "Séptimo Matutino";
        } else if (hermano3gradoEstudiante === 14) {
          hermano3gradoEstudiante = "Séptimo Vespertino";
        } else if (hermano3gradoEstudiante === 15) {
          hermano3gradoEstudiante = "Octavo Matutino";
        } else if (hermano3gradoEstudiante === 16) {
          hermano3gradoEstudiante = "Octavo Vespertino";
        } else if (hermano3gradoEstudiante === 17) {
          hermano3gradoEstudiante = "Noveno Matutino";
        } else if (hermano3gradoEstudiante === 18) {
          hermano3gradoEstudiante = "Noveno Vespertino";
        } else if (hermano3gradoEstudiante === 19) {
          hermano3gradoEstudiante = "Primero de Bachillerato";
        } else if (hermano3gradoEstudiante === 20) {
          hermano3gradoEstudiante = "Segundo de Bachillerato";
        }
      } catch (error) {
        // Error al analizar la cadena JSON
        //console.error("Error al analizar la cadena JSON de hermanos.", error);
      }

      //Imprimir en consola los hermanos del estudiante y su grado en una sola linea por cada uno
      /*//console.log(
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

      viveconambosEstudiante =
        dataEstudiante.externado_student_lives_with_parents;
      viveconQuienEstudiante = "N/a"; // Declaración fuera del bloque if
      parentescoEstudiante = "N/a"; // Declaración fuera del bloque if
      if (viveconambosEstudiante === true) {
        viveconambosEstudiante = "Si";
      } else {
        viveconambosEstudiante = "No";
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
        religionEstudiante = dataEstudiante.externado_student_church_other;
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
    }

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
      const fechaFormateadaResponsable = `${año}-${mes < 10 ? "0" + mes : mes
        }-${dia < 10 ? "0" + dia : dia}`;

      // Convertir la cadena formateada a un objeto Date
      const fechaNacimiento = new Date(fechaFormateadaResponsable);
      // Crear un objeto de fecha para la fecha actual
      const fechaActual = new Date();
      // Calcular la diferencia en años
      let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
      const cumpleañosEsteAño = new Date(
        fechaActual.getFullYear(),
        fechaNacimiento.getMonth(),
        fechaNacimiento.getDate()
      );
      if (cumpleañosEsteAño > fechaActual) {
        edad--;
      }

      const numeroduiResponsable = dataResponsable[0].externado_id;
      const numeronitResponsable = dataResponsable[0].externado_nit;
      const nacionalidadResponsable = dataResponsable[0].externado_nationality;
      const direccionResponsable = dataResponsable[0].externado_address;
      const municipioResponsable = dataResponsable[0].externado_town;
      const departamentoResponsable =
        dataResponsable[0].externadoDepartment.externado_department;
      let telefonotrabajoResponsable = dataResponsable[0].externado_work_phone;
      if (
        telefonotrabajoResponsable === null ||
        telefonotrabajoResponsable === ""
      ) {
        telefonotrabajoResponsable = "N/a";
      }
      const telefonoCelularResponsable =
        dataResponsable[0].externado_mobile_phone;
      const emailResponsable = dataResponsable[0].externado_email;
      const occupationResponsable = dataResponsable[0].externado_occupation;
      let lugartrabajoResponsable = dataResponsable[0].externado_workplace;
      if (lugartrabajoResponsable === null || lugartrabajoResponsable === "") {
        lugartrabajoResponsable = "N/a";
      }
      let posiciontrabajoResponsable = dataResponsable[0].externado_jobposition;
      if (
        posiciontrabajoResponsable === null ||
        posiciontrabajoResponsable === ""
      ) {
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
      if (universidadResponsable === null || universidadResponsable === "") {
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
      let edad2;
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
        fechaFormateadaResponsable2 = `${año2}-${mes2 < 10 ? "0" + mes2 : mes2
          }-${dia2 < 10 ? "0" + dia2 : dia2}`;

        const fechaNacimiento2 = new Date(fechaFormateadaResponsable2);
        const fechaActual2 = new Date();
        edad2 = fechaActual2.getFullYear() - fechaNacimiento2.getFullYear();
        const cumpleañosEsteAño2 = new Date(
          fechaActual2.getFullYear(),
          fechaNacimiento2.getMonth(),
          fechaNacimiento2.getDate()
        );
        if (cumpleañosEsteAño2 > fechaActual2) {
          edad2--;
        }

        numeroduiResponsable2 = dataResponsable[1].externado_id;
        numeronitResponsable2 = dataResponsable[1].externado_nit;
        nacionalidadResponsable2 = dataResponsable[1].externado_nationality;
        direccionResponsable2 = dataResponsable[1].externado_address;
        municipioResponsable2 = dataResponsable[1].externado_town;
        departamentoResponsable2 =
          dataResponsable[1].externadoDepartment.externado_department;
        telefonotrabajoResponsable2 = dataResponsable[1].externado_work_phone;
        if (
          telefonotrabajoResponsable2 === null ||
          telefonotrabajoResponsable2 === ""
        ) {
          telefonotrabajoResponsable2 = "N/a";
        }
        telefonoCelularResponsable2 = dataResponsable[1].externado_mobile_phone;
        emailResponsable2 = dataResponsable[1].externado_email;
        occupationResponsable2 = dataResponsable[1].externado_occupation;
        lugartrabajoResponsable2 = dataResponsable[1].externado_workplace;
        if (
          lugartrabajoResponsable2 === null ||
          lugartrabajoResponsable2 === ""
        ) {
          lugartrabajoResponsable2 = "N/a";
        }
        posiciontrabajoResponsable2 = dataResponsable[1].externado_jobposition;
        if (
          posiciontrabajoResponsable2 === null ||
          posiciontrabajoResponsable2 === ""
        ) {
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
        if (
          universidadResponsable2 === null ||
          universidadResponsable2 === ""
        ) {
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
      let edad3;
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

        fechaFormateadaResponsable3 = `${año3}-${mes3 < 10 ? "0" + mes3 : mes3
          }-${dia3 < 10 ? "0" + dia3 : dia3}`;

        // Convertir la cadena formateada a un objeto Date
        const fechaNacimiento3 = new Date(fechaFormateadaResponsable3);

        // Crear un objeto de fecha para la fecha actual
        const fechaActual3 = new Date();

        // Calcular la diferencia en años
        edad3 = fechaActual3.getFullYear() - fechaNacimiento3.getFullYear();

        // Ajustar la edad si el cumpleaños del año actual todavía no ha ocurrido
        const cumpleañosEsteAño3 = new Date(
          fechaActual3.getFullYear(),
          fechaNacimiento3.getMonth(),
          fechaNacimiento3.getDate()
        );
        if (cumpleañosEsteAño3 > fechaActual3) {
          edad3--;
        }

        numeroduiResponsable3 = dataResponsable[2].externado_id;
        numeronitResponsable3 = dataResponsable[2].externado_nit;
        nacionalidadResponsable3 = dataResponsable[2].externado_nationality;
        direccionResponsable3 = dataResponsable[2].externado_address;
        municipioResponsable3 = dataResponsable[2].externado_town;
        departamentoResponsable3 =
          dataResponsable[2].externadoDepartment.externado_department;
        telefonotrabajoResponsable3 = dataResponsable[2].externado_work_phone;
        if (
          telefonotrabajoResponsable3 === null ||
          telefonotrabajoResponsable3 === ""
        ) {
          telefonotrabajoResponsable3 = "N/a";
        }
        telefonoCelularResponsable3 = dataResponsable[2].externado_mobile_phone;
        emailResponsable3 = dataResponsable[2].externado_email;
        occupationResponsable3 = dataResponsable[2].externado_occupation;
        lugartrabajoResponsable3 = dataResponsable[2].externado_workplace;
        if (
          lugartrabajoResponsable3 === null ||
          lugartrabajoResponsable3 === ""
        ) {
          lugartrabajoResponsable3 = "N/a";
        }
        posiciontrabajoResponsable3 = dataResponsable[2].externado_jobposition;
        if (
          posiciontrabajoResponsable3 === null ||
          posiciontrabajoResponsable3 === ""
        ) {
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
        if (
          universidadResponsable3 === null ||
          universidadResponsable3 === ""
        ) {
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
      /*---------------------------------PDF ESTUDIANTE CON RESPONSABLE---------------------------------*/
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
      pdf.setFontSize(15);
      pdf.setTextColor(0, 0, 0);
      const titulo1 =
        "Ficha de registro del estudiante y padres/madres de familia";
      const titulo2 =
        "Fundación Externado San José – Colegio Externado San José";
      const tituloX1 = pageSize.getWidth() / 2;
      const tituloY1 = 25;
      const tituloY2 = tituloY1 + 10; // Ajusta este valor según sea necesario para el espaciado entre líneas
      const padding = 5; // Extiende la línea de subrayado 5 unidades más en cada extremo

      pdf.text(titulo1, tituloX1, tituloY1, { align: "center" });
      pdf.text(titulo2, tituloX1, tituloY2, { align: "center" });

      const underlineY2 = tituloY2 + 2; // Ajusta la posición vertical del subrayado si es necesario
      const tituloWidth2 =
        (pdf.getStringUnitWidth(titulo2) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;
      pdf.line(
        tituloX1 - tituloWidth2 / 2 - padding,
        underlineY2,
        tituloX1 + tituloWidth2 / 2 + padding,
        underlineY2
      );
      //fecha
      let fechaactual = new Date();
      let diafecha = fechaactual.getDate();
      let mesfecha = fechaactual.getMonth() + 1;
      let añofecha = fechaactual.getFullYear();
      diafecha = diafecha < 10 ? `0${diafecha}` : diafecha;
      mesfecha = mesfecha < 10 ? `0${mesfecha}` : mesfecha;
      const fechaFormateadaactual = `${diafecha}/${mesfecha}/${añofecha}`;

      // N° de Registro:_____________________
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        `Fecha de elaboración o actualización: ${fechaFormateadaactual}`,
        10,
        48
      );
      pdf.text(`N° de Registro:___________`, pageSize.getWidth() / 2 + 10, 48);

      // Datos generales texto centrado sin negrita tamaño 15
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      const datosGenerales1 = "Información General del Estudiante";
      const datosGeneralesX1 = pageSize.getWidth() / 2;
      const datosGeneralesY1 = 60;
      const datosGeneralesWidth1 =
        pdf.getStringUnitWidth(datosGenerales1) * pdf.internal.getFontSize();
      pdf.text(datosGenerales1, datosGeneralesX1, datosGeneralesY1, {
        align: "center",
      });

      // Establecer negrita solo para el texto quemado
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      // Imprimir datos en dos columnas
      //imprimiendo estudiante
      pdf.text(`Nombres: ${nombreEstudiante}`, 10, 75);
      pdf.text(
        ` Apellidos: ${apellidoEstudiante}`,
        pageSize.getWidth() / 2 + 10,
        75
      );

      pdf.text(`Edad: ${edadEstudiantepd2} años`, 10, 85);
      //poner fecha a la par
      pdf.text(
        `Fecha de nacimiento: ${fechaFormateadaEstudiante}`,
        pageSize.getWidth() / 2 + 10,
        85
      );
      // Fecha de nacimiento a la par de lugar de nacimiento

      // dirección de residencia
      const direccionTextoEstudiante = `Dirección: ${direccionEstudiante}`;
      const direccionFragmentosEstudiante = pdf.splitTextToSize(
        direccionTextoEstudiante,
        pageSize.getWidth() - 20
      );
      pdf.text(direccionFragmentosEstudiante, 10, 95);

      // Aumentar el espacio vertical entre líneas
      const espacioVertical = 10;

      // Departamento
      const departamentoTexto = `Departamento: ${departamentoEstudiante}`;
      let departamentoPosicionY = 105; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentosEstudiante.length > 1) {
        departamentoPosicionY = 110;
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
      let municipioPosicionY = 105; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentosEstudiante.length > 1) {
        municipioPosicionY = 110;
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
      const lugardenacimientoTexto = `Lugar de nacimiento: ${lugardenacimientoEstudiante}`;
      let lugardenacimientoPosicionY = 115; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentosEstudiante.length > 1) {
        lugardenacimientoPosicionY = 120;
      }

      const lugardenacimientoFragmentos = pdf.splitTextToSize(
        lugardenacimientoTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(lugardenacimientoFragmentos, 10, lugardenacimientoPosicionY);

      //Nacionalidad
      const nacionalidadTexto = `Nacionalidad: ${nacionalidadEstudiante}`;
      let nacionalidadPosicionY = 125; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentosEstudiante.length > 1) {
        nacionalidadPosicionY = 130;
      }

      const nacionalidadFragmentos = pdf.splitTextToSize(
        nacionalidadTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(nacionalidadFragmentos, 10, nacionalidadPosicionY);

      // Genero a la par de Nacionalidad
      const generoTexto = `Género: ${generoEstudiante}`;
      let generoPosicionY = 125; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentosEstudiante.length > 1) {
        generoPosicionY = 130;
      }

      const generoFragmentos = pdf.splitTextToSize(
        generoTexto,
        pageSize.getWidth() / 2 - 20
      );
      pdf.text(generoFragmentos, pageSize.getWidth() / 2 + 10, generoPosicionY);

      // Celular
      const celularTexto = `Teléfono celular: ${celularEstudiante}`;
      let celularPosicionY = 135; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentosEstudiante.length > 1) {
        celularPosicionY = 140;
      }

      const celularFragmentos = pdf.splitTextToSize(
        celularTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(celularFragmentos, 10, celularPosicionY);

      // Correo a la par de celular
      const correoTexto = `Correo: ${correoEstudiante}`;
      let correoPosicionY = 135; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentosEstudiante.length > 1) {
        correoPosicionY = 140;
      }

      const correoFragmentos = pdf.splitTextToSize(
        correoTexto,
        pageSize.getWidth() / 2 - 20
      );
      pdf.text(correoFragmentos, pageSize.getWidth() / 2 + 10, correoPosicionY);

      // Escuela anterior
      const escuelaTexto = `Escuela o colegio en el que estudió en el anterior año escolar: ${ultimaescuelaEstudiante}`;
      const escuelaFragmentos = pdf.splitTextToSize(
        escuelaTexto,
        pageSize.getWidth() - 20
      );
      let escuelaPosicionY = 145; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (direccionFragmentosEstudiante.length > 1) {
        escuelaPosicionY = 150; // Ajustar la posición si se dividió el texto
      }

      //Imprimir escuela anterior
      pdf.text(escuelaFragmentos, 10, escuelaPosicionY);

      // Grado
      const gradoTexto = `Grado que cursará en el siguiente año escolar: ${gradoEstudiante}`;
      let gradoPosicionY = 155; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        gradoPosicionY = 165; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        gradoPosicionY = 160; // Ajustar la posición si se dividió el texto
      }

      //Imprimir grado
      pdf.text(gradoTexto, 10, gradoPosicionY);

      // Tiene Hermanos
      const hermanosTexto = `¿Tiene hermanos en el colegio?: ${hermanosEstudiante}`;
      let hermanosPosicionY = 165; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        hermanosPosicionY = 175; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        hermanosPosicionY = 170; // Ajustar la posición si se dividió el texto
      }

      //Imprimir tiene hermanos
      pdf.text(hermanosTexto, 10, hermanosPosicionY);
      // Nombre de los hermanos y grado que estudiaran en el 2024 en el colegio si se tienen (imprimir un texto) en negrita
      pdf.setFont("helvetica", "bold");
      let hermanosPosicionY2 = 175; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        hermanosPosicionY2 = 185; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        hermanosPosicionY2 = 180; // Ajustar la posición si se dividió el texto
      }

      pdf.text(
        `Nombre y Grado que cursarán los hermanos (en caso se tengan) en el siguiente año escolar:`,
        10,
        hermanosPosicionY2
      );

      pdf.setFont("helvetica", "normal");
      // Imprimir a los 3 hermanos y sus grados en una fila cada uno separado por Nombres y Grado en 2 columnas
      // Hermano 1
      const hemano1Texto = `Nombre: ${hermano1nombreEstudiante}`;
      let hemano1PosicionY = 185; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        hemano1PosicionY = 195; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        hemano1PosicionY = 190; // Ajustar la posición si se dividió el texto
      }

      //Imprimir hermano 1
      pdf.text(hemano1Texto, 10, hemano1PosicionY);

      // Grado hermano 1 a la misma altura
      const hemano1GradoTexto = `Grado: ${hermano1gradoEstudiante}`;
      let hemano1GradoPosicionY = 185; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        hemano1GradoPosicionY = 195; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        hemano1GradoPosicionY = 190; // Ajustar la posición si se dividió el texto
      }

      //Imprimir grado hermano 1
      pdf.text(
        hemano1GradoTexto,
        pageSize.getWidth() / 2 + 10,
        hemano1GradoPosicionY
      );

      // Hermano 2
      const hemano2Texto = `Nombre: ${hermano2nombreEstudiante}`;
      let hemano2PosicionY = 195; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        hemano2PosicionY = 205; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        hemano2PosicionY = 200; // Ajustar la posición si se dividió el texto
      }

      //Imprimir hermano 2
      pdf.text(hemano2Texto, 10, hemano2PosicionY);

      // Grado hermano 2 a la misma altura
      const hemano2GradoTexto = `Grado: ${hermano2gradoEstudiante}`;
      let hemano2GradoPosicionY = 195; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        hemano2GradoPosicionY = 205; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        hemano2GradoPosicionY = 200; // Ajustar la posición si se dividió el texto
      }

      //Imprimir grado hermano 2
      pdf.text(
        hemano2GradoTexto,
        pageSize.getWidth() / 2 + 10,
        hemano2GradoPosicionY
      );

      // Hermano 3
      const hemano3Texto = `Nombre: ${hermano3nombreEstudiante}`;
      let hemano3PosicionY = 205; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        hemano3PosicionY = 215; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        hemano3PosicionY = 210; // Ajustar la posición si se dividió el texto
      }

      //Imprimir hermano 3
      pdf.text(hemano3Texto, 10, hemano3PosicionY);

      // Grado hermano 3 a la misma altura
      const hemano3GradoTexto = `Grado: ${hermano3gradoEstudiante}`;
      let hemano3GradoPosicionY = 205; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        hemano3GradoPosicionY = 215; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        hemano3GradoPosicionY = 210; // Ajustar la posición si se dividió el texto
      }

      //Imprimir grado hermano 3
      pdf.text(
        hemano3GradoTexto,
        pageSize.getWidth() / 2 + 10,
        hemano3GradoPosicionY
      );

      //Vive con ambos
      const viveconambosTexto = `¿Vive con ambos padres?: ${viveconambosEstudiante}`;
      let viveconambosPosicionY = 215; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        viveconambosPosicionY = 225; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        viveconambosPosicionY = 220; // Ajustar la posición si se dividió el texto
      }

      //Imprimir vive con ambos
      pdf.text(viveconambosTexto, 10, viveconambosPosicionY);

      //Imprimir si la respuesta es no, ¿Con quién vive el alumno/a? en negrita
      pdf.setFont("helvetica", "bold");
      let viveconambosPosicionY2 = 225; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        viveconambosPosicionY2 = 235; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        viveconambosPosicionY2 = 230; // Ajustar la posición si se dividió el texto
      }

      pdf.text(
        `Si la respuesta es no, ¿Con quién vive el alumno/a?`,
        10,
        viveconambosPosicionY2
      );

      pdf.setFont("helvetica", "normal");

      //Vive con quien
      const viveconquienTexto = `Vive con: ${viveconQuienEstudiante}`;
      let viveconquienPosicionY = 235; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        viveconquienPosicionY = 245; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        viveconquienPosicionY = 240; // Ajustar la posición si se dividió el texto
      }

      //Imprimir vive con quien
      pdf.text(viveconquienTexto, 10, viveconquienPosicionY);

      //Parentesco a la par de vive con quien a la misma altura
      const parentescoTexto = `Parentesco: ${parentescoEstudiante}`;
      let parentescoPosicionY = 235; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (
        direccionFragmentosEstudiante.length > 1 &&
        escuelaFragmentos.length > 1
      ) {
        parentescoPosicionY = 245; // Ajustar la posición si se dividió el texto
      } else if (direccionFragmentosEstudiante.length > 1) {
        parentescoPosicionY = 240; // Ajustar la posición si se dividió el texto
      }

      //Imprimir parentesco
      pdf.text(
        parentescoTexto,
        pageSize.getWidth() / 2 + 10,
        parentescoPosicionY
      );

      /*---------------------------------PDF POSICION 1---------------------------------*/
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

      // Datos generales texto centrado sin negrita tamaño 15
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      const datosGenerales =
        "Información General del Padre/Madre de Familia o Apoderado";
      const datosGeneralesX = pageSize.getWidth() / 2;
      const datosGeneralesY = 35;
      const datosGeneralesWidth =
        pdf.getStringUnitWidth(datosGenerales) * pdf.internal.getFontSize();
      pdf.text(datosGenerales, datosGeneralesX, datosGeneralesY, {
        align: "center",
      });

      // Establecer negrita solo para el texto quemado
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      // Imprimir datos en dos columnas
      pdf.text(`Nombres: ${nombreResponsable}`, 10, 50);
      pdf.text(
        `Apellidos: ${apellidoResponsable}`,
        pageSize.getWidth() / 2 + 10,
        50
      );

      // Parentesco con el alumno
      pdf.text(`Parentesco con el alumno: ${tipoResponsable}`, 10, 60);
      // Poner a la par de parentesco con el alumno solo si tipoResponsable === "Tutor Legal"
      if (tipoResponsable === "Tutor Legal") {
        pdf.text(
          `Relación con el alumno: ${relacionestudianteResponsable}`,
          pageSize.getWidth() / 2 + 10,
          60
        );
      }

      // Fecha de nacimiento
      pdf.text(`Edad: ${edad} años`, 10, 70);

      // Numero de documento a la par de fecha de nacimiento
      pdf.text(
        `Número de documento: ${numeroduiResponsable}`,
        pageSize.getWidth() / 2 + 10,
        70
      );

      // NIT
      pdf.text(`NIT: ${numeronitResponsable}`, 10, 80);

      // Nacionalidad a la par de NIT
      pdf.text(
        `Nacionalidad: ${nacionalidadResponsable}`,
        pageSize.getWidth() / 2 + 10,
        80
      );

      // Direccion y ver si se divide en 2 lineas
      const direccionTexto = `Dirección: ${direccionResponsable}`;
      const direccionFragmentos = pdf.splitTextToSize(
        direccionTexto,
        pageSize.getWidth() - 20
      );
      pdf.text(direccionFragmentos, 10, 90);

      // Departamento, verificar antes si la direccion fue dividida en 2
      if (direccionFragmentos.length > 1) {
        pdf.text(`Departamento: ${departamentoResponsable}`, 10, 105);
      } else {
        pdf.text(`Departamento: ${departamentoResponsable}`, 10, 100);
      }

      // Municipio a la par de departamento a la misma altura, verficar direccion 2 lineas
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Municipio: ${municipioResponsable}`,
          pageSize.getWidth() / 2 + 10,
          105
        );
      } else {
        pdf.text(
          `Municipio: ${municipioResponsable}`,
          pageSize.getWidth() / 2 + 10,
          100
        );
      }

      // correo
      if (direccionFragmentos.length > 1) {
        pdf.text(`Correo: ${emailResponsable}`, 10, 115);
      } else {
        pdf.text(`Correo: ${emailResponsable}`, 10, 110);
      }

      // correo a la par de celular
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Teléfono celular: ${telefonoCelularResponsable}`,
          pageSize.getWidth() / 2 + 10,
          115
        );
      } else {
        pdf.text(
          `Teléfono celular: ${telefonoCelularResponsable}`,
          pageSize.getWidth() / 2 + 10,
          110
        );
      }

      // Ocupación
      if (direccionFragmentos.length > 1) {
        pdf.text(`Profesión u Ocupación: ${occupationResponsable}`, 10, 125);
      } else {
        pdf.text(`Profesión u Ocupación: ${occupationResponsable}`, 10, 120);
      }

      // Lugar de trabajo en 140 o 145
      if (direccionFragmentos.length > 1) {
        pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable}`, 10, 135);
      } else {
        pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable}`, 10, 130);
      }

      // Posicion de trabajo
      if (direccionFragmentos.length > 1) {
        pdf.text(`Posición de trabajo: ${posiciontrabajoResponsable}`, 10, 145);
      } else {
        pdf.text(`Posición de trabajo: ${posiciontrabajoResponsable}`, 10, 140);
      }

      // Teléfono de trabajo
      if (direccionFragmentos.length > 1) {
        pdf.text(`Teléfono de trabajo: ${telefonotrabajoResponsable}`, 10, 155);
      } else {
        pdf.text(`Teléfono de trabajo: ${telefonotrabajoResponsable}`, 10, 150);
      }

      // Es PEP
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable}`,
          10,
          165
        );
      } else {
        pdf.text(
          `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable}`,
          10,
          160
        );
      }
      //negrita
      pdf.setFont("helvetica", "bold");
      // Ocupación PEP
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
          10,
          175
        );
      } else {
        pdf.text(
          `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
          10,
          170
        );
      }
      //normal
      pdf.setFont("helvetica", "normal");
      // Ocupación PEP
      if (direccionFragmentos.length > 1) {
        pdf.text(`${pepoccupationResponsable}`, 10, 185);
      } else {
        pdf.text(`${pepoccupationResponsable}`, 10, 180);
      }

      // Es PEP 3 años
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable}`,
          10,
          195
        );
      } else {
        pdf.text(
          `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable}`,
          10,
          190
        );
      }

      //negrita
      pdf.setFont("helvetica", "bold");

      // Ocupación PEP 3 años, dividir en 2 lineas si llega al final del ancho del pdf, aplicar lo mismo que dirección
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Puesto que ocupó en caso de ser una Persona Políticamente Expuesta:`,
          10,
          205
        );
      } else {
        pdf.text(
          `Puesto que ocupó en caso de haber sido una Persona Políticamente Expuesta:`,
          10,
          200
        );
      }

      //normal
      pdf.setFont("helvetica", "normal");
      // Ocupación PEP 3 años
      if (direccionFragmentos.length > 1) {
        pdf.text(`${pepoccupation3Responsable}`, 10, 215);
      } else {
        pdf.text(`${pepoccupation3Responsable}`, 10, 210);
      }

      // Ingresos
      if (direccionFragmentos.length > 1) {
        pdf.text(
          `Rango de ingresos mensuales familiares: ${incomingsResponsable}`,
          10,
          225
        );
      } else {
        pdf.text(
          `Rango de ingresos mensuales familiares: ${incomingsResponsable}`,
          10,
          220
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

        // Datos generales texto centrado sin negrita tamaño 15
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        const datosGenerales =
          "Informacion General del Padre/Madre de Familia o Apoderado";
        const datosGeneralesX = pageSize.getWidth() / 2;
        const datosGeneralesY = 35;
        const datosGeneralesWidth =
          pdf.getStringUnitWidth(datosGenerales) * pdf.internal.getFontSize();
        pdf.text(datosGenerales, datosGeneralesX, datosGeneralesY, {
          align: "center",
        });

        // Establecer negrita solo para el texto quemado
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);

        // Imprimir datos en dos columnas
        pdf.text(`Nombres: ${nombreResponsable2}`, 10, 50);
        pdf.text(
          `Apellidos: ${apellidoResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          50
        );

        // Parentesco con el alumno
        pdf.text(`Parentesco con el alumno: ${tipoResponsable2}`, 10, 60);
        // Poner a la par de parentesco con el alumno solo si tipoResponsable === "Tutor Legal"
        if (tipoResponsable === "Tutor Legal") {
          pdf.text(
            `Relación con el alumno: ${relacionestudianteResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            60
          );
        }

        // Fecha de nacimiento
        pdf.text(`Edad: ${edad2} años`, 10, 70);

        // Numero de documento a la par de fecha de nacimiento
        pdf.text(
          `Número de documento: ${numeroduiResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          70
        );

        // NIT
        pdf.text(`NIT: ${numeronitResponsable2}`, 10, 80);

        // Nacionalidad a la par de NIT
        pdf.text(
          `Nacionalidad: ${nacionalidadResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          80
        );

        // Direccion y ver si se divide en 2 lineas
        const direccionTexto2 = `Dirección: ${direccionResponsable2}`;
        const direccionFragmentos2 = pdf.splitTextToSize(
          direccionTexto,
          pageSize.getWidth() - 20
        );
        pdf.text(direccionFragmentos2, 10, 90);

        // Departamento, verificar antes si la direccion fue dividida en 2
        if (direccionFragmentos2.length > 1) {
          pdf.text(`Departamento: ${departamentoResponsable2}`, 10, 105);
        } else {
          pdf.text(`Departamento: ${departamentoResponsable2}`, 10, 100);
        }

        // Municipio a la par de departamento a la misma altura, verficar direccion 2 lineas
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Municipio: ${municipioResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            105
          );
        } else {
          pdf.text(
            `Municipio: ${municipioResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            100
          );
        }

        // correo
        if (direccionFragmentos2.length > 1) {
          pdf.text(`Correo: ${emailResponsable2}`, 10, 115);
        } else {
          pdf.text(`Correo: ${emailResponsable2}`, 10, 110);
        }

        // correo a la par de celular
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Teléfono celular: ${telefonoCelularResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            115
          );
        } else {
          pdf.text(
            `Teléfono celular: ${telefonoCelularResponsable2}`,
            pageSize.getWidth() / 2 + 10,
            110
          );
        }

        // Ocupación
        if (direccionFragmentos2.length > 1) {
          pdf.text(`Profesión u Ocupación: ${occupationResponsable2}`, 10, 125);
        } else {
          pdf.text(`Profesión u Ocupación: ${occupationResponsable2}`, 10, 120);
        }

        // Lugar de trabajo en 140 o 145
        if (direccionFragmentos2.length > 1) {
          pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable2}`, 10, 135);
        } else {
          pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable2}`, 10, 130);
        }

        // Posicion de trabajo
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Posición de trabajo: ${posiciontrabajoResponsable2}`,
            10,
            145
          );
        } else {
          pdf.text(
            `Posición de trabajo: ${posiciontrabajoResponsable2}`,
            10,
            140
          );
        }

        // Teléfono de trabajo
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Teléfono de trabajo: ${telefonotrabajoResponsable2}`,
            10,
            155
          );
        } else {
          pdf.text(
            `Teléfono de trabajo: ${telefonotrabajoResponsable2}`,
            10,
            150
          );
        }

        // Es PEP
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable2}`,
            10,
            165
          );
        } else {
          pdf.text(
            `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable2}`,
            10,
            160
          );
        }
        //negrita
        pdf.setFont("helvetica", "bold");
        // Ocupación PEP
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
            10,
            175
          );
        } else {
          pdf.text(
            `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
            10,
            170
          );
        }
        //normal
        pdf.setFont("helvetica", "normal");
        // Ocupación PEP
        if (direccionFragmentos2.length > 1) {
          pdf.text(`${pepoccupationResponsable2}`, 10, 185);
        } else {
          pdf.text(`${pepoccupationResponsable2}`, 10, 180);
        }

        // Es PEP 3 años
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable2}`,
            10,
            195
          );
        } else {
          pdf.text(
            `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable2}`,
            10,
            190
          );
        }

        //negrita
        pdf.setFont("helvetica", "bold");

        // Ocupación PEP 3 años, dividir en 2 lineas si llega al final del ancho del pdf, aplicar lo mismo que dirección
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Puesto que ocupó en caso de ser una Persona Políticamente Expuesta:`,
            10,
            205
          );
        } else {
          pdf.text(
            `Puesto que ocupó en caso de haber sido una Persona Políticamente Expuesta:`,
            10,
            200
          );
        }

        //normal
        pdf.setFont("helvetica", "normal");
        // Ocupación PEP 3 años
        if (direccionFragmentos2.length > 1) {
          pdf.text(`${pepoccupation3Responsable2}`, 10, 215);
        } else {
          pdf.text(`${pepoccupation3Responsable2}`, 10, 210);
        }

        // Ingresos
        if (direccionFragmentos2.length > 1) {
          pdf.text(
            `Rango de ingresos mensuales familiares: ${incomingsResponsable2}`,
            10,
            225
          );
        } else {
          pdf.text(
            `Rango de ingresos mensuales familiares: ${incomingsResponsable2}`,
            10,
            220
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

        // Datos generales texto centrado sin negrita tamaño 15
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        const datosGenerales =
          "Informacion General del Padre/Madre de Familia o Apoderado";
        const datosGeneralesX = pageSize.getWidth() / 2;
        const datosGeneralesY = 35;
        const datosGeneralesWidth =
          pdf.getStringUnitWidth(datosGenerales) * pdf.internal.getFontSize();
        pdf.text(datosGenerales, datosGeneralesX, datosGeneralesY, {
          align: "center",
        });

        // Establecer negrita solo para el texto quemado
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);

        // Imprimir datos en dos columnas
        pdf.text(`Nombres: ${nombreResponsable3}`, 10, 50);
        pdf.text(
          `Apellidos: ${apellidoResponsable3}`,
          pageSize.getWidth() / 2 + 10,
          50
        );

        // Parentesco con el alumno
        pdf.text(`Parentesco con el alumno: ${tipoResponsable3}`, 10, 60);
        // Poner a la par de parentesco con el alumno solo si tipoResponsable === "Tutor Legal"
        if (tipoResponsable === "Tutor Legal") {
          pdf.text(
            `Relación con el alumno: ${relacionestudianteResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            60
          );
        }

        // Fecha de nacimiento
        pdf.text(`Edad: ${edad3} años`, 10, 70);

        // Numero de documento a la par de fecha de nacimiento
        pdf.text(
          `Número de documento: ${numeroduiResponsable3}`,
          pageSize.getWidth() / 2 + 10,
          70
        );

        // NIT
        pdf.text(`NIT: ${numeronitResponsable3}`, 10, 80);

        // Nacionalidad a la par de NIT
        pdf.text(
          `Nacionalidad: ${nacionalidadResponsable3}`,
          pageSize.getWidth() / 2 + 10,
          80
        );

        // Direccion y ver si se divide en 2 lineas
        const direccionTexto3 = `Dirección: ${direccionResponsable3}`;
        const direccionFragmentos3 = pdf.splitTextToSize(
          direccionTexto,
          pageSize.getWidth() - 20
        );
        pdf.text(direccionFragmentos3, 10, 90);

        // Departamento, verificar antes si la direccion fue dividida en 2
        if (direccionFragmentos3.length > 1) {
          pdf.text(`Departamento: ${departamentoResponsable3}`, 10, 105);
        } else {
          pdf.text(`Departamento: ${departamentoResponsable3}`, 10, 100);
        }

        // Municipio a la par de departamento a la misma altura, verficar direccion 2 lineas
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Municipio: ${municipioResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            105
          );
        } else {
          pdf.text(
            `Municipio: ${municipioResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            100
          );
        }

        // correo
        if (direccionFragmentos3.length > 1) {
          pdf.text(`Correo: ${emailResponsable3}`, 10, 115);
        } else {
          pdf.text(`Correo: ${emailResponsable3}`, 10, 110);
        }

        // correo a la par de celular
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Teléfono celular: ${telefonoCelularResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            115
          );
        } else {
          pdf.text(
            `Teléfono celular: ${telefonoCelularResponsable3}`,
            pageSize.getWidth() / 2 + 10,
            110
          );
        }

        // Ocupación
        if (direccionFragmentos3.length > 1) {
          pdf.text(`Profesión u Ocupación: ${occupationResponsable3}`, 10, 125);
        } else {
          pdf.text(`Profesión u Ocupación: ${occupationResponsable3}`, 10, 120);
        }

        // Lugar de trabajo en 140 o 145
        if (direccionFragmentos3.length > 1) {
          pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable3}`, 10, 135);
        } else {
          pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable3}`, 10, 130);
        }

        // Posicion de trabajo
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Posición de trabajo: ${posiciontrabajoResponsable3}`,
            10,
            145
          );
        } else {
          pdf.text(
            `Posición de trabajo: ${posiciontrabajoResponsable3}`,
            10,
            140
          );
        }

        // Teléfono de trabajo
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Teléfono de trabajo: ${telefonotrabajoResponsable3}`,
            10,
            155
          );
        } else {
          pdf.text(
            `Teléfono de trabajo: ${telefonotrabajoResponsable3}`,
            10,
            150
          );
        }

        // Es PEP
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable3}`,
            10,
            165
          );
        } else {
          pdf.text(
            `¿Es actualmente una Persona Políticamente Expuesta (PEP´s)?*: ${espepResponsable3}`,
            10,
            160
          );
        }
        //negrita
        pdf.setFont("helvetica", "bold");
        // Ocupación PEP
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
            10,
            175
          );
        } else {
          pdf.text(
            `Puesto que ocupa en caso de ser una Persona Políticamente Expuesta:`,
            10,
            170
          );
        }
        //normal
        pdf.setFont("helvetica", "normal");
        // Ocupación PEP
        if (direccionFragmentos3.length > 1) {
          pdf.text(`${pepoccupationResponsable3}`, 10, 185);
        } else {
          pdf.text(`${pepoccupationResponsable3}`, 10, 180);
        }

        // Es PEP 3 años
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable2}`,
            10,
            195
          );
        } else {
          pdf.text(
            `¿Ha sido una Persona Políticamente Expuesta (PEP´s) en los últimos 3 años?*: ${espep3Responsable2}`,
            10,
            190
          );
        }

        //negrita
        pdf.setFont("helvetica", "bold");

        // Ocupación PEP 3 años, dividir en 2 lineas si llega al final del ancho del pdf, aplicar lo mismo que dirección
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Puesto que ocupó en caso de ser una Persona Políticamente Expuesta:`,
            10,
            205
          );
        } else {
          pdf.text(
            `Puesto que ocupó en caso de haber sido una Persona Políticamente Expuesta:`,
            10,
            200
          );
        }

        //normal
        pdf.setFont("helvetica", "normal");
        // Ocupación PEP 3 años
        if (direccionFragmentos3.length > 1) {
          pdf.text(`${pepoccupation3Responsable3}`, 10, 215);
        } else {
          pdf.text(`${pepoccupation3Responsable3}`, 10, 210);
        }

        // Ingresos
        if (direccionFragmentos3.length > 1) {
          pdf.text(
            `Rango de ingresos mensuales familiares: ${incomingsResponsable3}`,
            10,
            225
          );
        } else {
          pdf.text(
            `Rango de ingresos mensuales familiares: ${incomingsResponsable3}`,
            10,
            220
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

      pdf.save("PDF Registro.pdf");

      // cerrar modal
      handleCloseModal();
    }
  };

  const handleGenerarPDF1 = async () => {
    let bandera1 = false;
    let bandera2 = false;
    let bandera3 = false;
    //Agregar los datos de responsable 1
    let nombreResponsable1;
    let apellidoResponsable;
    let numeroduiResponsable;
    let numeronitResponsable;
    let nacionalidadResponsable;
    let telefonotrabajoResponsable;
    let telefonoCelularResponsable1;
    let emailResponsable;
    let occupationResponsable;
    let lugartrabajoResponsable;
    let posiciontrabajoResponsable;
    let esexalumnoResponsable;
    let universidadResponsable;
    let relacionestudianteResponsable;
    let tipoResponsable; // obtengo si es mamà, papà, tutor legal, etc
    //Agregar los datos de responsable 2
    let nombreResponsable2;
    let apellidoResponsable2;
    let numeroduiResponsable2;
    let numeronitResponsable2;
    let nacionalidadResponsable2;
    let telefonotrabajoResponsable2;
    let telefonoCelularResponsable2;
    let emailResponsable2;
    let occupationResponsable2;
    let lugartrabajoResponsable2;
    let posiciontrabajoResponsable2;
    let esexalumnoResponsable2;
    let universidadResponsable2;
    let relacionestudianteResponsable2;
    let tipoResponsable2; // obtengo si es mamà, papà, tutor legal, etc
    //Agregar los datos de responsable 3
    let nombreResponsable3;
    let apellidoResponsable3;
    let numeroduiResponsable3;
    let numeronitResponsable3;
    let nacionalidadResponsable3;
    let telefonotrabajoResponsable3;
    let telefonoCelularResponsable3;
    let emailResponsable3;
    let occupationResponsable3;
    let lugartrabajoResponsable3;
    let posiciontrabajoResponsable3;
    let esexalumnoResponsable3;
    let universidadResponsable3;
    let relacionestudianteResponsable3;
    let tipoResponsable3; // obtengo si es mamà, papà, tutor legal, etc

    if (dataResponsable) {
      if (
        dataResponsable[0].externadoRespType.externado_responsible_type ===
        "Mamá"
      ) {
        bandera1 = true;
        //Agregar los datos de responsable 1 que es mamá
        nombreResponsable1 = dataResponsable[0].externado_firstname;
        apellidoResponsable = dataResponsable[0].externado_lastname;
        numeroduiResponsable = dataResponsable[0].externado_id;
        numeronitResponsable = dataResponsable[0].externado_nit;
        nacionalidadResponsable =
          dataResponsable[0].externado_nationality || "N/a";
        telefonotrabajoResponsable = dataResponsable[0].externado_work_phone;
        if (
          telefonotrabajoResponsable === null ||
          telefonotrabajoResponsable === ""
        ) {
          telefonotrabajoResponsable = "N/a";
        }
        telefonoCelularResponsable1 = dataResponsable[0].externado_mobile_phone;
        emailResponsable = dataResponsable[0].externado_email || "N/a";
        occupationResponsable =
          dataResponsable[0].externado_occupation || "N/a";
        lugartrabajoResponsable = dataResponsable[0].externado_workplace;
        if (
          lugartrabajoResponsable === null ||
          lugartrabajoResponsable === ""
        ) {
          lugartrabajoResponsable = "N/a";
        }
        posiciontrabajoResponsable = dataResponsable[0].externado_jobposition;
        if (
          posiciontrabajoResponsable === null ||
          posiciontrabajoResponsable === ""
        ) {
          posiciontrabajoResponsable = "N/a";
        }
        esexalumnoResponsable =
          dataResponsable[0].externado_former_externado_student;
        if (esexalumnoResponsable === true) {
          esexalumnoResponsable = "Si";
        } else {
          esexalumnoResponsable = "No";
        }
        universidadResponsable =
          dataResponsable[0].externado_university_studies;
        if (universidadResponsable === null || universidadResponsable === "") {
          universidadResponsable = "N/a";
        }
        relacionestudianteResponsable =
          dataResponsable[0].externado_responsible_relationship;
        tipoResponsable =
          dataResponsable[0].externadoRespType.externado_responsible_type;
      }
      if (
        dataResponsable[0].externadoRespType.externado_responsible_type ===
        "Papá"
      ) {
        bandera2 = true;
        //Agregar los datos de responsable 2 que es papá
        nombreResponsable2 = dataResponsable[0].externado_firstname || "N/a";
        apellidoResponsable2 = dataResponsable[0].externado_lastname || "N/a";
        numeroduiResponsable2 = dataResponsable[0].externado_id || "N/a";
        numeronitResponsable2 = dataResponsable[0].externado_nit || "N/a";
        nacionalidadResponsable2 =
          dataResponsable[0].externado_nationality || "N/a";
        telefonotrabajoResponsable2 = dataResponsable[0].externado_work_phone;
        if (
          telefonotrabajoResponsable2 === null ||
          telefonotrabajoResponsable2 === ""
        ) {
          telefonotrabajoResponsable2 = "N/a";
        }
        telefonoCelularResponsable2 = dataResponsable[0].externado_mobile_phone;
        occupationResponsable2 =
          dataResponsable[0].externado_occupation || "N/a";
        lugartrabajoResponsable2 = dataResponsable[0].externado_workplace;
        if (
          lugartrabajoResponsable2 === null ||
          lugartrabajoResponsable2 === ""
        ) {
          lugartrabajoResponsable2 = "N/a";
        }
        emailResponsable2 = dataResponsable[0].externado_email || "N/a";
        posiciontrabajoResponsable2 = dataResponsable[0].externado_jobposition;
        if (
          posiciontrabajoResponsable2 === null ||
          posiciontrabajoResponsable2 === ""
        ) {
          posiciontrabajoResponsable2 = "N/a";
        }
        esexalumnoResponsable2 =
          dataResponsable[0].externado_former_externado_student;
        if (esexalumnoResponsable2 === true) {
          esexalumnoResponsable2 = "Si";
        } else {
          esexalumnoResponsable2 = "No";
        }
        universidadResponsable2 =
          dataResponsable[0].externado_university_studies;
        if (
          universidadResponsable2 === null ||
          universidadResponsable2 === ""
        ) {
          universidadResponsable2 = "N/a";
        }
        relacionestudianteResponsable2 =
          dataResponsable[0].externado_responsible_relationship;
        tipoResponsable2 =
          dataResponsable[0].externadoRespType.externado_responsible_type;
      }
      if (dataResponsable.length > 1) {
        if (
          dataResponsable[1].externadoRespType.externado_responsible_type ===
          "Mamá"
        ) {
          bandera1 = true;
          //Agrego a mamá los datos de la posicion [1]
          nombreResponsable1 = dataResponsable[1].externado_firstname || "N/a";
          apellidoResponsable = dataResponsable[1].externado_lastname || "N/a";
          numeroduiResponsable = dataResponsable[1].externado_id || "N/a";
          numeronitResponsable = dataResponsable[1].externado_nit || "N/a";
          nacionalidadResponsable =
            dataResponsable[1].externado_nationality || "N/a";
          telefonotrabajoResponsable = dataResponsable[1].externado_work_phone;
          if (
            telefonotrabajoResponsable === null ||
            telefonotrabajoResponsable === ""
          ) {
            telefonotrabajoResponsable = "N/a";
          }
          telefonoCelularResponsable1 =
            dataResponsable[1].externado_mobile_phone;
          emailResponsable = dataResponsable[1].externado_email || "N/a";
          occupationResponsable =
            dataResponsable[1].externado_occupation || "N/a";
          lugartrabajoResponsable = dataResponsable[1].externado_workplace;
          if (
            lugartrabajoResponsable === null ||
            lugartrabajoResponsable === ""
          ) {
            lugartrabajoResponsable = "N/a";
          }
          posiciontrabajoResponsable = dataResponsable[1].externado_jobposition;
          if (
            posiciontrabajoResponsable === null ||
            posiciontrabajoResponsable === ""
          ) {
            posiciontrabajoResponsable = "N/a";
          }
          esexalumnoResponsable =
            dataResponsable[1].externado_former_externado_student;
          if (esexalumnoResponsable === true) {
            esexalumnoResponsable = "Si";
          } else {
            esexalumnoResponsable = "No";
          }
          universidadResponsable =
            dataResponsable[1].externado_university_studies;
          if (
            universidadResponsable === null ||
            universidadResponsable === ""
          ) {
            universidadResponsable = "N/a";
          }
          relacionestudianteResponsable =
            dataResponsable[1].externado_responsible_relationship;
          tipoResponsable =
            dataResponsable[1].externadoRespType.externado_responsible_type;
        }
        if (
          dataResponsable[1].externadoRespType.externado_responsible_type ===
          "Papá"
        ) {
          bandera2 = true;
          //Agregar los datos de responsable 2 que es papá
          nombreResponsable2 = dataResponsable[1].externado_firstname || "N/a";
          apellidoResponsable2 = dataResponsable[1].externado_lastname || "N/a";
          numeroduiResponsable2 = dataResponsable[1].externado_id || "N/a";
          numeronitResponsable2 = dataResponsable[1].externado_nit || "N/a";
          nacionalidadResponsable2 =
            dataResponsable[1].externado_nationality || "N/a";
          telefonotrabajoResponsable2 = dataResponsable[1].externado_work_phone;
          if (
            telefonotrabajoResponsable2 === null ||
            telefonotrabajoResponsable2 === ""
          ) {
            telefonotrabajoResponsable2 = "N/a";
          }
          telefonoCelularResponsable2 =
            dataResponsable[1].externado_mobile_phone;
          occupationResponsable2 =
            dataResponsable[1].externado_occupation || "N/a";
          lugartrabajoResponsable2 = dataResponsable[1].externado_workplace;
          emailResponsable2 = dataResponsable[1].externado_email || "N/a";
          if (
            lugartrabajoResponsable2 === null ||
            lugartrabajoResponsable2 === ""
          ) {
            lugartrabajoResponsable2 = "N/a";
          }
          posiciontrabajoResponsable2 =
            dataResponsable[1].externado_jobposition;
          if (
            posiciontrabajoResponsable2 === null ||
            posiciontrabajoResponsable2 === ""
          ) {
            posiciontrabajoResponsable2 = "N/a";
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
          if (
            universidadResponsable2 === null ||
            universidadResponsable2 === ""
          ) {
            universidadResponsable2 = "N/a";
          }
          relacionestudianteResponsable2 =
            dataResponsable[1].externado_responsible_relationship;
          tipoResponsable2 =
            dataResponsable[1].externadoRespType.externado_responsible_type;
        }
      }
      if (dataResponsable.length > 2) {
        if (
          dataResponsable[2].externadoRespType.externado_responsible_type ===
          "Mamá"
        ) {
          bandera1 = true;
          //Agrego a mamá los datos de la posicion [2]
          nombreResponsable1 = dataResponsable[2].externado_firstname || "N/a";
          apellidoResponsable = dataResponsable[2].externado_lastname || "N/a";
          numeroduiResponsable = dataResponsable[2].externado_id || "N/a";
          numeronitResponsable = dataResponsable[2].externado_nit || "N/a";
          nacionalidadResponsable3 =
            dataResponsable[2].externado_nationality || "N/a";
          telefonotrabajoResponsable = dataResponsable[2].externado_work_phone;
          if (
            telefonotrabajoResponsable === null ||
            telefonotrabajoResponsable === ""
          ) {
            telefonotrabajoResponsable = "N/a";
          }
          telefonoCelularResponsable1 =
            dataResponsable[2].externado_mobile_phone;
          emailResponsable = dataResponsable[2].externado_email || "N/a";
          occupationResponsable =
            dataResponsable[2].externado_occupation || "N/a";
          lugartrabajoResponsable = dataResponsable[2].externado_workplace;
          if (
            lugartrabajoResponsable === null ||
            lugartrabajoResponsable === ""
          ) {
            lugartrabajoResponsable = "N/a";
          }
          posiciontrabajoResponsable = dataResponsable[2].externado_jobposition;
          if (
            posiciontrabajoResponsable === null ||
            posiciontrabajoResponsable === ""
          ) {
            posiciontrabajoResponsable = "N/a";
          }
          esexalumnoResponsable =
            dataResponsable[2].externado_former_externado_student;
          if (esexalumnoResponsable === true) {
            esexalumnoResponsable = "Si";
          } else {
            esexalumnoResponsable = "No";
          }
          universidadResponsable =
            dataResponsable[2].externado_university_studies;
          if (
            universidadResponsable === null ||
            universidadResponsable === ""
          ) {
            universidadResponsable = "N/a";
          }
          relacionestudianteResponsable =
            dataResponsable[2].externado_responsible_relationship;
          tipoResponsable =
            dataResponsable[2].externadoRespType.externado_responsible_type;
        }
        if (
          dataResponsable[2].externadoRespType.externado_responsible_type ===
          "Papá"
        ) {
          bandera2 = true;
          //Agregar los datos de responsable 2 que es papá
          nombreResponsable2 = dataResponsable[2].externado_firstname || "N/a";
          apellidoResponsable2 = dataResponsable[2].externado_lastname || "N/a";
          numeroduiResponsable2 = dataResponsable[2].externado_id || "N/a";
          numeronitResponsable2 = dataResponsable[2].externado_nit || "N/a";
          nacionalidadResponsable2 =
            dataResponsable[2].externado_nationality || "N/a";
          telefonotrabajoResponsable2 = dataResponsable[2].externado_work_phone;
          if (
            telefonotrabajoResponsable2 === null ||
            telefonotrabajoResponsable2 === ""
          ) {
            telefonotrabajoResponsable2 = "N/a";
          }
          telefonoCelularResponsable2 =
            dataResponsable[2].externado_mobile_phone;
          occupationResponsable2 =
            dataResponsable[2].externado_occupation || "N/a";
          lugartrabajoResponsable2 = dataResponsable[2].externado_workplace;
          emailResponsable2 = dataResponsable[2].externado_email || "N/a";
          if (
            lugartrabajoResponsable2 === null ||
            lugartrabajoResponsable2 === ""
          ) {
            lugartrabajoResponsable2 = "N/a";
          }
          posiciontrabajoResponsable2 =
            dataResponsable[2].externado_jobposition;
          if (
            posiciontrabajoResponsable2 === null ||
            posiciontrabajoResponsable2 === ""
          ) {
            posiciontrabajoResponsable2 = "N/a";
          }
          esexalumnoResponsable2 =
            dataResponsable[2].externado_former_externado_student;
          if (esexalumnoResponsable2 === true) {
            esexalumnoResponsable2 = "Si";
          } else {
            esexalumnoResponsable2 = "No";
          }
          universidadResponsable2 =
            dataResponsable[2].externado_university_studies;
          if (
            universidadResponsable2 === null ||
            universidadResponsable2 === ""
          ) {
            universidadResponsable2 = "N/a";
          }
          relacionestudianteResponsable2 =
            dataResponsable[2].externado_responsible_relationship;
          tipoResponsable2 =
            dataResponsable[2].externadoRespType.externado_responsible_type;
        }
      }
    }
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
      const fechaFormateada = `${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia
        }-${año}`;

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

        //(0,'Favor seleccionar un valor'),(1,'Parvularia 4'),(2,'Parvularia 5'),
        //(3,'Preparatoria'),(4,'Primero'),(5,'Segundo'),(6,'Tercero'),(7,'Cuarto Matutino')
        //,(8,'Cuarto Vespertino'),(9,'Quinto Matutino'),(10,'Quinto Vespertino'),(11,'Sexto Matutino'),
        //(12,'Sexto Vespertino'),(13,'Séptimo Matutino'),(14,'Séptimo Vespertino'),(15,'Octavo Matutino'),
        //(16,'Octavo Vespertino'),(17,'Noveno Matutino'),(18,'Noveno Vespertino'),(19,'Primero de Bachillerato'),(20,'Segundo de Bachillerato');
        if (hermano1gradoEstudiante === 1) {
          hermano1gradoEstudiante = "Parvularia 4";
        } else if (hermano1gradoEstudiante === 2) {
          hermano1gradoEstudiante = "Parvularia 5";
        } else if (hermano1gradoEstudiante === 3) {
          hermano1gradoEstudiante = "Preparatoria";
        } else if (hermano1gradoEstudiante === 4) {
          hermano1gradoEstudiante = "Primero";
        } else if (hermano1gradoEstudiante === 5) {
          hermano1gradoEstudiante = "Segundo";
        } else if (hermano1gradoEstudiante === 6) {
          hermano1gradoEstudiante = "Tercero";
        } else if (hermano1gradoEstudiante === 7) {
          hermano1gradoEstudiante = "Cuarto Matutino";
        } else if (hermano1gradoEstudiante === 8) {
          hermano1gradoEstudiante = "Cuarto Vespertino";
        } else if (hermano1gradoEstudiante === 9) {
          hermano1gradoEstudiante = "Quinto Matutino";
        } else if (hermano1gradoEstudiante === 10) {
          hermano1gradoEstudiante = "Quinto Vespertino";
        } else if (hermano1gradoEstudiante === 11) {
          hermano1gradoEstudiante = "Sexto Matutino";
        } else if (hermano1gradoEstudiante === 12) {
          hermano1gradoEstudiante = "Sexto Vespertino";
        } else if (hermano1gradoEstudiante === 13) {
          hermano1gradoEstudiante = "Séptimo Matutino";
        } else if (hermano1gradoEstudiante === 14) {
          hermano1gradoEstudiante = "Séptimo Vespertino";
        } else if (hermano1gradoEstudiante === 15) {
          hermano1gradoEstudiante = "Octavo Matutino";
        } else if (hermano1gradoEstudiante === 16) {
          hermano1gradoEstudiante = "Octavo Vespertino";
        } else if (hermano1gradoEstudiante === 17) {
          hermano1gradoEstudiante = "Noveno Matutino";
        } else if (hermano1gradoEstudiante === 18) {
          hermano1gradoEstudiante = "Noveno Vespertino";
        } else if (hermano1gradoEstudiante === 19) {
          hermano1gradoEstudiante = "Primero de Bachillerato";
        } else if (hermano1gradoEstudiante === 20) {
          hermano1gradoEstudiante = "Segundo de Bachillerato";
        }

        if (hermano2gradoEstudiante === 1) {
          hermano2gradoEstudiante = "Parvularia 4";
        } else if (hermano2gradoEstudiante === 2) {
          hermano2gradoEstudiante = "Parvularia 5";
        } else if (hermano2gradoEstudiante === 3) {
          hermano2gradoEstudiante = "Preparatoria";
        } else if (hermano2gradoEstudiante === 4) {
          hermano2gradoEstudiante = "Primero";
        } else if (hermano2gradoEstudiante === 5) {
          hermano2gradoEstudiante = "Segundo";
        } else if (hermano2gradoEstudiante === 6) {
          hermano2gradoEstudiante = "Tercero";
        } else if (hermano2gradoEstudiante === 7) {
          hermano2gradoEstudiante = "Cuarto Matutino";
        } else if (hermano2gradoEstudiante === 8) {
          hermano2gradoEstudiante = "Cuarto Vespertino";
        } else if (hermano2gradoEstudiante === 9) {
          hermano2gradoEstudiante = "Quinto Matutino";
        } else if (hermano2gradoEstudiante === 10) {
          hermano2gradoEstudiante = "Quinto Vespertino";
        } else if (hermano2gradoEstudiante === 11) {
          hermano2gradoEstudiante = "Sexto Matutino";
        } else if (hermano2gradoEstudiante === 12) {
          hermano2gradoEstudiante = "Sexto Vespertino";
        } else if (hermano2gradoEstudiante === 13) {
          hermano2gradoEstudiante = "Séptimo Matutino";
        } else if (hermano2gradoEstudiante === 14) {
          hermano2gradoEstudiante = "Séptimo Vespertino";
        } else if (hermano2gradoEstudiante === 15) {
          hermano2gradoEstudiante = "Octavo Matutino";
        } else if (hermano2gradoEstudiante === 16) {
          hermano2gradoEstudiante = "Octavo Vespertino";
        } else if (hermano2gradoEstudiante === 17) {
          hermano2gradoEstudiante = "Noveno Matutino";
        } else if (hermano2gradoEstudiante === 18) {
          hermano2gradoEstudiante = "Noveno Vespertino";
        } else if (hermano2gradoEstudiante === 19) {
          hermano2gradoEstudiante = "Primero de Bachillerato";
        } else if (hermano2gradoEstudiante === 20) {
          hermano2gradoEstudiante = "Segundo de Bachillerato";
        }

        if (hermano3gradoEstudiante === 1) {
          hermano3gradoEstudiante = "Parvularia 4";
        } else if (hermano3gradoEstudiante === 2) {
          hermano3gradoEstudiante = "Parvularia 5";
        } else if (hermano3gradoEstudiante === 3) {
          hermano3gradoEstudiante = "Preparatoria";
        } else if (hermano3gradoEstudiante === 4) {
          hermano3gradoEstudiante = "Primero";
        } else if (hermano3gradoEstudiante === 5) {
          hermano3gradoEstudiante = "Segundo";
        } else if (hermano3gradoEstudiante === 6) {
          hermano3gradoEstudiante = "Tercero";
        } else if (hermano3gradoEstudiante === 7) {
          hermano3gradoEstudiante = "Cuarto Matutino";
        } else if (hermano3gradoEstudiante === 8) {
          hermano3gradoEstudiante = "Cuarto Vespertino";
        } else if (hermano3gradoEstudiante === 9) {
          hermano3gradoEstudiante = "Quinto Matutino";
        } else if (hermano3gradoEstudiante === 10) {
          hermano3gradoEstudiante = "Quinto Vespertino";
        } else if (hermano3gradoEstudiante === 11) {
          hermano3gradoEstudiante = "Sexto Matutino";
        } else if (hermano3gradoEstudiante === 12) {
          hermano3gradoEstudiante = "Sexto Vespertino";
        } else if (hermano3gradoEstudiante === 13) {
          hermano3gradoEstudiante = "Séptimo Matutino";
        } else if (hermano3gradoEstudiante === 14) {
          hermano3gradoEstudiante = "Séptimo Vespertino";
        } else if (hermano3gradoEstudiante === 15) {
          hermano3gradoEstudiante = "Octavo Matutino";
        } else if (hermano3gradoEstudiante === 16) {
          hermano3gradoEstudiante = "Octavo Vespertino";
        } else if (hermano3gradoEstudiante === 17) {
          hermano3gradoEstudiante = "Noveno Matutino";
        } else if (hermano3gradoEstudiante === 18) {
          hermano3gradoEstudiante = "Noveno Vespertino";
        } else if (hermano3gradoEstudiante === 19) {
          hermano3gradoEstudiante = "Primero de Bachillerato";
        } else if (hermano3gradoEstudiante === 20) {
          hermano3gradoEstudiante = "Segundo de Bachillerato";
        }
      } catch (error) {
        // Error al analizar la cadena JSON
        //console.error("Error al analizar la cadena JSON de hermanos.", error);
      }

      //Imprimir en consola los hermanos del estudiante y su grado en una sola linea por cada uno
      /*//console.log(
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
      );*/

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
        religionEstudiante = dataEstudiante.externado_student_church_other;
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
      const datosGenerales = "Datos del Estudiante";
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
      // dirección de residencia
      /*const direccionTexto = `Dirección: ${direccionEstudiante}`;
       const direccionFragmentos = pdf.splitTextToSize(
         direccionTexto,
         pageSize.getWidth() - 20
       );
       pdf.text(direccionFragmentos, 10, 70);*/

      // Escuela anterior, verificar si se divide en 2 lineas como la dirección
      const escuelaTexto = `Escuela o colegio en el que estudió en el año escolar anterior: ${ultimaescuelaEstudiante}`;
      const escuelaFragmentos = pdf.splitTextToSize(
        escuelaTexto,
        pageSize.getWidth() - 20
      );
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
      pdf.text(escuelaFragmentos, 10, escuelaPosicionY);

      // Grado
      const gradoTexto = `Grado que cursará en el siguiente año escolar: ${gradoEstudiante}`;
      let gradoPosicionY = 140; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        gradoPosicionY = 150; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        hermanosPosicionY = 160; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        hermanosPosicionY2 = 170; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
        religionFragmentos.length > 1
      ) {
        hermanosPosicionY2 = 165; // Ajustar la posición si se dividió el texto
      }

      pdf.text(
        `Nombre y Grado que cursarán los hermanos (en caso se tengan) en el siguiente año escolar`,
        10,
        hermanosPosicionY2
      );

      pdf.setFont("helvetica", "normal");
      // Imprimir a los 3 hermanos y sus grados en una fila cada uno separado por Nombres y Grado en 2 columnas
      // Hermano 1
      const hemano1Texto = `Nombre: ${hermano1nombreEstudiante}`;
      let hemano1PosicionY = 170; // Posición predeterminada

      // Verificar si el texto de dirección se dividió en dos líneas
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        hemano1PosicionY = 180; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        hemano1GradoPosicionY = 180; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        hemano2PosicionY = 190; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        hemano2GradoPosicionY = 190; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        hemano3PosicionY = 200; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        hemano3GradoPosicionY = 200; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        catolicoFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        viveconambosPosicionY = 210; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        viveconambosPosicionY2 = 220; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        viveconquienPosicionY = 230; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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
      if (escuelaFragmentos.length > 1 && direccionFragmentos.length > 1) {
        parentescoPosicionY = 230; // Ajustar la posición si se dividió el texto
      } else if (
        direccionFragmentos.length > 1 ||
        celularFragmentos.length > 1 ||
        escuelaFragmentos.length > 1 ||
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

      // Agregar una nueva página para los datos de mama y papa
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
      //Imprimir titular como Datos Generales, ahora llamado Datos de los Padres
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(0, 0, 0);
      const datosPadres = "Datos de los Padres";
      const datosPadresX = pageSize.getWidth() / 2;
      let datosPadresY = 30;
      const datosPadresWidth =
        pdf.getStringUnitWidth(datosPadres) * pdf.internal.getFontSize();
      pdf.text(datosPadres, datosPadresX, datosPadresY, {
        align: "center",
      });

      // Datos de los padres

      pdf.setFontSize(12);

      //Imprimir texto como anteriores en negrita que diga Contacto de emergencia (en caso de que no se pueda localizar a los padres):
      pdf.setFont("helvetica", "bold");
      // Imprimiendo Madre si bandera1 es true
      pdf.text(`Datos de la madre:`, 10, 40);
      pdf.setFont("helvetica", "normal");

      // Nombre de la madre que es Responsable 1
      if (nombreResponsable1 === undefined) {
        pdf.text(`Nombres: N/a`, 10, 50);
        pdf.text(`Apellidos:  N/a`, pageSize.getWidth() / 2 + 10, 50);
        pdf.text(`Nacionalidad: N/a`, 10, 60);
        pdf.text(`Número de documento: N/a`, pageSize.getWidth() / 2 + 10, 60);
        pdf.text(`Profesión u Ocupación: N/a`, 10, 70);
        pdf.text(`Lugar de trabajo: N/a`, 10, 80);
        pdf.text(`Cargo que desempeña: N/a`, 10, 90);
        pdf.text(`Teléfono de trabajo: N/a`, 10, 100);
        pdf.text(`Teléfono celular: N/a`, pageSize.getWidth() / 2 + 10, 100);
        pdf.text(`¿Es exalumna del externado?: N/a`, 10, 110);
        pdf.text(`Universidad en la que estudió : N/a`, 10, 120);
      } else {
        pdf.text(`Nombres: ${nombreResponsable1}`, 10, 50);
        pdf.text(
          `Apellidos: ${apellidoResponsable}`,
          pageSize.getWidth() / 2 + 10,
          50
        );
        pdf.text(`Nacionalidad: ${nacionalidadResponsable}`, 10, 60);
        pdf.text(
          `Número de documento: ${numeroduiResponsable}`,
          pageSize.getWidth() / 2 + 10,
          60
        );

        pdf.text(`Profesión u Ocupación: ${occupationResponsable}`, 10, 70);
        pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable}`, 10, 80);
        pdf.text(`Cargo que desempeña: ${posiciontrabajoResponsable}`, 10, 90);
        pdf.text(`Teléfono de trabajo: ${telefonotrabajoResponsable}`, 10, 100);
        pdf.text(
          `Teléfono celular: ${telefonoCelularResponsable1}`,
          pageSize.getWidth() / 2 + 10,
          100
        );
        pdf.text(
          `¿Es exalumna del externado?: ${esexalumnoResponsable}`,
          10,
          110
        );
        pdf.text(
          `Universidad en la que estudió : ${universidadResponsable}`,
          10,
          120
        );
        pdf.text(`Correo electrónico: ${emailResponsable}`, 10, 130);
      }

      //Datos del padre
      pdf.setFont("helvetica", "bold");
      // Imprimiendo Padre si bandera2 es true
      pdf.text(`Datos del padre:`, 10, 140);
      pdf.setFont("helvetica", "normal");

      // Nombre del padre que es Responsable 2
      if (nombreResponsable2 === undefined) {
        pdf.text(`Nombres: N/a`, 10, 150);
        pdf.text(`Apellidos:  N/a`, pageSize.getWidth() / 2 + 10, 150);
        pdf.text(`Nacionalidad: N/a`, 10, 160);
        pdf.text(`Número de documento: N/a`, pageSize.getWidth() / 2 + 10, 160);
        pdf.text(`Profesión u Ocupación: N/a`, 10, 170);
        pdf.text(`Lugar de trabajo: N/a`, 10, 180);
        pdf.text(`Cargo que desempeña: N/a`, 10, 190);
        pdf.text(`Teléfono de trabajo: N/a`, 10, 200);
        pdf.text(`Teléfono celular: N/a`, pageSize.getWidth() / 2 + 10, 200);
        pdf.text(`¿Es exalumno del externado?: N/a`, 10, 210);
        pdf.text(`Universidad en la que estudió : N/a`, 10, 220);
      } else {
        pdf.text(`Nombres: ${nombreResponsable2}`, 10, 150);
        pdf.text(
          `Apellidos: ${apellidoResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          150
        );
        pdf.text(`Nacionalidad: ${nacionalidadResponsable2}`, 10, 160);
        pdf.text(
          `Número de documento: ${numeroduiResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          160
        );
        pdf.text(`Profesión u Ocupación: ${occupationResponsable2}`, 10, 170);
        pdf.text(`Lugar de trabajo: ${lugartrabajoResponsable2}`, 10, 180);
        pdf.text(
          `Cargo que desempeña: ${posiciontrabajoResponsable2}`,
          10,
          190
        );
        pdf.text(
          `Teléfono de trabajo: ${telefonotrabajoResponsable2}`,
          10,
          200
        );
        pdf.text(
          `Teléfono celular: ${telefonoCelularResponsable2}`,
          pageSize.getWidth() / 2 + 10,
          200
        );
        pdf.text(
          `¿Es exalumno del externado?: ${esexalumnoResponsable2}`,
          10,
          210
        );
        pdf.text(
          `Universidad en la que estudió : ${universidadResponsable2}`,
          10,
          220
        );
        pdf.text(`Correo electrónico: ${emailResponsable2}`, 10, 230);
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

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      //Quien es la persona responsable del alumno ante el colegio
      pdf.text(
        `¿Quién es la persona responsable del alumno ante el colegio?`,
        10,
        100
      );
      pdf.setFont("helvetica", "normal");
      pdf.text(`${responsableEstudiante}`, 10, 110);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Si el responsable es solo mamá o papá:`, 10, 120);
      pdf.setFont("helvetica", "normal");

      if (responsableEstudiante === "Mamá") {
        pdf.text(
          `Nombre:_________________________________________________ `,
          10,
          130
        );
        pdf.text(`Firma: ____________________`, 10, 140);
      } else if (responsableEstudiante === "Papá") {
        pdf.text(
          `Nombre:_________________________________________________`,
          10,
          130
        );
        pdf.text(`Firma: ____________________`, 10, 140);
      } else {
        pdf.text(`Nombre: N/a`, 10, 130);
        pdf.text(`Firma: N/a`, 10, 140);
      }

      pdf.setFont("helvetica", "bold");
      pdf.text(`Si los responsables son ambos padres:`, 10, 150);
      pdf.setFont("helvetica", "normal");
      if (responsableEstudiante === "Mamá y Papá") {
        pdf.text(
          `Nombre padre: _________________________________________________`,
          10,
          160
        );
        pdf.text(`Firma: ____________________`, 10, 170);
        pdf.text(
          `Nombre madre: _________________________________________________`,
          10,
          180
        );
        pdf.text(`Firma: ____________________`, 10, 190);
      } else {
        pdf.text(`Nombre padre: N/a`, 10, 160);
        pdf.text(`Firma padre: N/a`, 10, 170);
        pdf.text(`Nombre madre: N/a`, 10, 180);
        pdf.text(`Firma madre: N/a`, 10, 190);
      }

      pdf.setFont("helvetica", "bold");
      pdf.text(`Si no son los padres ¿Quién es la persona delegada?:`, 10, 200);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Nombre: ${nombreResponsable}`, 10, 210);
      // Imprimir direccion del responsable
      const direccionResponsableTexto = `Dirección: ${direccionResponsable}`;
      let direccionResponsablePosicionY = 220; // Posición predeterminada

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
      let duiResponsablePosicionY = 230; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        duiResponsablePosicionY = 235; // Ajustar la posición si se dividió el texto
      }

      // imprimir DUI del responsable
      pdf.text(duiResponsableTexto, 10, duiResponsablePosicionY);

      // Imprimir telefono de casa del responsable a la par del numero de dui
      const telefonoCasaResponsableTexto = `Teléfono de casa: ${telefonoCasaResponsable}`;
      let telefonoCasaResponsablePosicionY = 230; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        telefonoCasaResponsablePosicionY = 235; // Ajustar la posición si se dividió el texto
      }

      // imprimir telefono de casa del responsable
      pdf.text(
        telefonoCasaResponsableTexto,
        pageSize.getWidth() / 2 + 10,
        telefonoCasaResponsablePosicionY
      );

      // Imprimir el telefono de trabajo del responsable
      const telefonoTrabajoResponsableTexto = `Teléfono de trabajo: ${telefonoTrabajoResponsable}`;
      let telefonoTrabajoResponsablePosicionY = 240; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        telefonoTrabajoResponsablePosicionY = 245; // Ajustar la posición si se dividió el texto
      }

      // imprimir telefono de trabajo del responsable
      pdf.text(
        telefonoTrabajoResponsableTexto,
        10,
        telefonoTrabajoResponsablePosicionY
      );

      // Imprimir el telefono celular del responsable a la par del telefono de trabajo
      const telefonoCelularResponsableTexto = `Teléfono celular: ${telefonoCelularResponsable}`;
      let telefonoCelularResponsablePosicionY = 240; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        telefonoCelularResponsablePosicionY = 245; // Ajustar la posición si se dividió el texto
      }

      // imprimir telefono celular del responsable
      pdf.text(
        telefonoCelularResponsableTexto,
        pageSize.getWidth() / 2 + 10,
        telefonoCelularResponsablePosicionY
      );

      // Imprimir el correo electronico del responsable
      const correoResponsableTexto = `Correo electrónico: ${correoResponsable}`;
      let correoResponsablePosicionY = 250; // Posición predeterminada

      // en caso de que la direccion del responsable se divida en 2 lineas
      if (direccionResponsableFragmentos.length > 1) {
        correoResponsablePosicionY = 255; // Ajustar la posición si se dividió el texto
      }

      //imprimir el correo
      pdf.text(correoResponsableTexto, 10, correoResponsablePosicionY);

      if (responsableEstudiante === "Otro") {
        if (direccionResponsableFragmentos.length > 1) {
          pdf.text(`Firma: ____________________`, 10, 265);
        } else {
          pdf.text(`Firma: ____________________`, 10, 260);
        }
      } else {
        if (direccionResponsableFragmentos.length > 1) {
          pdf.text(`Firma: N/a`, 10, 265);
        } else {
          pdf.text(`Firma: N/a`, 10, 260);
        }
      }

      //Nueva pagina
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

      // Imprimir en negrita Nombre y firma del papá, la mamá o apoderado que está entregando este formulario:
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Nombre y firma del papá, mamá o apoderado que está entregando este formulario:`,
        10,
        35
      );

      // Imprimir Nombre y firma del papá, la mamá o apoderado que está entregando este formulario:
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Nombre: _________________________________________________`,
        10,
        55
      );
      pdf.text(`Firma: ____________________`, 10, 65);

      const Nota = `(NOTA IMPORTANTE: Si durante el año cambian algunos de estos datos, por favor presentarse a actualizarlos en secretaría)`;

      // En caso sea extensa, partir en 2 lineas
      const NotaFragmentos = pdf.splitTextToSize(
        Nota,
        pageSize.getWidth() - 20
      );
      pdf.text(NotaFragmentos, 10, 85);

      const Consentimiento = `Al firmar esta ficha de matrícula, brindo mi consentimiento para que el Colegio Externado de San José resguarde los datos personales consignados, y autorizo el uso de los mismos para fines de registro académico.`;

      //En caso sea extensa, partir en 2 lineas
      const ConsentimientoFragmentos = pdf.splitTextToSize(
        Consentimiento,
        pageSize.getWidth() - 20
      );
      pdf.text(ConsentimientoFragmentos, 10, 105);

      // Guardar o mostrar el PDF
      pdf.save("PDF Matricula.pdf");

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

  useEffect(() => {
    if (Number(estudiante.externado_student_resp_type_id) === 4) {
      setRepresentanteStatus(true);
    }

    if (estudiante.externado_student_lives_with_parents === false) {
      setAmbosStatus(true);
    }

    if (estudiante.externado_student_catholic === false) {
      setReligionStatus(true);
      if (estudiante.externado_student_non_catholic_church_id === 9) {
        setShowReligionInput(true);
      }
    }

    if (estudiante.externado_student_has_siblings === true) {
      setVisible3(true);

      var arr = [];
      arr = estudiante.externado_student_siblings;

      var b = JSON.stringify(arr);
      //console.log(b);
      //console.log(typeof b);
      setName1Arr(arr);
      //console.log("name1 ", name1Arr);
      //console.log(typeof name1Arr);

      var a = JSON.parse(arr);
      //console.log("este es: ", a);
      //console.log(typeof a);
      //console.log("aqui");
      let copy = [];
      let copy2 = [];

      for (var item of a) {
        copy.push(item.name);
      }
      setName1(copy[0]);
      //console.log(name1);
      setName2(copy[1]);
      //console.log(name2);
      setName3(copy[2]);
      //console.log(name3);

      for (var item2 of a) {
        copy2.push(item2.grade);
      }
      setGrade1(copy2[0]);
      //console.log(grade1);
      setGrade2(copy2[1]);
      //console.log(grade2);
      setGrade3(copy2[2]);
      //console.log(grade3);

      if (name1 !== undefined && name2 === undefined) {
        setSuma(0);

        setVisible4(false);
        setVisible5(false);
      } else if (name2 !== undefined && name3 === undefined) {
        setSuma(1);

        setVisible4(true);
        setVisible5(false);
      } else if (name3 !== undefined) {
        setSuma(2);

        setVisible4(true);
        setVisible5(true);
      }
    }
  }, [
    grade1,
    grade2,
    grade3,
    name1,
    name2,
    name3,
    estudiante.externado_student_resp_type_id,
    estudiante.externado_student_lives_with_parents,
    estudiante.externado_student_catholic,
    estudiante.externado_student_non_catholic_church_id,
    estudiante.externado_student_siblings,
    estudiante.externado_student_has_siblings,
    name1Arr,
  ]);
  //Mostrando fecha de nacimiento en Formato Date yyyy-mm-dd
  useEffect(() => {
    const newDate = estudiante.externado_student_birthdate;
    setFechaN(String(newDate));
    if (fechaN !== "null") {
      //console.log("La fecha de nacimiento es:", fechaN);

      var arr = fechaN.split("T");
      var arr1 = arr[0];

      setFechaNacimiento(arr1);
      //console.log("DATE: ", fechaNacimiento);
    } else {
      setFechaNacimiento("");
    }

    //* Validando campoS oblogatorio vacíos

    //? Escuela o colegio que estudió
    if (lastSchoolRef.current.value === "") {
      setIsEscuelaRequired(true);
    } else {
      setIsEscuelaRequired(false);
    }
    document.querySelector("#lastSchoolId").addEventListener("input", () => {
      if (lastSchoolRef.current.value === "") {
        setIsEscuelaRequired(true);
      } else if (lastSchoolRef.current.value !== "") {
        setIsEscuelaRequired(false);
      }
    });

    //? Grado que cursará
    if (currentLevelRef.current.selectedIndex === 0) {
      setIsGradoSelected(false);
    } else {
      setIsGradoSelected(true);
    }
    document.querySelector("#currentLevelId").addEventListener("click", () => {
      if (currentLevelRef.current.selectedIndex === 0) {
        setIsGradoSelected(false);
      } else if (birthPlaceRef.current.value !== 0) {
        setIsGradoSelected(true);
      }
    });

    //? Nombres del estudiante
    if (namesRef.current.value === "") {
      setIsFirstNameRequired(true);
    } else {
      setIsFirstNameRequired(false);
    }
    document.querySelector("#namesId").addEventListener("input", () => {
      if (namesRef.current.value === "") {
        setIsFirstNameRequired(true);
      } else if (namesRef.current.value !== "") {
        setIsFirstNameRequired(false);
      }
    });

    //? Apellidos del estudiante
    if (lastNamesRef.current.value === "") {
      setIsLastNameRequired(true);
    } else {
      setIsLastNameRequired(false);
    }
    document.querySelector("#lastNamesId").addEventListener("input", () => {
      if (lastNamesRef.current.value === "") {
        setIsLastNameRequired(true);
      } else if (lastNamesRef.current.value !== "") {
        setIsLastNameRequired(false);
      }
    });

    //? Dirección del estudiante
    if (addressRef.current.value === "") {
      setIsAddressRequired(true);
    } else {
      setIsAddressRequired(false);
    }
    document.querySelector("#addressId").addEventListener("input", () => {
      if (addressRef.current.value === "") {
        setIsAddressRequired(true);
      } else if (addressRef.current.value !== "") {
        setIsAddressRequired(false);
      }
    });

    //? Departamento del estudiante
    if (departmentRef.current.selectedIndex === 0) {
      setIsDepartamentoSelected(false);
    } else {
      setIsDepartamentoSelected(true);
    }
    document.querySelector("#departmentId").addEventListener("click", () => {
      if (departmentRef.current.selectedIndex === 0) {
        setIsDepartamentoSelected(false);
      } else if (departmentRef.current.value !== 0) {
        setIsDepartamentoSelected(true);
      }
    });

    //? Municipio del estudiante
    if (townRef.current.value === "") {
      setIsMunicipioRequired(true);
    } else {
      setIsMunicipioRequired(false);
    }
    document.querySelector("#townId").addEventListener("input", () => {
      if (townRef.current.value === "") {
        setIsMunicipioRequired(true);
      } else if (townRef.current.value !== "") {
        setIsMunicipioRequired(false);
      }
    });

    //? Lugar de nacimiento
    if (birthPlaceRef.current.value === "") {
      setIsLugardeNacimientoRequired(true);
    } else {
      setIsLugardeNacimientoRequired(false);
    }
    document.querySelector("#birthPlaceId").addEventListener("input", () => {
      if (birthPlaceRef.current.value === "") {
        setIsLugardeNacimientoRequired(true);
      } else if (birthPlaceRef.current.value !== "") {
        setIsLugardeNacimientoRequired(false);
      }
    });

    //? Fecha de nacimiento
    if (dateRef.current.value !== "") {
      setIsBirthdateInputFilled(true);
    } else {
      setIsBirthdateInputFilled(false);
    }
    document.querySelector("#birthDateId").addEventListener("input", () => {
      //console.log("Ha cambiado el contenido de la fecha");

      if (dateRef.current.value !== "") {
        setIsBirthdateInputFilled(true);
      } else if (dateRef.current.value === "") {
        setIsBirthdateInputFilled(false);
      }
    });

    //? Nacionalidad
    if (nationalityRef.current.value === "") {
      setIsNacionalidadRequired(true);
    } else {
      setIsNacionalidadRequired(false);
    }
    document.querySelector("#nationalityId").addEventListener("input", () => {
      if (nationalityRef.current.value === "") {
        setIsNacionalidadRequired(true);
      } else if (nationalityRef.current.value !== "") {
        setIsNacionalidadRequired(false);
      }
    });

    //? ¿El estudiante es cristiano católico?checked radio
    if (
      isCatholicRef.current.checked === true ||
      isCatholicRef.current.checked === false
    ) {
      setIsCatolicoSelected(true);
    }

    if (isCatholicRef.current.checked === true && religionStatus) {
      //? Si no es cristiano católico, ¿a qué religión pertenece?checked lista
      if (nonCatholicIdRef.current.selectedIndex === 0) {
        setIsReligionSelected(false);
      } else {
        setIsReligionSelected(true);
      }
      document.querySelector("#nonCatholicId").addEventListener("click", () => {
        //console.log("Ha cambiado el contenido de lista de iglesias");
        if (nonCatholicIdRef.current.selectedIndex === 0) {
          setIsReligionSelected(false);
        } else if (nonCatholicIdRef.current.selectedIndex !== 0) {
          setIsReligionSelected(true);
        }
      });
    }
    //? Otra iglesia
    if (showReligionInput) {
      if (religionStatus && churchOtherRef.current.value === "") {
        setIsReligionOtherRequired(false);
      } else if (showReligionInput && churchOtherRef.current.value !== "") {
        setIsReligionOtherRequired(true);
      }
      document.querySelector("#churchOtherId").addEventListener("input", () => {
        //console.log("Ha cambiado el contenido de otra iglesia");
        if (churchOtherRef.current.value === "") {
          setIsReligionOtherRequired(false);
        } else if (churchOtherRef.current.value !== "") {
          setIsReligionOtherRequired(true);
        }
      });
    }

    //*HERMANOS *************
    if (
      hasSiblingsRef.current.checked === true ||
      hasSiblingsRef.current.checked === false
    ) {
      setIsHermanosSelected(true);
    }

    //? HERMANO 1

    //*Hermnao 1 Nombre

    if (hasSiblingsRef.current.checked === false && visible3 === true) {
      if (name1Ref.current.value === "") {
        setisHermano1Required(false);
      } else if (name1Ref.current.value !== "") {
        setisHermano1Required(true);
      }

      document.querySelector("#name1Id").addEventListener("input", () => {
        if (name1Ref.current.value === "") {
          setisHermano1Required(false);
        } else if (name1Ref.current.value !== "") {
          setisHermano1Required(true);
        }
      });

      //* Hermano 1 Grado
      if (grade1Ref.current.selectedIndex === 0) {
        setisGrado1Required(false);
      } else {
        setisGrado1Required(true);
      }
      document.querySelector("#grade1Id").addEventListener("click", () => {
        if (grade1Ref.current.selectedIndex === 0) {
          setisGrado1Required(false);
        } else if (grade1Ref.current.selectedIndex !== 0) {
          setisGrado1Required(true);
        }
      });
    }

    //* Hermano 2 Nombre

    if (
      hasSiblingsRef.current.checked === false &&
      visible3 === true &&
      visible4 === true
    ) {
      if (name2Ref.current.value === "") {
        setisHermano2Required(false);
      } else if (name2Ref.current.value !== "") {
        setisHermano2Required(true);
      }
      document.querySelector("#name2Id").addEventListener("input", () => {
        if (name2Ref.current.value === "") {
          setisHermano2Required(false);
        } else if (name2Ref.current.value !== "") {
          setisHermano2Required(true);
        }
      });

      //* Hermano 2 Grado

      if (grade2Ref.current.selectedIndex === 0) {
        setisGrado2Required(false);
      } else {
        setisGrado2Required(true);
      }
      document.querySelector("#grade2Id").addEventListener("click", () => {
        if (grade2Ref.current.selectedIndex === 0) {
          setisGrado2Required(false);
        } else if (grade2Ref.current.selectedIndex !== 0) {
          setisGrado2Required(true);
        }
      });
    }

    //* Hermano 3 Nombre

    if (
      hasSiblingsRef.current.checked === false &&
      visible3 === true &&
      visible4 === true &&
      visible5 === true
    ) {
      if (name3Ref.current.value === "") {
        setisHermano3Required(false);
      } else if (name3Ref.current.value !== "") {
        setisHermano3Required(true);
      }
      document.querySelector("#name3Id").addEventListener("input", () => {
        if (name3Ref.current.value === "") {
          setisHermano3Required(false);
        } else if (name3Ref.current.value !== "") {
          setisHermano3Required(true);
        }
      });

      //* Hermano 3 Grado

      if (grade3Ref.current.selectedIndex === 0) {
        setisGrado3Required(false);
      } else {
        setisGrado3Required(true);
      }
      document.querySelector("#grade3Id").addEventListener("click", () => {
        if (grade3Ref.current.selectedIndex === 0) {
          setisGrado3Required(false);
        } else if (grade2Ref.current.selectedIndex !== 0) {
          setisGrado3Required(true);
        }
      });
    }

    //? ¿El estudiante vive con ambos padres? Check radio button
    if (
      livesWithRef.current.checked === true ||
      livesWithRef.current.checked === false
    ) {
      setIsAmbosPadresSelected(true);
    }

    //? Nombre completo de quien vive cone studiante
    if (livesWithRef.current.checked === true && ambosStatus === true) {
      if (livesWithWhoRef.current.value === "") {
        setIsLivesWithNameRequired(false);
      } else if (livesWithWhoRef.current.value !== "") {
        setIsLivesWithNameRequired(true);
      }
      document
        .querySelector("#livesWithNameId")
        .addEventListener("input", () => {
          if (livesWithWhoRef.current.value === "") {
            setIsLivesWithNameRequired(false);
          } else if (livesWithWhoRef.current.value !== "") {
            setIsLivesWithNameRequired(true);
          }
        });

      //? Parentesco que tiene con el estudiante
      if (livesWithRelatedRef.current.value === "") {
        setIsLivesWithRelated(false);
      } else if (livesWithRelatedRef.current.value !== "") {
        setIsLivesWithRelated(true);
      }
      document
        .querySelector("#livesWithRelatedId")
        .addEventListener("input", () => {
          if (livesWithRelatedRef.current.value === "") {
            //console.log("estoy en null");
            setIsLivesWithRelated(false);
          } else if (livesWithRelatedRef.current.value !== "") {
            setIsLivesWithRelated(true);
          }
        });
    }

    //? Nombre de contacto de emergencia
    if (eNameRef.current.value === "") {
      setIsNombreEmergenciaRequired(true);
    } else {
      setIsNombreEmergenciaRequired(false);
    }
    document.querySelector("#eNameId").addEventListener("input", () => {
      if (eNameRef.current.value === "") {
        setIsNombreEmergenciaRequired(true);
      } else if (eNameRef.current.value !== "") {
        setIsNombreEmergenciaRequired(false);
      }
    });

    //? Relación de contacto de emergencia
    if (eRelationshipRef.current.value === "") {
      setIsRelacionEmergenciaRequired(true);
    } else {
      setIsRelacionEmergenciaRequired(false);
    }
    document.querySelector("#eRelationShipId").addEventListener("input", () => {
      if (eRelationshipRef.current.value === "") {
        setIsRelacionEmergenciaRequired(true);
      } else if (eRelationshipRef.current.value !== "") {
        setIsRelacionEmergenciaRequired(false);
      }
    });

    //? Dirección de contacto de emergencia
    if (eAddressRef.current.value === "") {
      setIsDireccionEmergenciaRequired(true);
    } else {
      setIsDireccionEmergenciaRequired(false);
    }
    document.querySelector("#eAddressId").addEventListener("input", () => {
      if (eAddressRef.current.value === "") {
        setIsDireccionEmergenciaRequired(true);
      } else if (eAddressRef.current.value !== "") {
        setIsDireccionEmergenciaRequired(false);
      }
    });

    //? Teléfono de contacto de emergencia
    if (telEmergencyRef.current.value === "") {
      setIsTelefonoEmergenciaRequired(true);
    } else {
      setIsTelefonoEmergenciaRequired(false);
    }
    document.querySelector("#telEmergencyId").addEventListener("input", () => {
      if (telEmergencyRef.current.value === "") {
        setIsTelefonoEmergenciaRequired(true);
      } else if (telEmergencyRef.current.value !== "") {
        setIsTelefonoEmergenciaRequired(false);
      }
    });

    //? Seleccione el responsable (lista)
    if (responsibleTypeIdRef.current.selectedIndex === 0) {
      setIsResponsableSelected(false);
    } else {
      setIsResponsableSelected(true);
    }
    document
      .querySelector("#responsibleTypeIdId")
      .addEventListener("click", () => {
        if (responsibleTypeIdRef.current.selectedIndex === 0) {
          setIsResponsableSelected(false);
        } else if (responsibleTypeIdRef.current.selectedIndex !== 0) {
          setIsResponsableSelected(true);
        }
      });

    //? Nombre (Otro rep)
    if (
      responsibleTypeIdRef.current.selectedIndex !== 0 &&
      representanteStatus
    ) {
      if (representanteStatus && repNameRef.current.value === "") {
        setIsRepNameRequired(false);
      } else if (repNameRef.current.value !== "") {
        setIsRepNameRequired(true);
      }
      document.querySelector("#repNameId").addEventListener("input", () => {
        if (repNameRef.current.value === "") {
          setIsRepNameRequired(false);
        } else if (repNameRef.current.value !== "") {
          setIsRepNameRequired(true);
        }
      });

      //? Número de documento (Otro rep)
      if (representanteStatus && duiRef.current.value === "") {
        setIsDocumentRequired(false);
      } else if (duiRef.current.value !== "") {
        setIsDocumentRequired(true);
      }
      document.querySelector("#documentId").addEventListener("input", () => {
        if (duiRef.current.value === "") {
          setIsDocumentRequired(false);
        } else if (duiRef.current.value !== "") {
          setIsDocumentRequired(true);
        }
      });

      //? Dirección de redidencia (Otro rep)
      if (representanteStatus && repAddressRef.current.value === "") {
        setIsRepAddressRequired(false);
      } else if (repAddressRef.current.value !== "") {
        setIsRepAddressRequired(true);
      }
      document.querySelector("#repAddressId").addEventListener("input", () => {
        if (repAddressRef.current.value === "") {
          setIsRepAddressRequired(false);
        } else if (repAddressRef.current.value !== "") {
          setIsRepAddressRequired(true);
        }
      });

      //? Teléfono de casa (Otro rep)
      if (representanteStatus && telHomeRef.current.value === "") {
        setIsTelHomeRequired(false);
      } else if (telHomeRef.current.value !== "") {
        setIsTelHomeRequired(true);
      }
      document.querySelector("#telHomeId").addEventListener("input", () => {
        if (telHomeRef.current.value === "") {
          setIsTelHomeRequired(false);
        } else if (telHomeRef.current.value !== "") {
          setIsTelHomeRequired(true);
        }
      });

      //? Teléfono de trabajo (Otro rep)
      if (representanteStatus && telWorkRef.current.value === "") {
        setIsRepWorkTelRequired(false);
      } else if (telWorkRef.current.value !== "") {
        setIsRepWorkTelRequired(true);
      }
      document.querySelector("#telWorkId").addEventListener("input", () => {
        if (telWorkRef.current.value === "") {
          setIsRepWorkTelRequired(false);
        } else if (telWorkRef.current.value !== "") {
          setIsRepWorkTelRequired(true);
        }
      });

      //? Número de celular (Otro rep)
      if (representanteStatus && telMobileRepRef.current.value === "") {
        setIsTelMobileRepRequired(false);
      } else if (telMobileRepRef.current.value !== "") {
        setIsTelMobileRepRequired(true);
      }
      document
        .querySelector("#telMobileRepId")
        .addEventListener("input", () => {
          if (telMobileRepRef.current.value === "") {
            setIsTelMobileRepRequired(false);
          } else if (telMobileRepRef.current.value !== "") {
            setIsTelMobileRepRequired(true);
          }
        });

      //? Correo Electrónico (Otro rep)
      if (representanteStatus && emailRepRef.current.value === "") {
        setIsEmailRepRequired(false);
      } else if (telMobileRepRef.current.value !== "") {
        setIsEmailRepRequired(true);
      }
      document.querySelector("#emailRepId").addEventListener("input", () => {
        if (emailRepRef.current.value === "") {
          setIsEmailRepRequired(false);
        } else if (emailRepRef.current.value !== "") {
          setIsEmailRepRequired(true);
        }
      });
    }

    if (dataResponsable) {
      if (
        isEscuelaRequired === true ||
        isGradoSelected === false ||
        isFirstNameRequired === true ||
        isLastNameRequired === true ||
        isAddressRequired === true ||
        isDepartamentoSelected === false ||
        isMunicipioRequired === true ||
        isLugardeNacimientoRequired === true ||
        isBirthdateInputFilled === false ||
        isNacionalidadRequired === true ||
        (showReligionInput && !isReligionOtherRequired) ||
        (religionStatus && !isReligionSelected) ||
        (showAmbosPadresNombreInput && !isLivesWithNameRequired) ||
        (showAmbosPadresNombreInput && !isLivesWithRelated) ||
        isNombreEmergenciaRequired === true ||
        isRelacionEmergenciaRequired === true ||
        isDireccionEmergenciaRequired === true ||
        isTelefonoEmergenciaRequired === true ||
        !isResponsableSelected ||
        (representanteStatus && !isRepNameRequired) ||
        (representanteStatus && !isDocumentRequired) ||
        (representanteStatus && !isRepAddressRequired) ||
        (representanteStatus && !isTelHomeRequired) ||
        (representanteStatus && !isRepWorkTelRequired) ||
        (representanteStatus && !isTelMobileRepRequired) ||
        dataResponsable.length < 1
      ) {
        setVisiblePDF(false);
      } else {
        setVisiblePDF(true);
      }
    }
  }, [estudiante.externado_student_birthdate, fechaN, fechaNacimiento]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    /*const algunCampoVacio = Object.values(camposValidos).some(
      (estado) => estado === 1
    );


    //console.log("ESTOY AQUI #1 ***********************************")
    if (validateEmpty(lastSchoolRef.current.value) === false) {
        setMessageLastSchool("Campo obligatorio");
        setMessageEmail("");
        setMessageWorkTel("");
        setMessageEmergencyTel("");
        setMessageMobileTel("")
        setMessageNIT("");
        setMessageDUI("");
        setMessageHomeTel("");
        setMessageMobileRepTel("");
        setMessageEmailRep("");
       
    lastSchoolRef.current.focus(); //enfoca campo de error
        return ;
    

    }else if (algunCampoVacio) {

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
            //window.location = "/estudianteslista";
          });

          validateEmail(externado_student_email);
          //console.log("tipo de rep: ", externado_student_resp_type_id);

          //console.log("birthdate value: ", externado_student_birthdate);
          if (externado_student_resp_type_id === "4") {
            validateEmail(externado_student_rep_email);
          }


          studentSiblingsFinal();

          const dataToSubmit = {
            idexternado_student: estudiante.idexternado_student,
            externado_student_last_school : lastSchoolRef.current.value,
            externado_student_resp_type_id: Number(
              externado_student_resp_type_id
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
            externado_student_email,
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
            externado_student_birthdate,
            externado_student_rep_name,
            externado_student_rep_id,
            externado_student_rep_address,
            externado_student_rep_email,
            externado_student_rep_mobile_phone,
            externado_student_rep_homephone,
            externado_student_rep_work_phone,
            externado_student_has_siblings: Boolean(Number(externado_student_has_siblings)),
            externado_student_lives_with_address,
            externado_student_rep_id_type: Number(externado_student_rep_id_type),
            externado_student_church_other,
            externado_form_valid,
          };

          const token = localStorage.getItem("token");
          fetch(
            "http://localhost:3001/api/v1/externado-student/updateStudent",
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

      //console.log("ESTOY AQUI #2 ********************************")
    }else if (validateEmpty(lastSchoolRef.current.value) === false) {
        setMessageLastSchool("Campo obligatorio");
        setMessageEmail("");
        setMessageWorkTel("");
        setMessageEmergencyTel("");
        setMessageMobileTel("")
        setMessageNIT("");
        setMessageDUI("");
        setMessageHomeTel("");
        setMessageMobileRepTel("");
        setMessageEmailRep("");
       
    lastSchoolRef.current.focus(); //enfoca campo de error
        return ;
    
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
            //window.location = "/estudianteslista";
          });

          validateEmail(externado_student_email);
          //console.log("tipo de rep: ", externado_student_resp_type_id);

          //console.log("birthdate value: ", externado_student_birthdate);
          if (externado_student_resp_type_id === "4") {
            validateEmail(externado_student_rep_email);
          }

          

          studentSiblingsFinal();


          const dataToSubmit = {
            idexternado_student: estudiante.idexternado_student,
            externado_student_last_school,
            externado_student_resp_type_id: Number(
              externado_student_resp_type_id
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
            externado_student_email,
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
            externado_student_birthdate,
            externado_student_rep_name,
            externado_student_rep_id,
            externado_student_rep_address,
            externado_student_rep_email,
            externado_student_rep_mobile_phone,
            externado_student_rep_homephone,
            externado_student_rep_work_phone,
            externado_student_has_siblings: Boolean(Number(externado_student_has_siblings)),
            externado_student_lives_with_address,
            externado_student_rep_id_type: Number(externado_student_rep_id_type),
            externado_student_church_other,
            externado_form_valid,
          };

          const token = localStorage.getItem("token");
          fetch(
            "http://localhost:3001/api/v1/externado-student/updateStudent",
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
      });*/

    /* if (validateEmpty(lastSchoolRef.current.value) === false) {
         setMessageLastSchool("Campo obligatorio");
         setMessageCurrentLevel("");
         setMessageEmail("");
         setMessageWorkTel("");
         setMessageEmergencyTel("");
         setMessageMobileTel("");
         setMessageNIT("");
         setMessageDUI("");
         setMessageHomeTel("");
         setMessageMobileRepTel("");
         setMessageEmailRep("");
         setMessageErrorNameSibling1("");
         setMessageErrorNameSibling2("");
         setMessageErrorNameSibling3("");
         setMessageErrorGradeSibling1("");
         setMessageErrorGradeSibling2("");
         setMessageErrorGradeSibling3("");
         lastSchoolRef.current.focus(); //enfoca campo de error
         return;*/
    /*if (currentLevelRef.current.selectedIndex === 0) {
         setMessageLastSchool("");
         setMessageCurrentLevel("Debe seleccionar un valor");
         setMessageEmail("");
         setMessageWorkTel("");
         setMessageEmergencyTel("");
         setMessageMobileTel("");
         setMessageNIT("");
         setMessageDUI("");
         setMessageHomeTel("");
         setMessageMobileRepTel("");
         setMessageEmailRep("");
         setMessageErrorNameSibling1("");
         setMessageErrorNameSibling2("");
         setMessageErrorNameSibling3("");
         setMessageErrorGradeSibling1("");
         setMessageErrorGradeSibling2("");
         setMessageErrorGradeSibling3("");
         currentLevelRef.current.focus(); //enfoca campo de error
         return;*/
    if (
      validateDate(dateRef.current.value) === false &&
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
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");
      setMessageDate("Debe ingresar una fecha de nacimiento válida");
      dateRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateMobileTel(telMobileRef.current.value) === false &&
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
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");
      setMessageMobileTel("Debe ingresar un número de celular válido");
      telMobileRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateEmail(emailRef.current.value) === false &&
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
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");
      setMessageEmail("Debe ingresar un correo electrónico válido");

      emailRef.current.focus(); //enfoca campo de error
      return;
    } else if (!hasSiblingsRef.current.checked === true) {
      if (validateEmpty(name1Ref.current.value) === false) {
        setMessageErrorNameSibling1("Campo obligatorio");
        setMessageEmail("");
        setMessageWorkTel("");
        setMessageEmergencyTel("");
        setMessageMobileTel("");
        setMessageNIT("");
        setMessageDUI("");
        setMessageHomeTel("");
        setMessageMobileRepTel("");
        setMessageEmailRep("");
        setMessageErrorNameSibling2("");
        setMessageErrorNameSibling3("");
        setMessageErrorGradeSibling1("");
        setMessageErrorGradeSibling2("");
        setMessageErrorGradeSibling3("");
        name1Ref.current.focus(); //enfoca campo de error
        return;
      }
      if (grade1Ref.current.selectedIndex === 0) {
        setMessageErrorGradeSibling1("Debe seleccionar una opción");
        setMessageEmail("");
        setMessageWorkTel("");
        setMessageEmergencyTel("");
        setMessageMobileTel("");
        setMessageNIT("");
        setMessageDUI("");
        setMessageHomeTel("");
        setMessageMobileRepTel("");
        setMessageEmailRep("");
        setMessageErrorNameSibling1("");
        setMessageErrorNameSibling2("");
        setMessageErrorNameSibling3("");
        setMessageErrorGradeSibling2("");
        setMessageErrorGradeSibling3("");
        grade1Ref.current.focus(); //enfoca campo de error
        return;
      }
      if (name2Ref.current !== null && name2Ref.current !== undefined) {
        if (validateEmpty(name2Ref.current.value) === false) {
          setMessageErrorNameSibling2("Campo obligatorio");
          setMessageEmail("");
          setMessageWorkTel("");
          setMessageEmergencyTel("");
          setMessageMobileTel("");
          setMessageNIT("");
          setMessageDUI("");
          setMessageHomeTel("");
          setMessageMobileRepTel("");
          setMessageEmailRep("");
          setMessageErrorNameSibling1("");
          setMessageErrorNameSibling3("");
          setMessageErrorGradeSibling1("");
          setMessageErrorGradeSibling2("");
          setMessageErrorGradeSibling3("");
          name2Ref.current.focus(); //enfoca campo de error
          return;
        }
        if (grade2Ref.current.selectedIndex === 0) {
          setMessageErrorGradeSibling2("Debe seleccionar una opción");
          setMessageEmail("");
          setMessageWorkTel("");
          setMessageEmergencyTel("");
          setMessageMobileTel("");
          setMessageNIT("");
          setMessageDUI("");
          setMessageHomeTel("");
          setMessageMobileRepTel("");
          setMessageEmailRep("");
          setMessageErrorNameSibling1("");
          setMessageErrorNameSibling2("");
          setMessageErrorNameSibling3("");
          setMessageErrorGradeSibling1("");
          setMessageErrorGradeSibling3("");
          grade2Ref.current.focus(); //enfoca campo de error
          return;
        }
      }
      if (name3Ref.current !== null && name3Ref.current !== undefined) {
        if (validateEmpty(name3Ref.current.value) === false) {
          setMessageErrorNameSibling3("Campo obligatorio");
          setMessageEmail("");
          setMessageWorkTel("");
          setMessageEmergencyTel("");
          setMessageMobileTel("");
          setMessageNIT("");
          setMessageDUI("");
          setMessageHomeTel("");
          setMessageMobileRepTel("");
          setMessageEmailRep("");
          setMessageErrorNameSibling1("");
          setMessageErrorNameSibling2("");
          setMessageErrorGradeSibling1("");
          setMessageErrorGradeSibling2("");
          setMessageErrorGradeSibling3("");
          name3Ref.current.focus(); //enfoca campo de error
          return;
        }
        if (grade3Ref.current.selectedIndex === 0) {
          setMessageErrorGradeSibling3("Debe seleccionar una opción");
          setMessageEmail("");
          setMessageWorkTel("");
          setMessageEmergencyTel("");
          setMessageMobileTel("");
          setMessageNIT("");
          setMessageDUI("");
          setMessageHomeTel("");
          setMessageMobileRepTel("");
          setMessageEmailRep("");
          setMessageErrorNameSibling1("");
          setMessageErrorNameSibling2("");
          setMessageErrorNameSibling3("");
          setMessageErrorGradeSibling1("");
          setMessageErrorGradeSibling2("");
          grade3Ref.current.focus(); //enfoca campo de error
          return;
        }
      }
    } /* else if (!hasSiblingsRef.current.checked === true) {
           if (
             name3Ref.current !== null){
                 if(validateEmpty(name3Ref.current.value) === false)
             }
             
             
           ) {
             //console.log("estoy en sibling name 3");
             
           }
         } else if (!hasSiblingsRef.current.checked === true) {
           
           }*/

    if (validateEmergencyTel(telEmergencyRef.current.value) === false) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageHomeTel("");
      setMessageMobileRepTel("");
      setMessageEmailRep("");
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");
      setMessageEmergencyTel("Debe ingresar un número de teléfono válido");
      telEmergencyRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      responsibleTypeIdRef.current.selectedIndex === 4 &&
      validateDocument(duiRef.current.value, duiTypeRef.current.selected) ===
      false
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
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");

      if (duiTypeRef.current.selected === true) {
        setMessageDUI("Debe ingresar un número de pasaporte válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      } else {
        setMessageDUI("Debe ingresar un número de DUI válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      }
    } else if (
      responsibleTypeIdRef.current.selectedIndex === 4 &&
      validateHomeTel(telHomeRef.current.value) === false
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
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");
      setMessageHomeTel("Debe ingresar un número de teléfono válido");
      telHomeRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      responsibleTypeIdRef.current.selectedIndex === 4 &&
      validateWorkTel(telWorkRef.current.value) === false
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
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");
      setMessageWorkTel("Debe ingresar un número de trabajo válido");
      telWorkRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      responsibleTypeIdRef.current.selectedIndex === 4 &&
      validateEmailRep(emailRepRef.current.value) === false &&
      emailRepRef.current.value !== ""
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
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");
      setMessageEmailRep("Debe ingresar un correo electrónico válido");
      emailRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      responsibleTypeIdRef.current.selectedIndex === 4 &&
      validateMobileTel(telMobileRepRef.current.value) === false &&
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
      setMessageErrorNameSibling1("");
      setMessageErrorNameSibling2("");
      setMessageErrorNameSibling3("");
      setMessageErrorGradeSibling1("");
      setMessageErrorGradeSibling2("");
      setMessageErrorGradeSibling3("");
      setMessageMobileRepTel("Debe ingresar un número de celular válido");
      telMobileRepRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      isEscuelaRequired === true ||
      isGradoSelected === false ||
      isFirstNameRequired === true ||
      isLastNameRequired === true ||
      isAddressRequired === true ||
      isDepartamentoSelected === false ||
      isMunicipioRequired === true ||
      isLugardeNacimientoRequired === true ||
      isBirthdateInputFilled === false ||
      isNacionalidadRequired === true ||
      (showReligionInput && !isReligionOtherRequired) ||
      (religionStatus && !isReligionSelected) ||
      (showAmbosPadresNombreInput && !isLivesWithNameRequired) ||
      (showAmbosPadresNombreInput && !isLivesWithRelated) ||
      isNombreEmergenciaRequired === true ||
      isRelacionEmergenciaRequired === true ||
      isDireccionEmergenciaRequired === true ||
      isTelefonoEmergenciaRequired === true ||
      !isResponsableSelected ||
      (representanteStatus && !isRepNameRequired) ||
      (representanteStatus && !isDocumentRequired) ||
      (representanteStatus && !isRepAddressRequired) ||
      (representanteStatus && !isTelHomeRequired) ||
      (representanteStatus && !isRepWorkTelRequired) ||
      (representanteStatus && !isTelMobileRepRequired)

      /*||
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
      (representanteStatus && !representanteInputTelefonoTrabajoValue)*/
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
          if (externado_student_resp_type_id === "4") {
            validateEmail(externado_student_rep_email);
          }

          let studentSiblings1 = "";
          let studentSiblings2 = "";
          let studentSiblings3 = "";
          const siblings1 = {};
          studentSiblings1 = JSON.stringify(siblings1);

          const siblings2 = {};
          studentSiblings2 = JSON.stringify(siblings2);

          const siblings3 = {};
          studentSiblings3 = JSON.stringify(siblings3);

          const resultado =
            "[" +
            studentSiblings1 +
            "," +
            studentSiblings2 +
            "," +
            studentSiblings3 +
            "]";

          setStudentSiblings(resultado);
          externado_student_siblings = resultado;

          if (!hasSiblingsRef.current.checked === true) {
            studentSiblingsFinal();
          }

          //insertando true en externado_form_valid cuando todos los campos estén correctamente ingresados
          externado_form_valid = false;
          const dataToSubmit = {
            idexternado_student: estudiante.idexternado_student,
            externado_student_last_school: lastSchoolRef.current.value,
            externado_student_resp_type_id: Number(
              responsibleTypeIdRef.current.selectedIndex
            ),
            externado_student_current_level_id: Number(
              currentLevelRef.current.selectedIndex
            ),

            externado_student_firstname: namesRef.current.value,
            externado_student_lastname: lastNamesRef.current.value,
            externado_student_address: addressRef.current.value,
            externado_student_department_id: Number(
              departmentRef.current.selectedIndex
            ),
            externado_student_town: townRef.current.value,
            externado_student_birthplace: birthPlaceRef.current.value,
            externado_student_nationality: nationalityRef.current.value,
            externado_student_gender: Boolean(
              Number(genderRef.current.selected)
            ),
            externado_student_phone: telMobileRef.current.value,
            externado_student_email:
              emailRef.current.value !== "" ? emailRef.current.value : null,
            externado_student_catholic: !isCatholicRef.current.checked,

            externado_student_lives_with_parents: Boolean(
              Number(!livesWithRef.current.checked)
            ),
            externado_student_non_catholic_church_id: isCatholicRef.current
              .checked
              ? Number(nonCatholicIdRef.current.selectedIndex)
              : (nonCatholicIdRef.current = null),

            externado_student_lives_with_who: livesWithRef.current.checked
              ? livesWithWhoRef.current.value
              : (livesWithWhoRef.current = null),
            externado_student_lives_with_related: livesWithRef.current.checked
              ? livesWithRelatedRef.current.value
              : (livesWithRelatedRef.current = null),
            externado_student_emergency_name: eNameRef.current.value,
            externado_student_emergency_address: eAddressRef.current.value,
            externado_student_emergency_relationship:
              eRelationshipRef.current.value,
            externado_student_emergency_phone: telEmergencyRef.current.value,
            externado_student_siblings,
            externado_student_birthdate:
              dateRef.current.value !== "" ? dateRef.current.value : null,

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
              Number(!hasSiblingsRef.current.checked)
            ),

            externado_student_lives_with_address,
            externado_student_rep_id_type:
              Number(responsibleTypeIdRef.current.selectedIndex) !== 4
                ? (duiTypeRef.current = null)
                : Number(duiTypeRef.current.selected),
            externado_student_church_other:
              isCatholicRef.current.checked &&
                Number(nonCatholicIdRef.current.selectedIndex) === 9
                ? churchOtherRef.current.value
                : (churchOtherRef.current = null),
            externado_form_valid,
          };

          const token = localStorage.getItem("token");
          fetch(
            "http://localhost:3001/api/v1/externado-student/updateStudent",
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
    } //cierra else if(campos llenos)
    else if (
      isEscuelaRequired === false ||
      isGradoSelected === true ||
      isFirstNameRequired === false ||
      isLastNameRequired === false ||
      isAddressRequired === false ||
      isDepartamentoSelected === true ||
      isMunicipioRequired === false ||
      isLugardeNacimientoRequired === false ||
      isBirthdateInputFilled === true ||
      isNacionalidadRequired === false ||
      (religionStatus && isReligionSelected) ||
      (showReligionInput && isReligionOtherRequired) ||
      (showAmbosPadresNombreInput && isLivesWithNameRequired) ||
      (showAmbosPadresNombreInput && isLivesWithRelated) ||
      isNombreEmergenciaRequired === false ||
      isRelacionEmergenciaRequired === false ||
      isDireccionEmergenciaRequired === false ||
      isTelefonoEmergenciaRequired === false ||
      isResponsableSelected ||
      (representanteStatus && isRepNameRequired) ||
      (representanteStatus && isDocumentRequired) ||
      (representanteStatus && isRepAddressRequired) ||
      (representanteStatus && isTelHomeRequired) ||
      (representanteStatus && isRepWorkTelRequired) ||
      (representanteStatus && isTelMobileRepRequired)
    ) {
      //console.log("ESTOY DONDE NOOOO HAY CAMPOS OBLIGATORIOS VACIOS");
      Swal.fire({
        icon: "success",
        title: "Datos enviados",
        text: "Se ha registrado al estudiante exitosamente",
      }).then(function () {
        if (dataResponsable.length >= 1) {
          setVisiblePDF(true);
          window.location = "/estudianteslista";
        } else {
          setVisiblePDF(false);
          //console.log("No hay responsables creados para este estudiante");
        }
      });

      validateEmail(externado_student_email);
      //console.log("tipo de rep: ", externado_student_resp_type_id);

      //console.log("birthdate value: ", externado_student_birthdate);
      if (externado_student_resp_type_id === "4") {
        validateEmail(externado_student_rep_email);
      }

      let studentSiblings1 = "";
      let studentSiblings2 = "";
      let studentSiblings3 = "";
      const siblings1 = {};
      studentSiblings1 = JSON.stringify(siblings1);

      const siblings2 = {};
      studentSiblings2 = JSON.stringify(siblings2);

      const siblings3 = {};
      studentSiblings3 = JSON.stringify(siblings3);

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

      if (!hasSiblingsRef.current.checked === true) {
        studentSiblingsFinal();
      }

      //insertando true en externado_form_valid cuando todos los campos estén correctamente ingresados
      externado_form_valid = true;
      const dataToSubmit = {
        idexternado_student: estudiante.idexternado_student,
        externado_student_last_school: lastSchoolRef.current.value,
        externado_student_resp_type_id: Number(
          responsibleTypeIdRef.current.selectedIndex
        ),
        externado_student_current_level_id: Number(
          currentLevelRef.current.selectedIndex
        ),

        externado_student_firstname: namesRef.current.value,
        externado_student_lastname: lastNamesRef.current.value,
        externado_student_address: addressRef.current.value,
        externado_student_department_id: Number(
          departmentRef.current.selectedIndex
        ),
        externado_student_town: townRef.current.value,
        externado_student_birthplace: birthPlaceRef.current.value,
        externado_student_nationality: nationalityRef.current.value,
        externado_student_gender: Boolean(Number(genderRef.current.selected)),
        externado_student_phone: telMobileRef.current.value,
        externado_student_email:
          emailRef.current.value !== "" ? emailRef.current.value : null,
        externado_student_catholic: !isCatholicRef.current.checked,

        externado_student_lives_with_parents: Boolean(
          Number(!livesWithRef.current.checked)
        ),
        externado_student_non_catholic_church_id: isCatholicRef.current.checked
          ? Number(nonCatholicIdRef.current.selectedIndex)
          : (nonCatholicIdRef.current = null),

        externado_student_lives_with_who: livesWithRef.current.checked
          ? livesWithWhoRef.current.value
          : (livesWithWhoRef.current = null),
        externado_student_lives_with_related: livesWithRef.current.checked
          ? livesWithRelatedRef.current.value
          : (livesWithRelatedRef.current = null),
        externado_student_emergency_name: eNameRef.current.value,
        externado_student_emergency_address: eAddressRef.current.value,
        externado_student_emergency_relationship:
          eRelationshipRef.current.value,
        externado_student_emergency_phone: telEmergencyRef.current.value,
        externado_student_siblings,
        externado_student_birthdate:
          dateRef.current.value !== "" ? dateRef.current.value : null,
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
          Number(!hasSiblingsRef.current.checked)
        ),

        externado_student_lives_with_address,
        externado_student_rep_id_type:
          Number(responsibleTypeIdRef.current.selectedIndex) !== 4
            ? (duiTypeRef.current = null)
            : Number(duiTypeRef.current.selected),
        externado_student_church_other:
          isCatholicRef.current.checked &&
            Number(nonCatholicIdRef.current.selectedIndex) === 9
            ? churchOtherRef.current.value
            : (churchOtherRef.current = null),
        externado_form_valid,
      };

      const token = localStorage.getItem("token");
      fetch("http://localhost:3001/api/v1/externado-student/updateStudent", {
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
      return;
    }
  }; //cierra handleFormSumbit

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
        <p>
          Los campos con el <span style={{ color: "red", fontWeight: "bold" }}> * </span>
          son de caracter <span style={{ color: "red", fontWeight: "bold" }}>obligatorio</span> para
          Guardar{" "}
        </p>
        <Form  className="step2-estudiantes-lista" method="post" onSubmit={handleFormSubmit}>
        <div className="step3-estudiantes-lista">
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="lastSchoolId">
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
                  ref={lastSchoolRef}
                  maxLength={120}
                  defaultValue={estudiante.externado_student_last_school}
                  type="text"
                  placeholder=""
                  onChange={handleLastSchoolChange}
                />
                <p className="error-message">{messageLastSchool}</p>
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="currentLevelId">
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
                <Form.Control
                  as="select"
                  ref={currentLevelRef}
                  onChange={handleCurrentLevelIdChange}
                >
                  {grado?.map((level) => (
                    <option
                      selected={
                        level.idexternado_level ===
                        estudiante.externado_student_current_level_id
                          ? true
                          : null
                      }
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
        </div>
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
              <Form.Group controlId="namesId">
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
                  ref={namesRef}
                  maxLength={60}
                  defaultValue={estudiante.externado_student_firstname}
                  type="text"
                  placeholder=""
                  onChange={handleFirstNameChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="lastNamesId">
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
                  ref={lastNamesRef}
                  defaultValue={estudiante.externado_student_lastname}
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
              <Form.Group controlId="addressId">
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
                  ref={addressRef}
                  maxLength={120}
                  defaultValue={estudiante.externado_student_address}
                  type="text"
                  placeholder=""
                  onChange={handleAddressChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <Form.Group controlId="departmentId">
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
                <Form.Control
                  as="select"
                  onChange={handleDepertmentIdChange}
                  ref={departmentRef}
                >
                  {departamentos?.map((departamento) => (
                    <option
                      selected={
                        departamento.idexternado_departments ===
                        estudiante.externado_student_department_id
                          ? true
                          : null
                      }
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
              <Form.Group controlId="townId">
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
                  ref={townRef}
                  maxLength={30}
                  defaultValue={estudiante.externado_student_town}
                  type="text"
                  placeholder=""
                  onChange={handleTownChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="birthPlaceId">
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
                  ref={birthPlaceRef}
                  defaultValue={estudiante.externado_student_birthplace}
                  maxLength={60}
                  type="text"
                  placeholder=""
                  onChange={handleBirthplaceChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <Form.Group>
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
                    id="birthDateId"
                    ref={dateRef}
                    maxLength={120}
                    defaultValue={fechaNacimiento}
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
              <Form.Group controlId="nationalityId">
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
                  ref={nationalityRef}
                  defaultValue={estudiante.externado_student_nationality}
                  type="text"
                  maxLength={30}
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
                  <option
                    ref={genderRef}
                    selected={
                      estudiante.externado_student_gender === false
                        ? true
                        : null
                    }
                    id="0"
                    value="Masculino"
                  >
                    Masculino
                  </option>
                  <option
                    ref={genderRef}
                    selected={
                      estudiante.externado_student_gender === true ? true : null
                    }
                    id="1"
                    value="Femenino"
                  >
                    Femenino:
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
                defaultValue={estudiante.externado_student_phone}
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
                  defaultValue={estudiante.externado_student_email}
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
                      ref={isCatholicRef}
                      defaultChecked={
                        estudiante.externado_student_catholic === true
                          ? true
                          : null
                      }
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
                      ref={isCatholicRef}
                      defaultChecked={
                        estudiante.externado_student_catholic === false
                          ? true
                          : null
                      }
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
                <Form.Group controlId="nonCatholicId">
                  <Form.Label style={{ marginTop: "10px" }}>
                    {" "}
                    Si no es cristiano católico, ¿a qué religión pertenece?:
                    {!isReligionSelected && (
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

                  <Form.Control
                    as="select"
                    onChange={handleNonCatholicIdChange}
                    ref={nonCatholicIdRef}
                  >
                    {religiones?.map((religion) => (
                      <option
                        selected={
                          religion.idexternado_church ===
                          estudiante.externado_student_non_catholic_church_id
                            ? true
                            : null
                        }
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
                  <Form.Group controlId="churchOtherId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Si seleccionó otro, por favor especifique:
                      {showReligionInput && !isReligionOtherRequired && (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}
                          *
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      ref={churchOtherRef}
                      maxLength={45}
                      defaultValue={estudiante.externado_student_church_other}
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
                      ref={hasSiblingsRef}
                      defaultChecked={
                        estudiante.externado_student_has_siblings === true
                          ? true
                          : null
                      }
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
                      ref={hasSiblingsRef}
                      defaultChecked={
                        estudiante.externado_student_has_siblings === false
                          ? true
                          : null
                      }
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
                <Col>
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
                  <Form.Group controlId="name1Id">
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
                      ref={name1Ref}
                      maxLength={60}
                      defaultValue={name1}
                      type="text"
                      placeholder=""
                      onChange={handleSiblingName1}
                    />
                    <p className="error-message">{messageErrorNameSibling1}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="grade1Id">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Siguiente grado a cursar:{" "}
                      {!isgrado1Required && (
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
                    <Form.Control
                      as="select"
                      onChange={handleSiblingGrade1}
                      ref={grade1Ref}
                    >
                      {grado?.map((level) => (
                        <option
                          selected={
                            level.idexternado_level === grade1 ? true : null
                          }
                          id={level.idexternado_level}
                          key={level.idexternado_level}
                          value={level.externado_level}
                        >
                          {level.externado_level}
                        </option>
                      ))}
                    </Form.Control>
                    <p className="error-message">{messageErrorGradeSibling1}</p>
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
                  <Form.Group controlId="name2Id">
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
                      ref={name2Ref}
                      maxLength={60}
                      defaultValue={name2}
                      type="text"
                      placeholder=""
                      onChange={handleSiblingName2}
                    />
                    <p className="error-message">{messageErrorNameSibling2}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="grade2Id">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Siguiente grado a cursar:{" "}
                      {!isgrado2Required && (
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
                    <Form.Control
                      as="select"
                      onChange={handleSiblingGrade2}
                      ref={grade2Ref}
                    >
                      {grado?.map((level) => (
                        <option
                          selected={
                            level.idexternado_level === grade2 ? true : null
                          }
                          id={level.idexternado_level}
                          key={level.idexternado_level}
                          value={level.externado_level}
                        >
                          {level.externado_level}
                        </option>
                      ))}
                    </Form.Control>
                    <p className="error-message">{messageErrorGradeSibling2}</p>
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
                  <Form.Group controlId="name3Id">
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
                      ref={name3Ref}
                      defaultValue={name3}
                      maxLength={60}
                      type="text"
                      placeholder=""
                      onChange={handleSiblingName3}
                    />
                    <p className="error-message">{messageErrorNameSibling3}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="grade3Id">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Siguiente grado a cursar:{" "}
                      {!isgrado3Required && (
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
                    <Form.Control
                      as="select"
                      onChange={handleSiblingGrade3}
                      ref={grade3Ref}
                    >
                      {grado?.map((level) => (
                        <option
                          selected={
                            level.idexternado_level === grade3 ? true : null
                          }
                          id={level.idexternado_level}
                          key={level.idexternado_level}
                          value={level.externado_level}
                        >
                          {level.externado_level}
                        </option>
                      ))}
                    </Form.Control>
                    <p className="error-message">{messageErrorGradeSibling3}</p>
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
                      ref={livesWithRef}
                      defaultChecked={
                        estudiante.externado_student_lives_with_parents === true
                          ? true
                          : null
                      }
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
                      ref={livesWithRef}
                      defaultChecked={
                        estudiante.externado_student_lives_with_parents ===
                        false
                          ? true
                          : null
                      }
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
                <Col>
                  <Form.Label style={{ marginTop: "10px" }}>
                    <u>
                      <strong>
                        Si la respuesta es no, ¿Con quién vive el alumno/a?:
                      </strong>
                    </u>
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="livesWithNameId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Nombre completo:
                        <spantiene
                          con
                          el
                          estudi
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            paddingLeft: "5px",
                          }}
                        >
                          *
                        </spantiene>
                    </Form.Label>
                    <Form.Control
                      ref={livesWithWhoRef}
                      defaultValue={estudiante.externado_student_lives_with_who}
                      maxLength={60}
                      type="text"
                      placeholder=""
                      onChange={handleLivesWithWhoChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="livesWithRelatedId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Parentesco que tiene con el estudiante:
                      {!isLivesWithRelated && (
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
                      ref={livesWithRelatedRef}
                      defaultValue={
                        estudiante.externado_student_lives_with_related
                      }
                      type="text"
                      maxLength={45}
                      placeholder=""
                      onChange={handleLivesWithRelatedChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
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
              <Form.Group controlId="eNameId">
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
                  ref={eNameRef}
                  maxLength={60}
                  defaultValue={estudiante.externado_student_emergency_name}
                  type="text"
                  placeholder=""
                  onChange={handleEmergencyNameChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="eRelationShipId">
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
                  ref={eRelationshipRef}
                  maxLength={45}
                  defaultValue={
                    estudiante.externado_student_emergency_relationship
                  }
                  type="text"
                  placeholder="Tio, abuela, primo, etc."
                  onChange={handleEmergencyRelationshipChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="eAddressId">
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
                  ref={eAddressRef}
                  maxLength={120}
                  defaultValue={estudiante.externado_student_emergency_address}
                  type="text"
                  placeholder=""
                  onChange={handleEmergencyAddressChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group controlId="telEmergencyId">
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
                  defaultValue={estudiante.externado_student_emergency_phone}
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
              <Form.Group controlId="responsibleTypeIdId">
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
                      selected={
                        rst.idexternado_student_responsible_type ===
                        estudiante.externado_student_resp_type_id
                          ? true
                          : null
                      }
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
                  <Form.Group controlId="repNameId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Nombre:
                      {!isRepNameRequired && (
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
                      defaultValue={estudiante.externado_student_rep_name}
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
                      <option
                        ref={duiTypeRef}
                        selected={
                          estudiante.externado_student_rep_id_type === 0
                            ? 1
                            : null
                        }
                        id="0"
                        value="DUI"
                      >
                        DUI
                      </option>
                      <option
                        ref={duiTypeRef}
                        selected={
                          estudiante.externado_student_rep_id_type === 1
                            ? 1
                            : null
                        }
                        id="1"
                        value="Pasaporte"
                      >
                        Pasaporte
                      </option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="documentId">
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
                      defaultValue={estudiante.externado_student_rep_id}
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
                  <Form.Group controlId="repAddressId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Dirección de residencia:
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
                      ref={repAddressRef}
                      maxLength={120}
                      defaultValue={estudiante.externado_student_rep_address}
                      type="text"
                      placeholder=""
                      onChange={handleStudentRepAddressChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="telHomeId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Teléfono de casa:
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
                      ref={telHomeRef}
                      maxLength={20}
                      defaultValue={estudiante.externado_student_rep_homephone}
                      type="text"
                      placeholder="22222222"
                      onChange={handleStudentRepHomePhoneChange}
                    />
                    <p className="error-message">{messageHomeTel}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Group controlId="telWorkId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      {" "}
                      Teléfono de trabajo:
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
                      ref={telWorkRef}
                      defaultValue={estudiante.externado_student_rep_work_phone}
                      type="text"
                      maxLength={20}
                      placeholder="22222222"
                      onChange={handleStudentRepWorkPhoneChange}
                    />
                    <p className="error-message">{messageWorkTel}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="emailRepId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Correo electrónico:
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
                      type="text"
                      maxLength={60}
                      ref={emailRepRef}
                      defaultValue={estudiante.externado_student_rep_email}
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
                  <Form.Group controlId="telMobileRepId">
                    <Form.Label style={{ marginTop: "10px" }}>
                      {" "}
                      Número de celular:
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
                      ref={telMobileRepRef}
                      maxLength={20}
                      defaultValue={
                        estudiante.externado_student_rep_mobile_phone
                      }
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
                marginRight: "10px",
                marginLeft: "0px",
              }}
              variant="custom"
              className="boton-atras"
            >
              Atrás
            </Button>
          </NavLink>

          {/* Botón "Guardar" */}
          <Button
            ref={guardarRef}
            type="submit"
            style={{
              marginTop: "20px",
              float: "right",
              color: "white",
              marginRight: "0px",
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
              ref={generarPDFRef}
              id="generarPDFID"
              style={{
                marginTop: "20px",
                float: "right",
                marginRight: "0px", // Agregado para espacio entre botones
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
    </div >
  );
};

export default EstudiantesForm;
