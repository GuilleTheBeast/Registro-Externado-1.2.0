import moment from 'moment';

//* VALIDACIÓN DE CAMPOS PARA ESTUDIANTES
export const validateDocumentNumber = (documentType, documentNumber) => {
  if (documentType === "DUI" && /^\d{3}$/.test(documentNumber)) {
    return true; // Válido para DUI
  } else if (documentType === "Pasaporte" && /^\d{4}$/.test(documentNumber)) {
    return true; // Válido para Pasaporte
  } else {
    return false; // Inválido
  }
};

export function isDUI(dui) {
  const regex = /^(\d{8})-(\d)$/;
  if (regex.test(dui)) {
    const [, digits, digit_veri] = dui.match(regex);
    let sum = 0;

    for (let i = 0, l = digits.length; i < l; i++) {
      sum += (9 - i) * parseInt(digits[i], 10);
    }
    return parseInt(digit_veri, 10) === (10 - (sum % 10)) % 10;
  }
  return false;
}

export function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //console.log("Correo electrónico:", email); //se cambió value.email por email, ya que no se estaba obteniendo el correo electrónico ingresado
  //console.log("Coincide con el patrón:", emailPattern.test(email));
  if (!emailPattern.test(email) && email !== null) {
    //console.log("estoy dentro")
    // alert("Por favor, ingresa una dirección de correo electrónico válida.");
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del correo electrónico es válido.");
    // Aquí puedes agregar código para enviar los datos al servidor
  }
}

export function validateEmailRep(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //console.log("Correo electrónico:", email); //se cambió value.email por email, ya que no se estaba obteniendo el correo electrónico ingresado
  //console.log("Coincide con el patrón:", emailPattern.test(email));
  if (!emailPattern.test(email)) {
    // alert("Por favor, ingresa una dirección de correo electrónico válida.");
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del correo electrónico es válido.");
    // Aquí puedes agregar código para enviar los datos al servidor
  }
}

export function validateDocument(document, opc) {
  const duiPattern = /^[0-9]{8}-[0-9]{1}$/;
  const pasaportePattern = /^[A-Z]{1}[0-9]{0,8}$/;
  if (opc === "1" || opc === true) {
    //console.log("estoy en opción pasaporte");
    //console.log("la opción es: ", opc);
    //console.log("Pasaporte:", document);
    //console.log("Coincide con el patrón:", pasaportePattern.test(document));
    if (!pasaportePattern.test(document) && document !== "") {
      return false; // Detener el proceso si el pasaporte no es válido
    } else {
      //console.log("El formato del pasaporte es válido.");
      return true;
    }
  } else {
    //console.log("estoy en opción dui");
    //console.log("la opción es: ", opc);
    //console.log("DUI:", document);
    //console.log("Coincide con el patrón:", duiPattern.test(document));
    if (!duiPattern.test(document)&& document !== "") {
      return false; // Detener el proceso si el dui no es válido
    } else {
      //console.log("El formato del dui es válido.");
      return true;
    }
  }
}


export function validateNIT(nit) {
  const duiPattern =   /^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}$/;
  //console.log("NIT:", nit); 
  //console.log("Coincide con el patrón:", duiPattern.test(nit));
  if (!duiPattern.test(nit)) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del nit es válido.");
   return true;
  }
}

export function validateDate(date) {
let current = moment(new Date()).format('YYYY-MM-DD'); //obteniendo fecha actual
//console.log("Current date:", current);
//console.log("Selected date:", date);
  if (current <= date && date !== null) { //comparando fecha actual con fecha seleccionada
    return false; // Detener el proceso si la fecha seleccionada no es válida
  } else {
    //onsole.log("La fecha seleccionada es válida.");
   return true; 
  }
}

export function validateWorkTel(tel) {
  const telPattern =   /^[2][0-9]{7}$/;
  //console.log("Teléfono de trabajo:", tel); 
  //console.log("Coincide con el patrón:", telPattern.test(tel));
  if (!telPattern.test(tel) && tel !== "") {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono de trabajo es válido.");
   return true;
  }
}


export function validateMobileTel(cel) {
  const celPattern =   /^[6|7][0-9]{7}$/;
  //console.log("Teléfono celular:", cel); 
  //console.log("Coincide con el patrón:", celPattern.test(cel));
  if (!celPattern.test(cel) && cel !== undefined) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono celular  es válido.");
   return true;
  }
}

export function validateEmergencyTel(etel) {
  const etelPattern =   /^[6|7|2][0-9]{7}$/;
  //console.log("Teléfono emergencia:", etel); 
  //console.log("Coincide con el patrón:", etelPattern.test(etel));
  if (!etelPattern.test(etel) && etel !== "") {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono es válido.");
   return true;
  }
}

export function validateHomeTel(htel) {
  const htelPattern =   /^[6|7|2][0-9]{7}$/;
  //console.log("Teléfono emergencia:", htel); 
  //console.log("Coincide con el patrón:", htelPattern.test(htel));
  if (!htelPattern.test(htel) && htel !== "") {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono es válido.");
   return true;
  }
}

export function validateEmpty(value) {
  const valuePattern =   /^$/;
  //console.log("Teléfono emergencia:", value); 
  //console.log("Coincide con el patrón:", valuePattern.test(value));
  if (valuePattern.test(value)) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono es válido.");
   return true;
  }
}

//* VALIDACIÓN DE CAMPOS PARA REPRESENTANTES
export const validateDocumentNumberResp = (documentType, documentNumber) => {
  if (documentType === "DUI" && /^\d{3}$/.test(documentNumber)) {
    return true; // Válido para DUI
  } else if (documentType === "Pasaporte" && /^\d{4}$/.test(documentNumber)) {
    return true; // Válido para Pasaporte
  } else {
    return false; // Inválido
  }
};

export function isDUIResp(dui) {
  const regex = /^(\d{8})-(\d)$/;
  if (regex.test(dui)) {
    const [, digits, digit_veri] = dui.match(regex);
    let sum = 0;

    for (let i = 0, l = digits.length; i < l; i++) {
      sum += (9 - i) * parseInt(digits[i], 10);
    }
    return parseInt(digit_veri, 10) === (10 - (sum % 10)) % 10;
  }
  return false;
}

export function validateEmailResp(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //console.log("Correo electrónico:", email); //se cambió value.email por email, ya que no se estaba obteniendo el correo electrónico ingresado
  //console.log("Coincide con el patrón:", emailPattern.test(email));
  if (!emailPattern.test(email)) {
    // alert("Por favor, ingresa una dirección de correo electrónico válida.");
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del correo electrónico es válido.");
    // Aquí puedes agregar código para enviar los datos al servidor
  }
}

export function validateDocumentResp(document, opc) {
  const duiPattern = /^[0-9]{8}-[0-9]{1}$/;
  const pasaportePattern = /^[A-Z]{1}[0-9]{0,8}$/;
  if (opc === "1" || opc === true) {
    //console.log("estoy en opción pasaporte");
    //console.log("la opción es: ", opc);
    //console.log("Pasaporte:", document);
    //console.log("Coincide con el patrón:", pasaportePattern.test(document));
    if (!pasaportePattern.test(document)) {
      return false; // Detener el proceso si el pasaporte no es válido
    } else {
      console.log("El formato del pasaporte es válido.");
      return true;
    }
  } else {
    //console.log("estoy en opción dui");
    //console.log("la opción es: ", opc);
    //console.log("DUI:", document);
    //console.log("Coincide con el patrón:", duiPattern.test(document));
    if (!duiPattern.test(document)) {
      return false; // Detener el proceso si el dui no es válido
    } else {
      //console.log("El formato del dui es válido.");
      return true;
    }
  }
}


export function validateNITResp(nit) {
  const duiPattern =   /^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}$/;
  //console.log("NIT:", nit); 
  //console.log("Coincide con el patrón:", duiPattern.test(nit));
  if (!duiPattern.test(nit)) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del nit es válido.");
   return true;
  }
}

export function validateDateResp(date) {
let current = moment(new Date()).format('YYYY-MM-DD'); //obteniendo fecha actual
//console.log("Current date:", current);

  if (current <= date ) { //comparando fecha actual con fecha seleccionada
    return false; // Detener el proceso si la fecha seleccionada no es válida
  } else {
    //console.log("La fecha seleccionada es válida.");
   return true; 
  }
}

export function validateWorkTelResp(tel) {
  const telPattern =   /^[2][0-9]{7}$/;
  //console.log("Teléfono de trabajo:", tel); 
  //console.log("Coincide con el patrón:", telPattern.test(tel));
  if (!telPattern.test(tel)) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono de trabajo es válido.");
   return true;
  }
}


export function validateMobileTelResp(cel) {
  const celPattern =   /^[6|7][0-9]{7}$/;
  //console.log("Teléfono celular:", cel); 
  //console.log("Coincide con el patrón:", celPattern.test(cel));
  if (!celPattern.test(cel)) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono celular  es válido.");
   return true;
  }
}

export function validateEmergencyTelResp(etel) {
  const etelPattern =   /^[6|7|2][0-9]{7}$/;
  //console.log("Teléfono emergencia:", etel); 
  //console.log("Coincide con el patrón:", etelPattern.test(etel));
  if (!etelPattern.test(etel)) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono es válido.");
   return true;
  }
}

export function validateHomeTelResp(htel) {
  const htelPattern =   /^[6|7|2][0-9]{7}$/;
  //console.log("Teléfono emergencia:", htel); 
  //console.log("Coincide con el patrón:", htelPattern.test(htel));
  if (!htelPattern.test(htel)) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono es válido.");
   return true;
  }
}

export function validateEmptyResp(value) {
  const valuePattern =   /^$/;
  //console.log("Teléfono emergencia:", value); 
  //console.log("Coincide con el patrón:", valuePattern.test(value));
  if (valuePattern.test(value)) {
    return false; // Detener el proceso si el correo no es válido
  } else {
    //console.log("El formato del teléfono es válido.");
   return true;
  }
}