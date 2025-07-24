/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { Product } from "@/models/product";
import ProductRepository from "../../repositories/product";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createListCollection, Editable, Image, Input } from "@chakra-ui/react";
import "./producteditpage.css";
import { Tag } from "../../components/ui/tag";
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../components/ui/select";
import { InfoTip } from "../../components/ui/toggle-tip";
import { ArrowLeftIcon } from "lucide-react";
import { toaster } from "../../components/ui/toaster";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../components/ui/menu"
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
import { Button } from "../../components/ui/button";
import AdminRepository from "../../repositories/admin";

export const ProductAddPage = () => {
    const navigator = useNavigate();
    const [product, setProduct] = useState<Product>({
        id: 0, // ID ainda não atribuído, será gerado pelo backend
        name_product: "",
        price: 0,
        desconto: 0,
        quantidade_disponivel: 0,
        tamanhos: JSON.stringify([]),  // Lista de tamanhos inicializada como uma lista vazia
        categoryList: JSON.stringify([]),  // Mudança para um array vazio de categorias (não mais string)
        photoURL: JSON.stringify([]),  // Lista de URLs de fotos inicializada como uma lista vazia
        type_full_label: "",
        personalizavel: false,
        extensor: "",
        disponibilidade: 1,  // Produto disponível por padrão
        categoria: "", // Categoria do produto, inicializada como string vazia
        url: "", // URL do produto, inicializada como string vazia
        fornecedor: "", // Nome do fornecedor, inicializada como string vazia
        tipo: "", // Tipo de produto, inicializado como string vazia
        type: "",
    });
    const adminRepo = new AdminRepository();
    const productRepo = new ProductRepository();

    const [itemData, setItemData] = useState<any>(
        {
            highlightText: null,
            highlightDescription: null,
            highlightImage: null,
            urlLink: null,
            products: "[]"
        }
    )

    const [novoTamanho, setNovoTamanho] = useState<string>("");

    const [typeCategorys, setTypeCategorys] = useState<any[]>();
    const [newCategoryName, setNewCategoryName] = useState<string>("");

    const handleFileUpload = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const uploadPhoto = await adminRepo.upload(event);
            if (uploadPhoto) {
                setProduct((prevProduct: any) => {
                    let photoURLs = [];

                    try {
                        photoURLs = JSON.parse(prevProduct?.photoURL || '[]');
                    } catch (error: any) {
                        photoURLs = [];
                    }

                    return {
                        ...prevProduct,
                        photoURL: JSON.stringify([
                            ...photoURLs,
                            uploadPhoto,
                        ]),
                    };
                });
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            // Como não estamos editando um produto existente, chamamos a função de criar
            const newProduct = await productRepo.createProduct(product);
            toaster.create({
                title: "Produto adicionado com sucesso",
                type: "success"
            });
            setTimeout(() => {
                navigator("/admin/products")
            }, 1000);
            // Redirecionar ou resetar a página após o sucesso, se necessário
        } catch (error: any) {
            toaster.create({
                title: "Erro ao adicionar produto",
                type: "error"
            });
        }
    };

    const handleDeletePhoto = (photoUrl: string) => {
        // Se a foto não existe, não faz nada
        if (!product) return;

        // Recupera as fotos atuais e remove a URL da foto clicada
        const updatedPhotoURLs = JSON.parse(product.photoURL || '[]').filter((url: string) => url !== photoUrl);

        // Atualiza o estado do produto com as fotos restantes
        setProduct({
            ...product,
            photoURL: JSON.stringify(updatedPhotoURLs),
        });

        // Opcional: Aqui você pode chamar o serviço para remover a foto do backend, se necessário.
        // Exemplo:
        // ProductRepository.deletePhoto(photoUrl).catch(error => console.error('Erro ao excluir foto:', error));
    };

    const handleInputChangeTextArea = (e: React.ChangeEvent<any>) => {
        if (product) {
            setProduct({
                ...product,
                [e.target.name]: e.currentTarget.value,
            });
        }
    };

    useEffect(() => {
        // Requisição para obter as categorias
        const fetchCategories = async () => {
            try {
                const response = await adminRepo.getCategorys(); // Obtém as categorias via serviço
                const formattedCategories = response.map((category: any) => ({
                    label: category.category,  // Presumindo que `category` seja o nome da categoria
                    value: category.category,  // Presumindo que `id` seja o identificador da categoria
                }));
                setTypeCategorys(createListCollection({ items: formattedCategories }));
            } catch (error: any) {
                console.error('Erro ao carregar categorias:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategoryName(e.target.value);
    };

    const addNewCategory = async () => {
        if (!newCategoryName) return; // Prevent adding empty categories
        try {
            await adminRepo.addNewCategory(JSON.stringify({ label: newCategoryName }, itemData));
            setTypeCategorys((prev) => [
                ...prev,
                { label: newCategoryName, value: newCategoryName }
            ]);
            setNewCategoryName(""); // Clear the input after adding
        } catch (error: any) {
            toaster.create({
                title: "Erro ao criar categoria",
                type: "error"
            });
        }
    };

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <section className="product-edit-page">
                    <div className="container">
                        <h1 className="page-title">
                            <Link to={window.location.origin + "/admin/products"}><ArrowLeftIcon /></Link>
                            Adição de Produtos
                        </h1>
                        <div className="content-wrapper">
                            {/* Fotos */}
                            <div className="photos-box">
                                <div className="photos-gallery">
                                    {product &&
                                        <>
                                            {JSON.parse(product?.photoURL).length > 1 ? (
                                                <>
                                                    {JSON.parse(product?.photoURL).map((photo: any, key: number) => (
                                                        <MenuRoot key={key}>
                                                            <MenuTrigger asChild>
                                                                <Image
                                                                    boxSize={120}
                                                                    key={key}
                                                                    src={photo}
                                                                    alt={product?.name_product || 'Produto'}
                                                                    className="product-image"
                                                                />
                                                            </MenuTrigger>

                                                            <MenuContent>
                                                                <MenuItem
                                                                    value="delete"
                                                                    color="fg.error"
                                                                    _hover={{ bg: 'bg.error', color: 'fg.error' }}
                                                                    onClick={() => handleDeletePhoto(photo)}
                                                                >
                                                                    Excluir foto
                                                                </MenuItem>
                                                            </MenuContent>
                                                        </MenuRoot>

                                                    ))}
                                                </>
                                            ) : (
                                                <MenuRoot>
                                                    <MenuTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Image
                                                                src={JSON.parse(product.photoURL)[0]}
                                                                alt={product?.name_product || 'Produto'}
                                                                className="product-image-single"
                                                            />
                                                        </Button>
                                                    </MenuTrigger>

                                                    <MenuContent>
                                                        <MenuItem
                                                            value="delete"
                                                            color="fg.error"
                                                            _hover={{ bg: 'bg.error', color: 'fg.error' }}
                                                            onClick={() => handleDeletePhoto(JSON.parse(product.photoURL)[0])}
                                                        >
                                                            Excluir foto
                                                        </MenuItem>
                                                    </MenuContent>
                                                </MenuRoot>

                                            )}
                                        </>}
                                    <input type="file" onChange={(e) => handleFileUpload(e)} />
                                </div>
                            </div>

                            {/* Informações do produto */}
                            <div className="info-box">
                                <form className="product-form">
                                    <Editable.Root placeholder="Escreva o nome do produto" style={{ fontWeight: 600 }} size={"lg"} defaultValue={product?.name_product} activationMode="dblclick">
                                        <Editable.Preview />
                                        <Editable.Input placeholder="Escreva o nome do produto" onChange={(e) => { setProduct({ ...product, name_product: e.target.value }) }} />
                                        <InfoTip content="Clique duas vezes para editar" />
                                    </Editable.Root>

                                    <div className="form-row">
                                        <label htmlFor="price">Preço do Produto<InfoTip content="Preço do produto. Não se esqueça que esse preço será subtraído com o desconto" /></label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="desconto">Desconto <InfoTip content="Valor do desconto em R$, caso não queira desconto em seu produto, deixe em 0" /></label>
                                        <input
                                            type="number"
                                            id="desconto"
                                            name="desconto"
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="quantidade_disponivel">Quantidade Disponível <InfoTip content="Quantidade disponível no estoque do produto" /></label>
                                        <input
                                            type="number"
                                            id="quantidade_disponivel"
                                            name="quantidade_disponivel"
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="tamanhos">Tamanhos</label>
                                        <div className="sizes-box">
                                            {JSON.parse(product.tamanhos).map((size: string) => (
                                                <Tag onClose={() => {
                                                    const updatedSizes = JSON.parse(product.tamanhos).filter((item: string) => item !== size);
                                                    setProduct({ ...product, tamanhos: JSON.stringify(updatedSizes) });
                                                }} colorPalette="green" key={size}>
                                                    {size}
                                                </Tag>
                                            ))}
                                        </div>

                                        <div className="add-size">
                                            <input
                                                type="text"
                                                onChange={(e) => setNovoTamanho(e.target.value)}
                                                value={novoTamanho}
                                                placeholder="Novo Tamanho"
                                            />
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                if (novoTamanho) {
                                                    setProduct({ ...product, tamanhos: JSON.stringify([...JSON.parse(product.tamanhos), novoTamanho]) });
                                                    setNovoTamanho("");
                                                }
                                            }}>Adicionar Tamanho</button>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="categorias">Categorias</label>
                                        <div className="sizes-box">
                                            {JSON.parse(product.categoryList).map((category: string) => (
                                                <Tag colorPalette={"pink"} closable key={category}>{category.toUpperCase()}</Tag>
                                            ))}
                                        </div>
                                        {typeCategorys &&
                                            <SelectRoot multiple defaultValue={JSON.parse(product.categoryList)} collection={typeCategorys} size="sm" width="320px">
                                                <SelectTrigger>
                                                    <SelectValueText placeholder="Selecione as categorias" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeCategorys.items.map((category: any) => (
                                                        <SelectItem
                                                            item={category}
                                                            onClick={() => {
                                                                const currentCategoryList = JSON.parse(product.categoryList);
                                                                const categoryExists = currentCategoryList.includes(category.value);

                                                                // Se a categoria já existir, removemos, senão adicionamos
                                                                if (categoryExists) {
                                                                    setProduct({
                                                                        ...product,
                                                                        categoryList: JSON.stringify(currentCategoryList.filter(item => item !== category.value))
                                                                    });
                                                                } else {
                                                                    setProduct({
                                                                        ...product,
                                                                        categoryList: JSON.stringify([...currentCategoryList, category.value])
                                                                    });
                                                                }
                                                            }}
                                                            key={category.value}
                                                        >
                                                            {category.label.toUpperCase()}
                                                        </SelectItem>
                                                    ))}
                                                    <DialogRoot>
                                                        <DialogBackdrop />
                                                        <DialogTrigger asChild>
                                                            <Button className="createNewCategory">
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
                                                                            const res = await adminRepo.upload(e);
                                                                            if (res) {
                                                                                setItemData({ ...itemData, highlightImage: res });
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                            </DialogBody>
                                                            <DialogFooter>
                                                                <Button onClick={addNewCategory} className="createNewCategory">
                                                                    Criar categoria
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </DialogRoot>
                                                </SelectContent>
                                            </SelectRoot>
                                        }
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="type">Tipo de produto</label>
                                        <select
                                            id="type"
                                            name="type"
                                            onChange={(e) => handleInputChange({ target: { name: 'type', value: e.target.value } })}
                                        >
                                            <option defaultChecked value="jewelry">Joia/Semijoia</option>
                                            <option value="perfume">Perfume</option>
                                        </select>
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="type_full_label">Tipo de Material</label>
                                        <input
                                            disabled={product.type === "perfume"}
                                            type="text"
                                            id="type_full_label"
                                            name="type_full_label"
                                            onChange={() => {
                                                setProduct({
                                                    ...product, type_full_label: product.type === "perfume" ? "Perfume" : product.type_full_label
                                                })
                                            }}
                                            value={product.type === "perfume" ? "Perfume" : product.type_full_label}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="type_full_label">URL</label>
                                        <input
                                            type="text"
                                            id="type_full_label"
                                            name="type_full_label"
                                            onChange={(e) => setProduct({ ...product, url: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="type_full_label">Descrição do Produto</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={product.description}
                                            onChange={handleInputChangeTextArea}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="personalizavel">Personalizável</label>
                                        <select
                                            id="personalizavel"
                                            name="personalizavel"
                                            onChange={(e) => handleInputChange({ target: { name: 'personalizavel', value: e.target.value === "true" } })}
                                        >
                                            <option value="true">Sim</option>
                                            <option value="false">Não</option>
                                        </select>
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="extensor">Extensor</label>
                                        <input
                                            type="text"
                                            id="extensor"
                                            name="extensor"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" onClick={handleSave} className="btn-save">
                                            Salvar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
};
