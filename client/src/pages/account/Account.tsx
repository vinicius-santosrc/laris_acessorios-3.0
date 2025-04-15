import React, { useEffect, useState } from 'react';
import './Account.css';
import { UserProps } from '../../models/user';
import { Loader } from '../../components/ui/loader';
import authService from '../../services/authService';
import { formatCPF, getFirstAndLastName } from '../../lib/utils';
import { auth } from '@/lib/firebase';
import { OrderAfterBuyProps } from '@/models/order';
import { orderService } from '../../services/orderService';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const Account = () => {
    const fotoUsuario = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp";
    const [selectedSection, setSelectedSection] = useState("dadosPessoais");
    const { user, loading } = useUser();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        window.document.title = "Conta - Lari's Acessórios"
        if (window.location.hash === "#wishlist") {
            setSelectedSection("favoritos");
        }

        if (window.location.hash === "#orders") {
            setSelectedSection("pedidos");
        }

        if (!user) {
            window.location.href = window.location.origin;
        }
    }, []);

    useEffect(() => {
        setLoading(loading);
    }, [loading]);

    const renderContent = () => {
        switch (selectedSection) {
            case "dadosPessoais":
                return (
                    <div>
                        <h2>Dados Pessoais</h2>
                        <p>Nome: {user?.nome_completo}</p>
                        <p>Email: {user?.email}</p>
                        <p>CPF: {user && formatCPF(user?.cpf)}</p>
                    </div>
                );
            case "pedidos":
                return (
                    <div>
                        <h2>Meus Pedidos</h2>
                        <p>Aqui você pode visualizar seus pedidos anteriores.</p>
                        <div className="orders-content">
                            <div className="orders-list">
                                {user?.orders.map((order: OrderAfterBuyProps) => {
                                    const items = JSON.parse(order.items); // Transformar o JSON de items em um objeto
                                    const address = JSON.parse(order.address); // Transformar o JSON de endereço em um objeto
                                    const userProfile = JSON.parse(order.user); // Transformar o JSON de usuário em um objeto

                                    return (
                                        <div key={order.id} className="order-card">
                                            <Link to={window.location.origin + "/account/orders/" + order.id}>
                                                <div className="order-header">
                                                    <h3>Pedido #{order.id}</h3>
                                                    <p>Status: {order.state}</p>
                                                </div>

                                                <div className="order-info">
                                                    <div className="order-details">
                                                        <h4>Detalhes do Pedido</h4>
                                                        <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                                        <p><strong>Forma de Pagamento:</strong> {order.paymentOption}</p>
                                                        <p><strong>Valor Total:</strong> R${order.order_totalprice.toFixed(2)}</p>
                                                        <p><strong>Desconto:</strong> R${order.desconto.toFixed(2)}</p>
                                                        <p><strong>Endereço de entrega:</strong> {address.endereço}, {address.numero}, {address.bairro} - {address.cidade}/{address.estado} ({address.cep})</p>
                                                        <p><strong>Referência:</strong> {address.referencia}</p>
                                                    </div>

                                                    <div className="order-items">
                                                        <h4>Produtos</h4>
                                                        {items.map((item: any, index: number) => {
                                                            const photo = JSON.parse(item.photoURL)[0];
                                                            return (
                                                                <div key={index} className="order-item">
                                                                    <img src={photo} alt={item.name_product} />
                                                                    <div className="item-details">
                                                                        <h5>{item.name_product}</h5>
                                                                        <p><strong>Categoria:</strong> {item.categoria}</p>
                                                                        <p><strong>Tamanho:</strong> {item.tamanhos}</p>
                                                                        <p><strong>Preço:</strong> R${item.price.toFixed(2)}</p>
                                                                        <p><strong>Desconto:</strong> R${item.desconto.toFixed(2)}</p>
                                                                        <p><strong>Disponibilidade:</strong> {item.disponibilidade ? 'Disponível' : 'Indisponível'}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            case "favoritos":
                return (
                    <div>
                        <h2>Meus Favoritos</h2>
                        <p>Veja os itens que você adicionou aos favoritos.</p>
                        {/* Implementar favoritos */}
                    </div>
                );
            default:
                return (
                    <div>
                        <h2>Seja bem-vindo à sua conta!</h2>
                        <p>Gerencie seus dados pessoais, pedidos e favoritos com facilidade.</p>
                    </div>
                );
        }
    };

    const logout = async () => {
        await authService.logout();
    }

    return (
        <div className="account-wrapper">
            {isLoading && <Loader />}
            <div className="sidebarcontent-account">
                <div className="user-info">
                    <img src={fotoUsuario} alt="Foto do usuário" className="user-photo" />
                    <div className="user-greeting">
                        <p>Olá, {user && getFirstAndLastName(user?.nome_completo)}!</p>
                    </div>
                </div>
                <nav className="navigation">
                    <ul>
                        <li onClick={() => setSelectedSection("dadosPessoais")}>Dados Pessoais</li>
                        <li onClick={() => setSelectedSection("pedidos")}>Pedidos</li>
                        <li onClick={() => setSelectedSection("favoritos")}>Meus Favoritos</li>
                        <li onClick={() => { logout() }}>Sair</li>
                    </ul>
                </nav>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Account;
