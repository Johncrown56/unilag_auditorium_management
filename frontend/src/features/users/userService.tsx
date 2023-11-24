import api from "../../utils/http";
import { IupdateProfile } from "../../utils/interfaces";

const baseUrl = process.env.REACT_APP_BASEURL + "/api/users";

// get all users
const fetchAll = async () => {
  const response = await api.get(baseUrl + "/all");
  return response.data;
};

const fetchOne = async (id: string) => {
  const response = await api.get(baseUrl + "/profile/" + id);
  console.log(response);
  return response.data;
};

const update = async (id: string, data: IupdateProfile) => {
  const response = await api.put(baseUrl + "/profile/" + id, data);
  console.log(response);
  return response.data;
};

const userService = {
  fetchAll,
  fetchOne,
  update,
};

export default userService;
