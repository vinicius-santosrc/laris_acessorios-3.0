export interface OrderProps {
    uid: string;
    enderecoPedido: any;
    dadosPedido: any;
    precototal: any;
    paymentOption: "CART" | "PIX" | "DINHEIRO";
    desconto: any;
    subtotal: any;
    CuponsDescontos: any;
    CupomAtual: any;
}

export interface OrderAfterBuyProps {
    id: number,
    uid: string;
    address: string;
    items: any;
    user: any;
    order_totalprice: number;
    createdAt: any;
    paymentOption: 'CART' | 'PIX' | 'DINHEIRO';
    state: 'PREPARANDO' | 'ENTREGA' | 'FINALIZADO';
    situation: "PAGO" | "NAOPAGO";
    desconto: number;
    subtotal: number;
    cupom_desconto: number;
    cupom_name: string;

}