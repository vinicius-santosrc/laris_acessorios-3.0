/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { Image, Table, Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import "./productsadminpage.css"
import { Users } from "lucide-react";
import { ClientsRepository } from "../../repositories/clients";
import { UserProps } from "../../models/user";

export const UsersAdmin = () => {
    const [clients, setClients] = useState<UserProps[] | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const clientsRepo = new ClientsRepository();

    useEffect(() => {

        // Função para verificar a largura da tela
        const checkIfMobile = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        // Verifica ao carregar o componente
        checkIfMobile();

        // Adiciona evento para verificar mudanças na largura da tela
        window.addEventListener("resize", checkIfMobile);

        // Remove o evento ao desmontar o componente
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        }
    }, []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const searchedProducts: UserProps[] = await clientsRepo.getAll();
                setClients(searchedProducts);
            } catch (error: any) {
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
                                        {!isMobile && <Table.ColumnHeader>E-mail</Table.ColumnHeader>}
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
                                            {!isMobile && <Table.Cell>{user.email}</Table.Cell>}
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
