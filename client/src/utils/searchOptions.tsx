import { LayoutDashboard, BoxIcon, ListIcon, Users, ListOrdered, Calendar, FactoryIcon, FileText, DatabaseIcon, Settings } from "lucide-react";
import OrderRepository from "../repositories/order";
import ProductRepository from "../repositories/product";

export const DASHBOARD_SEARCH_OPTIONS = async () => {
  const baseJson = [
    { label: "Dashboard", value: "dashboard", url: "/admin", icon: <LayoutDashboard /> },
    { label: "Produtos", value: "produtos", url: "/admin/products", icon: <BoxIcon /> },
    { label: "Adicionar Produto", value: "add-product", url: "/admin/products/add", icon: <BoxIcon /> },
    { label: "Categorias", value: "categories", url: "/admin/categories", icon: <ListIcon /> },
    { label: "Clientes", value: "clients", url: "/admin/clients", icon: <Users /> },
    { label: "Pedidos", value: "orders", url: "/admin/orders", icon: <ListOrdered /> },
    { label: "Planejamentos", value: "planning", url: "/admin/planning", icon: <Calendar /> },
    { label: "Facilitys", value: "facilitys", url: "/admin/facilitys", icon: <FactoryIcon /> },
    { label: "Relatórios", value: "reports", url: "/admin/reports", icon: <FileText /> },
    { label: "Planilha Itens", value: "planilha-itens", url: "/admin/sheet/planilha-itens", icon: <DatabaseIcon /> },
    { label: "Planilha Finanças", value: "planilha-financas", url: "/admin/sheet/planilha-despesas", icon: <DatabaseIcon /> },
    { label: "Configurações", value: "config", url: "/admin/config", icon: <Settings /> },
  ];

  const orders = await OrderRepository.getAll();
  const productRepo = new ProductRepository();
  const products = await productRepo.getAll();

  const mappedOrders = orders?.map((order: any) => ({
    label: `Pedido #${order.id}`,
    value: `order-${order.id}`,
    url: `/admin/orders/${order.id}`,
    icon: <BoxIcon />
  })) ?? [];

  const mappedProducts = products?.map((product: any) => ({
    label: product.name_product,
    value: `product-${product.id}`,
    url: `/admin/products/${product.uid}`,
    icon: <img src={JSON.parse(product.photoURL)[0]} alt="Product" style={{ width: "16px", height: "16px", borderRadius: "4px" }} />
  })) ?? [];

  return [...baseJson, ...mappedOrders, ...mappedProducts];
};