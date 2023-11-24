import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { get, removeItem } from "./storage";
import AuthConstants from "../config/authconstant";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
});

const useNavigateAndClearToken = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateAndClearToken = () => {
    removeItem(AuthConstants()); // Clear the expired token from local storage
    navigate("/login", {
      state: { from: location?.pathname },
      replace: true,
    }); // Redirect to the login page
  };

  return navigateAndClearToken;
};

// Add a request interceptor to add the Authorization header to each request
api.interceptors.request.use(
  (config) => {
    //const token = localStorage.getItem('token');
    const user = get(AuthConstants());
    const token = user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const navigateAndClearToken = useNavigateAndClearToken();

    if (error.response && error.response.status === 401) {
      // Handle token expiration, e.g., redirect to the login page
      navigateAndClearToken();
    }

    return Promise.reject(error);
  }
);

export default api;
