import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { UserProps } from '../models/user';
import { OrderAfterBuyProps } from '@/models/order';
import { orderService } from '../services/orderService';

interface UserContextType {
    user: UserProps | null;
    loading: boolean;
}

const token = process.env.REACT_APP_API_BEARER_TOKEN;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await authService.getUserData();
                const userContent: UserProps = await authService.getUserByUid(res || "");
                const orders: OrderAfterBuyProps[] = await orderService.getByUser(userContent?.email);
                const userArray: any = { ...userContent, orders: orders };
                if (userArray.label === "Admin") if (token) localStorage.setItem("token", token);
                console.log(res)
                if (!res || !userContent) {
                    return;
                }
                setUser(userArray);
            } catch (error: any) {
                console.error("Erro ao obter dados do usuário", error);
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