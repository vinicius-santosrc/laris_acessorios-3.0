import { adminService } from "../../services/adminService";
import { toaster } from "../../components/ui/toaster";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./sheetpage.css";
import { ModelDespesas, SheetItem } from "@/lib/utils";
import { Button, Input, Tabs } from "@chakra-ui/react";
import { Download, SaveIcon } from "lucide-react";
import SheetService from "../../services/sheetService";

export const SheetsPage = () => {
    const [monthlyData, setMonthlyData] = useState<any>({});
    const [totalEntradas, setTotalEntradas] = useState(0);
    const [totalSaidas, setTotalSaidas] = useState(0);

    const [saldoWrap, setSaldo] = useState(0)

    const { planilha } = useParams();

    const [AddItemOpen, setAddItemOpen] = useState(false)

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
                await adminService.deleteSheetById("planilha-despesas", JSON.stringify(item));
                loadItens();
                getTotal();
            } else if (planilha === 'planilha-itens') {
                await adminService.deleteSheetById("planilha-itens", JSON.stringify(item));
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
                    await adminService.editSheetById("planilha-itens", JSON.stringify(currentItem));
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
                    await adminService.editSheetById("planilha-despesas", JSON.stringify(currentItemDESPESAS));
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
                    await adminService.addSheetById("planilha-itens", JSON.stringify(currentItem));
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
                    await adminService.addSheetById("planilha-despesas", JSON.stringify(currentItemDESPESAS));
                    toaster.create({
                        title: "Item criado com sucesso!",
                        type: "success"
                    });
                    await loadItens();
                    getTotal();
                    setCurrentItemDESPESAS({
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
        await SheetService.export("excel", itemsData, "Produtos");
    };

    const exportFinancesToExcel = async () => {
        const financeData = await Promise.all(Object.keys(monthlyData).map(async (month) => ({
            Mês: month,
            Entradas: monthlyData[month].entradas.toFixed(2),
            Saídas: monthlyData[month].saidas.toFixed(2),
            Total: (monthlyData[month].entradas - monthlyData[month].saidas).toFixed(2),
        })));
        await SheetService.export("excel", financeData, "Finanças");
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
        await SheetService.export("excel", financeTableData, "Entradas e Despesas");
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
            const items = await adminService.getSheet("planilha-despesas");
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
            const Items = await adminService.getSheet("planilha-itens");
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
                                        <h3 id={saldoWrap?.toFixed(2) < 0 ? "saidas" : "saldoh3"}>Saldo: R$<span>{saldoWrap?.toFixed(2)}</span></h3>
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
                                                    <td>R$ {(monthlyData[month].entradas.toFixed(2) - monthlyData[month].saidas.toFixed(2)).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="newItem">
                                        <div className="headeritem">
                                            <div className="side1item">
                                                <h1>{itemId ? 'Editando' : 'Adicionar'} um Item</h1>
                                                <p>Preencha todos os dados para adicionar o item ao banco de dados.</p>
                                            </div>
                                            <div>
                                                {AddItemOpen
                                                    ?
                                                    <button onClick={() => {
                                                        setAddItemOpen(false)
                                                    }}><i className="fa-solid fa-minus"></i></button>
                                                    :
                                                    <button onClick={() => {
                                                        setAddItemOpen(true)
                                                    }}><i className="fa-solid fa-plus"></i></button>
                                                }


                                            </div>

                                        </div>
                                        {AddItemOpen
                                            ?
                                            <div className="exboxitem">
                                                <p>Descrição:</p>
                                                <input
                                                    type="text"
                                                    value={currentItemDESPESAS.descricao}
                                                    onChange={(e) => setcurrentItemDESPESAS({ ...currentItemDESPESAS, descricao: e.target.value })}
                                                />
                                                <p>Valor:</p>
                                                <input
                                                    type="number"
                                                    value={currentItemDESPESAS.valor}
                                                    onChange={(e) => setcurrentItemDESPESAS({ ...currentItemDESPESAS, valor: e.target.value })}
                                                />
                                                <p>Tipo:</p>
                                                <select
                                                    value={currentItemDESPESAS.tipo}
                                                    onChange={(e) => setcurrentItemDESPESAS({ ...currentItemDESPESAS, tipo: e.target.value })}
                                                >
                                                    <option value={'Receita'} selected>Receita</option>
                                                    <option value={'Despesa'}>Despesa</option>
                                                </select>
                                                <br />
                                                <button onClick={handleSave}>{itemId ? 'Salvar' : 'Adicionar item na tabela'}</button>
                                            </div>
                                            :
                                            null}

                                    </div>

                                    <div className="actions">
                                        <Button onClick={exportFinancesTableToExcel} display={"flex"} alignItems={"center"} gap={2}>
                                            <Download />
                                            <span>Exportar tabela de entradas/despesas para excel</span>
                                        </Button>
                                    </div>
                                    <table className="item-table-despesas">
                                        <Tabs.Root lazyMount unmountOnExit defaultValue="Tudo">
                                            <Tabs.List borderRadius={4} padding={4} display={"flex"} overflowY={"hidden"} overflowX={"auto"} gap={12}>
                                                {
                                                    Object.keys(monthlyData).map((month) => {
                                                        return (
                                                            <Tabs.Trigger value={month}>
                                                                {month}
                                                            </Tabs.Trigger>
                                                        )
                                                    })}
                                            </Tabs.List>
                                            {Object.keys(monthlyData).map((month) => {
                                                return (
                                                    <Tabs.Content className="contentTab" value={month} key={month}>
                                                        <table className="item-table item-table-despesas">
                                                            <thead className="titlecolumns">
                                                                <tr>
                                                                    <th>Descrição</th>
                                                                    <th>Valor</th>
                                                                    <th>Tipo</th>
                                                                    <th>Ações</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td id="bggray">
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Adicione um novo item"
                                                                            value={currentItemDESPESAS.descricao}
                                                                            onChange={(e) => setcurrentItemDESPESAS({ ...currentItemDESPESAS, descricao: e.target.value })}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="Escreva o valor"
                                                                            value={currentItemDESPESAS.valor}
                                                                            onChange={(e) => setcurrentItemDESPESAS({ ...currentItemDESPESAS, valor: e.target.value })}
                                                                        />
                                                                    </td>
                                                                    <td id="bggray">
                                                                        <select
                                                                            value={currentItemDESPESAS.tipo}
                                                                            onChange={(e) => setcurrentItemDESPESAS({ ...currentItemDESPESAS, tipo: e.target.value })}
                                                                        >
                                                                            <option value={'Receita'} selected>Receita</option>
                                                                            <option value={'Despesa'}>Despesa</option>
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <button onClick={handleSave}><SaveIcon width={20} /></button>
                                                                    </td>
                                                                </tr>
                                                                {monthlyData[month].items.map((item: ModelDespesas) => (
                                                                    <tr className={item.tipo === "Receita" ? "color-green-receita" : "red-color-despesa"} id={item.id.toString()} key={item.id}>
                                                                        <td id="bggray">{item.descricao}</td>
                                                                        <td>R$ {item.valor.toFixed(2)}</td>
                                                                        <td id="bggray">
                                                                            {item.tipo === 'Receita'
                                                                                ? <>
                                                                                    <i className="fa-solid fa-circle-chevron-up"></i>
                                                                                    <span>Entrada</span>
                                                                                </>
                                                                                : <>
                                                                                    <i className="fa-solid fa-circle-chevron-down"></i>
                                                                                    <span>Saída</span>
                                                                                </>
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <button onClick={() => handleEdit(item)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                                            <button onClick={() => handleDelete(item)}><i className="fa-solid fa-trash"></i></button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </Tabs.Content>
                                                )
                                            })}
                                        </Tabs.Root>

                                    </table>
                                </>}
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
                                <div className="newItem">
                                    <div className="headeritem">
                                        <div className="side1item">
                                            <h1>{itemId ? 'Editando' : 'Adicionar'} um Item</h1>
                                            <p>Preencha todos os dados para adicionar o item ao banco de dados.</p>
                                        </div>
                                        <div>
                                            {AddItemOpen
                                                ?
                                                <button onClick={() => {
                                                    setAddItemOpen(false)
                                                }}><i className="fa-solid fa-minus"></i></button>
                                                :
                                                <button onClick={() => {
                                                    setAddItemOpen(true)
                                                }}><i className="fa-solid fa-plus"></i></button>
                                            }


                                        </div>

                                    </div>
                                    {AddItemOpen
                                        ?
                                        <div className="exboxitem">
                                            <p>Código:</p>
                                            <input
                                                type="text"
                                                value={currentItem.codigo}
                                                onChange={(e) => setCurrentItem({ ...currentItem, codigo: e.target.value })}
                                            />
                                            <p>Nome do Item:</p>
                                            <input
                                                type="text"
                                                value={currentItem.nameofitem}
                                                onChange={(e) => setCurrentItem({ ...currentItem, nameofitem: e.target.value })}
                                            />
                                            <p>Detalhe:</p>
                                            <input
                                                type="text"
                                                value={currentItem.detalhe}
                                                onChange={(e) => setCurrentItem({ ...currentItem, detalhe: e.target.value })}
                                            />
                                            <p>Preço de Compra:</p>
                                            <input
                                                type="number"
                                                value={currentItem.preco_compra}
                                                onChange={(e) => setCurrentItem({ ...currentItem, preco_compra: e.target.value })}
                                            />
                                            <p>Custos:</p>
                                            <input
                                                type="number"
                                                value={currentItem.custos}
                                                onChange={(e) => setCurrentItem({ ...currentItem, custos: e.target.value })}
                                            />
                                            <p>Preço de Revenda:</p>
                                            <input
                                                type="number"
                                                value={currentItem.precorevenda}
                                                onChange={(e) => setCurrentItem({ ...currentItem, precorevenda: e.target.value })}
                                            />
                                            <p>Quantidade de Compra:</p>
                                            <input
                                                type="number"
                                                value={currentItem.quantcompra}
                                                onChange={(e) => setCurrentItem({ ...currentItem, quantcompra: e.target.value })}
                                            />
                                            <p>Lucro por Item:</p>
                                            <input
                                                type="number"
                                                value={currentItem.lucroporitem}
                                                onChange={(e) => setCurrentItem({ ...currentItem, lucroporitem: e.target.value })}
                                            />
                                            <button onClick={handleSave}>Salvar</button>
                                        </div>
                                        :
                                        null}

                                </div>


                                <div className="actions">
                                    <Button onClick={exportItemsToExcel} display={"flex"} alignItems={"center"} gap={2}>
                                        <Download />
                                        <span>Exportar para excel</span>
                                    </Button>
                                </div>
                                <table className="item-table">
                                    <thead className="titlecolumns">
                                        <tr>
                                            <th>Código</th>
                                            <th>Nome do Item</th>
                                            <th>Detalhe</th>
                                            <th>Preço de Compra</th>
                                            <th>Custos</th>
                                            <th>Preço de Revenda</th>
                                            <th>Quantidade de Compra</th>
                                            <th>Lucro por Item</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td id="bggray">
                                                <Input
                                                    type="text"
                                                    placeholder="Adicione um novo item"
                                                    value={currentItem.codigo}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, codigo: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    placeholder="Nome do item"
                                                    value={currentItem.nameofitem}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, nameofitem: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    placeholder="Detalhe"
                                                    value={currentItem.detalhe}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, detalhe: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    placeholder="Preço de compra"
                                                    value={currentItem.preco_compra}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, preco_compra: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    placeholder="Custos"
                                                    value={currentItem.custos}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, custos: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    placeholder="Preço de revenda"
                                                    value={currentItem.precorevenda}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, precorevenda: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    placeholder="Qtd. Compra"
                                                    value={currentItem.quantcompra}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, quantcompra: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    placeholder="Lucro por item"
                                                    value={currentItem.lucroporitem}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, lucroporitem: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={handleSave}><SaveIcon width={20} /></button>
                                            </td>
                                        </tr>
                                        {items.map((item: SheetItem, index) => (
                                            <tr id={item.id.toString()} key={item.id}>
                                                <td id="bggray">{item.codigo}</td>
                                                <td>{item.nameofitem}</td>
                                                <td id="bggray">{item.detalhe}</td>
                                                <td>R$ {item.preco_compra}</td>
                                                <td id="bggray">R$ {item.custos}</td>
                                                <td>R$ {item.precorevenda}</td>
                                                <td id="bggray">{item.quantcompra}</td>
                                                <td id="lucrolinha">R$ {item.lucroporitem}</td>
                                                <td>
                                                    <button onClick={() => handleEdit(item)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                    <button onClick={() => handleDeleteItem(item)}><i className="fa-solid fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>}
                    </div>
                </div>
            </div>
        </section>
    )
}