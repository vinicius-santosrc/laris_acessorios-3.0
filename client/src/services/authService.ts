/**
 * Creation Date: 18/09/2023
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2023, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { Account, Client, Databases } from 'appwrite'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserAuthProps } from '@/lib/utils';

const endpoint = process.env.REACT_APP_API_ENDPOINT;
//const endpoint = process.env.REACT_APP_API_ENDPOINT_TEST;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

class AuthService {
    private client: Client;
    private database: Databases;

    constructor() {
        this.client = new Client();
        this.client.setEndpoint("https://cloud.appwrite.io/v1").setProject("651c17501139519bc5a2");
        this.database = new Databases(this.client);
    }

    static register = async (user: UserAuthProps) => {
        await createUserWithEmailAndPassword    (auth, user.email, user.password)
            .then(async (userCredential) => {
                await fetch(`${endpoint}${preEndpoint}${secretKey}/users/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: userCredential.user.uid,
                        nome_completo: user.nome_completo,
                        cpf: user.cpf,
                        email: user.email
                    }),
                })
                    .then((res) => {
                        window.location.href = window.location.origin;
                    })
                    .catch((err) => console.error(err))
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(error)
            });
    }

    static login = async (email: string, password: string) => {
        const client = new Client();
        client.setEndpoint("https://cloud.appwrite.io/v1").setProject("651c17501139519bc5a2");
        const account = new Account(client);

        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    static getUserData = async () => {
        const client = new Client();
        client.setEndpoint("https://cloud.appwrite.io/v1").setProject("651c17501139519bc5a2");
        const account = new Account(client);

        try {
            return await account.get();
        } catch (error) {
            console.error("Get user data error:", error);
            throw error;
        }
    }
    
    static isLogged = async () => {
        const client = new Client();
        client.setEndpoint("https://cloud.appwrite.io/v1").setProject("651c17501139519bc5a2");
        const account = new Account(client);

        try {
            if (await account.get()) {
                return true
            }
            return false;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    static logout = async () => {
        try {
            await signOut(auth);
            window.location.href = window.location.origin;
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    }
}

export default AuthService;
