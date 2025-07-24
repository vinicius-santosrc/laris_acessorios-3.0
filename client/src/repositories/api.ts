/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import axios from "axios";

const token = localStorage.getItem("token");

const getUrlByAmbient = (): string => {
    switch (process.env.REACT_APP_DEFAULTCONFIGURATION ?? "") {
        case "production":
            return process.env.REACT_APP_API_ENDPOINT_PRODUCTION ?? "";
        case "development":
            return process.env.REACT_APP_API_ENDPOINT ?? "";
        default:
            return "";
    }
}

const api = axios.create({
    baseURL: getUrlByAmbient(), // seu backend
    withCredentials: true // permite cookies
});

const whiteListUrls = [
    process.env.REACT_APP_API_UPLOAD_URL,
    process.env.REACT_APP_API_ENDPOINT_APPWRITE
];

api.interceptors.request.use(config => {
    if (whiteListUrls.includes(config.url)) return config;
    if (token) config.headers.Authorization = token;

    return config;
});

export { getUrlByAmbient };

export default api;
