import api from "../../utils/http";
import { IupdateProfile } from "../../utils/interfaces";

const baseUrl = "/api/users";

// get all users
const fetchAll = async () => {
  const response = await api.get(baseUrl + "/all");
  return response.data;
};

const fetchOne = async (id: string) => {
  const response = await api.get(baseUrl + "/profile/" + id);
  return response.data;
};

const update = async (id: string, data: IupdateProfile) => {
  const response = await api.put(baseUrl + "/profile/" + id, data);
  return response.data;
};

const userService = {
  fetchAll,
  fetchOne,
  update,
};

export default userService;
