import { Product } from "@/models/product";
import productService from "../../services/productService";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { toaster } from "../../components/ui/toaster";
import Compressor from 'compressorjs';

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
        tipo: "" // Tipo de produto, inicializado como string vazia
    });

    const [novoTamanho, setNovoTamanho] = useState<string>("");

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
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            // Como não estamos editando um produto existente, chamamos a função de criar
            const newProduct = await productService.createProduct(product);
            toaster.create({
                title: "Produto adicionado com sucesso",
                type: "success"
            });
            setTimeout(() => {
                navigator("/admin/products")
            }, 1000);
            // Redirecionar ou resetar a página após o sucesso, se necessário
        } catch (error) {
            toaster.create({
                title: "Erro ao adicionar produto",
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
                                                        <Image
                                                            boxSize={120}
                                                            key={key}
                                                            src={photo}
                                                            alt={product?.name_product || 'Produto'}
                                                            className="product-image"
                                                        />
                                                    ))}
                                                </>
                                            ) : (
                                                <Image
                                                    src={JSON.parse(product.photoURL)[0]}
                                                    alt={product?.name_product || 'Produto'}
                                                    className="product-image-single"
                                                />
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
                                            {JSON.parse(product?.categoryList).map((category: string) => (
                                                <Tag colorPalette={"pink"} closable key={category}>{category.toUpperCase()}</Tag>
                                            ))}
                                        </div>
                                        <SelectRoot multiple defaultValue={JSON.parse(product?.categoryList)} collection={typeCategorys} size="sm" width="320px">
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
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="type_full_label">URL</label>
                                        <input
                                            type="text"
                                            id="type_full_label"
                                            name="type_full_label"
                                            onChange={(e) => setProduct({...product, url: e.target.value})}
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
