import { adminService } from '../services/adminService';
import React, { createContext, useContext, useEffect, useState } from 'react';

const MenuItemsContext = createContext<any | undefined>(undefined);

export const MenuItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [menuItems, setMenuItems] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await adminService.getMenuItems();
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