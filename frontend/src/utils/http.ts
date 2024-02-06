// Import the necessary libraries
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { get, removeItem } from "./storage";
import AuthConstants from "../config/authconstant";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
});

export const useNavigateAndClearToken = () => {
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

export const fetchDataFromApi = async (url: string, params?: any) => {
  try {
    const { data } = await api.get(url, {
      params,
    });
    console.log(data)
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// Add a request interceptor to add the Authorization header to each request
api.interceptors.request.use(
  (config) => {
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

export default api;
