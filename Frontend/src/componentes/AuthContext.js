import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("authToken") || ""
  );

  const setToken = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
  };
  // Limpia el token cuando el componente se desmonta
  useEffect(() => {
    return () => {
      localStorage.removeItem("authToken");
    };
  }, []);

  // Establece un temporizador para limpiar el token después de 1 minuto
  useEffect(() => {
    const expirationTime = 60 * 60 * 1000; // 1 hora en milisegundos
    const expirationTimer = setTimeout(() => {
      // Establecer el token en null después de 1 minuto
      setAuthToken(null);
      // Redirigir al usuario a la página de caducado
      // history.push("/caducado");
    }, expirationTime);

    // Limpia el temporizador al desmontar el componente o cuando el token cambia
    return () => clearTimeout(expirationTimer);
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const fetchDepartamentos = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-department/getDepartments",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      "Error al obtener la lista de departamentos: " + error.message
    );
  }
};

export const fetchPuestostrabajo = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-pep/getPep",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener la lista de empleos: " + error.message);
  }
};

export const fetchSalarios = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-incomings/getIncomings",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener salarios: " + error.message);
  }
};

export const fetchGrado = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-levels/getLevels",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener grados: " + error.message);
  }
};

export const fetchReligion = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-church/getChurches",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener religiones: " + error.message);
  }
};

export const fetchAllUsersSup = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-users/allUsersSuper",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener usuarios super admin: " + error.message);
  }
};
/* 
export const fetchAllUsersAssistant = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-users/allUsersAssistant",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener usuarios asistentes: " + error.message);
  }
};

*/

export const fetchAllUsersAdmin = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-users/allUsersAdm",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener usuarios admin: " + error.message);
  }
};

export const fetchActualPeriod = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-admin-system/getActualPeriod",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener el periodo actual: " + error.message);
  }
}; 

export const fetchHistorico = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-admin-system/historicalPeriod",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener el historico: " + error.message);
  }
};

export const fetchResponsableTypeLeft = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-responsible-type/getResponsibleTypesLeft",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      "Error al obtener responsables quedantes: " + error.message
    );
  }
};

export const fetchResponsableType = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-responsible-type/getResponsibleTypes",

      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener responsables: " + error.message);
  }
};

export const fetchResponsablesPrev = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/auth/responsiblesPrev",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener responsables tabla: " + error.message);
  }
};

export const fetchEstudiantesPrev = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/auth/studentsPrev",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener estudiantes tabla: " + error.message);
  }
};

export const fetchResponsableTipo = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-student-responsible-type/getStudentRespType",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener responsables tipo: " + error.message);
  }
};

export const deleteEstudianteById = async (authToken, estudianteId) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/v1/externado-student/deleteStudent`,
      {
        idexternado_student: estudianteId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar estudiante: " + error.message);
  }
};

export const editEstudianteById = async (authToken, estudianteId) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/v1/externado-student/pdfStudent`,
      {
        idexternado_student: estudianteId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al editar estudiante: " + error.message);
  }
};

export const deleteResponsableById = async (authToken, responsableId) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/v1/externado-responsible/deleteResponsible`,
      {
        idexternado_responsible: responsableId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar responsable: " + error.message);
  }
};

export const fetchResponsableById = async (authToken, responsableId) => {
  try {
    var user = axios.post(
      `http://localhost:3001/api/v1/auth/responsible`,
      {
        idexternado_responsible: responsableId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    ).data;

    return user;
  } catch (error) {
    throw new Error("Error al editar responsable: " + error.message);
  }


  
};

export const fetchUsuarioInfo =  async (authToken, userId) =>{
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/externado-users/getUserInfoSuper/${userId}`,
  
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      return response.data;
  
    
  } catch (error) {
    throw new Error("Error al editar estudiante: " + error.message);
  }
};

export const fetchUsuarios = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-users/allUsersSuper",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener estudiantes tabla: " + error.message);
  }
};

export const fetchAssistant = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-users/allUsersAssistant",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener estudiantes tabla: " + error.message);
  }
};

export const fetchUsuariosAdmin = async (authToken) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-users/allUsersAdm",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener estudiantes tabla: " + error.message);
  }
};

export const fetchEstudianteInfo =  async (authToken, studentId) =>{
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/externado-admins/studentGet/${studentId}`,

      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      return response.data;
  
    
  } catch (error) {
    throw new Error("Error al editar estudiante: " + error.message);
  }
};

export const fetchResponsableInfo =  async (authToken, responsibleId) =>{
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/externado-admins/responsibleGet/${responsibleId}`,

      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      return response.data;
  
    
  } catch (error) {
    throw new Error("Error al editar responsable: " + error.message);
  }
};

export const fetchEstudiantes = async (authToken, pagination = { page: 1, limit: 10, paginated: false}, nombres = null,  currentLevelId = null) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-admins/studentList",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        params: {
          nombre: nombres,
          currentLevelId: currentLevelId,
          page: pagination.page,
          limit: pagination.limit,
          paginated: pagination.paginated
        
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener estudiantes tabla: " + error.message);
  }
}

export const fetchEstudiantesA = async (authToken, pagination = { page: 1, limit: 10, paginated: false}, apellidos = null, currentLevelId = null) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/externado-admins/studentListA",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        params: {
          apellido: apellidos,
          currentLevelId: currentLevelId,
          page: pagination.page,
          limit: pagination.limit,
          paginated: pagination.paginated
        
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener estudiantes tabla: " + error.message);
  }
}
