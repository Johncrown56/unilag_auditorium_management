import { IAuditorium } from "../../utils/interfaces";
import api from "../../utils/http";

const baseUrl = process.env.REACT_APP_BASEURL + "/api/auditoriums";

// Create auditorium
const create = async (data: IAuditorium) => {
  const response = await api.post(baseUrl, data);
  console.log(response.data);
  return response.data;
};

// fetch all auditoriums
const fetch = async () => {
  const response = await api.get(baseUrl);
  return response.data;
};

// fetch one auditorium
const fetchOne = async (id: string) => {
  const response = await api.get(baseUrl + "/" + id);
  return response.data;
};

// update auditorium
const update = async (data: IAuditorium) => {
  const response = await api.put(baseUrl, data);
  return response.data;
};

const auditoriumService = {
  create,
  fetch,
  update,
  fetchOne,
};

export default auditoriumService;
