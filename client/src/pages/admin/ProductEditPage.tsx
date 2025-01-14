import { Product } from "@/models/product";
import productService from "../../services/productService";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Editable, Image } from "@chakra-ui/react";
import "./producteditpage.css";
import { Tag } from "../../components/ui/tag";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../components/ui/select"
import { typeProductList } from "../../lib/utils";
import { InfoTip } from "../../components/ui/toggle-tip";
import { ArrowLeftIcon } from "lucide-react";
import { FileUploadList, FileUploadRoot, FileUploadTrigger } from "../../components/ui/file-upload";
import { Button } from "../../components/ui/button";
import { HiUpload } from "react-icons/hi";

export const ProductEditPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const { uid } = useParams();
    const [productPhotos, setProductPhotos] = useState<string[]>([]);

    useEffect(() => {
        if (uid) {
            getProductAtual();
        }
    }, [uid]);

    const getProductAtual = async () => {
        if (uid) {
            const productAt: Product = await productService.getById(uid);
            setProduct(productAt);
            setProductPhotos(JSON.parse(productAt.photoURL));
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
        /*if (product) {
            const updatedProduct = await productService.updateProduct(product);
            if (updatedProduct) {
                alert("Produto atualizado com sucesso!");
            } else {
                alert("Erro ao atualizar o produto.");
            }
        }*/
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
                                    {productPhotos.length > 1 ? (
                                        <>{productPhotos.map((photo, key) => (
                                            <Image
                                                boxSize={120}
                                                key={key}
                                                src={photo}
                                                alt={product?.name_product || 'Produto'}
                                                className="product-image"
                                            />
                                        ))
                                        }
                                        </>
                                    ) : (
                                        <Image
                                            src={productPhotos[0]}
                                            alt={product?.name_product || 'Produto'}
                                            className="product-image-single"
                                        />

                                    )}
                                    <FileUploadRoot>
                                        <FileUploadTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <HiUpload /> Upload file
                                            </Button>
                                        </FileUploadTrigger>
                                        <FileUploadList />
                                    </FileUploadRoot>
                                </div>
                            </div>

                            {/* Informações do produto */}
                            <div className="info-box">
                                {product ? (
                                    <form className="product-form">
                                        {product &&
                                            <Editable.Root style={{ fontWeight: 600 }} size={"lg"} defaultValue={product.name_product} activationMode="dblclick">
                                                <Editable.Preview />
                                                <Editable.Input />
                                            </Editable.Root>
                                        }
                                        <div className="form-row">
                                            <label htmlFor="price">Preço do Produto<InfoTip content="Preço do produto. Não se esqueça que esse preço será subtraido com o desconto" /></label>
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
                                                {JSON.parse(product.tamanhos).map((size: string) => {
                                                    return <Badge colorPalette="green">{size}</Badge>
                                                })}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <label htmlFor="tamanhos">Categorias</label>
                                            <div className="sizes-box">
                                                {JSON.parse(product.categoryList).map((size: string) => {
                                                    return <Tag closable>{size.toUpperCase()}</Tag>
                                                })}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <label htmlFor="fornecedor">Fornecedor <InfoTip content="Não informado ao cliente, somente mostrado aos administradores" /></label>
                                            <input
                                                type="text"
                                                id="fornecedor"
                                                name="fornecedor"
                                                value={product.fornecedor}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <label htmlFor="tipo">Tipo</label>
                                            <SelectRoot value={[product.tipo]} collection={typeProductList}>
                                                <SelectTrigger>
                                                    <SelectValueText placeholder="Selecione o tipo do produto" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeProductList.items.map((movie: any) => (
                                                        <SelectItem
                                                            item={movie}
                                                            key={movie.value}>
                                                            {movie.label}
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
