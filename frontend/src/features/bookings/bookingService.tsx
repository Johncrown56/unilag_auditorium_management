import { IBooking } from "../../utils/interfaces";
import api from "../../utils/http";

const baseUrl = process.env.REACT_APP_BASEURL + "/api/bookings";

// Book auditorium
const create = async (data: IBooking) => {
  const response = await api.post(baseUrl, data);
  return response.data;
};

// update auditorium
const update = async (data: IBooking) => {
  const response = await api.put(baseUrl, data);
  return response.data;
};

// fetch all booked auditorium
const fetch = async () => {
  const response = await api.get(baseUrl);
  return response.data;
};

// fetch one booked auditorium
const fetchOne = async (id: string) => {
  const response = await api.get(baseUrl + "/" + id);
  return response.data;
};

// fetch all booked auditorium for each user
const fetchByUser = async () => {
  const response = await api.get(baseUrl + "?type=user");
  return response.data;
};

const bookingService = {
  create,
  fetch,
  update,
  fetchOne,
  fetchByUser,
};

export default bookingService;
