/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import axios, { AxiosInstance } from "axios";

const getUrlByAmbient = (): string => {
    switch (process.env.REACT_APP_DEFAULTCONFIGURATION ?? "") {
        case "production":
            return process.env.REACT_APP_API_ENDPOINT_PRODUCTION ?? "";
        case "development":
            return process.env.REACT_APP_API_ENDPOINT ?? "";
        default:
            return "";
    }
};

const api: AxiosInstance = axios.create({
    baseURL: getUrlByAmbient(),
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

const whiteListUrls = [
    process.env.REACT_APP_API_UPLOAD_URL,
    process.env.REACT_APP_API_ENDPOINT_APPWRITE
];

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (whiteListUrls.includes(config.url ?? "")) return config;
    if (token) config.headers.Authorization = token;
    return config;
});
let secretKey = process.env.REACT_APP_API_SECRET_KEY ?? "";
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/refreshToken")) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await api.post(`/api/v1/${secretKey}/refreshToken`);
                const newToken = refreshResponse.data.token;

                if (!newToken) throw new Error("Token não retornado pelo refresh");

                localStorage.setItem("token", newToken);
                originalRequest.headers.Authorization = newToken;

                window.location.reload();

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { getUrlByAmbient };

export default api;
