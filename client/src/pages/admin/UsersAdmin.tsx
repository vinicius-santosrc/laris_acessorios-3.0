import { Product } from "@/models/product"
import productService from "../../services/productService";
import { Badge, Image, Table, Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import "./productsadminpage.css"
import { Users } from "lucide-react";
import { clientsService } from "../../services/clientsService";
import { UserProps } from "../../models/user";

export const UsersAdmin = () => {
    const [clients, setClients] = useState<UserProps[] | null>(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const searchedProducts: UserProps[] = await clientsService.getAll();
                setClients(searchedProducts);
            } catch (error) {
                console.error("Failed to fetch category data:", error);
            }
        };

        fetchCategoryData();
    }, []);

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                {/* Título e Subtítulo */}
                <div className="header">
                    <h1 className="title">Gestão de Clientes</h1>
                    <p className="subtitle">Gerencie os clientes com facilidade.</p>
                </div>

                <div className="dashboard-table-content">
                    <Tabs.Root defaultValue="members">
                        <Tabs.List>
                            <Tabs.Trigger value="members">
                                <Users />
                                Users
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content className="contentTab" value="members">
                            <Table.Root size="sm">
                                <Table.Header>
                                    <Table.Row className="rowTable">
                                        <Table.ColumnHeader></Table.ColumnHeader>
                                        <Table.ColumnHeader>Foto</Table.ColumnHeader>
                                        <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                        <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                                        <Table.ColumnHeader>E-mail</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {clients?.map((user: UserProps) => (
                                        <Table.Row className="rowTable" key={user.cpf}>
                                            <Table.Cell>{user.id}</Table.Cell>
                                            <Table.Cell><Image
                                                boxSize="50px"
                                                objectFit="cover"
                                                borderRadius="md"
                                                src={user.photoURL}></Image></Table.Cell>
                                            <Table.Cell>{user.nome_completo}</Table.Cell>
                                            <Table.Cell>{user.label}</Table.Cell>
                                            <Table.Cell>{user.email}</Table.Cell>
                                        </Table.Row>
                                    ))}

                                </Table.Body>
                            </Table.Root>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </section>
    );
}
