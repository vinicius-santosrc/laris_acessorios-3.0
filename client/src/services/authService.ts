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
                console.error("Resposta do servidor:", error.response.data);
                throw new Error(error.response.data.error || "Erro desconhecido no servidor.");
            } else if (error.request) {
                console.error("Sem resposta do servidor:", error.request);
                throw new Error("Sem resposta do servidor.");
            } else {
                console.error("Erro ao configurar requisição:", error.message);
                throw new Error("Erro ao configurar requisição.");
            }
        }
    }

    static readonly login = async (email: string, password: string) => {
        try {
            const response = await api.post(`${url}${preEndpoint}${secretKey}/login`, {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            return response.data;
        }
        catch (error: any) {
            if (error.response) {
                console.error("Resposta do servidor:", error.response.data);
                throw new Error(error.response.data.error || "Erro desconhecido no servidor.");
            } else if (error.request) {
                console.error("Sem resposta do servidor:", error.request);
                throw new Error("Sem resposta do servidor.");
            } else {
                console.error("Erro ao configurar requisição:", error.message);
                throw new Error("Erro ao configurar requisição.");
            }
        }
    }

    public static readonly getUserData = async (): Promise<string | null> => {
        try {
            const response = await api.get(`${url}${preEndpoint}${secretKey}/me`, {
                withCredentials: true
            });
            return response.data.user?.uid || null;
        } catch (error) {
            return null;
        }
    }

    static readonly isLogged = async (): Promise<boolean> => {
        try {
            const response = await api.get(`${url}${preEndpoint}${secretKey}/me`, {
                withCredentials: true
            });
            return !!response.data.user;
        } catch {
            return false;
        }
    }

    static readonly logout = async () => {
        try {
            await api.post(`${url}${preEndpoint}${secretKey}/logout`, null, {
                withCredentials: true
            });
        } catch (error: any) {
            console.error('Erro ao realizar logout:', error);
        }
        finally {
            localStorage.clear();
            window.location.href = window.location.origin;
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
            console.error("Erro ao buscar usuário por e-mail:", error);
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
            console.error("Erro ao buscar usuário por UID:", error);
        }
    }
}

export default authService;
