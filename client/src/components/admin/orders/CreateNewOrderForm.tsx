import React, { useEffect, useState } from "react";
import { ShippingItem } from "../../../models/shipping";
import { formatCEP, formatCPF, formatTelefone, gerarUidComCaracteresENumeros, getCEPJson } from "../../../lib/utils";
import { OrderProps } from "../../../models/order";
import {
    Avatar,
    Checkbox,
    createListCollection,
    Image,
    Input,
    Select,
    useSelectContext
} from "@chakra-ui/react";
import "./CreateNewOrderForm.css";
import { Product } from "../../../models/product";
import productService from "../../../services/productService";
import { UserProps } from "../../../models/user";
import { clientsService } from "../../../services/clientsService";
import { Button } from "../../../components/ui/button";
import { Edit } from "lucide-react";
import { ShippingService } from "../../../services/shippingService";
import { CepProps } from "../../../models/cep";
import { toaster } from "../../../components/ui/toaster";
import { orderService } from "../../../services/orderService";
import { adminService } from "../../../services/adminService";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../../components/ui/menu"

const CreateNewOrderForm = () => {
    const [items, setItems] = useState<any[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [desconto, setDesconto] = useState<number>(0);
    const [cep, setCep] = useState<string>("");

    const [shippingDays, setShippingDays] = useState<any>(null);
    const [shippingCost, setShippingCost] = useState<any>(null);
    const [isCepValid, setIsCepValid] = useState<boolean>(false);

    const [estado, setEstado] = useState<any>(null);
    const [cidade, setcidade] = useState<any>(null);
    const [bairro, setbairro] = useState<any>(null);
    const [endereco, setendereco] = useState<any>(null);
    const [numero, setnumero] = useState<any>(null);
    const [referencia, setreferencia] = useState<any>(null);

    // States for Step 0
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [cpf, setCPF] = useState<string>("");
    const [telefone, setTel] = useState<string>("");

    const [shippingDetails, setShippingDetails] = useState<ShippingItem[]>([]);
    const [shipMethodSelected, setShipMethod] = useState<ShippingItem>();

    //States for Step 1
    const [paymentMethodSelected, setPaymentMethodSelected] = useState<any>("PIX");
    const [parcelamento, setParcelamento] = useState<any>();
    const [cpfTitular, setCPFTITULAR] = useState<any>();

    const [userHasAccount, setUserHasAccount] = useState<boolean>(false);
    const orderUid = gerarUidComCaracteresENumeros();

    const [products, setAllProducts] = useState<Product[]>([]);
    const [allClientes, setClients] = useState<UserProps[]>([]);

    const [user, setUser] = useState<UserProps>();

    const [hasAddress, setHasAddress] = useState<boolean>(false);

    const [newProduct, setNewProduct] = useState({
        name: "",
        size: "",
        photoURL: "",
        price: 0,
        desconto: 0
    });

    const addNewProduct = () => {
        if (!newProduct.name || !newProduct.size || !newProduct.photoURL) {
            toaster.create({
                title: "Por favor, preencha todos os campos do novo produto.",
                type: "error"
            });
            return;
        }

        const productToAdd = {
            id: "999999", // Gerar um ID único
            name_product: newProduct.name,
            size: newProduct.size,
            photoURL: JSON.stringify([newProduct.photoURL]),
            price: newProduct.price, // Defina um preço padrão ou adicione um campo para preço
            desconto: newProduct.desconto, // Defina um desconto padrão
            disponibilidade: 1,
            tamanhos: JSON.stringify([newProduct.size]),
            quantidade_disponivel: 1,
            categoria: "Não categorizado", // Defina uma categoria padrão
            url: "", // URL do produto
            fornecedor: "", // Fornecedor do produto
            tipo: "jewelry", // Tipo do produto
            personalizavel: false,
            extensor: "",
            type_full_label: "",
            categoryList: [],
            description: "",
            availableForImmediateDelivery: false
        };

        console.log(productToAdd)

        setItems([...items, productToAdd]);
        setNewProduct({ name: "", size: "", photoURL: "" }); // Limpar campos após adicionar
        toaster.create({
            title: "Produto adicionado com sucesso!",
            type: "success"
        });
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProducts: Product[] = await productService.getAll();
                setAllProducts(fetchedProducts);
            } catch (err: any) {
                throw Error(err);
            }
        };

        const fetchClients = async () => {
            try {
                const searchedProducts: UserProps[] = await clientsService.getAll();
                setClients(searchedProducts);
            } catch (error: any) {
                console.error("Failed to fetch category data:", error);
            }
        };

        fetchClients();
        fetchProduct();
    }, []);

    const productCollection = createListCollection({
        items: products.map((produto) => ({
            id: produto.id,
            name: produto.name_product,
            avatar: JSON.parse(produto.photoURL)[0],
        })),
        itemToString: (item) => item.name,
        itemToValue: (item) => item.id,
    });

    const clientesCollection = createListCollection({
        items: allClientes.map((client: UserProps) => ({
            id: client.id,
            name: client.nome_completo,
            avatar: client.photoURL,
        })),
        itemToString: (item) => item.name,
        itemToValue: (item) => item.id,
    });

    const fetchShippingInfo = async () => {
        if (cep.length !== 9) {
            setIsCepValid(false);
            return;
        }

        setIsCepValid(true);

        try {
            const cepReturned: CepProps = await getCEPJson(cep);
            const detailsShipping: any = await ShippingService.getShippingOptionsByCep(cep);
            detailsShipping.push({
                id: 4,
                name: "Retirada",
                price: "0.00",
                custom_price: "0.00",
                discount: "0.00",
                currency: "R$",
                delivery_time: 0,
                delivery_range: {
                    min: 0,
                    max: 0
                },
                custom_delivery_time: 0,
                custom_delivery_range: {
                    min: 0,
                    max: 0
                },
                packages: [],
                additional_services: {
                    receipt: false,
                    own_hand: false,
                    collect: false
                },
                additional: {
                    unit: {
                        price: 0,
                        delivery: 0
                    }
                },
                company: {
                    id: 3,
                    name: "Retirada",
                    picture: ""
                }
            });
            setShippingDetails(detailsShipping);
            calculateTotal(items);
            if (!cepReturned.localidade) {
                setIsCepValid(false);
            }

            if (!cepReturned.localidade) {
                toaster.create({
                    title: "Não foi possível encontrar o cep informado, insira os dados manualmente",
                    type: "error"
                })
            }

            setcidade(cepReturned.localidade);
            setEstado(cepReturned.estado);
            setbairro(cepReturned.bairro);
            setendereco(cepReturned.logradouro)
            setTotal(total + shippingCost)

        } catch (error: any) {
            console.error("Erro ao buscar informações de entrega", error);
        }
    };

    const userNotLogged = {
        cpf: cpf,
        cupons: '[]',
        cupons_usados: '[]',
        email: email,
        id: 2,
        label: "default",
        nome_completo: name,
        photoURL: "",
        uid: ""
    };

    const dadosPedido = {
        "usuario": {
            ...user || userNotLogged,
            "telefone": telefone
        },
        "produtos": items,
    };

    const enderecoPedido = {
        "endereço": endereco,
        "bairro": bairro,
        "cidade": cidade,
        "estado": estado,
        "cep": cep,
        "referencia": referencia,
        "numero": numero,
        "shippingMethodSelected": shipMethodSelected,
        "shippingCust": shipMethodSelected?.price,
        "shippingDeliveryTime": shipMethodSelected?.delivery_time,
        "codigoRastreio": ""
    };

    const calculateTotal = (items: Product[]) => {
        const newSubtotal = items.reduce((acc, item) => acc + item.price, 0);
        let descontoTotal = 0;

        items.forEach((item) => {
            if (item.desconto > 0) {
                descontoTotal += item.desconto;
            }
        });

        setSubtotal(newSubtotal);
        setDesconto(descontoTotal);
        const deliveryCost = Number(shippingCost) || 0;
        setTotal(newSubtotal - descontoTotal + deliveryCost);
    };

    const orderContent: OrderProps = {
        uid: orderUid,
        enderecoPedido: enderecoPedido,
        dadosPedido: dadosPedido,
        precototal: total,
        paymentOption: paymentMethodSelected,
        desconto: desconto,
        subtotal: subtotal,
        CuponsDescontos: 0,
        CupomAtual: ''
    };
    const selectShippingMethod = (shippingItem: ShippingItem) => {
        setShipMethod(shippingItem);
        setShippingDays(shippingItem.delivery_time);
        setShippingCost(shippingItem.price);
        calculateTotal(items);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Use optional chaining to safely access the first file
        if (file) {
            try {
                const uploadPhoto = await adminService.upload(event); // Upload the file
                if (uploadPhoto) {
                    // Update the newProduct state with the uploaded photo URL
                    setNewProduct((prevProduct) => ({
                        ...prevProduct,
                        photoURL: [uploadPhoto], // Store the uploaded photo URL
                    }));
                }
            } catch (error) {
                console.error("Error uploading file:", error); // Log any errors during upload
            }
        }
    };

    const handleDeletePhoto = (photoUrl: string) => {
        // Check if newProduct exists
        if (!newProduct) return;

        // Parse the current photo URLs and filter out the one to be deleted
        const updatedPhotoURLs = JSON.parse(newProduct.photoURL || '[]').filter((url: string) => url !== photoUrl);

        // Update the state with the remaining photo URLs
        setNewProduct({
            ...newProduct,
            photoURL: JSON.stringify(updatedPhotoURLs), // Store the updated photo URLs
        });

        // Optional: Call a service to remove the photo from the backend if necessary
        // productService.deletePhoto(photoUrl).catch(error => console.error('Error deleting photo:', error));
    };

    const handleFinalize = async () => {
        calculateTotal(items);
        calculateTotal(items);
        if ((!user && (name == "" || telefone == "")) || items.length <= 0) {
            toaster.create({
                title: "Preencha todas as informações"
            });
            return;
        }

        try {
            await orderService.createByAdmin(orderContent);
        }
        catch (error) {
            toaster.create({
                title: "Não foi possível criar o pedido.",
                type: "error"
            });
            return error;
        };
    }

    const removeItem = (itemId: string) => {
        setItems(items.filter(item => item.id !== itemId));
        calculateTotal(items.filter(item => item.id !== itemId)); // Recalcula o total após a remoção
    };

    return (
        <div className="admin-createnew-order">
            <div className="step-createnew-order">
                <h1>1. Usuário</h1>
                <div className="non-account">
                    <input type="checkbox" id='checkbox' onChange={(e) => { setUserHasAccount(e.target.checked); setUser(null) }} />
                    <label htmlFor="checkbox">O cliente não possui conta cadastrada no site.</label>
                </div>
                {!userHasAccount ?
                    <div className="has-account">
                        <Select.Root
                            multiple={false}
                            collection={clientesCollection}
                            size="sm"
                            width="240px"
                            positioning={{ sameWidth: true }}
                            onValueChange={(value) => {
                                setUser(allClientes.find((product) => product.id === value.items[0].id))
                            }
                            }
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    {user?.nome_completo ?? 'Selecione o cliente'}
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                                <Select.Content>
                                    {clientesCollection.items.map((item) => (
                                        <Select.Item item={item} key={item.id} justifyContent="flex-start">
                                            <Avatar.Root shape="rounded" size="2xs">
                                                <Avatar.Image src={item.avatar} alt={item.name} />
                                                <Avatar.Fallback name={item.name} />
                                            </Avatar.Root>
                                            <div>
                                                <h2>{item.name}</h2>
                                            </div>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Select.Root>
                    </div>
                    :
                    <div className="hasnt-account">
                        <Input placeholder="Nome completo * " required={true} value={name} onChange={(e) => setName(e.target.value)} />
                        <Input placeholder="E-mail" required={false} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input placeholder="CPF" required={false} value={cpf} maxLength={14} onChange={(e) => setCPF(formatCPF(e.target.value))} />
                        <Input placeholder="Telefone para contato" required={false} value={telefone} maxLength={15} onChange={(e) => setTel(formatTelefone(e.target.value))} />
                    </div>
                }
            </div>

            <div className="step-createnew-order">
                <h1>2. Produtos da compra</h1>
                <Select.Root
                    multiple={true}
                    collection={productCollection}
                    size="sm"
                    width="240px"
                    positioning={{ sameWidth: true }}
                    onValueChange={(value) =>
                        setItems(
                            value.items
                                .map((item) =>
                                    products.find((product) => product.id === item.id)
                                )
                                .filter((product) => product !== undefined)
                        )
                    }
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            Selecione os produtos
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                        <Select.Content>
                            {productCollection.items.map((item) => (
                                <Select.Item item={item} key={item.id} justifyContent="flex-start">
                                    <Avatar.Root shape="rounded" size="2xs">
                                        <Avatar.Image src={item.avatar} alt={item.name} />
                                        <Avatar.Fallback name={item.name} />
                                    </Avatar.Root>
                                    <div>
                                        <h2>{item.name}</h2>
                                    </div>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Select.Root>

                <div className="product-list">
                    {items.length > 0 && <h2>Produtos adicionados:</h2>}
                    {items.map((item, index) => {
                        const photosProduct = JSON.parse(item.photoURL);
                        return (
                            <div className="item-cart-box" key={item.id}>
                                <div className="item-cart-box__inside">
                                    <div className="item-info">
                                        <div className="item-left-side">
                                            <img src={photosProduct.length > 1 ? photosProduct[0] : photosProduct} alt={item.name_product} />
                                        </div>
                                        <div className="item-right-side">
                                            <h1>{item.name_product} - {item.size}</h1>
                                            <p>{item.type_full_label}</p>
                                        </div>
                                    </div>
                                    <div className="item-middle">
                                        {item.desconto > 0 ?
                                            <h1><s style={{ color: "gray" }}> R$ {(item.price).toFixed(2)}</s> R$ {(item.price - item.desconto).toFixed(2)}</h1>
                                            :
                                            <h1 style={{ color: "#be0a45" }}>R$ {(item.price - item.desconto).toFixed(2)}</h1>
                                        }
                                    </div>
                                    <div className="item-right-side">
                                        <Button onClick={() => removeItem(item.id)}>Remover</Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className="item-cart-box">
                        <div className="item-cart-box__inside">
                            <div className="item-info">
                                <div className="item-left-side">
                                    <Input
                                        placeholder="Nome do produto"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Tamanho"
                                        value={newProduct.size}
                                        onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                                    />
                                    <MenuRoot>
                                        <MenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Image
                                                    src={newProduct.photoURL}
                                                    alt={newProduct?.name || 'Produto'}
                                                    className="product-image-single"
                                                />
                                            </Button>
                                        </MenuTrigger>

                                        <MenuContent>
                                            <MenuItem
                                                value="delete"
                                                color="fg.error"
                                                _hover={{ bg: 'bg.error', color: 'fg.error' }}
                                                onClick={() => handleDeletePhoto(JSON.parse(newProduct.photoURL))}
                                            >
                                                Excluir foto
                                            </MenuItem>
                                        </MenuContent>
                                    </MenuRoot>
                                    <br />
                                    <input type="file" onChange={(e) => handleFileUpload(e)} />
                                    <Input
                                        placeholder="Preço"
                                        value={newProduct.price}
                                        type="number"
                                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                    />
                                    <Input
                                        placeholder="Desconto"
                                        value={newProduct.desconto}
                                        type="number"
                                        onChange={(e) => setNewProduct({ ...newProduct, desconto: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="item-middle">
                                    <Button onClick={addNewProduct}>Adicionar Produto</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="step-createnew-order">
                <h1>3. Endereço para entrega</h1>
                <div className="non-account">
                    <input type="checkbox" id='checkbox2' onChange={(e) => { setHasAddress(e.target.checked); setCep(""); }} />
                    <label htmlFor="checkbox2">Não adicionar endereço de entrega para esse pedido (não recomendado).</label>
                </div>
                {!hasAddress &&
                    <div className="items-component-checkout">
                        {isCepValid ? (
                            <>
                                <label><b>Receber</b> {items.length} itens em <span>{cep}</span> <Button onClick={() => { setIsCepValid(false) }}><Edit /></Button></label>
                                {!shipMethodSelected?.id && <label style={{ color: "red" }}>* Selecione uma opção de frete</label>}
                                <div className="typeAddressSelected">
                                    {shippingDetails.map((item: ShippingItem) => {
                                        return (
                                            <div key={item.name}>
                                                <Checkbox.Root width={"full"} checked={shipMethodSelected?.id === item.id}>
                                                    <Checkbox.HiddenInput />
                                                    <Checkbox.Control />
                                                    <Checkbox.Label width={"full"} style={{ width: "100% !importabt" }} cursor={"pointer"} color={"black"}>
                                                        <div onClick={() => selectShippingMethod(item)} className="addressItem">
                                                            <div className="addressItem">
                                                                <div className="addressItem__insideleft">
                                                                    <p>{item.company.name} ({item.name})</p>
                                                                    {item.company.name != "Retirada" ? <p>Em até {item.delivery_time} dias úteis</p> : <>Retire o produto em Pouso Alegre - MG</>}
                                                                </div>
                                                                <div className="addressItem__insideright">
                                                                    {item.company.name != "Retirada" ? <p>{item.currency} {item.price}</p> : <></>}
                                                                </div>
                                                            </div>
                                                        </div></Checkbox.Label>
                                                </Checkbox.Root>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Digite o CEP"
                                    value={formatCEP(cep)}
                                    onChange={(e) => setCep(formatCEP(e.target.value))}
                                    onBlur={fetchShippingInfo}
                                    background={"var(--cinza-principal)"}
                                    padding={2}
                                    maxLength={9}
                                />
                            </div>
                        )}
                        {isCepValid &&
                            <React.Fragment>
                                <div className="inputbox">
                                    <label>Cidade</label>
                                    <Input
                                        value={cidade}
                                        onChange={(e) => setcidade(e.target.value)}
                                        placeholder="Insira a cidade aqui"
                                        background={"var(--cinza-principal)"}
                                        padding={2}
                                        variant={"subtle"}
                                    />
                                </div>
                                <div className="inputbox">
                                    <label>Estado</label>
                                    <Input
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        placeholder="Insira o estado aqui"
                                        background={"var(--cinza-principal)"}
                                        padding={2}
                                        variant={"subtle"}
                                    />
                                </div>
                                <div className="inputbox">
                                    <label>Bairro</label>
                                    <Input
                                        value={bairro}
                                        onChange={(e) => setbairro(e.target.value)}
                                        placeholder="Insira o bairro aqui"
                                        background={"var(--cinza-principal)"}
                                        padding={2}
                                        variant={"subtle"}
                                    />
                                </div>
                                <div className="inputbox">
                                    <label>Endereço</label>
                                    <Input
                                        value={endereco}
                                        onChange={(e) => setendereco(e.target.value)}
                                        placeholder="Insira o endereço aqui"
                                        background={"var(--cinza-principal)"}
                                        padding={2}
                                        variant={"subtle"}
                                    />
                                </div>
                                <div className="inputbox">
                                    <label>Número</label>
                                    <Input
                                        value={numero}
                                        onChange={(e) => setnumero(e.target.value)}
                                        placeholder="Insira o número aqui"
                                        background={"var(--cinza-principal)"}
                                        padding={2}
                                        variant={"subtle"}
                                    />
                                </div>
                                <div className="inputbox">
                                    <label>Referencia</label>
                                    <Input
                                        value={referencia}
                                        onChange={(e) => setreferencia(e.target.value)}
                                        placeholder="Insira a referencia aqui"
                                        background={"var(--cinza-principal)"}
                                        padding={2}
                                        variant={"subtle"}
                                    />
                                </div>
                            </React.Fragment>
                        }
                    </div>
                }
            </div>
            <div className="step-createnew-order">
                <h1>4. Pagamento</h1>
                <label>Forma de pagamento: </label>
                <select onChange={(e) => setPaymentMethodSelected(e.target.value)}>
                    <option value={"CART"}>Cartão de Crédito</option>
                    <option selected value={"PIX"}>Pix</option>
                </select>
            </div>
            <div className="step-createnew-order">
                <h1>5. Finalizar</h1>
                <Button onClick={handleFinalize} className="createNewCategoryBtn">Criar pedido</Button>
            </div>
        </div>
    )
}

export default CreateNewOrderForm;
