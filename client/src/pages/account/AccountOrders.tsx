import { OrderAfterBuyProps } from "../../models/order";
import { orderService } from "../../services/orderService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./accountOrders.css"; // Estilos para página
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from "../../components/ui/timeline";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu";

const AccountOrders = () => {
    const [orderAtual, setOrderAtual] = useState<OrderAfterBuyProps | null>(null);
    const { order } = useParams(); // Pega o ID do pedido da URL

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
        <div className="order-details-page">
            <h2>Detalhes do Pedido #{orderAtual.id}</h2>

            {/* Resumo do Pedido */}
            <div className="order-summary">
                <h3>Resumo do Pedido</h3>
                <p><strong>Status:</strong> {orderAtual.state}</p>
                <p><strong>Data do Pedido:</strong> {new Date(orderAtual.createdAt).toLocaleDateString()}</p>
                <p><strong>Forma de Pagamento:</strong> {orderAtual.paymentOption === "CART" ? "Cartão de Crédito" : "Pix"}</p>
                <p><strong>Valor Total:</strong> R${orderAtual.order_totalprice.toFixed(2)}</p>
                <p><strong>Desconto Aplicado:</strong> R${orderAtual.desconto.toFixed(2)}</p>
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
                        <div key={index} className="order-item">
                            <img src={photo || "/default-image.jpg"} alt={item.name_product} />
                            <div className="item-details">
                                <h4>{item.name_product}</h4>
                                <p><strong>Categoria:</strong> {item.categoria}</p>
                                <p><strong>Tamanho:</strong> {item.tamanhos}</p>
                                <p><strong>Preço:</strong> R${item.price.toFixed(2)}</p>
                                <p><strong>Desconto:</strong> R${item.desconto.toFixed(2)}</p>
                                <p><strong>Disponibilidade:</strong> {item.disponibilidade ? "Disponível" : "Indisponível"}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Informações do Cliente */}
            <div className="order-user">
                <h3>Informações do Cliente</h3>
                <img src={user.photoURL || "/default-user.jpg"} alt={user.nome_completo} />
                <p><strong>Nome:</strong> {user.nome_completo}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>CPF:</strong> {user.cpf}</p>
            </div>
        </div>
    );
};

export default AccountOrders;
