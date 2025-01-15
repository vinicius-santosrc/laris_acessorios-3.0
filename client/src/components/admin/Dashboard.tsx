import { HiCash } from 'react-icons/hi';
import './dashboard/dashboard.css'
import cash from "./undraw_savings_uwjn.svg"

export const Dashboard = () => {
    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <h1>Bem-vindo ao Painel Administrativo</h1>
                <div className="dashboard-widgets">
                    {/* Widget de Usuários */}
                    <div className="widget large cash mobile">
                        <h2><HiCash />Lucro Atual</h2>
                        <img src={cash} alt='cash' />
                        <p>1% a mais do que o ultimo mês</p>
                        <p className="widget-value">R$ $lucroAtual</p>
                    </div>
                    <div className="widget large users mobile">
                        <h2>Report de Vendas</h2>
                        <div className='graphicwidget'>

                        </div>
                        <p className="widget-value">R$ $totalvendas</p>
                    </div>
                    <div className="widget large users mobile">
                        <h2>Feedbacks</h2>
                        <div className='graphicwidget'>

                        </div>
                        <p className="widget-value">24 feedbacks</p>
                    </div>
                    <div className="widget medium users mobile">
                        <h2>Pedidos</h2>
                        <p>X pedidos</p>
                        {/*<table className="products-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Data</th>
                                    <th>Valor</th>
                                    <th>ID do Produto</th>
                                    <th>Status</th>
                                    <th>Opções</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>nome completo</td>
                                    <td>10/12/2024</td>
                                    <td>R$ 100,00</td>
                                    <td>235, 124</td>
                                    <td>CONCLUÍDO</td>
                                    <td>Mais</td>
                                </tr>
                            </tbody>
                        </table> */}
                    </div>
                    <div className="widget large users mobile">
                        <h2>Atividade</h2>
                        <p className="widget-value">125 Usuarios </p>
                    </div>
                    <div className="widget small users mobile">
                        <h2>Total de Usuários</h2>
                        <p className="widget-value">2,340</p>
                    </div>
                    <div className="widget medium users mobile">
                        <h2>Produtos</h2>
                        <p>X produtos</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
