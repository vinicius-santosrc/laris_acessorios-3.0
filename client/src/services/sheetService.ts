import * as XLSX from 'xlsx';

class SheetService {
    constructor() { }

    static async export(type: "excel", data: any[], filename: string) {
        try {
            if (type === 'excel') {
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, `${filename}`);
                XLSX.writeFile(workbook, `LARIS ACESSORIOS - Planilha ${filename}.xlsx`);
            }
            else {
                alert("Método inválido de exportação");
            }
        } catch (error) {
            console.error("Erro ao exportar:", error);
        }
    }
}

export default SheetService;