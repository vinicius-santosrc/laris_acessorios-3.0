import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Success.css";
import { orderService } from "../../services/orderService";
import { Loader } from "../../components/ui/loader";
import { Product } from "../../models/product";
import { OrderAfterBuyProps } from "@/models/order";

const Success = () => {
    const { uid } = useParams();
    const [order, setOrder] = useState<OrderAfterBuyProps>();
    const [endereco, setEndereco] = useState<any>(null);
    const [items, setItems] = useState<any>(null);
    const [userComprador, setUserComprador] = useState<any>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (uid) {
                try {
                    const currentOrder = await orderService.getByUid(uid);
                    setOrder(currentOrder);
                    setEndereco(JSON.parse(currentOrder.address));
                    setItems(JSON.parse(currentOrder.items));
                    setUserComprador(JSON.parse(currentOrder.user));

                } catch (error) {
                    console.error("Erro ao buscar a ordem:", error);
                }
            }
        };
        fetchOrder();
    }, [uid]);

    function getPaymentMethodLabel(paymentMethod: any) {
        if (paymentMethod === 'CART') {
            return "Cartão"
        }
        else {
            return "Pix"
        }
    }

    if (!order) {
        return <Loader />;
    }

    return (
        <section className="success-page">
            <div className="success-container">
                <div className="success-header">
                    {order.paymentOption === "CART" ? (
                        <h1 className="success-title">Compra Realizada com Sucesso!</h1>
                    ) : (
                        <h1 className="success-title">Aguardando o pagamento do seu pedido...</h1>
                    )}
                    <p className="success-description">
                        {order.paymentOption === "CART"
                            ? "Parabéns! Seu pedido foi confirmado e está sendo preparado."
                            : "Estamos aguardando o pagamento do seu pedido. Entraremos em contato para combinar a entrega e enviar o QRCode para o pagamento via pix."}
                    </p>
                </div>
                <div className="pix-instructions">
                    {order.paymentOption === "PIX" &&
                        <>
                            <p>1. Aguarde nosso contato para definir os detalhes da entrega e o valor final.</p>
                            <p>2. Realize o pagamento via Pix utilizando o QR Code enviado pela nossa equipe.</p>
                            <p>3. Envie o comprovante de pagamento pelo WhatsApp para a pessoa que entrou em contato com você.</p>
                            <p>4. Agora é só aguardar ansiosamente pelo seu pedido da Laris! 💖</p>
                        </>
                    }
                </div>
                <div className="order-info-wrapper">
                    <div className="order-info-left">
                        <div className="order-info-card">
                            <h3>Informações do Comprador</h3>
                            <ul>
                                <li><strong>Nome:</strong> {userComprador && userComprador.nome_completo}</li>
                                <li><strong>Email:</strong> {userComprador && userComprador.email}</li>
                            </ul>
                        </div>
                        <div className="order-info-card">
                            <h3>Endereço de Entrega</h3>
                            <ul>
                                <li><strong>Rua:</strong> {endereco?.endereço} - {endereco?.numero}</li>
                                <li><strong>Bairro:</strong> {endereco?.bairro}</li>
                                <li><strong>Cidade:</strong> {endereco?.cidade} - {endereco?.estado}</li>
                                <li><strong>CEP:</strong> {endereco?.cep}</li>
                                <li><strong>Referência:</strong> {endereco?.referencia}</li>
                            </ul>
                        </div>
                        <div className="order-info-card">
                            <h3>Forma de Pagamento</h3>
                            <ul>
                                <li><strong>Pagamento:</strong> {getPaymentMethodLabel(order.paymentOption)}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="order-info-right">
                        <div className="order-items-card">
                            <h3>Itens do Pedido</h3>
                            <ul>
                                {items.map((item: Product) => {

                                    const photosProduct = JSON.parse(item.photoURL);
                                    let photoDisplay
                                    if (photosProduct.length > 1) {
                                        photoDisplay = photosProduct[0]
                                    }
                                    else {
                                        photoDisplay = photosProduct
                                    }

                                    return (
                                        <li key={item.id}>
                                            <Link className="productDisplay" to={window.location.origin + "/product/" + item.url} target="_blank">
                                                <div className="photoProduct">
                                                    <img src={photoDisplay} alt={item.name_product} />
                                                </div>
                                                <div className="infoProduct">
                                                    <p><strong>{item.name_product}</strong></p>
                                                    <p>Quantidade: 1</p>
                                                    <p>Preço: R$ {item.price.toFixed(2)}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <Link to="/" className="button button-primary">
                        Voltar para a Página Inicial
                    </Link>
                    <Link to="/account#orders" className="button button-secondary">
                        Ver Meus Pedidos
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Success;