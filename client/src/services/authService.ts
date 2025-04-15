/**
 * Creation Date: 18/09/2023
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2023, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { Account, Client, Databases } from 'appwrite';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserAuthProps } from '@/lib/utils';
import { UserProps } from '@/models/user';
import axios from 'axios';
import { getUrlByAmbient } from './api';

const url = getUrlByAmbient();
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

const endPointAppWrite: string | undefined = process.env.REACT_APP_API_ENDPOINT_APPWRITE;
const projectAppWrite: string | undefined = process.env.REACT_APP_API_PROJECT_APPWRITE;

class authService {
    private client: Client;
    private database: Databases;

    constructor() {
        this.client = new Client();
        if (endPointAppWrite && projectAppWrite) {
            this.client.setEndpoint(endPointAppWrite).setProject(projectAppWrite);
        }
        this.database = new Databases(this.client);
    }

    static register = async (user: UserAuthProps) => {
        await createUserWithEmailAndPassword(auth, user.email, user.password)
            .then(async (userCredential) => {
                try {
                    await axios.post(`${url}${preEndpoint}${secretKey}/users/add`, {
                        uid: userCredential.user.uid,
                        nome_completo: user.nome_completo,
                        cpf: user.cpf,
                        email: user.email
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    window.location.href = window.location.origin;
                } catch (err) {
                    throw Error(err);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    static login = async (email: string, password: string) => {
        const client = new Client();
        if (endPointAppWrite && projectAppWrite) {
            client.setEndpoint(endPointAppWrite).setProject(projectAppWrite);
        }
        const account = new Account(client);

        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error: any) {
            console.error("Login error:", error);
            throw error;
        }
    }

    static getUserData = async () => {
        const client = new Client();
        if (endPointAppWrite && projectAppWrite) {
            client.setEndpoint(endPointAppWrite).setProject(projectAppWrite);
        }
        const account = new Account(client);
        try {
            return await account.get();
        } catch (error: any) {
            console.error("Get user data error:", error);
        }
    }

    static isLogged = async () => {
        const client = new Client();
        if (endPointAppWrite && projectAppWrite) {
            client.setEndpoint(endPointAppWrite).setProject(projectAppWrite);
        }
        const account = new Account(client);

        try {
            return await account.get() != null;
        } catch (error: any) {
        }
    }

    static logout = async () => {
        try {
            const client = new Client();
            if (endPointAppWrite && projectAppWrite) {
                client.setEndpoint(endPointAppWrite).setProject(projectAppWrite);
            }
            const account = new Account(client);

            await account.deleteSession('current');
            localStorage.clear();
            window.location.href = window.location.origin;
        } catch (error: any) {
            console.error('Erro ao realizar logout:', error);
        }
    }

    static getUserByEmail = async (email: string) => {
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

    static isUserAdmin = async (email: string) => {
        try {
            const response = await axios.post(`${url}${preEndpoint}${secretKey}/user`, {
                email: email
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
        return null;
    }
}

export default authService;