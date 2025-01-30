import { OrderAfterBuyProps } from "../../models/order";
import { orderService } from "../../services/orderService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./accountOrders.css"; // Estilos para página
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from "../../components/ui/timeline";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu";
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsRoot } from "../../components/ui/steps";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";

const AccountOrders = () => {
    const [orderAtual, setOrderAtual] = useState<OrderAfterBuyProps | null>(null);
    const { order } = useParams(); // Pega o ID do pedido da URL
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Preparando", "Enviado", "Entregue"];

    useEffect(() => {
        getOrderAtual();
    }, [order]);

    async function getOrderAtual() {
        try {
            if (order) {
                const fetchedOrder = await orderService.getById(order);
                setOrderAtual(fetchedOrder);
            }
        } catch (error) {
            console.error("Erro ao carregar o pedido:", error);
        }
    }

    if (!orderAtual) {
        return <div>Carregando pedido...</div>;
    }

    function formatOrderDate(createdAt: string): string {
        const date = new Date(createdAt); // Converte a string para objeto Date
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        };

        return date.toLocaleDateString('pt-BR', options); // Formata a data
    }


    const items = JSON.parse(orderAtual.items);
    const address = JSON.parse(orderAtual.address);
    const user = JSON.parse(orderAtual.user);

    return (
        <React.Fragment>
            <div className="back-button">
                <Button onClick={() => window.location.href = window.location.origin + "/account#orders"} className="back-button-inside"><ArrowLeft /> Voltar para sua conta</Button>
            </div>
            <div className="order-details-page">
                <h2>Detalhes do Pedido #{orderAtual.id}</h2>

                <StepsRoot
                    py="6"
                    defaultStep={currentStep}
                    colorPalette={"black"}
                    count={3}
                >
                    <StepsList>
                        {steps.map((step, index) => (
                            <StepsItem
                                key={index}
                                index={index}
                                title={step}
                            />
                        ))}
                    </StepsList>
                </StepsRoot>
                {/* Resumo do Pedido */}
                <div className="order-summary">
                    <h2>Resumo do Pedido</h2>
                    <p><strong>Data do Pedido:</strong> {new Date(orderAtual.createdAt).toLocaleDateString()}</p>
                    <p><strong>Forma de Pagamento:</strong> {orderAtual.paymentOption === "CART" ? "Cartão de Crédito" : "Pix"}</p>
                    <p><strong>Valor Total:</strong> R${orderAtual.order_totalprice.toFixed(2)}</p>
                    <p><strong>Desconto Aplicado:</strong> R${orderAtual.desconto.toFixed(2)}</p>
                </div>
                {/* Resumo do Pedido */}
                <div className="order-summary">
                    <h2>Endereço de Entrega</h2>
                    <p><strong>Endereço de Entrega:</strong> {address.endereço}, {address.numero}, {address.bairro} - {address.cidade}/{address.estado} ({address.cep})</p>
                    <p><strong>Referência:</strong> {address.referencia}</p>

                    {/* Timeline de Status do Pedido */}
                    <TimelineRoot>
                        <TimelineItem>
                            <TimelineConnector>
                                <LuCheck />
                            </TimelineConnector>
                            <TimelineContent>
                                <TimelineTitle>Pedido Confirmado</TimelineTitle>
                                <TimelineDescription>{formatOrderDate(orderAtual.createdAt)}</TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineConnector>
                                <LuShip />
                            </TimelineConnector>
                            <TimelineContent>
                                <TimelineTitle>Produto Enviado</TimelineTitle>
                                <TimelineDescription>Pendente</TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineConnector>
                                <LuPackage />
                            </TimelineConnector>
                            <TimelineContent>
                                <TimelineTitle>Pedido Entregue</TimelineTitle>
                                <TimelineDescription>Pendente</TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>
                    </TimelineRoot>
                </div>
                {/* Itens do Pedido */}
                <div className="order-items">
                    <h3>Itens do Pedido</h3>
                    {items.map((item: any, index: number) => {
                        const photo = JSON.parse(item.photoURL)[0];

                        return (
                            <div key={index} className="order-item-content">
                                <img src={photo || "/default-image.jpg"} alt={item.name_product} />
                                <div className="item-details">
                                    <h4>{item.name_product}</h4>
                                    <p><strong>Tamanho:</strong> {item.tamanhos}</p>
                                    <p><strong>Preço:</strong> R${item.price.toFixed(2)}</p>
                                    <p><strong>Desconto:</strong> R${item.desconto.toFixed(2)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </React.Fragment>
    );
};

export default AccountOrders;
