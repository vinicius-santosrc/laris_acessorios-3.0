/**
 * Creation Date: 18/09/2023
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2023, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { Account, Client, Databases } from 'appwrite'
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

class AuthService {
    private client: Client;
    private database: Databases;

    constructor() {
        this.client = new Client();
        this.client.setEndpoint("https://cloud.appwrite.io/v1").setProject("651c17501139519bc5a2");
        this.database = new Databases(this.client);
    }

    static login = async (email: string, password: string) => {
        const client = new Client();
        client.setEndpoint("https://cloud.appwrite.io/v1").setProject("651c17501139519bc5a2");
        const account = new Account(client);

        try {
            return await account.createSession(email, password);
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
