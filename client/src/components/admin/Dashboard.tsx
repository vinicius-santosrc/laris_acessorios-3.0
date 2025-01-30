import { HiCash } from 'react-icons/hi';
import './dashboard/dashboard.css';
import cash from "./undraw_savings_uwjn.svg";
import { useEffect, useState } from 'react';
import productService from '../../services/productService';
import { clientsService } from '../../services/clientsService';
import { Badge, Table } from '@chakra-ui/react';
import { adminService } from '../../services/adminService';
import { UserProps } from '../../models/user';
import { formatCPF, getFirstAndLastName } from '../../lib/utils';
import ApexCharts from 'react-apexcharts';  // Importando ApexCharts
import { Product } from '@/models/product';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const [lucroAtual, setLucro] = useState<number>(0);
    const [sales, setSales] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [expenses, setExpenses] = useState([]);

    // Função para pegar os itens de vendas, clientes e despesas
    const getItems = async () => {
        const products = await productService.getAll();
        const clients = await clientsService.getAll();
        const expensesSheet = await adminService.getSheet("planilha-despesas");

        setProducts(products);
        setUsers(clients);
        setExpenses(expensesSheet);

        const totalSales = sales.reduce((acc: number, sale: any) => acc + sale.price, 0);
        const totalExpenses = expenses.reduce((acc: number, expense: any) => acc + expense.amount, 0);
        const lucro = totalSales - totalExpenses;
        setLucro(lucro);
    };

    // Função para calcular os percentuais de lucro do mês atual
    const getProfitPercentageOfThisMonth: any = () => {
        const groupedData: any = { "Tudo": { entradas: 0, saidas: 0, items: [] } };

        expenses.forEach((item: any) => {
            // Adiciona o item na categoria "Tudo"
            groupedData["Tudo"].items.push(item);
            if (item.tipo === "Receita") {
                groupedData["Tudo"].entradas += Number(item.valor);
            } else {
                groupedData["Tudo"].saidas += Number(item.valor);
            }

            // Agrupa os dados por mês
            const month = new Date(item.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!groupedData[month]) {
                groupedData[month] = { entradas: 0, saidas: 0, items: [] };
            }
            if (item.tipo === "Receita") {
                groupedData[month].entradas += Number(item.valor);
            } else {
                groupedData[month].saidas += Number(item.valor);
            }
            groupedData[month].items.push(item);
        });

        const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        const currentMonthData = groupedData[currentMonth];

        const previousMonthDate = new Date();
        previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
        const previousMonth = previousMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const previousMonthData = groupedData[previousMonth];

        if (currentMonthData && previousMonthData) {
            const currentProfit = currentMonthData.entradas - currentMonthData.saidas;
            const previousProfit = previousMonthData.entradas - previousMonthData.saidas;

            if (previousProfit > 0) {
                const profitDifference = currentProfit - previousProfit;
                const profitPercentage = (profitDifference / previousProfit) * 100;
                return {
                    percetage: profitPercentage.toFixed(2),
                    profit: profitDifference.toFixed(2),
                    currentMonth: currentMonthData
                };
            }
        }

        return 0;
    }

    // Dados para o gráfico de pizza
    const profitData = getProfitPercentageOfThisMonth();

    // Configuração do gráfico de pizza
    const chartOptions: any = {
        chart: {
            type: 'pie',
        },
        labels: ['Entradas', 'Saídas'],
        series: [profitData.currentMonth ? profitData.currentMonth.entradas : 0, profitData.currentMonth ? profitData.currentMonth.saidas : 0],
        colors: ['#be0a45', 'gray'],  // Verde para entradas, vermelho para saídas
        tooltip: {
            y: {
                formatter: (value: number) => `R$ ${value.toFixed(2)}`
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };

    const widgets = [
        {
            title: 'Lucro Atual',
            icon: <HiCash />,
            content: (
                <>
                    <img src={cash} alt='cash' />
                    <p>{profitData.percetage}% a mais do que o ultimo mês</p>
                </>
            ),
            value: `R$ ${profitData.profit}`,
            className: 'widget small cash mobile'
        },
        {
            title: 'Report de Vendas',
            content: (
                <div className='graphicwidget'>
                    <Table.Root>
                        <Table.Header>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Nome</Table.ColumnHeader>
                            <Table.ColumnHeader>Preço</Table.ColumnHeader>
                        </Table.Header>
                        <Table.Body>
                            {sales.map((sale: any, index: number) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{sale.id}</Table.Cell>
                                    <Table.Cell>{sale.name}</Table.Cell>
                                    <Table.Cell>{sale.price}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </div>
            ),
            value: `R$ ${sales.reduce((acc: number, sale: any) => acc + sale.price, 0).toFixed(2)}`,
            className: 'widget small sales mobile'
        },
        {
            title: 'Feedbacks',
            content: (
                <div className='graphicwidget'>
                    <ul>
                        {feedbacks.map((feedback: any, index: number) => (
                            <li key={index}>{feedback.message}</li>
                        ))}
                    </ul>
                </div>
            ),
            value: `${feedbacks.length} feedbacks`,
            className: 'widget small feedbacks mobile'
        },
        {
            title: 'Pedidos',
            content: <p>{sales.length} pedidos</p>,  // Supondo que "sales" seja a lista de pedidos
            className: 'widget medium orders mobile'
        },
        {
            title: 'Atividade',
            content: (
                <div className="graphicwidget">
                    <ApexCharts
                        options={chartOptions}
                        series={chartOptions.series}
                        type="pie"
                        height={350}
                    />
                    <p>Entradas e Saídas do Mês</p>
                </div>
            ),
            value: `Entradas: R$ ${profitData.currentMonth ? profitData.currentMonth.entradas : 0} | Saídas: R$ ${profitData.currentMonth ? profitData.currentMonth.saidas : 0}`,
            className: 'widget small activity mobile'
        },
        {
            title: 'Total de Usuários',
            content: <Table.Root>
                <Table.Header>
                    <Table.ColumnHeader>Nome</Table.ColumnHeader>
                    <Table.ColumnHeader>Role</Table.ColumnHeader>
                    <Table.ColumnHeader>CPF</Table.ColumnHeader>
                </Table.Header>
                <Table.Body>
                    {users.map((user: UserProps, index: number) => (
                        <Table.Row key={index}>
                            <Table.Cell className='userContentTable'>
                                <img src={user.photoURL} alt={user.nome_completo} />
                                {getFirstAndLastName(user.nome_completo)}</Table.Cell>
                            <Table.Cell><Badge>{user.label}</Badge></Table.Cell>
                            <Table.Cell>{formatCPF(user.cpf)}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>,
            value: (users.length.toString() + ` usuários`),
            className: 'widget small users mobile'
        },
        {
            title: 'Produtos',
            content: <Table.Root>
                <Table.Header>
                    <Table.ColumnHeader></Table.ColumnHeader>
                    <Table.ColumnHeader>Nome</Table.ColumnHeader>
                    <Table.ColumnHeader>Preço</Table.ColumnHeader>
                </Table.Header>
                <Table.Body>
                    {products.splice(1, 10).map((product: Product, index: number) => {

                        const photo = JSON.parse(product.photoURL)[0]

                        return (
                            <Table.Row key={index}>
                                <Table.Cell className='userContentTable'>
                                    <Link to={"/admin/products/" + product.id}><img src={photo} alt={product.name_product} /></Link>
                                </Table.Cell>
                                <Table.Cell><Link to={"/admin/products/" + product.id}>{product.name_product} </Link></Table.Cell>
                                <Table.Cell>{(product.price - product.desconto).toFixed(2)}</Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>,
            className: 'widget medium products mobile'
        }
    ];

    useEffect(() => {
        getItems();
    }, []);

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <h1>Bem-vindo ao Painel Administrativo</h1>
                <div className="dashboard-widgets">
                    {widgets.map((widget, index) => (
                        <div key={index} className={`widget ${widget.className}`}>
                            <h2>{widget.icon}{widget.title}</h2>
                            {widget.content}
                            {widget.value && <p className="widget-value">{widget.value}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
