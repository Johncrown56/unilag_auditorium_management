import { IBooking, IChangeStatus } from "../../utils/interfaces";
import api from "../../utils/http";
import endpoint from "../../utils/endpoints";

const baseUrl = endpoint.BOOKING;

// Book auditorium
const create = async (data: IBooking) => {
  const response = await api.post(baseUrl, data);
  return response.data;
};

// update auditorium
const update = async (id: string, data: IBooking) => {
  const response = await api.put(baseUrl + "/" + id, data);
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

// change booking status
const changeStatus = async (data: IChangeStatus) => {
  const response = await api.post(baseUrl + "/status/" + data.id, {
    status: data.status,
  });
  return response.data;
};

const bookingService = {
  create,
  fetch,
  update,
  fetchOne,
  changeStatus,
};

export default bookingService;
