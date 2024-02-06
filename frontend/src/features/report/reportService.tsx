import endpoint from "../../utils/endpoints";
import api from "../../utils/http";

const baseUrl = endpoint.ADMIN;

// get user Count
const countUser = async () => {
  const response = await api.get(baseUrl + "/");
  return response.data;
};

const reportService = {
  countUser,
};

export default reportService;
