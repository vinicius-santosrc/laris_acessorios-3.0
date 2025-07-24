/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/
export interface UserProps {
    cpf: string;
    cupons: string;
    cupons_usados: string;
    email: string;
    id: number;
    label: string;
    nome_completo: string;
    photoURL: string;
    uid: string;
    favorites: string;
    orders?: any;
}