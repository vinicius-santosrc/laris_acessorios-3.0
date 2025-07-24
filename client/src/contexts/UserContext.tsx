/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthRepository from '../repositories/auth';
import { UserProps } from '../models/user';
import { OrderAfterBuyProps } from '@/models/order';
import OrderRepository from '../repositories/order';

interface UserContextType {
    user: UserProps | null;
    loading: boolean;
}

const token = process.env.REACT_APP_API_BEARER_TOKEN;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProps | null>(null);
    const [loading, setLoading] = useState(true);
    const authRepo = new AuthRepository();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let res = await authRepo.getUserData();

                if (!res) {
                    try {
                        await authRepo.refreshToken();
                        res = await authRepo.getUserData();
                    } catch (refreshError) {
                        // await authRepo.logout();
                        return;
                    }
                }

                if (!res) {
                    return;
                }

                const userContent: UserProps = await authRepo.getUserByUid(res);
                const orders: OrderAfterBuyProps[] = await OrderRepository.getByUser(userContent?.email);
                const userArray: any = { ...userContent, orders: orders };

                if (userArray.label === "Admin" && token) {
                    localStorage.setItem("token", token);
                }

                setUser(userArray);

            } catch (error: any) {
                console.error("Erro ao obter dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider >
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser  must be used within a UserProvider');
    }
    return context;
};