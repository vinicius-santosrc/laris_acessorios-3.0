/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { FacilitysRepository } from '../repositories/facilitys';
import React, { createContext, useContext, useEffect, useState } from 'react';

const FacilityContext = createContext<any | undefined>(undefined);

export const FacilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [facility, setFacility] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const facilityRepo = new FacilitysRepository();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const allFacilitys = await facilityRepo.getAll();
                setFacility(allFacilitys);
            } catch (error: any) {
                console.error("Erro ao obter dados do usuário", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <FacilityContext.Provider value={{ facility, loading }}>
            {children}
        </FacilityContext.Provider >
    );
};

export const useFacility = () => {
    const context = useContext(FacilityContext);
    if (context === undefined) {
        throw new Error('useFacility must be used within a FacilityProvider');
    }
    return context;
};