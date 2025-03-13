import { Product } from "@/models/product";
import productService from "../../services/productService";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { typeCategorys } from "../../lib/utils";
import { InfoTip } from "../../components/ui/toggle-tip";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toaster } from "../../components/ui/toaster";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../components/ui/menu"
import { adminService } from "../../services/adminService";
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

export const ProductEditPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const { uid } = useParams();
    const [typeCategorys, setTypeCategorys] = useState(createListCollection({
        items: []
    }));
    const [newCategoryName, setNewCategoryName] = useState<string>("");

    const [novoTamanho, setNovoTamanho] = useState<string>();
    const [newPhoto, setNewPhoto] = useState<any>();

    const [itemData, setItemData] = useState<any>(
        {
            highlightText: null,
            highlightDescription: null,
            highlightImage: null,
            urlLink: null,
            products: "[]"
        }
    )

    const [uploadNewPicCategory, setUploadNewPicCategory] = useState<any>("")

    useEffect(() => {
        if (uid) {
            getProductAtual();
        }
    }, [uid]);

    const getProductAtual = async () => {
        if (uid) {
            const productAt: Product = await productService.getById(uid);
            setProduct(productAt);
        }
    };

    const handleFileUpload = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const uploadPhoto = await adminService.upload(event);
            setProduct((prevProduct: any) => {
                let photoURLs = [];

                try {
                    photoURLs = JSON.parse(prevProduct?.photoURL || '[]');
                } catch (error) {
                    console.error("Erro ao fazer o parse de photoURL:", error);
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
    };

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


    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategoryName(e.target.value);
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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (product) {
            setProduct({
                ...product,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleInputChangeTextArea = (e: React.ChangeEvent<any>) => {
        if (product) {
            setProduct({
                ...product,
                [e.target.name]: e.currentTarget.value,
            });
        }
    };

    const handleSave = async () => {
        if (product) {
            try {
                const updatedProduct: any = await productService.updateProduct(product);
                toaster.create({
                    title: "Produto editado com sucesso",
                    type: "success"
                });
            }
            catch (error) {
                toaster.create({
                    title: "Erro ao editar produto",
                    type: "error"
                });
            }

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
        // productService.deletePhoto(photoUrl).catch(error => console.error('Erro ao excluir foto:', error));
    };

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <section className="product-edit-page">
                    <div className="container">
                        <h1 className="page-title">
                            <Link to={window.location.origin + "/admin/products"}><ArrowLeftIcon /></Link>
                            Edição de Produtos
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
                                {product ? (
                                    <form className="product-form">
                                        <Editable.Root style={{ fontWeight: 600 }} size={"lg"} defaultValue={product.name_product} activationMode="dblclick">
                                            <Editable.Preview />
                                            <Editable.Input onChange={(e) => { setProduct({ ...product, name_product: e.target.value }) }} />
                                            <InfoTip content="Clique duas vezes para editar" />
                                        </Editable.Root>

                                        <div className="form-row">
                                            <label htmlFor="price">Preço do Produto<InfoTip content="Preço do produto. Não se esqueça que esse preço será subtraído com o desconto" /></label>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={product.price}
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
                                                value={product.desconto}
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
                                                value={product.quantidade_disponivel}
                                                onChange={handleInputChange}
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <label htmlFor="tamanhos">Tamanhos</label>
                                            <div className="sizes-box">
                                                {JSON.parse(product.tamanhos).map((size: string) => (
                                                    <Tag onClose={(e: any) => {
                                                        e.preventDefault()
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
                                                <button onClick={(e: any) => { e.preventDefault(); if (novoTamanho) setProduct({ ...product, tamanhos: JSON.stringify([...JSON.parse(product.tamanhos), novoTamanho]) }); setNovoTamanho("") }}>Adicionar Tamanho</button>
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
                                                                                const res = await adminService.upload(e);
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
                                            <label htmlFor="type_full_label">Tipo de Material</label>
                                            <input
                                                type="text"
                                                id="type_full_label"
                                                name="type_full_label"
                                                value={product.type_full_label}
                                                onChange={handleInputChange}
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
                                                value={product.personalizavel ? "true" : "false"}
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
                                                value={product.extensor}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-actions">
                                            <button type="button" onClick={handleSave} className="btn-save">
                                                Salvar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <p>Carregando...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
};