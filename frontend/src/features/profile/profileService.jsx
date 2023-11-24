import axios from "axios";
import AuthConstants from "../../config/authconstant";
import { get } from "../../utils/storage";

const baseUrl = process.env.REACT_APP_BASEURL;
const url = baseUrl + "/api/users/profile";

// get user profile
const fetch = async () => {
  const user = get(AuthConstants());
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
  return response.data;
};

// update user profile
const update = async (data) => {
  const user = get(AuthConstants());
  const response = await axios.put(url, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
  return response.data;
};

const profileService = {
  fetch,
  update,
};

export default profileService;
