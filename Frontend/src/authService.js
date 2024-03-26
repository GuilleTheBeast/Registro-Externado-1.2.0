import axios from "axios";
import Swal from "sweetalert2";

export const API_URL = "http://localhost:3001/api/v1";

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        externado_email: email,
        externado_pass: password,
      });
      const responseData = response.data;
      const { tokenJSON, statusJSON } = responseData;
      localStorage.setItem("token", tokenJSON);
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenJSON}`;
      if (statusJSON !== undefined) {
        axios.defaults.headers.common["Status"] = statusJSON.toString();
      }
      return { token: tokenJSON, status: statusJSON, responseData };
    } catch (error) {
      //console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },
};

export default authService;
