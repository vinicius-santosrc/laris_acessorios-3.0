import { OrderAfterBuyProps } from "../../models/order";
import { orderService } from "../../services/orderService";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./adminOrders.css";
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from "../../components/ui/timeline";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu";
import { StepsItem, StepsList, StepsRoot } from "../../components/ui/steps";
import { ArrowLeft, DollarSignIcon, DotSquareIcon, ListIcon } from "lucide-react";
import { Loader } from "../../components/ui/loader";
import { Button, Input, Portal, Separator } from "@chakra-ui/react";
import { Menu } from "@chakra-ui/react"
import Swal from 'sweetalert2'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from "leaflet"
import productService from "../../services/productService";
import { toaster } from "../../components/ui/toaster";

const AdminOrders = () => {
    const [orderAtual, setOrderAtual] = useState<OrderAfterBuyProps | null>(null);
    const { order } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Preparando", "Enviado", "Entregue"];
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    useEffect(() => {
        getOrderAtual();
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

                // Geocodificação do CEP
                await getCoordinates(JSON.parse(fetchedOrder.address).cep);
            }
        } catch (error: any) {
            console.error("Erro ao carregar o pedido:", error);
        }
    }

    async function getCoordinates(cep: string) {
        try {
            const formattedCep = cep.replace("-", "");
            const cepReq = await fetch(`https://brasilapi.com.br/api/cep/v2/${formattedCep}`);
            const response = await cepReq.json();

            setLatitude(response.location.coordinates.latitude)
            setLongitude(response.location.coordinates.longitude)
        } catch (error: any) {
            console.error("Erro ao obter coordenadas:", error);
        }
    }

    if (!orderAtual) {
        return <Loader></Loader>;
    }

    function formatOrderDate(createdAt: string): string {
        const date = new Date(createdAt);
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        };

        return date.toLocaleDateString('pt-BR', options);
    }

    const boxIcon = new Icon({
        iconUrl: 'https://www.larisacessorios.com.br/favicon.ico', // Substitua pelo caminho do seu ícone de caixa
        iconSize: [35, 41], // Tamanho do ícone
        iconAnchor: [12, 41], // Ponto de ancoragem do ícone
    });

    async function updateOrder() {
        try {
            await orderService.update(orderAtual)
        }
        catch (error: any) {
            throw Error(error);
        }
    }

    async function deleteOrder() {
        try {
            Swal.fire({
                title: "Você tem certeza?",
                text: "Deseja realmente excluir esse pedido?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Excluir",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    await orderService.delete(orderAtual);
                    Swal.fire({
                        title: "Removido!",
                        text: "O pedido foi removido.",
                        icon: "success"
                    }).then(() => {
                        window.location.href = window.location.origin + "/admin/orders"
                    })
                }
            });
        }
        catch (error: any) {
            throw Error(error);
        };
    }

    const items = JSON.parse(orderAtual.items);
    const address = JSON.parse(orderAtual.address);
    const user = JSON.parse(orderAtual.user);

    function formatTelefoneToLink(telefone: string) {
        return telefone.replace(/\D/g, '');
    }

    async function changeVisibility(item: any) {
        try {
            const isCurrentlyAvailable = item.disponibilidade === 1;

            await productService.changeVisibilityByList(
                [item.id],
                isCurrentlyAvailable ? "unavaliable" : "avaliable"
            );

            toaster.create({
                title: `Visibilidade dos produtos alterada para ${isCurrentlyAvailable ? "Indisponível" : "Disponível"}.`,
                type: "success",
            });

            setOrderAtual((prev) => {
                if (!prev) return prev;

                const updatedItems = JSON.parse(prev.items).map((i: any) =>
                    i.id === item.id ? { ...i, disponibilidade: isCurrentlyAvailable ? 0 : 1 } : i
                );

                return { ...prev, items: JSON.stringify(updatedItems) };
            });
        } catch (error) {
            console.error("Erro ao mudar visibilidade:", error);
            toaster.create({
                title: "Erro ao alterar visibilidade.",
                type: "error",
            });
        }
    }


    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="back-button">
                    <Link to={window.location.origin + "/admin/orders"} className="back-button-inside"><ArrowLeft /> Voltar para pedidos</Link>
                </div>
                <div className="order-details-page">
                    <h1>Você está visualizando os detalhes do pedido #{orderAtual.id}</h1>
                    <button className="btn-contact" onClick={updateOrder}>Atualizar alterações</button>
                    <button className="btn-contact" onClick={deleteOrder}>Excluir order</button>
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
                        <h1>Resumo do Pedido</h1>
                        <p><strong>Data do Pedido:</strong> {new Date(orderAtual.createdAt).toLocaleDateString()}</p>
                        <p><strong>Forma de Pagamento:</strong> {orderAtual.paymentOption === "CART" ? "Cartão de Crédito" : "Pix"}</p>
                        <p><strong>Valor Total:</strong> R${orderAtual.order_totalprice.toFixed(2)}</p>
                        <p><strong>Desconto Aplicado:</strong> R${orderAtual.desconto.toFixed(2)}</p>
                        <Separator />
                        <br />
                        <p><strong>Nome: </strong> {user.nome_completo}</p>
                        <p><strong>E-mail: </strong> {user.email}</p>
                        <p><strong>CPF:</strong> {user.cpf}</p>
                        <p><strong>Telefone para contato:</strong> {user?.telefone}</p>
                        <br />

                        <Separator />

                        <button onClick={() => window.open(`https://wa.me/55${formatTelefoneToLink(user.telefone)}`)} className="btn-contact">Entrar em contato por WhatsApp</button> <br />
                        <button onClick={() => window.location.href = "mailto:" + user.email} className="btn-contact">Entrar em contato por E-mail</button>
                    </div>
                    {/* Resumo do Pedido */}
                    <div className="order-summary">
                        <h1>Pagamento</h1>
                        <p><strong>Valor Total (incluindo desconto):</strong> R${orderAtual.order_totalprice.toFixed(2)}</p>
                        <p><strong>Desconto Aplicado:</strong> R${orderAtual.desconto.toFixed(2)}</p>
                        <p><strong>Forma de Pagamento:</strong> {orderAtual.paymentOption === "CART" ? "Cartão de Crédito" : "Pix"}</p>
                        <p><strong>Situação atual do pagamento: <select disabled={orderAtual.paymentOption === "CART"} onChange={(e) => setOrderAtual({ ...orderAtual, situation: e.target.value })} defaultValue={orderAtual.situation}><option value={"NAOPAGO"}>NÃO PAGO</option><option value={"PAGO"}>PAGO</option></select> </strong></p>
                    </div>
                    <div className="order-summary">
                        <h1>Entrega</h1>
                        <p><strong>{address?.shippingMethodSelected?.company.name} - {address?.shippingMethodSelected?.name}</strong></p>
                        {address?.shippingMethodSelected?.company.name !== "Retirada" ? <p><strong>Seu pedido será entregue em {address?.shippingMethodSelected?.delivery_time} dias após ser enviado.</strong></p> : "Entraremos em contato via WhatsApp para definir um local em Pouso Alegre MG para retirada de seu produto"}
                        {address?.shippingMethodSelected?.company.name !== "Retirada" && <input onChange={(e) => setOrderAtual({ ...orderAtual, codigoRastreio: e.target.value })} value={orderAtual.codigoRastreio} placeholder="Coloque aqui o código de rastreio do produto" />}
                        <br />
                        <p><strong>Endereço {address?.shippingMethodSelected?.company.name !== "Retirada" ? "de Entrega" : ""}:</strong> {address.endereço}, {address.numero}, {address.bairro} - {address.cidade}/{address.estado} ({address.cep})</p>
                        <div style={{ height: "300px", width: "100%" }}>
                            {latitude && longitude ? (
                                <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "100%", width: "100%" }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[latitude, longitude]} icon={boxIcon}>
                                        <Popup>
                                            <h2 style={{ fontSize: 18 }}>Pedido #{orderAtual.id}</h2>
                                            Cliente: {user.nome_completo} <br />
                                            <br />
                                            {address.cidade} [{address.estado}] - {address.bairro} - {address["endereço"]} {address.numero}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <p>Carregando mapa...</p>
                            )}
                        </div>
                        <p><strong>Referência:</strong> {address.referencia}</p>

                        {/* Timeline de Status do Pedido */}
                        <TimelineRoot>
                            <TimelineItem>
                                <TimelineConnector>
                                    {orderAtual.state === 'PREPARANDO' && orderAtual.situation !== "NAOPAGO" ? <LuCheck /> : <DollarSignIcon style={{ opacity: 0.5 }} />}
                                </TimelineConnector>
                                <TimelineContent>
                                    <TimelineTitle>Pedido Confirmado</TimelineTitle>
                                    <TimelineDescription>{orderAtual.situation !== "NAOPAGO" ? <>{formatOrderDate(orderAtual.createdAt)}</> : "Pendente"}</TimelineDescription>
                                </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                                <TimelineConnector>
                                    {orderAtual.state === 'ENTREGA' || orderAtual.state === 'FINALIZADO' && orderAtual.situation !== "NAOPAGO" ? <LuCheck /> : <LuShip style={{ opacity: 0.5 }} />}
                                </TimelineConnector>
                                <TimelineContent>
                                    <TimelineTitle>Produto Enviado</TimelineTitle>
                                    <TimelineDescription>{orderAtual.state === 'ENTREGA' || orderAtual.state === 'FINALIZADO' && orderAtual.situation !== "NAOPAGO" ? "" : 'Pendente'}</TimelineDescription>
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
                        <h1>Itens do Pedido</h1>
                        {items.map((item: any, index: number) => {
                            const photo = JSON.parse(item.photoURL)[0];

                            return (
                                <div key={index} className="order-item-content">
                                    <img src={photo || "/default-image.jpg"} alt={item.name_product} />
                                    <Link target="_blank" to={window.location.origin + "/product/" + item.url} className="item-details">
                                        <h4>{item.name_product}</h4>
                                        <p><strong>Tamanho:</strong> {item.tamanhos}</p>
                                        <p><strong>Preço:</strong> R${item.price.toFixed(2)}</p>
                                        <p><strong>Desconto:</strong> R${item.desconto.toFixed(2)}</p>
                                    </Link>
                                    <div className="icon-btn">
                                        <Menu.Root>
                                            <Menu.Trigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <ListIcon />
                                                </Button>
                                            </Menu.Trigger>
                                            <Portal>
                                                <Menu.Positioner>
                                                    <Menu.Content>
                                                        <Menu.Item value="new-txt-a" onClick={() => changeVisibility(item)}>
                                                            Tornar {item.disponibilidade == 0 ? "Disponivel" : "Indisponivel"}
                                                        </Menu.Item>
                                                    </Menu.Content>
                                                </Menu.Positioner>
                                            </Portal>
                                        </Menu.Root>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminOrders;