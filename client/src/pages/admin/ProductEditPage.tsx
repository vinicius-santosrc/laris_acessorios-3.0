import { Product } from "@/models/product";
import productService from "../../services/productService";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Editable, Image } from "@chakra-ui/react";
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
import Compressor from 'compressorjs';
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../components/ui/menu"

export const ProductEditPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const { uid } = useParams();

    const [novoTamanho, setNovoTamanho] = useState<string>();
    const [newPhoto, setNewPhoto] = useState<any>();

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
            new Compressor(file, {
                success(result: any) {
                    const formData = new FormData();
                    formData.append('image', result, result.name);  // Envia o arquivo compactado (não em base64)
                    formData.append('key', "f559d2e043626a1955fb14d57caec1e2"); // Adicione sua chave de API

                    // Fazendo a requisição POST
                    fetch('https://api.imgbb.com/1/upload', {
                        method: 'POST',
                        body: formData,  // O corpo da requisição será o FormData
                    })
                        .then(response => response.json())
                        .then(response => {
                            if (response.success) {
                                console.log('Upload successful:', response.data.url); // URL da imagem carregada

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
                                            response.data.url,
                                        ]),
                                    };
                                });
                            } else {
                                console.error('Upload failed:', response.error.message);
                            }
                        })
                        .catch(error => {
                            console.error('Error during upload:', error);
                        });
                },
                error(err: any) {
                    console.error('Error during image compression:', err.message);
                }
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
                                            <SelectRoot multiple defaultValue={JSON.parse(product.categoryList)} collection={typeCategorys} size="sm" width="320px">
                                                <SelectTrigger>
                                                    <SelectValueText placeholder="Selecione as categorias" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeCategorys.items.map((category) => (
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

                                                </SelectContent>
                                            </SelectRoot>
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