import { adminService } from "../../services/adminService";
import { toaster } from "../../components/ui/toaster";
import { useEffect, useState } from "react";
import "./planning.css";

export const Planing = () => {
    const [boxCreateNewVisible, setboxCreateNewVisible] = useState(false);
    const [ContentCards, setContentCards] = useState([]);
    const [NameOfNewList, setNameOfNewList] = useState<any>(null);
    const [createCardOpen, setCreateCardOpen] = useState(false); // Novo estado
    const [newItems, setNewItems] = useState<any>(null); // Novo estado para os itens a lista
    const [localNewItems, setLocalNewItems] = useState('');

    const secretKey = process.env.REACT_APP_API_SECRET_KEY;
    const endpoint = process.env.REACT_APP_API_ENDPOINT;
    const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

    useEffect(() => {
        getCards()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            getCards()
        }, 5000);
    })

    async function deleteThatCard(id: any) {
        try {
            await adminService.planningDeleteById(id).then((r) => {
                getCards()
            })
        }
        catch (error) {
            toaster.create({
                title: "Oops...",
                description: "Algo deu errado. Contate um desenvolvedor.",
                type: "error"
            })
            getCards()
        }
    }

    async function createNewList() {
        if (NameOfNewList) {
            try {
                // Faça algo com imageUrls, se necessário
                await adminService.addNewPlanningCard(NameOfNewList).then(() => {
                    getCards();
                    setNameOfNewList(null);
                })
            } catch (error) {
                toaster.create({
                    title: "Oops...",
                    description: "Algo deu errado. Contate um desenvolvedor.",
                    type: "error"
                })
            }
        }
        else (
            toaster.create({
                title: "ERRO!",
                description: "Preencha o nome da lista.",
                type: "error"
            })
        )
    }
    function toggleCreateCard() {
        {
            createCardOpen ?
                setCreateCardOpen(false)
                :
                setCreateCardOpen(true)
        }

    }



    async function addListDB(id: any, content_card: any) {

        const itensantigos = JSON.parse(content_card)

        if (!newItems) {
            return
        }

        if (content_card != "[]") {
            try {
                const list = [...itensantigos]
                list.push(newItems)
                await adminService.updatedCard(list, id).then((r: any) => {
                    getCards()
                })
            }
            catch (error) {
                toaster.create({
                    title: "Oops...",
                    description: "Algo deu errado. Contate um desenvolvedor.",
                    type: "error"
                })
            }
        }
        else {
            try {
                const list = []
                list.push(newItems.toString())
                fetch(`${endpoint}${preEndpoint}${secretKey}/planejamentos/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: id,
                        list: list
                    }),
                })
                    .then((r) => {
                        getCards()
                    })
            }
            catch (error) {
                toaster.create({
                    title: "Oops...",
                    description: "Algo deu errado. Contate um desenvolvedor.",
                    type: "error"
                })
            }
        }
    }

    async function removeAtt(a: any, id: any, content_card: any) {

        const contentCardArray = JSON.parse(content_card);

        if (a >= 0 && a < contentCardArray.length) {
            // Remova o item da matriz
            contentCardArray.splice(a, 1);

            // Atualize o documento no banco de dados com a nova matriz 'content_card'
            try {
                fetch(`${endpoint}${preEndpoint}${secretKey}/planejamentos/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: id,
                        list: contentCardArray
                    }),
                })
            }
            catch (error) {
                toaster.create({
                    title: "Oops...",
                    description: "Algo deu errado. Contate um desenvolvedor.",
                    type: "error"
                })
            }
            // Atualize o estado ContentCards (se necessário)
            getCards();
        }



    }

    async function getCards() {
        try {
            const response = await adminService.getPlanning()
            setContentCards(response)
        }
        catch (error) {
            console.log(error)
        }
    }



    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="Planejamentos-Card-Wrapper">
                    <div className="Content-Planejamentos-Card-Wrapper">

                        {ContentCards.map((cards: any, index: number) => (
                            <div className="Card-Wrapper" id={index.toString()} key={index}>
                                <div className="Card-Wrapper-Top">
                                    <h3>{cards.name_card}</h3>
                                    <button onClick={() => {
                                        deleteThatCard(cards.id)
                                    }}><i className="fa-solid fa-trash-can"></i></button>
                                </div>
                                <div className="Content-Card">
                                    {JSON.parse(cards.content_card).map((r: any, i: number) => {
                                        return (
                                            <div className="flexbox-content" key={i}>
                                                <div className="contents-card">
                                                    {r}
                                                </div>
                                                <button onClick={() => {
                                                    removeAtt(i, cards.id, cards.content_card)
                                                }} id={i.toString()} key={i}><i className="fa-solid fa-minus"></i></button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="bottom_create">
                                    <div className="createshowcreate">
                                        <input
                                            type="text"
                                            placeholder="Insira o conteúdo do cartão..."
                                            value={newItems} // Use o valor do estado para refletir o conteúdo atual
                                            onChange={(e) =>
                                                setNewItems(e.target.value)
                                            } // Atualize o estado conforme o usuário digita
                                        />
                                        <div className="contentcreatebutton">
                                            <button onClick={() => {
                                                addListDB(cards.id, cards.content_card)
                                            }}>Adicionar cartão</button>
                                            <button id="closecreatecardbtn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#0F172A" />
                                            </svg>
                                            </button>
                                        </div>

                                    </div>


                                </div>
                            </div>
                        ))}
                        {boxCreateNewVisible ?
                            <div className="Card-CreateNew">
                                <input onChange={(v) => {
                                    setNameOfNewList(v.target.value)
                                }} value={NameOfNewList} type="text" placeholder="Insira o título da lista..." />
                                <div className="flex-box-wrapper-createnew">
                                    <button onClick={createNewList}>Adicionar Lista</button>
                                    <button onClick={() => {
                                        setboxCreateNewVisible(false)
                                    }} id="closelist"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#0F172A" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            :
                            <div className="Card-CreateNewStart">
                                <button onClick={() => {
                                    setboxCreateNewVisible(true)
                                }}><i className="fa-solid fa-plus"></i> Adicionar uma lista</button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </section>
    )
}