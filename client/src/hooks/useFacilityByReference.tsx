/**
 * Creation Date: 15/04/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { useFacility } from '../contexts/FacilityContext';

export const useFacilityByReference = (reference: string) => {
    const { facility } = useFacility();

    if (!facility) return null;

    const found = facility.find((item: any) => item.reference === reference);
    return found || null;
};
