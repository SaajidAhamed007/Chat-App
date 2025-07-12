import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"https://chat-app-n6yx.onrender.com//api",
    withCredentials:true
})
