/**
 * Creation Date: 18/09/2023
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2023, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { Client } from 'appwrite';
import { UserAuthProps } from '@/lib/utils';
import { UserProps } from '@/models/user';
import axios from 'axios';
import api, { getUrlByAmbient } from './api';

class AuthRepository {
    protected url: string;
    protected secretKey: string;
    protected preEndpoint: string;

    constructor() {
        this.url = getUrlByAmbient();
        this.secretKey = process.env.REACT_APP_API_SECRET_KEY ?? "";
        this.preEndpoint = process.env.REACT_APP_API_PREENDPOINT ?? "";

        const client = new Client();
        const endPointAppWrite: string | undefined = process.env.REACT_APP_API_ENDPOINT_APPWRITE;
        const projectAppWrite: string | undefined = process.env.REACT_APP_API_PROJECT_APPWRITE;
        if (endPointAppWrite && projectAppWrite) {
            client.setEndpoint(endPointAppWrite).setProject(projectAppWrite);
        }
    }

    readonly register = async (user: UserAuthProps, password: string) => {
        try {
            const response = await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/register`, {
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

    readonly login = async (email: string, password: string) => {
        try {
            const response = await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/login`, {
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

    readonly refreshToken = async () => {
        try {
            const response = await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/refreshToken`, null, {
                withCredentials: true
            });
            return response.data;
        } catch (error: any) {
            console.error("Erro ao renovar o token:", error);
            throw new Error("Falha ao renovar token.");
        }
    }

    public readonly getUserData = async (): Promise<any | null> => {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/me`, {
            withCredentials: true
        });
        return response.data.user?.uid || null;
    }

    readonly isLogged = async (): Promise<boolean> => {
        try {
            const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/me`, {
                withCredentials: true
            });
            return !!response.data.user;
        } catch {
            return false;
        }
    }

    readonly logout = async () => {
        try {
            await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/logout`, null, {
                withCredentials: true
            });
        } catch (error: any) {
            console.error('Erro ao realizar logout:', error);
        }
        finally {
            localStorage.clear();
            // window.location.href = window.location.origin;
        }
    }

    readonly getUserByEmail = async (email: string) => {
        try {
            const response = await axios.post(`${this.url}${this.preEndpoint}${this.secretKey}/user`, {
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

    readonly isUserAdmin = async (uid: string) => {
        try {
            const response = await axios.post(`${this.url}${this.preEndpoint}${this.secretKey}/userByUid`, {
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

    readonly getUserByUid = async (uid: string) => {
        try {
            const response = await axios.post(`${this.url}${this.preEndpoint}${this.secretKey}/userByUid`, {
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

export default AuthRepository;
