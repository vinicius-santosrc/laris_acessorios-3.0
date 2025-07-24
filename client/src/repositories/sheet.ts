/**
 * Creation Date: 27/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import * as XLSX from 'xlsx';

class SheetRepository {
    private exportToExcel(data: any[], filename: string) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, filename);
        XLSX.writeFile(workbook, `LARIS ACESSORIOS - Planilha ${filename}.xlsx`);
    }

    async export(type: "excel", data: any[], filename: string) {
        try {
            switch (type) {
                case "excel":
                    this.exportToExcel(data, filename);
                    break;
                default:
                    throw new Error(`Tipo de exportação '${type}' não suportado.`);
            }
        } catch (error) {
            console.error("Erro ao exportar:", error);
            throw error;
        }
    }
}

export default SheetRepository;