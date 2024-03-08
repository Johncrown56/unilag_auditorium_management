import endpoint from "../../utils/endpoints";
import api from "../../utils/http";

const adminBaseUrl = endpoint.ADMIN;

// get user Count
const countUser = async () => {
  const response = await api.get(adminBaseUrl + "/count");
  return response.data;
};

const reportService = {
  countUser,
};

export default reportService;
