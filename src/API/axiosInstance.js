// axiosInstance.js

import axios from "axios";

// Create a custom Axios instance with base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_LOCALIP, // Assuming you define this environment variable in your .env file
});


export default instance;
