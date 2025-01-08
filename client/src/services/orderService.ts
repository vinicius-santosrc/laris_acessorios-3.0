import { toaster } from "../components/ui/toaster";

export class orderService {
    private static endpoint = process.env.REACT_APP_API_ENDPOINT;
    private static secretKey = process.env.REACT_APP_API_SECRET_KEY;
    private static preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

    constructor() { }

    static create = async (order: OrderProps) => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/orders/add`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: JSON.stringify(order.enderecoPedido),
                    items: JSON.stringify(order.dadosPedido.produtos),
                    user: JSON.stringify(order.dadosPedido.usuario),
                    totalprice: order.precototal,
                    paymentOption: order.paymentOption,
                    situation: order.paymentOption === "CART" ? 'PAGO' : 'NAOPAGO',
                    desconto: order.desconto,
                    subtotal: order.subtotal,
                    cupom_desconto: order.CuponsDescontos || 0,
                    cupons: order.CupomAtual ? order.CupomAtual.name : ''
                }),
            });

            if (response.ok) {
                toaster.create({
                    title: "Pedido realizado com sucesso",
                    type: "success"
                });

                localStorage.setItem('sacola', '[]');
            } else {
                toaster.create({
                    title: "Erro ao realizar pedido",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Erro ao criar o pedido:", error);
            toaster.create({
                title: "Erro de conexão",
                type: "error"
            });
        }
    };

    static getByUid = async (uid: string) => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/orders`;

        try {
            const request = await fetch(url);
            const data = await request.json();
            const orderFounded = data.find((order: any) => order.uid === uid)
            return orderFounded;
        }
        catch (error) {
            console.error("Erro ao pegar a order " + uid + ": ", error)
        }
    }

    static getByUser = async (userId: string) => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/orders`;

        try {
            const request = await fetch(url);
            const data = await request.json();
            return data;
        }
        catch (error) {
            console.error("Erro ao pegar a orders", error)
        }
    }
}