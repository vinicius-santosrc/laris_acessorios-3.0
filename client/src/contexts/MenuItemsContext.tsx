/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import AdminRepository from '../repositories/admin';
import React, { createContext, useContext, useEffect, useState } from 'react';

const MenuItemsContext = createContext<any | undefined>(undefined);

export const MenuItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [menuItems, setMenuItems] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const adminRepo = new AdminRepository();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await adminRepo.getMenuItems();
                setMenuItems(data);
            } catch (error: any) {
                console.error("Erro ao obter dados do usuário", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    return (
        <MenuItemsContext.Provider value={{ menuItems, loading }}>
            {children}
        </MenuItemsContext.Provider >
    );
};

export const useMenuItems = () => {
    const context = useContext(MenuItemsContext);
    if (context === undefined) {
        throw new Error('useMenuItems must be used within a MenuItemsProvider');
    }
    return context;
};