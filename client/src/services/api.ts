import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create();

const whiteListUrls = [
    process.env.REACT_APP_API_UPLOAD_URL,
    process.env.REACT_APP_API_ENDPOINT_APPWRITE
]

api.interceptors.request.use(config => {
    if (whiteListUrls.includes(config.url)) return config;
    if (token) config.headers.Authorization = token;
    
    return config;
});

export default api;
