/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import AdminRepository from "../../repositories/admin";
import GenericTable from "../../components/geral/generic-table/GenericTableComponent";
import { toaster } from "../../components/ui/toaster";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./sheetpage.css";
import { Button } from "@chakra-ui/react";
import { Download } from "lucide-react";
import SheetRepository from "../../repositories/sheet";

export const SheetsPage = () => {
    const [monthlyData, setMonthlyData] = useState<any>({});
    const [totalEntradas, setTotalEntradas] = useState(0);
    const [totalSaidas, setTotalSaidas] = useState(0);

    const [saldoWrap, setSaldo] = useState(0)

    const { planilha } = useParams();

    const [AddItemOpen, setAddItemOpen] = useState(false)

    const adminRepo = new AdminRepository();
    const sheetsRepo = new SheetRepository();

    const [items, setItems] = useState([]);
    const [itemId, setItemId] = useState(null)
    const [currentItem, setCurrentItem] = useState<any>({
        codigo: "",
        nameofitem: "",
        detalhe: "",
        preco_compra: "",
        custos: "",
        precorevenda: "",
        quantcompra: "",
        lucroporitem: "",
    });

    const [currentItemDESPESAS, setcurrentItemDESPESAS] = useState({
        descricao: "",
        valor: "",
        tipo: "Receita"
    });

    useEffect(() => {
        getTotal();
        loadItens();
    }, [planilha]);

    async function getTotal() {
        calculateTotals(monthlyData)
    }

    const handleEdit = (item: any) => {
        setCurrentItem(item);
        setcurrentItemDESPESAS(item);
        setItemId(item.id)
        setAddItemOpen(true)
        getTotal();
    };

    const handleDelete = async (item: any) => {
        if (!item.id) {
            toaster.create({
                title: "Oops...",
                description: "O item não possui um ID válido para exclusão! Contate um desenvolvedor.",
                type: "error"
            });
            getTotal();
            return;
        }

        try {
            if (planilha === 'planilha-despesas') {
                await adminRepo.deleteSheetById("planilha-despesas", JSON.stringify(item));
                loadItens();
                getTotal();
            } else if (planilha === 'planilha-itens') {
                await adminRepo.deleteSheetById("planilha-itens", JSON.stringify(item));
                loadItens();
            }
        } catch (error) {
            toaster.create({
                title: "Oops...",
                description: "O item não pode ser excluído. Contate um desenvolvedor.",
                type: "error"
            });
        }
    };

    const handleSaveAll = async (loadData: any) => {
        try {
            if (planilha === "planilha-itens") {
                if (loadData.length === 0) {
                    toaster.create({ title: "Nenhum item para salvar!" });
                    return;
                }

                for (const item of loadData) {
                    // Se o item já tiver ID, atualiza, senão cria
                    if (item.id) {
                        await adminRepo.editSheetById("planilha-itens", JSON.stringify(item));
                    } else {
                        await adminRepo.addSheetById("planilha-itens", JSON.stringify(item));
                    }
                }

                toaster.create({ title: "Todos os itens foram salvos com sucesso!", type: "success" });
                await loadItens();
            } else if (planilha === "planilha-despesas") {
                if (loadData.length === 0) {
                    toaster.create({ title: "Nenhum item para salvar!" });
                    return;
                }

                for (const item of loadData) {
                    if (item.id) {
                        await adminRepo.editSheetById("planilha-despesas", JSON.stringify(item));
                    } else {
                        await adminRepo.addSheetById("planilha-despesas", JSON.stringify(item));
                    }
                }

                toaster.create({ title: "Todos os itens foram salvos com sucesso!", type: "success" });
                await loadItens();
                getTotal();
            }
        } catch (error) {
            toaster.create({
                title: "Oops...",
                description: "Algum item não pôde ser salvo. Contate um desenvolvedor.",
                type: "error"
            });
        }
    };

    const handleSave = async () => {
        if (planilha === "planilha-itens") {
            if (!currentItem.codigo || !currentItem.nameofitem || !currentItem.detalhe || !currentItem.preco_compra || !currentItem.custos || !currentItem.precorevenda || !currentItem.quantcompra || !currentItem.lucroporitem) {
                toaster.create({
                    title: "Preencha todos os campos!",
                });
                return;
            }
        } else if (planilha === "planilha-despesas") {
            if (!currentItemDESPESAS.descricao || !currentItemDESPESAS.valor || !currentItemDESPESAS.tipo) {
                toaster.create({
                    title: "Preencha todos os campos!",
                });
                return;
            }
        }

        try {
            if (itemId) {
                // Atualize o item no Appwrite
                if (planilha === "planilha-itens") {
                    await adminRepo.editSheetById("planilha-itens", JSON.stringify(currentItem));
                    await loadItens();
                    setCurrentItem({
                        codigo: "",
                        nameofitem: "",
                        detalhe: "",
                        preco_compra: "",
                        custos: "",
                        precorevenda: "",
                        quantcompra: "",
                        lucroporitem: "",
                    });
                    setItemId(null);
                } else if (planilha === "planilha-despesas") {
                    await adminRepo.editSheetById("planilha-despesas", JSON.stringify(currentItemDESPESAS));
                    await loadItens();
                    getTotal();
                    setcurrentItemDESPESAS({
                        descricao: "",
                        valor: "",
                        tipo: "Receita"
                    });
                    setItemId(null);
                }
            } else {
                // Crie um novo item no Appwrite sem especificar o ID
                if (planilha === "planilha-itens") {
                    await adminRepo.addSheetById("planilha-itens", JSON.stringify(currentItem));
                    toaster.create({
                        title: "Item criado com sucesso!",
                        type: "success"
                    });
                    await loadItens();
                    setCurrentItem({
                        codigo: "",
                        nameofitem: "",
                        detalhe: "",
                        preco_compra: "",
                        custos: "",
                        precorevenda: "",
                        quantcompra: "",
                        lucroporitem: "",
                    });
                } else if (planilha === "planilha-despesas") {
                    await adminRepo.addSheetById("planilha-despesas", JSON.stringify(currentItemDESPESAS));
                    toaster.create({
                        title: "Item criado com sucesso!",
                        type: "success"
                    });
                    await loadItens();
                    getTotal();
                    setcurrentItemDESPESAS({
                        descricao: "",
                        valor: "",
                        tipo: "",
                    });
                }
            }
        } catch (error) {
            toaster.create({
                title: "Oops...",
                description: "O item não pode ser salvo. Contate um desenvolvedor.",
                type: "error"
            });
        }
    };

    const exportItemsToExcel = async () => {
        const itemsData = await Promise.all(items.map(async (item: any) => ({
            "Código": item.codigo,
            "Nome": item.nameofitem,
            "Detalhe": item.detalhe,
            "Preço de Compra": item.preco_compra,
            "Custos": item.custos,
            "Preço de Revenda": item.precorevenda,
            "Quantidade de Compra": item.quantcompra,
            "Lucro por Item": item.lucroporitem,
        })));
        await sheetsRepo.export("excel", itemsData, "Produtos");
    };

    const exportFinancesToExcel = async () => {
        const financeData = await Promise.all(Object.keys(monthlyData).map(async (month) => ({
            Mês: month,
            Entradas: monthlyData[month].entradas.toFixed(2),
            Saídas: monthlyData[month].saidas.toFixed(2),
            Total: (monthlyData[month].entradas - monthlyData[month].saidas).toFixed(2),
        })));
        await sheetsRepo.export("excel", financeData, "Finanças");
    };

    const exportFinancesTableToExcel = async () => {
        const financeTableData: any[] = [];
        Object.keys(monthlyData).forEach(month => {
            monthlyData[month].items.forEach((item: any) => {
                financeTableData.push({
                    "Descrição": item.descricao,
                    "Valor": item.valor.toFixed(2),
                    "Tipo": item.tipo,
                });
            });
        });
        await sheetsRepo.export("excel", financeTableData, "Entradas e Despesas");
    };

    const calculateTotals = (groupedData: any) => {
        let entradas = 0;
        let saidas = 0;

        entradas = groupedData["Tudo"]?.entradas;
        saidas = groupedData["Tudo"]?.saidas;

        setTotalEntradas(entradas);
        setTotalSaidas(saidas);
        setSaldo(entradas - saidas);
    };

    const loadItens = async () => {
        if (planilha === 'planilha-despesas') {
            const items = await adminRepo.getSheet("planilha-despesas");
            const groupedData: any = { "Tudo": { entradas: 0, saidas: 0, items: [] } };

            items.forEach((item: any) => {
                groupedData["Tudo"].items.push(item);
                if (item.tipo === "Receita") {
                    groupedData["Tudo"].entradas += Number(item.valor);
                } else {
                    groupedData["Tudo"].saidas += Number(item.valor);
                }

                const month = new Date(item.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
                if (!groupedData[month]) {
                    groupedData[month] = { entradas: 0, saidas: 0, items: [] };
                }
                if (item.tipo === "Receita") {
                    groupedData[month].entradas += Number(item.valor);
                } else {
                    groupedData[month].saidas += Number(item.valor);
                }
                groupedData[month].items.push(item);
            });

            setMonthlyData(groupedData);
            calculateTotals(groupedData);
        }
        else if (planilha == 'planilha-itens') {
            const Items = await adminRepo.getSheet("planilha-itens");
            setItems(Items)
        }
    };

    if (planilha == 'planilha-despesas') {
        return (
            <section className="dashboard-laris-acessorios">
                <div className="dashboard-content">
                    <div className="AdminPage-DashBoard">
                        <div className="Admin-ContentDashBoard">
                            {planilha != "planilha-despesas"
                                ?
                                <div className="Planilha-404-NotFound">
                                    <img src={window.location.origin + "/static/media/admin-images/undraw_void_-3-ggu.svg"} alt="Sem Planilha" />
                                    <h1>Nenhuma planilha foi encontrada.</h1>
                                    <p>Entre em contato com o desenvolvedor ou tente novamente mais tarde.</p>
                                </div>
                                :
                                <>
                                    <div className="newItem">
                                        <h1>Total</h1>
                                        <h3>Entradas: R$<span id="entradas">{totalEntradas?.toFixed(2)}</span></h3>
                                        <h3>Saídas: R$<span id="saidas">{totalSaidas?.toFixed(2)}</span></h3>
                                        <h3 id={Number(saldoWrap?.toFixed(2)) < 0 ? "saidas" : "saldoh3"}>Saldo: R$<span>{saldoWrap?.toFixed(2)}</span></h3>
                                    </div>
                                    <div className="actions">
                                        <Button onClick={exportFinancesToExcel} display={"flex"} alignItems={"center"} gap={2}>
                                            <Download />
                                            <span>Exportar tabela de saldo para excel</span>
                                        </Button>
                                    </div>
                                    <table className="item-table item-table-despesas-top">
                                        <thead className="titlecolumns">
                                            <tr>
                                                <th>Mês</th>
                                                <th>Entradas</th>
                                                <th>Saídas</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(monthlyData).map(month => (
                                                <tr key={month}>
                                                    <td>{month}</td>
                                                    <td>R$ {monthlyData[month].entradas.toFixed(2)}</td>
                                                    <td>R$ {monthlyData[month].saidas.toFixed(2)}</td>
                                                    <td>R$ {(monthlyData[month].entradas - monthlyData[month].saidas).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="actions">
                                        <Button onClick={exportFinancesTableToExcel} display={"flex"} alignItems={"center"} gap={2}>
                                            <Download />
                                            <span>Exportar tabela de entradas/despesas para excel</span>
                                        </Button>
                                    </div>
                                    <GenericTable
                                        columns={[
                                            { label: "Descrição", key: "descricao", type: "text" },
                                            { label: "Valor", key: "valor", type: "number" },
                                            { label: "Tipo", key: "tipo", type: [{ label: "Receita", value: "Receita" }, { label: "Despesa", value: "Despesa" }] }
                                        ]}
                                        data={monthlyData["Tudo"]?.items || []}
                                        currentItem={currentItemDESPESAS}
                                        setCurrentItem={setcurrentItemDESPESAS}
                                        onSave={handleSave}
                                        onSaveAll={handleSaveAll}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        inputPlaceholders={{
                                            descricao: "Adicione uma descrição",
                                            valor: "Digite o valor",
                                            tipo: "Tipo (Receita ou Despesa)"
                                        }}
                                        addItemOpen={AddItemOpen}
                                        setAddItemOpen={setAddItemOpen}
                                        actions={true}
                                    />
                                </>
                            }
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    function handleDeleteItem(item: any) {
        handleDelete(item)
    }


    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="AdminPage-DashBoard">
                    <div className="Admin-ContentDashBoard">
                        {planilha != "planilha-despesas" && planilha != "planilha-itens"
                            ?
                            <div className="Planilha-404-NotFound">
                                <img src={"https://laris-acessorios.vercel.app" + "/static/media/admin-images/undraw_void_-3-ggu.svg"} />
                                <h1>Nenhuma planilha foi encontrada.</h1>
                                <p>Entre em contato com o desenvolvedor ou tente novamente mais tarde.</p>
                            </div>
                            :
                            <>
                                <div className="actions">
                                    <Button onClick={exportItemsToExcel} display={"flex"} alignItems={"center"} gap={2}>
                                        <Download />
                                        <span>Exportar para excel</span>
                                    </Button>
                                </div>
                                <GenericTable
                                    columns={[
                                        { label: "Código", key: "codigo", type: "text" },
                                        { label: "Nome do Item", key: "nameofitem", type: "text" },
                                        { label: "Detalhe", key: "detalhe", type: "text" },
                                        { label: "Preço de Compra", key: "preco_compra", type: "number" },
                                        { label: "Custos", key: "custos", type: "number" },
                                        { label: "Preço de Revenda", key: "precorevenda", type: "number" },
                                        { label: "Quantidade de Compra", key: "quantcompra", type: "number" },
                                        { label: "Lucro por Item", key: "lucroporitem", type: "number" }
                                    ]}
                                    data={items}
                                    currentItem={currentItem}
                                    setCurrentItem={setCurrentItem}
                                    onSave={handleSave}
                                    onSaveAll={handleSaveAll}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteItem}
                                    inputPlaceholders={{
                                        codigo: "Adicione um novo item",
                                        nameofitem: "Nome do item",
                                        detalhe: "Detalhe",
                                        preco_compra: "Preço de compra",
                                        custos: "Custos",
                                        precorevenda: "Preço de revenda",
                                        quantcompra: "Qtd. Compra",
                                        lucroporitem: "Lucro por item"
                                    }}
                                    addItemOpen={AddItemOpen}
                                    setAddItemOpen={setAddItemOpen}
                                    actions={true}
                                />
                            </>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}