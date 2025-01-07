import React, { useEffect, useState } from 'react';
import './Account.css';
import { UserProps } from '../../models/user';
import { Loader } from '../../components/ui/loader';
import authService from '../../services/authService';
import { formatCPF } from '../../lib/utils';

const Account = () => {
    const fotoUsuario = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp";

    const [userAtual, setUser] = useState<UserProps>();
    const [isLoading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState("dadosPessoais");

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const res = await authService.getUserData();
                const userContent: UserProps = await authService.getUserByEmail(res.email);
                setUser(userContent);
            } catch (error) {
                console.error("Erro ao obter dados do usuário", error);
            }
            setLoading(false);
        };

        // Check the URL hash to set the default section
        if (window.location.hash === "#wishlist") {
            setSelectedSection("favoritos");
        }

        fetchUserData();
    }, []);

    const renderContent = () => {
        switch (selectedSection) {
            case "dadosPessoais":
                return (
                    <div>
                        <h2>Dados Pessoais</h2>
                        <p>Nome: {userAtual?.nome_completo}</p>
                        <p>Email: {userAtual?.email}</p>
                        <p>CPF: {userAtual && formatCPF(userAtual?.cpf)}</p>
                    </div>
                );
            case "pedidos":
                return (
                    <div>
                        <h2>Meus Pedidos</h2>
                        <p>Aqui você pode visualizar seus pedidos anteriores.</p>
                        {/* Implementar pedidos */}
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

    return (
        <div className="account-container">
            {isLoading && <Loader />}
            <div className="sidebar">
                <div className="user-info">
                    <img src={fotoUsuario} alt="Foto do usuário" className="user-photo" />
                    <div className="user-greeting">
                        <p>Olá, {userAtual?.nome_completo}!</p>
                    </div>
                </div>
                <nav className="nav">
                    <ul>
                        <li onClick={() => setSelectedSection("dadosPessoais")}>Dados Pessoais</li>
                        <li onClick={() => setSelectedSection("pedidos")}>Pedidos</li>
                        <li onClick={() => setSelectedSection("favoritos")}>Meus Favoritos</li>
                        <li onClick={() => console.log("Sair")}>Sair</li>
                    </ul>
                </nav>
            </div>
            <div className="account-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Account;
