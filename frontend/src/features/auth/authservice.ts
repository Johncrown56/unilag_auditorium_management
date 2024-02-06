import { get, removeItem, store } from "../../utils/storage";
import AuthConstants from "../../config/authconstant";
import {
  IForgotPassword,
  ILogin,
  IRegister,
  IResetPassword,
  IVerifyOTP,
} from "../../utils/interfaces";
import api from "../../utils/http";
import endpoint from "../../utils/endpoints";

const baseUrl = endpoint.USERS;

//register user
const register = async (data: IRegister) => {
  const response = await api.post(baseUrl, data);
  console.log(response.data);
  if (response.data.success) {
    store(AuthConstants(), response.data.data);
  }
  return response.data;
};

// Login user
const login = async (data: ILogin) => {
  const response = await api.post(baseUrl + "/login", data);
  if (response.data.success) {
    store(AuthConstants(), response.data.data);
  }
  return response.data;
};

// Logout user
const logout = async () => {
  const user = get(AuthConstants());
  const response = await api.get(baseUrl + "/logout", {
    headers: { Authorization: `Bearer ${user.token}` },
  });
  console.log(response.data);
  if (response.data.success) {
    removeItem(AuthConstants());
  }
  return response.data;
};

// customer forgot Password
const forgotPassword = async (data: IForgotPassword) => {
  const response = await api.post(baseUrl + "/forgot-password", data);
  if (response.data.success) {
    console.log(response.data.data);
  }
  return response.data;
};

// reset password
const resetPassword = async (data: IResetPassword) => {
  const response = await api.post(baseUrl + "/reset-password", data);
  if (response.data.success) {
    console.log(response.data.data);
  }
  return response.data;
};

// verify email or phone
const verifyEmail = async (data: IVerifyOTP) => {
  const response = await api.post(baseUrl + "/otpverify", data);
  if (response.data.success) {
    console.log(response.data.data);
  }
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
  verifyEmail,
};

export default authService;
