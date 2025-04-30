import { useEffect, useState } from "react";
import { OrderAfterBuyProps } from "../../models/order";
import { orderService } from "../../services/orderService";
import { Button, Table } from '@chakra-ui/react';
import './Orders.css';
import { OrderStates } from "../../lib/utils";
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../components/ui/select";
import { Link } from "react-router-dom";
import {
    DialogBackdrop,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import CreateNewOrderForm from "../../components/admin/orders/CreateNewOrderForm";

const Orders = () => {
    const [orders, setOrders] = useState<OrderAfterBuyProps[]>([]);

    const getAllOrders = async () => {
        try {
            const orders = await orderService.getAll();
            const parsedOrders = orders.map((order: OrderAfterBuyProps) => {
                order.user = JSON.parse(order.user);
                order.items = JSON.parse(order.items);
                return order;
            });
            setOrders(parsedOrders);
        } catch (error: any) {
            throw Error(error);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    async function updateOrder(order: any) {
        try {
            await orderService.update(order)
        }
        catch (error: any) {
            throw Error(error);
        }
    }

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="top-bar-admin">
                    <h1 className="page-title">Administração de Pedidos</h1>
                    <DialogRoot size={"xl"}>
                        <DialogBackdrop />
                        <DialogTrigger asChild>
                            <Button className="createNewCategoryBtn">
                                Adicionar pedidos externos
                            </Button>
                        </DialogTrigger>
                        <DialogContent top={3} height={"97vh"} overflowY={"scroll"} background={"#f7f7f7"} paddingX={12} paddingY={4}>
                            <DialogCloseTrigger />
                            <DialogHeader>
                                <DialogTitle>Criação de pedidos externos</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                                <CreateNewOrderForm />
                            </DialogBody>
                        </DialogContent>
                    </DialogRoot>
                </div>
                <div className="orders-page">
                    <Table.Root>
                        <Table.Header>
                            <Table.ColumnHeader>ID do Pedido</Table.ColumnHeader>
                            <Table.ColumnHeader></Table.ColumnHeader>
                            <Table.ColumnHeader>Cliente</Table.ColumnHeader>
                            <Table.ColumnHeader>Data</Table.ColumnHeader>
                            <Table.ColumnHeader>Total</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Situação</Table.ColumnHeader>
                            <Table.ColumnHeader>Ações</Table.ColumnHeader>
                        </Table.Header>
                        <Table.Body>
                            {orders.map((order) => {
                                const items = order.items[0];
                                const previewImage = JSON.parse(items.photoURL)[0]

                                return (
                                    <Table.Row key={order.id}>
                                        <Table.Cell>{order.id}</Table.Cell>
                                        <Table.Cell><img className="previewimage" src={previewImage} alt={order.id.toString()} /></Table.Cell>
                                        <Table.Cell>{order.user.nome_completo}</Table.Cell> {/* Usando o nome completo do cliente */}
                                        <Table.Cell>{new Date(order.createdAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>R$ {order.order_totalprice.toFixed(2)}</Table.Cell>
                                        <Table.Cell>
                                            <SelectRoot defaultValue={order.state} collection={OrderStates} size="sm" width="320px">
                                                <SelectTrigger>
                                                    <SelectValueText placeholder={order.state} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {OrderStates.items.map((orderState: any) => (
                                                        <SelectItem
                                                            item={orderState}
                                                            onClick={() => {
                                                                order.state = orderState.value;

                                                                updateOrder(order)

                                                            }}
                                                            key={orderState.value}
                                                        >
                                                            {orderState.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </SelectRoot>
                                        </Table.Cell>
                                        <Table.Cell>{order.situation}</Table.Cell>
                                        <Table.Cell>
                                            <Link to={window.location.origin + "/admin/orders/" + order.id} className="action-button">Detalhes</Link>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table.Root>
                </div>
            </div>
        </section>
    );
};

export default Orders;