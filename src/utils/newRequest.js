import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://fiverr-backend-54ww.onrender.com",
  withCredentials: true,
});

export default newRequest;
