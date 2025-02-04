import { adminService } from "../../services/adminService";
import { toaster } from "../../components/ui/toaster";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CardItem from "../../components/admin/planning/CardItem"; // Importando o novo componente CardItem
import "./planning.css";

export const Planing = () => {
    const [boxCreateNewVisible, setboxCreateNewVisible] = useState(false);
    const [ContentCards, setContentCards] = useState<any[]>([]);
    const [NameOfNewList, setNameOfNewList] = useState<string | null>(null);
    const [newItems, setNewItems] = useState('');

    useEffect(() => {
        getCards();
        const interval = setInterval(getCards, 5000);
        return () => clearInterval(interval);
    }, []);

    // Funções do CRUD
    async function deleteThatCard(id: any) {
        try {
            await adminService.planningDeleteById(id);
            getCards();
        } catch (error) {
            toaster.create({
                title: "Oops...",
                description: "Algo deu errado. Contate um desenvolvedor.",
                type: "error"
            });
            getCards();
        }
    }

    async function createNewList() {
        if (NameOfNewList) {
            try {
                await adminService.addNewPlanningCard(NameOfNewList);
                getCards();
                setNameOfNewList(null);
            } catch (error) {
                toaster.create({
                    title: "Oops...",
                    description: "Algo deu errado. Contate um desenvolvedor.",
                    type: "error"
                });
            }
        } else {
            toaster.create({
                title: "ERRO!",
                description: "Preencha o nome da lista.",
                type: "error"
            });
        }
    }

    async function addListDB(id: any, content_card: any) {
        const itensantigos = JSON.parse(content_card);
        if (!newItems) return;

        const list = content_card !== "[]" ? [...itensantigos, newItems] : [newItems.toString()];

        try {
            await adminService.updatedCard(list, id);
            getCards();
        } catch (error) {
            toaster.create({
                title: "Oops...",
                description: "Algo deu errado. Contate um desenvolvedor.",
                type: "error"
            });
        }
    }

    async function removeAtt(index: number, id: any, content_card: string) {
        const contentCardArray = JSON.parse(content_card);
        if (index >= 0 && index < contentCardArray.length) {
            contentCardArray.splice(index, 1);
            try {
                await adminService.updatedCard(contentCardArray, id);
                getCards();
            } catch (error) {
                toaster.create({
                    title: "Oops...",
                    description: "Algo deu errado. Contate um desenvolvedor.",
                    type: "error"
                });
            }
        }
    }

    async function getCards() {
        try {
            const response = await adminService.getPlanning();
            setContentCards(response);
        } catch (error) {
            console.log(error);
        }
    }

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const sourceCardIndex = result.source.droppableId;
        const destinationCardIndex = result.destination.droppableId;

        const sourceCard = ContentCards[sourceCardIndex];
        const destinationCard = ContentCards[destinationCardIndex];

        const sourceItems = JSON.parse(sourceCard.content_card);
        const destinationItems = JSON.parse(destinationCard.content_card);

        const [movedItem] = sourceItems.splice(result.source.index, 1);
        destinationItems.splice(result.destination.index, 0, movedItem);

        // Atualizar o estado local
        const updatedCards: any = [...ContentCards];
        updatedCards[sourceCardIndex].content_card = sourceItems;
        updatedCards[destinationCardIndex].content_card = destinationItems;

        setContentCards(updatedCards);

        // Atualizar o banco de dados
        try {
            await adminService.updatedCard(updatedCards[sourceCardIndex].content_card, updatedCards[sourceCardIndex].id);
            await adminService.updatedCard(updatedCards[destinationCardIndex].content_card, updatedCards[destinationCardIndex].id);

            await getCards();
        } catch (error) {
            toaster.create({
                title: "Oops...",
                description: "Erro ao atualizar o banco de dados.",
                type: "error"
            });
        }
    };

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="Planejamentos-Card-Wrapper">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {ContentCards.map((cards: any, index: number) => (
                            <Droppable key={cards.id} droppableId={index.toString()} isDropDisabled={false}>
                                {(provided: any) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="Card-Wrapper">
                                        <div className="Card-Wrapper-Top">
                                            <h3>{cards.name_card}</h3>
                                            <button onClick={() => deleteThatCard(cards.id)}><i className="fa-solid fa-trash-can"></i></button>
                                        </div>
                                        <div className="Content-Card">
                                            {(() => {
                                                let parsedContent;
                                                try {
                                                    parsedContent = JSON.parse(cards.content_card);
                                                } catch (error) {
                                                    console.error("Erro ao analisar content_card:", error);
                                                    parsedContent = []; // valor padrão
                                                }
                                                return parsedContent.map((item: any, i: any) => (
                                                    <CardItem key={i} index={i} item={item} removeItem={() => removeAtt(i, cards.id, cards.content_card)} />
                                                ));
                                            })()}
                                        </div>
                                        <div className="bottom_create">
                                            <div className="createshowcreate">
                                                <input
                                                    type="text"
                                                    placeholder="Insira o conteúdo do cartão..."
                                                    onChange={(e) => setNewItems(e.target.value)}
                                                />
                                                <div className="contentcreatebutton">
                                                    <button onClick={() => addListDB(cards.id, cards.content_card)}>Adicionar cartão</button>
                                                    <button id="closecreatecardbtn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#0F172A" />
                                                    </svg></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </DragDropContext>
                    {boxCreateNewVisible ?
                        <div className="Card-CreateNew">
                            <input onChange={(v) => setNameOfNewList(v.target.value)} value={NameOfNewList} type="text" placeholder="Insira o título da lista..." />
                            <div className="flex-box-wrapper-createnew">
                                <button onClick={createNewList}>Adicionar Lista</button>
                                <button onClick={() => setboxCreateNewVisible(false)} id="closelist"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#0F172A" />
                                </svg></button>
                            </div>
                        </div>
                        :
                        <div className="Card-CreateNewStart">
                            <button onClick={() => setboxCreateNewVisible(true)}><i className="fa-solid fa-plus"></i> Adicionar uma lista</button>
                        </div>
                    }
                </div>
            </div>
        </section>
    );
};