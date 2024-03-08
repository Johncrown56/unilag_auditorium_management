import endpoint from "../../utils/endpoints";
import api from "../../utils/http";
import { IChangePassword, IUser } from "../../utils/interfaces";

const baseUrl = `${endpoint.USERS}`;
const url = `${endpoint.USERS}/profile`;

// get user profile
const fetch = async () => {
  const response = await api.get(url);
  return response.data;
};

// update user profile
const update = async (data: IUser) => {
  const response = await api.put(`${url}/${data.userId}`, data);
  return response.data;
};

const changePassword = async (data: IChangePassword) => {
  const response = await api.put(`${baseUrl}/change-password`, data);
  return response.data;
};

const profileService = {
  fetch,
  update,
  changePassword
};

export default profileService;
