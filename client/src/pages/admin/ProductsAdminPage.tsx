import { Product } from "@/models/product";
import productService from "../../services/productService";
import { Badge, Image, Table, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./productsadminpage.css";
import { ViewIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
    ActionBarContent,
    ActionBarRoot,
    ActionBarSelectionTrigger,
    ActionBarSeparator,
} from "../../components/ui/action-bar";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../components/ui/menu"
import { Checkbox } from "../../components/ui/checkbox";
import { LuTrash2 } from "react-icons/lu";
import { toaster } from "../../components/ui/toaster";
import { Link, useNavigate } from "react-router-dom";

export const ProductsAdminPage = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    useEffect(() => {
        fetchCategoryData();

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

    const fetchCategoryData = async () => {
        try {
            const searchedProducts: Product[] = await productService.getAll();
            setProducts(searchedProducts);
        } catch (error) {
            console.error("Failed to fetch category data:", error);
        }
    };
    // Função para lidar com a seleção do checkbox
    const handleCheckboxChange = (id: number, checked: boolean) => {
        setSelectedIds((prevSelectedIds) => {
            if (checked) {
                return [...prevSelectedIds, id]; // Adiciona o ID se marcado
            } else {
                return prevSelectedIds.filter((itemId) => itemId !== id); // Remove o ID se desmarcado
            }
        });
    };

    const navigator = useNavigate()

    const handleChangevisibility = async (value: "avaliable" | "unavaliable") => {
        await productService.changeVisibilityByList(selectedIds, value).then(() => {
            fetchCategoryData()
            setSelectedIds([])
            toaster.create({
                title: `Visibilidade dos produtos alterada para ${value == "avaliable" ? "Disponível" : "Indisponível"}.`,
                type: "success"
            })
        })
    };

    const deleteSelectedItems = async () => {
        await productService.deleteByList(selectedIds).then(() => {
            fetchCategoryData()
            setSelectedIds([])
            toaster.create({
                title: "Produtos excluidos com sucesso.",
                type: "success"
            })
        })
    }

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                {/* Título e Subtítulo */}
                <div className="header">
                    <h1 className="title">Gestão de Produtos</h1>
                    <p className="subtitle">Gerencie os produtos da sua loja de joias com facilidade.</p>
                </div>

                {/* Botões de Ação */}
                <div className="actions">
                    <Button onClick={() => navigator("/admin/products/add")} className="action-button">Adicionar Produto</Button>
                    <Button className="action-button">Filtrar Produtos</Button>
                    <Button className="action-button">Resetar Filtros</Button>
                </div>

                <div className="dashboard-table-content">
                    <Tabs.Root lazyMount unmountOnExit defaultValue="members" >
                        <Tabs.List>
                            <Tabs.Trigger value="members">
                                Tudo
                            </Tabs.Trigger>
                            <Tabs.Trigger value="projects">
                                Disponíveis
                            </Tabs.Trigger>
                            <Tabs.Trigger value="tasks">
                                Indisponiveis
                            </Tabs.Trigger>
                        </Tabs.List>
                        {/* Todos os Produtos */}
                        <Tabs.Content className="contentTab" value="members">
                            <Table.Root size="sm">
                                <Table.Header>
                                    <Table.Row className="rowTable">
                                        <Table.ColumnHeader></Table.ColumnHeader>
                                        <Table.ColumnHeader>Foto</Table.ColumnHeader>
                                        <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                        {!isMobile && <Table.ColumnHeader>Categorias</Table.ColumnHeader>}
                                        <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                                        <Table.ColumnHeader>Preço</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {products?.map((item: Product) => (
                                        <Table.Row className="rowTable" key={item.id}>
                                            <Table.Cell>
                                                <Checkbox
                                                    variant={"subtle"}
                                                    checked={selectedIds.includes(item.id)}
                                                    onCheckedChange={(e: any) =>
                                                        handleCheckboxChange(item.id, e.checked)
                                                    }
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link to={"/admin/products/" + item.id}>
                                                    <Image
                                                        src={JSON.parse(item.photoURL)[0]}
                                                        alt={item.name_product}
                                                        boxSize="50px"
                                                        objectFit="cover"
                                                        borderRadius="md"
                                                    /></Link>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link to={"/admin/products/" + item.id}>{item.name_product}</Link></Table.Cell>
                                            {!isMobile && <Table.Cell>
                                                <Link to={"/admin/products/" + item.id}>
                                                    <div className="section-item-list-admin">
                                                        {item &&
                                                            JSON.parse(item.categoryList)?.map(
                                                                (category: string, index: number) => (
                                                                    <div className="item-row-products-page" key={index}>
                                                                        <Badge>{category.toUpperCase()}</Badge>
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                </Link>
                                            </Table.Cell>}
                                            <Table.Cell>{item.type_full_label}</Table.Cell>
                                            <Table.Cell textAlign="end">R$ {item.price.toFixed(2)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Tabs.Content>

                        {/* Disponíveis */}
                        <Tabs.Content className="contentTab" value="projects">
                            <Table.Root size="sm">
                                <Table.Header>
                                    <Table.Row className="rowTable">
                                        <Table.ColumnHeader></Table.ColumnHeader>
                                        <Table.ColumnHeader>Foto</Table.ColumnHeader>
                                        <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                        {!isMobile && <Table.ColumnHeader>Categorias</Table.ColumnHeader>}
                                        <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="end">Preço</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {products
                                        ?.filter((item: Product) => item.disponibilidade === 1)
                                        .map((item: Product) => (
                                            <Table.Row className="rowTable" key={item.id}>
                                                <Table.Cell>
                                                    <Checkbox
                                                        variant={"subtle"}
                                                        checked={selectedIds.includes(item.id)}
                                                        onCheckedChange={(e: any) =>
                                                            handleCheckboxChange(item.id, e.checked)
                                                        }
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Link to={"/admin/products/" + item.id}>
                                                        <Image
                                                            src={JSON.parse(item.photoURL)[0]}
                                                            alt={item.name_product}
                                                            boxSize="50px"
                                                            objectFit="cover"
                                                            borderRadius="md"
                                                        /></Link>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Link to={"/admin/products/" + item.id}>{item.name_product}</Link></Table.Cell>
                                                {!isMobile && <Table.Cell>
                                                    <Link to={"/admin/products/" + item.id}>
                                                        <div className="section-item-list-admin">
                                                            {item &&
                                                                JSON.parse(item.categoryList)?.map(
                                                                    (category: string, index: number) => (
                                                                        <div className="item-row-products-page" key={index}>
                                                                            <Badge>{category.toUpperCase()}</Badge>
                                                                        </div>
                                                                    )
                                                                )}
                                                        </div>
                                                    </Link>
                                                </Table.Cell>}
                                                <Table.Cell>{item.type_full_label}</Table.Cell>
                                                <Table.Cell textAlign="end">R$ {item.price.toFixed(2)}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                </Table.Body>
                            </Table.Root>
                        </Tabs.Content>

                        {/* Sem Estoque */}
                        <Tabs.Content className="contentTab" value="tasks">
                            <Table.Root size="sm">
                                <Table.Header>
                                    <Table.Row className="rowTable">
                                        <Table.ColumnHeader></Table.ColumnHeader>
                                        <Table.ColumnHeader>Foto</Table.ColumnHeader>
                                        <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                        {!isMobile && <Table.ColumnHeader>Categorias</Table.ColumnHeader>}
                                        <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="end">Preço</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {products
                                        ?.filter((item: Product) => item.disponibilidade === 0)
                                        .map((item: Product) => (
                                            <Table.Row className="rowTable" key={item.id}>
                                                <Table.Cell>
                                                    <Checkbox
                                                        variant={"subtle"}
                                                        checked={selectedIds.includes(item.id)}
                                                        onCheckedChange={(e: any) =>
                                                            handleCheckboxChange(item.id, e.checked)
                                                        }
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Link to={"/admin/products/" + item.id}>
                                                        <Image
                                                            src={JSON.parse(item.photoURL)[0]}
                                                            alt={item.name_product}
                                                            boxSize="50px"
                                                            objectFit="cover"
                                                            borderRadius="md"
                                                        /></Link>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Link to={"/admin/products/" + item.id}>{item.name_product}</Link></Table.Cell>
                                                {!isMobile && <Table.Cell>
                                                    <Link to={"/admin/products/" + item.id}>
                                                        <div className="section-item-list-admin">
                                                            {item &&
                                                                JSON.parse(item.categoryList)?.map(
                                                                    (category: string, index: number) => (
                                                                        <div className="item-row-products-page" key={index}>
                                                                            <Badge>{category.toUpperCase()}</Badge>
                                                                        </div>
                                                                    )
                                                                )}
                                                        </div>
                                                    </Link>
                                                </Table.Cell>}
                                                <Table.Cell>{item.type_full_label}</Table.Cell>
                                                <Table.Cell textAlign="end">R$ {item.price.toFixed(2)}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                </Table.Body>
                            </Table.Root>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>

            {/* Barra de Ação */}
            <ActionBarRoot open={selectedIds.length > 0}>
                <ActionBarContent>
                    <ActionBarSelectionTrigger>{selectedIds.length} produtos selecionados</ActionBarSelectionTrigger>
                    <ActionBarSeparator />
                    <Button onClick={deleteSelectedItems} variant="outline" size="sm">
                        <LuTrash2 />
                        Deletar
                    </Button>
                    <MenuRoot>
                        <MenuTrigger>
                            <ViewIcon />
                            Disponibilidade
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItem onClick={() => handleChangevisibility('avaliable')} value="avaliable">
                                Adicionar a <Badge>DISPONÍVEL</Badge>
                            </MenuItem>
                            <MenuItem onClick={() => handleChangevisibility('unavaliable')} value="unavaliable">
                                Adicionar a <Badge>SEM ESTOQUE</Badge>
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>
                </ActionBarContent>
            </ActionBarRoot>
        </section>
    );
};
