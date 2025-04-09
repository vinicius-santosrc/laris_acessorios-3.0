import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create();

api.interceptors.request.use(config => {
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default api;
