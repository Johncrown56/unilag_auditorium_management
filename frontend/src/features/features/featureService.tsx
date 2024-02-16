import endpoint from "../../utils/endpoints";
import api from "../../utils/http";
import { IFeat } from "../../utils/interfaces";

const url = `${endpoint.FEATURES}`;

// create feature
const create = async (data: IFeat) => {
    const response = await api.post(url, data);
    return response.data;
  };

// get features
const fetch = async () => {
  const response = await api.get(url);
  return response.data;
};

// update feature
const update = async (id: string, data: IFeat) => {
  const endpoint = `${url}/${id}`
  const response = await api.put(endpoint, data);
  return response.data;
};

// delete feature
const remove = async (id: string) => {
  const endpoint = `${url}/${id}`
  const response = await api.delete(endpoint);
  return response.data;
};

const featureService = {
    create,
  fetch,
  update,
  remove
};

export default featureService;
