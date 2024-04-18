import React, { useState, useEffect, useRef } from "react";
import "../estilos/botones.css";
import Joyride from "react-joyride";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import {
  validateDocumentNumberResp,
  isDUI,
  validateEmailResp,
  validateDocumentResp,
  validateNITResp,
  validateDateResp,
  validateWorkTelResp,
  validateMobileTelResp,
} from "../validacion/validacion";
import "bootstrap-datepicker";
import { useNavigate } from "react-router-dom";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import $ from "jquery";
import "../estilos/fondo.css";
import "../estilos/forms.css";
import "../estilos/validaciones.css";
import Footer from "../layout/footer/Footer";
import Swal from "sweetalert2";
import {
  useAuth,
  fetchDepartamentos,
  fetchPuestostrabajo,
  fetchSalarios,
  fetchResponsableTypeLeft,
} from "../AuthContext";

//Crear un formulario 2 columnas para padres y representantes
const RepresentantesForm = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([
    {
      target: ".step1-estudiantes-lista",
      disableBeacon: true,
      content: (
        <div  className="text-justify">
          <h4 className=" font-weight-bold">Bienvenido al formulario de registro general de padres de familia o apoderado</h4>
          <p>Esta es una guía para entender el formulario de registro general de padres de familia o apoderado. Por favor, completa todos los campos obligatorios marcados con un asterisco <span style={{ color: "red", fontWeight: "bold" }}>*</span>.</p>
          <p>Al completar todos los campos obligatorios, podrás guardar toda la información para la generacion de PDF de matricula y pasar a la siguiente fase.</p>
          <p>Este formulario es fundamental para registrar tu información en nuestro sistema.</p>
        </div>
      ),
      placement: 'bottom', // Tooltip will appear to the right of the target
    },
    {
      target: ".step2-estudiantes-lista",
      content: (
        <div  className="text-justify">
          <h4 className=" font-weight-bold">Completa los datos personales del padre de familia o del apoderado segun documento de identificación</h4>
          <p>Esta sección se enfoca en los datos personales del padre del familia o del apoderado segun documento de identificación.</p>
          <p>Por favor, completa todos los campos obligatorios para registrar los datos de manera completa. Estos datos son importantes para asegurar la matrícula. </p>
        </div>
      ),
    },
    {
      target: ".step3-estudiantes-lista",
      content: (
        <div className="text-justify">
          <h4 className="font-weight-bold">Ingresa informacion laboral y de educacion del padre de familia o apoderado</h4>
          <p>Completa con cuidado todos los campos obligatorios con los datos del padre de familia o operado.</p>
          <p>Todos los campos marcados con un asterisco <span style={{ color: "red", fontWeight: "bold" }}>*</span> son obligatorios. Una vez completados todos los campos, podrás revisar la información y avanzar al siguiente paso.</p>
          <p>Debes ingresar los datos del padre de familia o tutor, así como información laboral y de estudios del mismo.</p>
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
  const { authToken } = useAuth();
  //console.log("RepresentantesForm se montó");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const navigate = useNavigate();
  const [showRelationshipInput, setShowRelationshipInput] = useState(false);
  const [pepStatus, setPepStatus] = useState(false);
  const [showPepInput, setShowPepInput] = useState(false);
  const [pepOccupationId, setPepOccupationid] = useState(null);
  const [showIncomesInput, setShowIncomesInput] = useState(false);
  const [incomesCounter, setIncomesCounter] = useState(0);

  const [pepStatus2, setPepStatus2] = useState(false);
  const [showPepInput2, setShowPepInput2] = useState(false);
  const [pepOccupationId2, setPepOccupationid2] = useState(null);
  const [counter, setCounter] = useState(0);
  const [parentesco, setParentesco] = useState("Padre");
  const [departamentos, setDepartamentos] = useState([]);
  const [salariosRango, setSalariosRango] = useState([]); // Nuevo estado para almacenar los salarios
  const [puestos, setPuestos] = useState([]);
  const [responsables, setResponsables] = useState([]); // Nuevo estado para almacenar los responsables
  const [documentType, setDocumentType] = useState("DUI");
  const [externado_id, setDocumentNumber] = useState("");

  //Validacion llenos
  const [isFirstNameRequired, setIsFirstNameRequired] = useState(true);
  const [isBirthdateInputFilled, setIsBirthdateInputFilled] = useState("");
  const [isLastNameRequired, setIsLastNameRequired] = useState(true);
  const [relationshipInputValue, setRelationshipInputValue] = useState("");
  const [isResponsibleTypeSelected, setIsResponsibleTypeSelected] =
    useState(false);
  const [isRelationshipInputFilled, setIsRelationshipInputFilled] =
    useState(false);
  const [isNationRequired, setIsNationRequired] = useState(true);
  const [isDocumentNumberRequired, setIsDocumentNumberRequired] =
    useState(true);
  const [isEmailRequired, setIsEmailRequired] = useState(true);
  const [isNitRequired, setIsNitRequired] = useState(true);
  const [isCellphoneRequired, setIsCellphoneRequired] = useState(true);
  const [isMunicipioRequired, setIsMunicipioRequired] = useState(true);
  const [isDepartamentoSelected, setIsDepartamentoSelected] = useState(false);
  const [isAddressRequired, setIsAddressRequired] = useState(true);
  const [isProfessionRequired, setIsProfessionRequired] = useState(true);
  const [isFormerStudentSelected, setIsFormerStudentSelected] = useState(false);
  const [isPepSelected, setIsPepSelected] = useState(false);
  const [isPepOccupationSelected, setIsPepOccupationSelected] = useState(false);
  const [pepInputValue, setPepInputValue] = useState("");
  const [isPepSelected2, setIsPepSelected2] = useState(false);
  const [isPepOccupationSelected2, setIsPepOccupationSelected2] =
    useState(false);
  const [pepInputValue2, setPepInputValue2] = useState("");
  const [isIncomesSelected, setIsIncomesSelected] = useState(false);
  const [incomingsInputValue, setIncomingsInputValue] = useState("");
  const [contadorGeneral, setContadorGeneral] = useState(0);
  const [depa, setDepa] = useState("");

  // Contador
  const [camposValidos, setCamposValidos] = useState({
    firstname: 0,
    lastname: 0,
    nationality: 0,
    nit: 0,
    mobile: 0,
    address: 0,
    municipio: 0,
    proffesion: 0,
    email: 0,
    documentnumber: 0,
    birthdate: 0,

    // ... otros campos
  });

  //Agregando representante
  const [externado_firstname, setFirstName] = useState("");
  const [externado_lastname, setLastName] = useState("");
  const [externado_nationality, setNationality] = useState("");
  const [externado_nit, setNit] = useState("");
  const [externado_address, setAddress] = useState("");
  const [externado_id_type, setIdType] = useState();
  const [externado_department_id, setDepartmentId] = useState();
  const [externado_town, setTown] = useState("");
  const [externado_occupation, setOccupation] = useState("");
  const [externado_workplace, setWorkplace] = useState("");
  const [externado_jobposition, setJobPosition] = useState("");
  const [externado_work_phone, setWorkPhone] = useState("");
  const [externado_mobile_phone, setMobilePhone] = useState("");
  const [externado_email, setEmail] = useState("");
  const [externado_university_studies, setUStudies] = useState("");
  const [emailValido, setEmailValido] = useState(true); //Inicialmente, asumimos que el correo es valido
  const [externado_responsible_relationship, setRelationship] = useState(""); //relación con el estudiante
  const [externado_pep_occupation_id, setPepOccupationId] = useState();
  const [externado_pep_3years_occupation_id, setPepOccupation3Id] = useState();
  const [externado_incomings_id, setIncomingsId] = useState();
  const [externado_responsible_type_id, setResponsibleType] = useState();
  const [externado_direct_responsible, setDirectResponsible] = useState();
  const [externado_former_externado_student, setFormerStudent] = useState();
  const [externado_pep, setPep] = useState();
  const [externado_pep_3years, setPep3Years] = useState();
  const [externado_birthdate, setBirthdate] = useState(Date());
  const [fecha_actual, setFechaActual] = useState(Date());
  const [externado_pep_occupation_other, setPepOccupationOther] = useState("");
  const [externado_pep_3years_occupation_other, setPepOccupation3YearsOther] =
    useState("");
  const [externado_incomings_other, setIncomingsOther] = useState("");
  const [messageDate, setMessageDate] = useState("");
  const [messageDUI, setMessageDUI] = useState("");
  const [messageNIT, setMessageNIT] = useState("");
  const [messageEmail, setMessageEmail] = useState("");
  const [messageWorkTel, setMessageWorkTel] = useState("");
  const [messageMobileTel, setMessageMobileTel] = useState("");
  const dateRef = useRef();
  const duiRef = useRef();
  const nitRef = useRef();
  const emailRef = useRef();
  const telWorkRef = useRef();
  const telMobileRef = useRef();

  const parentescoText =
    parentesco === "Padre"
      ? "Nombres y apellidos del padre"
      : parentesco === "Madre"
      ? "Nombres y apellidos de la madre"
      : "Nombres y apellidos del responsable";

  //almacenar los responsables
  const handleParentescoChange = (e) => {
    setParentesco(e.target.value);
  };

  //obteniendo tipo de responsable o parentesco
  const handleResponsibleType = (event) => {
    setRelationship(event.target.value);
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    const selectedValue = event.target.value;
    //console.log("EL id es: ", option);
    setResponsibleType(option);
    // Actualizar el estado para mostrar u ocultar el input según la opción seleccionada
    setIsRelationshipInputFilled(false);

    setShowRelationshipInput(selectedValue === "Tutor Legal");
    setIsResponsibleTypeSelected(event.target.value !== "");
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    // Actualizar el estado del nuevo input
    setRelationshipInputValue(inputValue);
    // ... tu código existente
    setIsRelationshipInputFilled(inputValue.trim() !== "");
  };

  const handleBirthdateChange = (event) => {
    const inputValue = event.target.value;
    //console.log(" Fecha de nacimiento: ", externado_birthdate);
    //console.log(" Fecha actual: ", fecha_actual);
    // Actualizar el estado del nuevo input
    setRelationshipInputValue(inputValue);
    // ... tu código existente
    setIsRelationshipInputFilled(inputValue.trim() !== "");
  };

  //almacena valor nombres
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    setIsFirstNameRequired(event.target.value.trim() === "");
  };

  //almacena valor apellido
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    setIsLastNameRequired(event.target.value.trim() === "");
  };

  //almacena valor nacionalidad
  const handleNationalityChange = (event) => {
    setNationality(event.target.value);
    setIsNationRequired(event.target.value.trim() === "");
  };

  //Obteniendo tipo de docuemnto
  const handleDocuementTypeChange = (event) => {
    //obtenindo valor
    setDocumentType(event.target.value);
    //obteniendo id
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de tipo de documento es: ", option);
    setIdType(option);
  };
  //Obtieniendo número de documento
  const handleDocumentNumberChange = (event) => {
    const newDocumentNumber = event.target.value;
    //console.log("newDocumentNumber:", newDocumentNumber);
    setIsDocumentNumberRequired(event.target.value.trim() === "");
    setDocumentNumber(newDocumentNumber);
  };

  const isDocumentNumberValid = validateDocumentNumberResp(
    documentType,
    externado_id
  );
  //alamacena valor dirección
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
    setIsAddressRequired(event.target.value.trim() === "");
  };
  //alamacena Id departamento
  const handleDepartmentChange = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const selectedValue = event.target.value;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id del departamento es: ", option);
    setDepartmentId(option);
    setDepa(selectedValue);
    // Actualizar el estado para mostrar u ocultar el input según la opción seleccionada
    if (selectedValue === "Favor seleccionar un valor") {
      setIsDepartamentoSelected(false);
    } else {
      setIsDepartamentoSelected(true);
    }
  };
  //almacena valor municipio
  const handleTownChange = (event) => {
    setTown(event.target.value);
    setIsMunicipioRequired(event.target.value.trim() === "");
  };
  //almacena valor NIT
  const handleNitChange = (event) => {
    setNit(event.target.value);
    setIsNitRequired(event.target.value.trim() === "");
  };
  const handleMobilePhoneChange = (event) => {
    setMobilePhone(event.target.value);
    setIsCellphoneRequired(event.target.value.trim() === "");
  };
  //almacena valor profesión
  const handleOccupationChange = (event) => {
    setOccupation(event.target.value);
    setIsProfessionRequired(event.target.value.trim() === "");
  };
  //almacena valor lugar de trabajo
  const handleWorkplaceChange = (event) => {
    setWorkplace(event.target.value);
  };
  //almacena valor posición de trabajo
  const handleJobPositionChange = (event) => {
    setJobPosition(event.target.value);
  };
  //almacena valor tel trabajo
  const handleWorkPhoneChange = (event) => {
    setWorkPhone(event.target.value);
  };
  //almacena valor tel móvil

  //almacena valor email
  const handleEmailChange = (e) => {
    const nuevoEmail = e.target.value;
    setEmail(nuevoEmail);
    setEmailValido(emailRegex.test(nuevoEmail)); //Validamos el nuevo email
    setIsEmailRequired(nuevoEmail.trim() === "");
  };

  const handleFormerStudentChange = (event) => {
    setFormerStudent(event.target.value);
    setIsFormerStudentSelected(true);
  };
  //almacena valor universidad
  const handleUiversityStudiesChange = (event) => {
    setUStudies(event.target.value);
  };
  //almacena valor relación con el estudiante
  const handleRelationshipChange = (event) => {
    setRelationship(event.target.value);
  };
  //almacena true o false representante directo
  const handleDirectResponsibleChange = (event) => {
    setDirectResponsible(event.target.value);
  };
  //almacena valor true o false de pep 3 años
  const handlePepChange = (event) => {
    setIsPepSelected(true);
    setPep(event.target.value);
    const pepValue = event.target.value === "1";
    setPepStatus(pepValue);
    setShowPepInput(pepValue && pepOccupationId === "Otro");
    setIsPepOccupationSelected(!pepValue);
  };
  const handlePepInputValueChange = (event) => {
    const inputValue = event.target.value;
    setPepOccupationOther(inputValue);
    // Actualizar el estado del nuevo input
    setPepInputValue(inputValue);
    // ... tu código existente
  };
  //almacena Id persona politicamente expuesta
  const handlePepOccupationIdChange = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de pep es: ", option);
    setPepOccupationId(option);
    const selectedValue = event.target.value;
    // Actualizar el estado para mostrar u ocultar el input según la opción seleccionada
    setShowPepInput(selectedValue === "Otro" && pepStatus);
    if (selectedValue === "Favor seleccionar un valor") {
      setIsPepOccupationSelected(false);
      //Poner el input vacio de pepInputValue vacio
    } else if (
      selectedValue !== "Otro" &&
      selectedValue !== "Favor seleccionar un valor"
    ) {
      setPepInputValue("");
      setIsPepOccupationSelected(true);
    } else {
      setIsPepOccupationSelected(true);
    }
  };

  //almacena valor true o false de pep 3 años
  const handlePep3yearsChange = (event) => {
    const selectedValue = event.target.value;
    setPep3Years(selectedValue);
    setPepStatus2(selectedValue === "1");
    // Reiniciar el contador si selecciona "No"
    setCounter((prevCounter) => (selectedValue === "0" ? 0 : prevCounter));
    //console.log("Contador handlePep3yearsChange " + counter);
    setIsPepSelected2(true);
    setIsPepOccupationSelected2(selectedValue === "Favor seleccionar un valor");
  };

  useEffect(() => {
    // Actualizar el estado para mostrar u ocultar el input según el valor del contador
    setShowPepInput2(pepStatus2 && pepOccupationId2 === "Otro" && counter > 0);
  }, [pepStatus2, pepOccupationId2, counter]);

  const handlePepOccupation3IdChange = (event) => {
    //obeniendo el id de la opción seleccionada
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de pep es: ", option);
    setPepOccupation3Id(option);
    const selectedValue = event.target.value;
    //console.log("EL id de pep3 es: ", selectedValue);

    setPepOccupationid2(selectedValue);
    setShowPepInput2(selectedValue === "Otro");
    if (selectedValue === "Favor seleccionar un valor") {
      setIsPepOccupationSelected2(false);
    } else if (
      selectedValue !== "Otro" &&
      selectedValue !== "Favor seleccionar un valor"
    ) {
      setPepInputValue2("");
      setIsPepOccupationSelected2(true);
    } else {
      setIsPepOccupationSelected2(true);
    }
  };
  // Efecto secundario para manejar la visibilidad del input
  useEffect(() => {
    setShowPepInput2(pepStatus2 && showPepInput2);
  }, [pepStatus2, showPepInput2]);

  const handlePepInputValueChange2 = (event) => {
    const inputValue = event.target.value;
    // Actualizar el estado del nuevo input
    setPepInputValue2(inputValue);
    setPepOccupation3YearsOther(inputValue);
    // ... tu código existente
  };

  //alamacena Id ingresos
  const handleIncomingsIdChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    //console.log("EL id de ingresos es: ", option);
    const selectedValue = event.target.value;
    // Actualizar el estado para mostrar u ocultar el input según la opción seleccionada
    setShowIncomesInput(selectedValue === "Otro");
    if (selectedValue === "Favor seleccionar un valor") {
      setIsIncomesSelected(false);
    } else if (
      selectedValue !== "Otro" &&
      selectedValue !== "Favor seleccionar un valor"
    ) {
      setIncomingsInputValue("");
      setIsIncomesSelected(true);
    } else {
      setIsIncomesSelected(true);
    }
    // Actualizar el estado de los ingresos seleccionados
    setIncomingsId(option);
  };

  const handleIncomingsInputChange = (event) => {
    const inputValue = event.target.value;
    setIncomingsOther(inputValue);
    // Actualizar el estado del nuevo input
    setIncomingsInputValue(inputValue);
    // ... tu código existente
  };

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
    //console.log("Token actual en RepresentantesForm:", authToken);
    fetchData();
  }, [authToken]);

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
        //console.log("Entraste al if de rol 3");
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const puestosData = await fetchPuestostrabajo(authToken);
        //console.log("Datos de puestos de trabajo:", puestosData);
        setPuestos(puestosData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsableData = await fetchResponsableTypeLeft(authToken);
        //console.log("Datos de respomsables faltantes:", responsableData);
        setResponsables(responsableData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salariosData = await fetchSalarios(authToken);
        //console.log("Datos de salario:", salariosData);
        setSalariosRango(salariosData);
      } catch (error) {
        //console.error(error.message);
      }
    };

    fetchData();
  }, [authToken]);

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
        setBirthdate(e.format());
        //   setFechaActual(e.Date());

        setIsBirthdateInputFilled(externado_birthdate.trim() !== "");
      });
  }, []);

  //Campitos
  useEffect(() => {
    setCamposValidos((prevCampos) => ({
      ...prevCampos,
      firstname: externado_firstname.trim() === "" ? 1 : 0,
      lastname: externado_lastname.trim() === "" ? 1 : 0,
      nationality: externado_nationality.trim() === "" ? 1 : 0,
      nit: externado_nit.trim() === "" ? 1 : 0,
      mobile: externado_mobile_phone.trim() === "" ? 1 : 0,
      address: externado_address.trim() === "" ? 1 : 0,
      municipio: externado_town.trim() === "" ? 1 : 0,
      proffesion: externado_occupation.trim() === "" ? 1 : 0,
      email: externado_email.trim() === "" ? 1 : 0,
      documentnumber: externado_id.trim() === "" ? 1 : 0,
      birthdate: externado_birthdate.trim() === "" ? 1 : 0,
    }));
  }, [
    externado_firstname,
    externado_lastname,
    externado_nationality,
    externado_nit,
    externado_mobile_phone,
    externado_address,
    externado_town,
    externado_occupation,
    externado_email,
    externado_id,
    externado_birthdate,
  ]);

  //Almacenando datos en la Api
  const handleFormSubmit = (event) => {
    event.preventDefault();
    //console.log("isResponsibleTypeSelected:", isResponsibleTypeSelected);
    //console.log("showRelationshipInput:", showRelationshipInput);
    //console.log("isRelationshipInputFilled:", isRelationshipInputFilled);

    const algunCampoVacio = Object.values(camposValidos).some(
      (estado) => estado === 1
    );

    if (algunCampoVacio) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debe llenar todos los campos obligatorios antes de Guardar",
      });
      return;
    } else if (
      !isResponsibleTypeSelected ||
      !isDepartamentoSelected ||
      !isFormerStudentSelected ||
      (!isPepSelected && pepStatus) || // Verifica si el valor del radio button es 1 y si está seleccionado
      (pepStatus && !isPepOccupationSelected) ||
      (!isPepSelected2 && pepStatus2) || // Verifica si el valor del radio button es 1 y si está seleccionad
      (pepStatus2 && !isPepOccupationSelected2) ||
      (showPepInput && !pepInputValue) ||
      (showPepInput2 && !pepInputValue2) ||
      (showIncomesInput && !incomingsInputValue) ||
      !isBirthdateInputFilled
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debe llenar todos los campos obligatorios antes de Guardar",
      });
      return;
    } else if (validateDateResp(externado_birthdate) === false) {
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageNIT("");
      setMessageDUI("");
      setMessageDate("Debe ingresar una fecha de nacimiento válida");
      dateRef.current.focus(); //enfoca campo de error
      return;
    } else if (
      validateDocumentResp(externado_id, externado_id_type) === false
    ) {
      /*Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debe ingresar un número de DUI válido",
      });*/
      setMessageDate("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageNIT("");

      if (externado_id_type === "1") {
        //console.log("estoy en pasaporte");
        setMessageDUI("Debe ingresar un número de pasaporte válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      } else {
        //console.log("estoy en dui");
        setMessageDUI("Debe ingresar un número de DUI válido");
        duiRef.current.focus(); //enfoca campo de error
        return;
      }
      //document.getElementById("dui").focus(); //muestra un warning ya que formcontrol bootstrap ya cuenta con un controlId.
    } else if (validateNITResp(externado_nit) === false) {
      setMessageDate("");
      setMessageDUI("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageNIT("Debe ingresar un número de NIT válido");
      setMessageDUI("");
      nitRef.current.focus(); //enfoca campo de error
      return;
    } else if (validateEmailResp(externado_email) === false) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageWorkTel("");
      setMessageMobileTel("");
      setMessageEmail("Debe ingresar un correo electrónico válido");
      emailRef.current.focus(); //enfoca campo de error
      return;
    } else if (validateMobileTelResp(externado_mobile_phone) === false) {
      //console.log("Estoy en mobile");
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageWorkTel("");
      setMessageMobileTel("Debe ingresar un número de celular válido");
      telMobileRef.current.focus(); //enfoca campo de error
      return;
    } else if (validateWorkTelResp(externado_work_phone) === false) {
      setMessageDate("");
      setMessageDUI("");
      setMessageNIT("");
      setMessageEmail("");
      setMessageMobileTel("");
      setMessageWorkTel("Debe ingresar un número de trabajo válido");
      telWorkRef.current.focus(); //enfoca campo de error
      return;
    } else {
      Swal.fire({
        icon: "success",
        title: "Datos enviados",
        text: "Se ha registrado al responsable exitosamente",
      }).then(function () {
        window.location = "/representanteslista";
      });

      const dataToSubmit = {
        externado_responsible_type_id: Number(externado_responsible_type_id), //Parentesco
        externado_firstname, //Nombres
        externado_lastname, //Apellidos
        externado_nationality, //Nacionalidad
        externado_id_type: Boolean(Number(externado_id_type)), //tipo de documento
        externado_id, //número de documento
        externado_address, //dirección de residencia
        externado_department_id: Number(externado_department_id), //departamento
        externado_town, //municipio
        externado_occupation, //profesión
        externado_workplace, //lugar de trabajo
        externado_jobposition, //cargo que desempeña
        externado_work_phone, //Teléfono de trabajo
        externado_mobile_phone, //teléfono celular
        externado_email, //email
        externado_former_externado_student: Boolean(
          Number(externado_former_externado_student)
        ), //Es exalumno
        externado_university_studies, //estudios universitarios
        externado_responsible_relationship, //relacion con el estudiante
        externado_direct_responsible: Boolean(
          Number(externado_direct_responsible)
        ), //Es responsable directo
        externado_pep: Boolean(Number(externado_pep)), // es una persona pe
        externado_pep_occupation_id: Number(externado_pep_occupation_id), //pep ocupación
        externado_pep_3years: Boolean(Number(externado_pep_3years)), // ha sido pep en los últimos 3 años
        externado_pep_3years_occupation_id: Number(
          externado_pep_3years_occupation_id
        ), //pep ocupación 3 añoss
        externado_incomings_id: Number(externado_incomings_id), //ingresos
        externado_birthdate, //fecha de nacimiento
        externado_nit, //nit
        externado_pep_occupation_other, // pep ocupación opción "otro"
        externado_pep_3years_occupation_other, // pep 3 años, ocupación opción "otro"
        externado_incomings_other, //ingresos, opción "otro"
      };

      const token = localStorage.getItem("token");
      fetch(
        "http://localhost:3001/api/v1/externado-responsible/registerResponsible",
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
          //console.log("Tipo de dato parentesco: ", externado_responsible_type_id);
          //console.log("dato DR: ", externado_direct_responsible);
          //console.log("Tipo de dato DR: ", typeof externado_direct_responsible);
          //console.log(" Fecha de nacimiento: ", externado_birthdate);
          //console.log(" Fecha actual: ", fecha_actual);
        });
    }
  };

  return (
    <>
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
        <h4 className="step1-estudiantes-lista">Información general de los padres de familia o apoderado</h4>
          <p>
            Los campos con el <span style={{ color: "red" }}>* </span>
            son de caracter <span style={{ color: "red" }}>
              obligatorio
            </span>{" "}
            para Guardar{" "}
          </p>

          <Form method="post" onSubmit={handleFormSubmit}>
            <Row>
              <Form.Group as={Col} xs={12} sm={6}>
                <Form.Label>
                  Parentesco con el/la alumno/a:
                  {isResponsibleTypeSelected ? null : (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </Form.Label>
                <Form.Control as="select" onChange={handleResponsibleType}>
                  <option selected disabled hidden>
                    Seleccionar
                  </option>
                  {responsables?.map((responsable) => (
                    <option
                      id={responsable.idexternado_responsible_type}
                      key={responsable.idexternado_responsible_type}
                      value={responsable.externado_responsible_type}
                    >
                      {responsable.externado_responsible_type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Row>

            <Form.Label style={{ paddingTop: "15px" }}>
              <u>
                <strong>
                  {parentescoText} según documento de identificación
                </strong>
              </u>
            </Form.Label>
            <div className="step2-estudiantes-lista">
            <Row>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>
                    Nombres
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    maxLength={60}
                    type="text"
                    placeholder={""}
                    name="firstName"
                    value={externado_firstname}
                    onChange={handleFirstNameChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>
                    Apellidos
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    maxLength={60}
                    type="text"
                    placeholder=""
                    name="lastName"
                    value={externado_lastname}
                    onChange={handleLastNameChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={3} xs={12} sm={12}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Fecha de nacimiento
                    {isBirthdateInputFilled ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
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
              <Col md={3} xs={12} sm={12}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Nacionalidad
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>

                  <Form.Control
                    maxLength={30}
                    type="text"
                    placeholder="Ej: Salvadoreña"
                    style={{ marginTop: "3px" }}
                    onChange={handleNationalityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3} xs={12} sm={12}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Tipo de documento
                  </Form.Label>
                  <Form.Control
                    style={{ marginTop: "3px" }}
                    as="select"
                    onChange={handleDocuementTypeChange}
                  >
                    <option id="0" value="DUI">
                      DUI
                    </option>
                    <option id="1" value="Pasaporte">
                      Pasaporte
                    </option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3} xs={12} sm={12}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Número de documento
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    maxLength={20}
                    ref={duiRef}
                    type="text"
                    placeholder=""
                    onChange={handleDocumentNumberChange}
                    style={{ marginTop: "3px" }}
                  />{" "}
                  <p className="error-message">{messageDUI}</p>
                  {/* Marcar como inválido si la validación falla */}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={3}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Número de NIT
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    maxLength={20}
                    ref={nitRef}
                    type="text"
                    value={externado_nit}
                    placeholder="Ej: 0614-111102-111-0"
                    onChange={handleNitChange}
                  ></Form.Control>
                  <p className="error-message">{messageNIT}</p>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={3}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "10px" }}>
                    {" "}
                    Número de celular
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    ref={telMobileRef}
                    maxLength={20}
                    type="text"
                    placeholder="Ej: 123445678"
                    value={externado_mobile_phone}
                    onChange={handleMobilePhoneChange}
                  />
                  <p className="error-message">{messageMobileTel}</p>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Dirección de residencia
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    maxLength={120}
                    type="text"
                    placeholder="Dirección exacta"
                    onChange={handleAddressChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={3}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Departamento
                    {!isDepartamentoSelected && (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </Form.Label>
                  <Form.Control as="select" onChange={handleDepartmentChange}>
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
                  <Form.Label style={{ paddingTop: "10px" }}>
                    Municipio
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    maxLength={30}
                    type="text"
                    placeholder=""
                    onChange={handleTownChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Profesión
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    maxLength={120}
                    type="text"
                    placeholder="Desarrollador de Software"
                    onChange={handleOccupationChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            </div>
            <div className="step3-estudiantes-lista">
            <Row>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "10px" }}>
                    {" "}
                    Lugar de trabajo
                  </Form.Label>
                  <Form.Control
                    maxLength={120}
                    type="text"
                    placeholder=" Empresa Innovadora de Tecnología TechSolutions"
                    onChange={handleWorkplaceChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Cargo que desempeña
                  </Form.Label>
                  <Form.Control
                    maxLength={120}
                    type="text"
                    placeholder="Ingeniero de Software Senior"
                    onChange={handleJobPositionChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label style={{ marginTop: "10px" }}>
                    Correo electrónico
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    maxLength={60}
                    ref={emailRef}
                    type="text"
                    placeholder="ej: minombre@ejemplo.com"
                    onChange={handleEmailChange}
                    className={
                      'form-control ${!emailValido ? "is-invalid" : ""}'
                    }
                  />
                  <p className="error-message">{messageEmail}</p>
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
                    Teléfono de trabajo
                  </Form.Label>
                  <Form.Control
                    ref={telWorkRef}
                    maxLength={20}
                    type="text"
                    placeholder="Ej: 2222222"
                    onChange={handleWorkPhoneChange}
                  />
                  <p className="error-message">{messageWorkTel}</p>
                </Form.Group>
              </Col>
              <Col xs={6} sm={3}></Col>
            </Row>
            <Row>
              <Col
                style={{ display: "flex", flexDirection: "column" }}
                xs={12}
                sm={12}
                md={6}
              >
                <Form.Label style={{ marginTop: "10px" }}>
                  ¿Es exalumno del Externado?
                  {!isFormerStudentSelected && (
                    <span style={{ color: "red" }}>* </span>
                  )}
                </Form.Label>
                <div className="form-group row">
                  <div className="col-sm-2 mt-2">
                    Si{" "}
                    <input
                      type="radio"
                      name="formerStudent"
                      value="1"
                      className="mx-2"
                      onChange={handleFormerStudentChange}
                    />
                  </div>
                  <div className="col-sm-2 mt-2">
                    No{" "}
                    <input
                      type="radio"
                      name="formerStudent"
                      value="0"
                      className="mx-2"
                      onChange={handleFormerStudentChange}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "10px" }}>
                    ¿En qué universidad estudió?
                  </Form.Label>
                  <Form.Control
                    maxLength={120}
                    type="text"
                    placeholder="Universidad"
                    onChange={handleUiversityStudiesChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label style={{ marginTop: "10px" }}>
                    ¿Es usted actualmente una Persona Políticamente Expuesta
                    (PEP´s)?
                    {isPepSelected ? null : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </Form.Label>
                  <div className="form-group row">
                    <div className="col-sm-2 mt-2">
                      Si{" "}
                      <input
                        type="radio"
                        name="pep1"
                        value="1"
                        className="mx-2"
                        onClick={() => setPepStatus(true)}
                        onChange={handlePepChange}
                      />
                    </div>
                    <div className="col-sm-2 mt-2">
                      No{" "}
                      <input
                        type="radio"
                        name="pep1"
                        value="0"
                        className="mx-2"
                        onClick={() => setPepStatus(false)}
                        onChange={handlePepChange}
                      />
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {pepStatus && (
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      {" "}
                      Si usted es una Persona Políticamente Expuesta, por favor
                      seleccionar según corresponda
                      {!isPepOccupationSelected && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </Form.Label>

                    <Form.Control
                      as="select"
                      onChange={handlePepOccupationIdChange}
                    >
                      {puestos?.map((puesto) => (
                        <option
                          id={puesto.idexternado_pep}
                          key={puesto.idexternado_pep}
                          value={puesto.externado_pep_value}
                        >
                          {puesto.externado_pep_value}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              )}
            </Row>
            {pepStatus && showPepInput && (
              <>
                <Row>
                  <Col></Col>
                  <Col xs={12} sm={12} md={6}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label style={{ marginTop: "10px" }}>
                        Si seleccionó otro, por favor especifique
                        {showPepInput && !pepInputValue ? (
                          <span style={{ color: "red" }}>*</span>
                        ) : null}
                      </Form.Label>
                      <Form.Control
                        maxLength={120}
                        type="text"
                        placeholder=""
                        onChange={handlePepInputValueChange}
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
                    ¿Ha sido usted una Persona Políticamente Expuesta (PEP´s)?
                    en los últimos 3 años?
                    {isPepSelected2 ? null : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </Form.Label>
                  <div className="form-group row">
                    <div className="col-sm-2 mt-2">
                      Si{" "}
                      <input
                        type="radio"
                        name="pep2"
                        value="1"
                        className="mx-2"
                        onClick={() => setPepStatus2(true)}
                        onChange={handlePep3yearsChange}
                      />
                    </div>
                    <div className="col-sm-2 mt-2">
                      No{" "}
                      <input
                        type="radio"
                        name="pep2"
                        value="0"
                        className="mx-2"
                        onClick={() => setPepStatus2(false)}
                        onChange={handlePep3yearsChange}
                      />
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {pepStatus2 && (
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      {" "}
                      Si usted es una Persona Políticamente Expuesta, por favor
                      seleccionar según corresponda
                      {!isPepOccupationSelected2 && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </Form.Label>

                    <Form.Control
                      as="select"
                      onChange={handlePepOccupation3IdChange}
                    >
                      {puestos?.map((puesto) => (
                        <option
                          id={puesto.idexternado_pep}
                          key={puesto.idexternado_pep}
                          value={puesto.externado_pep_value}
                        >
                          {puesto.externado_pep_value}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              )}
            </Row>
            {pepStatus2 && showPepInput2 && (
              <Row>
                <Col></Col>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ marginTop: "10px" }}>
                      Si seleccionó otro, por favor especifique
                      {showPepInput2 && !pepInputValue2 ? (
                        <span style={{ color: "red" }}>*</span>
                      ) : null}
                    </Form.Label>
                    <Form.Control
                      maxLength={120}
                      type="text"
                      placeholder=""
                      onChange={handlePepInputValueChange2}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={12} sm={12} md={6}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>
                    Rango promedio de sus ingresos mensuales familiares (acá
                    incluye su salario, recepción de remesas, pensiones,
                    ganancias de su negocio, etc.) Si su rango es superior a
                    $3,000 dólares mensuales, por favor especifique un monto
                    aproximado
                    {
                      !isIncomesSelected && (
                        <span style={{ color: "red" }}>*</span>
                      )
                      // <span style={{ color: "red" }}>*Obligatorio</span>
                    }
                  </Form.Label>

                  <Form.Control as="select" onChange={handleIncomingsIdChange}>
                    {salariosRango.map((salario) => (
                      <option
                        id={salario.idexternado_incomings}
                        key={salario.idexternado_incomings}
                        value={salario.externado_incomings_value}
                      >
                        {salario.externado_incomings_value}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col></Col>
            </Row>
            {showIncomesInput && (
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{ paddingTop: "10px" }}>
                      Si seleccionó otro, por favor especifique
                      {showIncomesInput && !incomingsInputValue ? (
                        <span style={{ color: "red" }}>* </span>
                      ) : null}
                    </Form.Label>
                    <Form.Control
                      maxLength={120}
                      type="text"
                      placeholder=""
                      onChange={handleIncomingsInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col></Col>
              </Row>
            )}
            </div>

            <Button
              type="submit"
              style={{
                marginTop: "20px",
                float: "right",
                color: "white",
                marginLeft: "10px",
                marginRight: "0px",
              }}
              variant="custom"
              className="boton-guardar step5-estudiantes-lista"
            >
              Guardar
            </Button>

            <NavLink to="/representanteslista">
              <Button
                style={{
                  marginTop: "20px",
                  marginLeft: "0px",
                  float: "left",
                }}
                variant="custom"
                className="boton-atras"
              >
                Atrás
              </Button>
            </NavLink>
          </Form>
        </Container>
        <Footer />
      </div>
    </>
  );
};

export default RepresentantesForm;
