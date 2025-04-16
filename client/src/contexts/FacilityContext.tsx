import { Facilitys } from '../services/facilitysService';
import React, { createContext, useContext, useEffect, useState } from 'react';

const FacilityContext = createContext<any | undefined>(undefined);

export const FacilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [facility, setFacility] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const allFacilitys = await Facilitys.getAll();
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