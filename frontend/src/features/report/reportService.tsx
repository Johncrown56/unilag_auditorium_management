import api from "../../utils/http";

const baseUrl = "/api/admin";

// get user Count
const countUser = async () => {
  const response = await api.get(baseUrl + "/");
  return response.data;
};

const reportService = {
  countUser,
};

export default reportService;
