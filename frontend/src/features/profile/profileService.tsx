import api from "../../utils/http";

const url = "/api/users/profile";

// get user profile
const fetch = async () => {
  const response = await api.get(url);
  return response.data;
};

// update user profile
const update = async (data: any) => {
  const response = await api.put(url, data);
  return response.data;
};

const profileService = {
  fetch,
  update,
};

export default profileService;
