import React from "react";
import { Link } from "react-router-dom";
import "./Success.css";

const Success = () => {
    return (
        <section className="success-section">
            <div className="success-container">
                <div className="success-message-container">
                    <h1 className="success-title">Compra Realizada com Sucesso!</h1>
                    <p className="success-description">
                        Parabéns! Seu pedido foi confirmado e está sendo preparado com muito
                        carinho. Em breve, você receberá sua joia exclusiva.
                    </p>
                </div>

                <div className="order-info-container">
                    <h2 className="order-info-title">Detalhes do Pedido</h2>
                    <ul className="order-info-list">
                        <li><strong>Pedido nº:</strong> 123456789</li>
                        <li><strong>Data da Compra:</strong> 06 de Janeiro de 2025</li>
                        <li><strong>Total:</strong> R$ 2.999,00</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <Link to="/" className="button">
                        Voltar para a Página Inicial
                    </Link>
                    <Link to="/pedidos" className="button">
                        Ver Meus Pedidos
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default Success;
