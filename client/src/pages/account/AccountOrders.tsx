import { OrderAfterBuyProps } from "../../models/order";
import { orderService } from "../../services/orderService";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./accountOrders.css";
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from "../../components/ui/timeline";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu";
import { StepsItem, StepsList, StepsRoot } from "../../components/ui/steps";
import { Button } from "../../components/ui/button";
import { ArrowLeft, DollarSignIcon } from "lucide-react";
import authService from "../../services/authService";
import { Loader } from "../../components/ui/loader";
import { Separator } from "@chakra-ui/react";

const AccountOrders = () => {
    const [orderAtual, setOrderAtual] = useState<OrderAfterBuyProps | null>(null);
    const [isAdmin, setIsAuthenticated] = useState<boolean>(false);
    const { order } = useParams(); // Pega o ID do pedido da URL
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Preparando", "Enviado", "Entregue"];

    useEffect(() => {
        getOrderAtual();

        const checkUserLoggedIn = async () => {
            try {
                let authentication = await authService.getUserData();

                if (!authentication) {
                    console.warn("Access token possivelmente expirado. Tentando renovar...");
                    try {
                        await authService.refreshToken();
                        authentication = await authService.getUserData();
                    } catch (refreshError) {
                        console.error("Falha ao renovar o token:", refreshError);
                        await authService.logout();
                        setIsAuthenticated(false);
                        return;
                    }
                }

                if (authentication) {
                    const isAdmin = await authService.isUserAdmin(authentication.email);
                    setIsAuthenticated(isAdmin);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Erro ao verificar autenticação do usuário:", error);
                setIsAuthenticated(false);
            }
        };

        checkUserLoggedIn();
    }, [order]);    

    async function getOrderAtual() {
        try {
            if (order) {
                const fetchedOrder = await orderService.getById(order);
                setOrderAtual(fetchedOrder);

                if (fetchedOrder.state === "PREPARANDO") {
                    setCurrentStep(1);
                }
                else if (fetchedOrder.state === "ENTREGA") {
                    setCurrentStep(2);
                }
                else {
                    setCurrentStep(3);
                }

                if (fetchedOrder.situation === "NAOPAGO") {
                    setCurrentStep(0)
                }
            }
        } catch (error: any) {
            throw Error("Erro ao carregar o pedido:", error);
        }
    }

    if (!orderAtual) {
        return <Loader></Loader>;
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
                    <Separator />
                    <br />
                    <p><strong>Nome: </strong> {user.nome_completo}</p>
                    <p><strong>CPF:</strong> {user.cpf}</p>
                    <p><strong>Telefone para contato:</strong> {user?.telefone}</p>
                </div>
                {/* Resumo do Pedido */}
                <div className="order-summary">
                    <h2>Entrega</h2>
                    <p><strong>{address?.shippingMethodSelected?.company.name} - {address?.shippingMethodSelected?.name}</strong></p>
                    {address?.shippingMethodSelected?.company.name != "Retirada" ? <p><strong>Seu pedido será entregue em {address?.shippingMethodSelected?.delivery_time} dias após ser enviado.</strong></p> : "Entraremos em contato via WhatsApp para definir um local em Pouso Alegre MG para retirada de seu produto"}
                    {address?.shippingMethodSelected?.company.name != "Retirada" && <p><strong>Código para rastreio do pedido: <Link target="_blank" to={"https://rastreamento.correios.com.br/app/index.php"}><u>{orderAtual?.codigoRastreio}</u></Link></strong></p>}
                    <br />
                    <p><strong>Endereço {address?.shippingMethodSelected?.company.name != "Retirada" ? "de Entrega" : ""}:</strong> {address.endereço}, {address.numero}, {address.bairro} - {address.cidade}/{address.estado} ({address.cep})</p>
                    <p><strong>Referência:</strong> {address.referencia}</p>

                    {/* Timeline de Status do Pedido */}
                    <TimelineRoot>
                        <TimelineItem>
                            <TimelineConnector>
                                {orderAtual.state === 'PREPARANDO' && orderAtual.situation != "NAOPAGO" ? <LuCheck /> : <DollarSignIcon style={{ opacity: 0.5 }} />}
                            </TimelineConnector>
                            <TimelineContent>
                                <TimelineTitle>Pedido Confirmado</TimelineTitle>
                                <TimelineDescription>{orderAtual.situation != "NAOPAGO" ? <>{formatOrderDate(orderAtual.createdAt)}</> : "Pendente" }</TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineConnector>
                                {orderAtual.state === 'ENTREGA' || orderAtual.state === 'FINALIZADO' && orderAtual.situation != "NAOPAGO" ? <LuCheck /> : <LuShip style={{ opacity: 0.5 }} />}
                            </TimelineConnector>
                            <TimelineContent>
                                <TimelineTitle>Produto Enviado</TimelineTitle>
                                <TimelineDescription>{orderAtual.state === 'ENTREGA' || orderAtual.state === 'FINALIZADO' && orderAtual.situation != "NAOPAGO" ? "" : 'Pendente'}</TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineConnector>
                                {orderAtual.state === 'FINALIZADO' ? <LuCheck /> : <LuPackage style={{ opacity: 0.5 }} />}
                            </TimelineConnector>
                            <TimelineContent>
                                <TimelineTitle>Pedido Entregue</TimelineTitle>
                                <TimelineDescription>{orderAtual.state === 'FINALIZADO' ? "" : 'Pendente'}</TimelineDescription>
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
