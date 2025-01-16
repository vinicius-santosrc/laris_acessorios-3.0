import { adminService } from "../../services/adminService";
import { toaster } from "../../components/ui/toaster";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./sheetpage.css";
import { ModelDespesas, SheetItem } from "@/lib/utils";
import { Input, Select, Tabs } from "@chakra-ui/react";
import { SaveIcon } from "lucide-react";

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
    }, []);

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

    const handleDelete = (item: any) => {
        if (!item.id) {
            toaster.create({
                title: "Oops...",
                description: "O item não possui um ID válido para exclusão! Contate um desenvolvedor.",
                type: "error"
            })
            getTotal();
            return;
        }

        if (planilha == 'planilha-despesas') {
            adminService.deleteSheetById("planilha-despesas", JSON.stringify(item)).then(() => {
                loadItens();
                getTotal();
            })
                .catch(() => {
                    toaster.create({
                        title: "Oops...",
                        description: "O item não possui um ID válido para exclusão! Contate um desenvolvedor.",
                        type: "error"
                    })
                });
        }
        else if (planilha == 'planilha-itens') {
            adminService.deleteSheetById("planilha-itens", JSON.stringify(item)).then(() => {
                loadItens();
            })
                .catch(() => {
                    toaster.create({
                        title: "Oops...",
                        description: "O item não possui um ID válido para exclusão! Contate um desenvolvedor.",
                        type: "error"
                    })
                });
        }

    };

    const handleSave = () => {
        if (planilha == "planilha-itens") {
            if (!currentItem.codigo || !currentItem.nameofitem || !currentItem.detalhe || !currentItem.preco_compra || !currentItem.custos || !currentItem.precorevenda || !currentItem.quantcompra || !currentItem.lucroporitem) {
                toaster.create({
                    title: "Preencha todos os campos!",
                })
                return;
            }
        }

        else if (planilha == "planilha-despesas") {
            if (!currentItemDESPESAS.descricao || !currentItemDESPESAS.valor || !currentItemDESPESAS.tipo) {
                toaster.create({
                    title: "Preencha todos os campos!",
                })
                return;
            }
        }

        if (itemId) {
            // Atualize o item no Appwrite
            if (planilha == "planilha-itens") {
                adminService.editSheetById("planilha-itens", JSON.stringify(currentItem)).then(() => {
                    loadItens();
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
                })
                    .catch(() => {
                        toaster.create({
                            title: "Oops...",
                            description: "O item não pode ser salvo. Contate um desenvolvedor.",
                            type: "error"
                        })

                    });
            }
            else if (planilha == "planilha-despesas") {
                //EDITAR LINHA
                adminService.editSheetById("planilha-despesas", JSON.stringify(currentItemDESPESAS)).then(() => {
                    loadItens();
                    getTotal();
                    setcurrentItemDESPESAS({
                        descricao: "",
                        valor: "",
                        tipo: "Receita"
                    });
                    setItemId(null);

                })
                    .catch(() => {
                        toaster.create({
                            title: "Oops...",
                            description: "O item não pode ser salvo. Contate um desenvolvedor.",
                            type: "error"
                        })

                    });
            }
        } else {
            // Crie um novo item no Appwrite sem especificar o ID
            if (planilha == "planilha-itens") {
                adminService.addSheetById("planilha-itens", JSON.stringify(currentItem)).then(() => {
                    toaster.create({
                        title: "Item criado com sucesso!",
                        type: "sucess"
                    })
                    loadItens();
                    setCurrentItem({
                        codigo: "",
                        nameofitem: "",
                        detalhe: "",
                        preco_compra: "",
                        custos: "",
                        precorevenda: "",
                        quantcompra: "",
                        lucroporitem: "",
                        // Certifique-se de redefinir o ID
                    });
                })
                    .catch(() => {
                        toaster.create({
                            title: "Oops...",
                            description: "O item não pode ser criado. Contate um desenvolvedor.",
                            type: "error"
                        })
                    });
            }
            else if (planilha == "planilha-despesas") {
                //ADICIONAR LINHA
                adminService.addSheetById("planilha-despesas", JSON.stringify(currentItemDESPESAS)).then(() => {
                    toaster.create({
                        title: "Item criado com sucesso!",
                        type: "sucess"
                    })
                    loadItens();
                    getTotal();
                    setCurrentItem({
                        descricao: "",
                        valor: "",
                        tipo: "",
                        // Certifique-se de redefinir o ID
                    });
                })
                    .catch(() => {
                        toaster.create({
                            title: "Oops...",
                            description: "O item não pode ser criado. Contate um desenvolvedor.",
                            type: "error"
                        })
                    });
            }
        }
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
                                        <h1>Esse mês</h1>
                                        <h3>Entradas: R$<span id="entradas">{totalEntradas?.toFixed(2)}</span></h3>
                                        <h3>Saídas: R$<span id="saidas">{totalSaidas?.toFixed(2)}</span></h3>
                                        <h3 id="saldoh3">Saldo: R$<span>{saldoWrap?.toFixed(2)}</span></h3>
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


                                    <table className="item-table-despesas">
                                        <Tabs.Root lazyMount unmountOnExit defaultValue="Tudo">
                                            <Tabs.List>
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
                                                                        <button onClick={handleSave}><SaveIcon width={20}/></button>
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
                        {planilha == "planilha-despesas"
                            ?
                            <div className="Planilha-404-NotFound">
                                <img src={window.location.origin + "/static/media/admin-images/undraw_void_-3-ggu.svg"} />
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