import endpoint from "../../utils/endpoints";
import api from "../../utils/http";
import { IUser } from "../../utils/interfaces";

const baseUrl = endpoint.ADMIN;

// create User
const create = async (data: IUser) => {
    const response = await api.post(baseUrl, data);
    return response.data;
  };

// fetch all admins
const fetch = async (role?: string) => {
  const response = await api.get(`${baseUrl}`);
  return response.data; 
};

const fetchOne = async (id: string) => {
  const response = await api.get(baseUrl + "/" + id);   
  return response.data;
};

const update = async (id: string, data: IUser) => {
  const response = await api.put(baseUrl + "/" + id, data);
  return response.data;
};

// delete a user // Only superadmin or poweradmin can delete a user
const remove = async (id: string) => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
  };

const adminService = {
  fetch,
  fetchOne,
  update,
  create,
  remove
};

export default adminService;
