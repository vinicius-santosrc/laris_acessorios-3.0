/**
 * Creation Date: 18/09/2023
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2023, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { Account, Client, Databases } from 'appwrite';
import { UserAuthProps } from '@/lib/utils';
import { UserProps } from '@/models/user';
import axios from 'axios';
import api, { getUrlByAmbient } from './api';

const url = getUrlByAmbient();
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

const endPointAppWrite: string | undefined = process.env.REACT_APP_API_ENDPOINT_APPWRITE;
const projectAppWrite: string | undefined = process.env.REACT_APP_API_PROJECT_APPWRITE;

class authService {
    private readonly client: Client;

    constructor() {
        this.client = new Client();
        if (endPointAppWrite && projectAppWrite) {
            this.client.setEndpoint(endPointAppWrite).setProject(projectAppWrite);
        }
    }

    static readonly register = async (user: UserAuthProps, password: string) => {
        try {
            const response = await api.post(`${url}${preEndpoint}${secretKey}/register`, {
                nome_completo: user.nome_completo,
                cpf: user.cpf,
                email: user.email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        }
        catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status de erro
                console.error("Resposta do servidor:", error.response.data);
                throw new Error(error.response.data.error || "Erro desconhecido no servidor.");
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error("Sem resposta do servidor:", error.request);
                throw new Error("Sem resposta do servidor.");
            } else {
                // Algo aconteceu ao configurar a requisição
                console.error("Erro ao configurar requisição:", error.message);
                throw new Error("Erro ao configurar requisição.");
            }
        }
    }
    static login = async (email: string, password: string) => {
        try {
            const response = await api.post(`${url}${preEndpoint}${secretKey}/login`, {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data
        }
        catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status de erro
                console.error("Resposta do servidor:", error.response.data);
                throw new Error(error.response.data.error || "Erro desconhecido no servidor.");
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error("Sem resposta do servidor:", error.request);
                throw new Error("Sem resposta do servidor.");
            } else {
                // Algo aconteceu ao configurar a requisição
                console.error("Erro ao configurar requisição:", error.message);
                throw new Error("Erro ao configurar requisição.");
            }
        }
    }

    public static readonly getUserData = () => {
        return localStorage.getItem("user_id");
    }

    static readonly isLogged = async () => {
        if (localStorage.getItem("user_id")) {
            return true
        }
        return false;
    }

    static readonly logout = async () => {
        try {
            localStorage.clear();
            window.location.href = window.location.origin;
        } catch (error: any) {
            console.error('Erro ao realizar logout:', error);
        }
    }

    static readonly getUserByEmail = async (email: string) => {
        try {
            const response = await axios.post(`${url}${preEndpoint}${secretKey}/user`, {
                email: email
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data[0];
        } catch (error: any) {
        }
    }

    static readonly isUserAdmin = async (uid: string) => {
        try {
            const response = await axios.post(`${url}${preEndpoint}${secretKey}/userByUid`, {
                uid: uid
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data: UserProps[] = response.data;
            return data[0] && data[0].label == "Admin";
        } catch (error: any) {
            return false;
        }
    }

    static getUserByUid = async (uid: string) => {
        try {
            const response = await axios.post(`${url}${preEndpoint}${secretKey}/userByUid`, {
                uid: uid
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data[0];
        } catch (error: any) {
        }
    }
}

export default authService;