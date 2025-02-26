/**
 * Creation Date: 25/02/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import "./CategoriesAdmin.css";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "../../components/ui/accordion"
import { AbsoluteCenter, Box, Editable } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { CategoriesProps } from "../../lib/utils";
import { InfoTip } from "../../components/ui/toggle-tip";
import { TrashIcon } from "lucide-react";
import { Product } from "../../models/product";
import productService from "../../services/productService";
import { Badge, Image, Table, Tabs } from "@chakra-ui/react";
import { Link } from "react-router-dom";


const CategoriesAdmin = () => {
    const [allCategories, setCategories] = useState<CategoriesProps[]>([]);
    const [allProducts, setProducts] = useState<Product[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedCategories: CategoriesProps[] = await adminService.getAllCategoriesData();
                setCategories(fetchedCategories);

                const fetchedProducts: Product[] = await productService.getAll();
                setProducts(fetchedProducts);
            } catch (err: any) {
                console.error(err)
            }
        };
        fetchProduct();
    }, []);

    useEffect(() => {
        const checkIfMobile = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        checkIfMobile()
    })

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="header">
                    <h1 className="title">Categorias</h1>
                    <p className="subtitle">Gerencie as categorias presentes em sua joalheria.</p>
                </div>

                <AccordionRoot spaceY="4" variant="plain" collapsible defaultValue={["b"]}>
                    {allCategories.map((item: CategoriesProps, index: number) => (
                        <AccordionItem key={index} value={item.urlLink}>
                            <Box position="relative">
                                <AccordionItemTrigger indicatorPlacement="start">
                                    <Editable.Root
                                        style={{ fontWeight: 600 }}
                                        size={"lg"}
                                        defaultValue={item.highlightText}
                                        activationMode="dblclick"
                                    >
                                        <Editable.Preview />
                                        <Editable.Input
                                            value={item.highlightText}
                                            onChange={(e) => {
                                                setCategories((prevCategories) =>
                                                    prevCategories.map((cat) =>
                                                        cat.urlLink === item.urlLink
                                                            ? { ...cat, highlightText: e.target.value }
                                                            : cat
                                                    )
                                                );
                                            }}
                                        />
                                        <InfoTip content="Clique duas vezes para editar" />
                                    </Editable.Root>
                                </AccordionItemTrigger>
                                <AbsoluteCenter axis="vertical" insetEnd="0">
                                    <button>
                                        <TrashIcon />
                                    </button>
                                </AbsoluteCenter>
                            </Box>
                            <AccordionItemContent>
                                <img className="categoryImage" src={item.highlightImage} alt="Imagem da Categoria" />
                                <Editable.Root
                                    style={{ fontWeight: 600 }}
                                    size={"lg"}
                                    defaultValue={item.highlightDescription}
                                    activationMode="dblclick"
                                >
                                    <Editable.Preview />
                                    <Editable.Input
                                        value={item.highlightDescription}
                                        onChange={(e) => {
                                            setCategories((prevCategories) =>
                                                prevCategories.map((cat) =>
                                                    cat.urlLink === item.urlLink
                                                        ? { ...cat, highlightDescription: e.target.value }
                                                        : cat
                                                )
                                            );
                                        }}
                                    />
                                    <InfoTip content="Clique duas vezes para editar a descrição" />
                                </Editable.Root>
                                <Table.Root size="sm">
                                    <Table.Header>
                                        <Table.Row className="rowTable">
                                            <Table.ColumnHeader>Foto</Table.ColumnHeader>
                                            <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                            {!isMobile && <Table.ColumnHeader>Categorias</Table.ColumnHeader>}
                                            <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                                            <Table.ColumnHeader>Preço</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {allProducts.map((product: Product) => {
                                            if (JSON.parse(product.categoryList).includes(item.urlLink)) {
                                                return (
                                                    <Table.Row className="rowTable" key={product.id}>
                                                        <Table.Cell>
                                                            <Link to={"/admin/products/" + product.id}>
                                                                <Image
                                                                    src={JSON.parse(product.photoURL)[0]}
                                                                    alt={product.name_product}
                                                                    boxSize="50px"
                                                                    objectFit="cover"
                                                                    borderRadius="md"
                                                                /></Link>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Link to={"/admin/products/" + product.id}>{product.name_product}</Link></Table.Cell>
                                                        {!isMobile && <Table.Cell>
                                                            <Link to={"/admin/products/" + product.id}>
                                                                <div className="section-item-list-admin">
                                                                    {item &&
                                                                        JSON.parse(product.categoryList)?.map(
                                                                            (category: string, index: number) => (
                                                                                <div className="item-row-products-page" key={index}>
                                                                                    <Badge>{category.toUpperCase()}</Badge>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                </div>
                                                            </Link>
                                                        </Table.Cell>}
                                                        <Table.Cell>{product.type_full_label}</Table.Cell>
                                                        <Table.Cell textAlign="end">R$ {product.price.toFixed(2)}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            }
                                        })}
                                    </Table.Body>
                                </Table.Root>
                            </AccordionItemContent>
                        </AccordionItem>
                    ))}
                </AccordionRoot>
            </div>
        </section>
    )
}

export default CategoriesAdmin;