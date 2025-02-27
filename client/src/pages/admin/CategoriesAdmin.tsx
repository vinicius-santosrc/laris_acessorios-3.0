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
import { AbsoluteCenter, Box, createListCollection, Editable, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { CategoriesProps } from "../../lib/utils";
import { InfoTip } from "../../components/ui/toggle-tip";
import { Product } from "../../models/product";
import productService from "../../services/productService";
import { Badge, Image, Table} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { toaster } from "../../components/ui/toaster";
import { Button } from "../../components/ui/button";
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

const CategoriesAdmin = () => {
    const [allCategories, setCategories] = useState<CategoriesProps[]>([]);
    const [allProducts, setProducts] = useState<Product[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [typeCategorys, setTypeCategorys] = useState(createListCollection({
        items: []
    }));
    const [itemData, setItemData] = useState<any>(
        {
            highlightText: null,
            highlightDescription: null,
            highlightImage: null,
            urlLink: null,
            products: "[]"
        }
    )

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

    function saveCategories() {
        const promises = allCategories.map((category) => {
            return adminService.updateByCategory(category);
        });
        Promise.all(promises)
            .then(() => {
                toaster.create({
                    title: "Categorias editadas com sucesso",
                    type: "success"
                })
            })
            .catch((err) => {
                console.error("Erro ao atualizar categorias:", err);
                toaster.error({
                    title: "Erro ao atualizar categorias",
                    description: err,
                    type: "error"
                })
            });
    }

    async function changeImage(e: any, item: CategoriesProps) {
        const file = e.target.files[0];
        if (file) {
            const uploadPhoto = await adminService.upload(e);

            setCategories((prevCategories) =>
                prevCategories.map((cat) =>
                    cat.urlLink === item.urlLink
                        ? { ...cat, highlightImage: uploadPhoto }
                        : cat
                )
            );
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await adminService.getCategorys(); // Certifique-se de que este método retorna um array de categorias
            const formattedCategories = response.map((category: any) => ({
                label: category.category,
                value: category.category,
            }));

            setTypeCategorys(createListCollection({ items: formattedCategories }));
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategory = async (category: CategoriesProps) => {
        setCategories((prevCategories) => {
            return prevCategories.filter((cat) => cat.urlLink != category.urlLink);
        });

    };

    const addNewCategory = async () => {
        if (!itemData.highlightText) return; // Prevent adding empty categories
        if (!itemData.highlightImage) {
            toaster.create({
                title: "A foto não foi carregada corretamente. Tente novamente e espere alguns segundos antes de criar a categoria",
                type: "error"
            });
        }
        try {
            // Enviar a nova categoria e os dados adicionais
            const createdCategory = await adminService.addNewCategory(
                JSON.stringify({ label: newCategoryName, highlightText: itemData.highlightText, highlightDescription: itemData.highlightDescription, highlightImage: itemData.highlightImage, urlLink: itemData.urlLink }),
                itemData
            );

            // Atualizar a lista de categorias
            setTypeCategorys((prev: any) => [
                ...prev,
                { label: newCategoryName, value: newCategoryName }
            ]);
            setNewCategoryName(""); // Limpar o input após adicionar
            setItemData({ highlightText: null, highlightDescription: null, highlightImage: null, urlLink: null, products: "[]" }); // Limpar os dados do item

            toaster.create({
                title: "Nova categoria criada com sucesso",
                type: "error"
            });
            fetchCategories()
        } catch (error) {
            console.error(error);
            toaster.create({
                title: "Erro ao criar categoria",
                type: "error"
            });
        }
    };

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="header">
                    <h1 className="title">Categorias</h1>
                    <p className="subtitle">Gerencie as categorias presentes em sua joalheria.</p>
                    <div className="actions">
                        <DialogRoot>
                            <DialogBackdrop />
                            <DialogTrigger asChild>
                                <Button className="createNewCategoryBtn">
                                    Criar categoria
                                </Button>
                            </DialogTrigger>
                            <DialogContent paddingX={12} paddingY={4}>
                                <DialogCloseTrigger />
                                <DialogHeader>
                                    <DialogTitle>Nova categoria</DialogTitle>
                                </DialogHeader>
                                <DialogBody>
                                    <div className="add-category">
                                        <Input
                                            type="text"
                                            value={itemData.highlightText}
                                            onChange={(e) => { setItemData({ ...itemData, highlightText: e.target.value }) }}
                                            placeholder="Nova categoria"
                                        />
                                        <Input
                                            type="text"
                                            value={itemData.highlightDescription}
                                            onChange={(e) => { setItemData({ ...itemData, highlightDescription: e.target.value }) }}
                                            placeholder="Descrição categoria"
                                        />
                                        <Input
                                            type="text"
                                            value={itemData.urlLink}
                                            onChange={(e) => { setItemData({ ...itemData, urlLink: e.target.value }) }}
                                            placeholder="URL categoria"
                                        />
                                        <Input
                                            type="file"
                                            onChange={async (e) => {
                                                const res = await adminService.upload(e);
                                                if (res) {
                                                    setItemData({ ...itemData, highlightImage: res });
                                                }
                                            }}
                                        />
                                    </div>
                                </DialogBody>
                                <DialogFooter>
                                    <Button onClick={addNewCategory} className="createNewCategoryBtn">
                                        Criar categoria
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </DialogRoot>

                        <Button onClick={saveCategories} className="savebtn">Salvar alterações</Button>
                    </div>
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
                                    {/*<button disabled>
                                        <TrashIcon />
                                    </button> */}
                                </AbsoluteCenter>
                            </Box>
                            <AccordionItemContent>
                                <img className="categoryImage" src={item.highlightImage} alt="Imagem da Categoria" />
                                <input type="file" placeholder="Alterar imagem" onChange={(e) => { changeImage(e, item) }} />
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
                                <Editable.Root
                                    disabled
                                    style={{ fontWeight: 600 }}
                                    size={"lg"}
                                    defaultValue={item.urlLink}
                                    placeholder={"URL:" + item.urlLink}
                                    activationMode="dblclick"
                                >
                                    <Editable.Preview />
                                    <Editable.Input
                                        value={item.urlLink}
                                        onChange={(e) => {
                                            setCategories((prevCategories) =>
                                                prevCategories.map((cat) =>
                                                    cat.urlLink === item.urlLink
                                                        ? { ...cat, urlLink: e.target.value }
                                                        : cat
                                                )
                                            );
                                        }}
                                    />
                                    <InfoTip content="Clique duas vezes para editar a url" />
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