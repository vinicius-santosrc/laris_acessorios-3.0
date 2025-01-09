import { Link } from "react-router-dom";
import "./ContactUs.css";

export const ContactUs = () => {
    return (
        <div className="contact-container">
            <h1>Entre em Contato</h1>
            <p className="contact-description">
                Estamos prontos para te ajudar! Escolha a forma mais conveniente de entrar em contato conosco.
            </p>
            <div className="contact-options">
                <div className="contact-item">
                    <Link to="https://wa.me/5535997394181" target="_blank" className="contact-link">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png"
                            alt="WhatsApp"
                            className="contact-icon"
                        />
                        <div className="contact-text">
                            <h3>WhatsApp</h3>
                            <p>Envie uma mensagem direta pelo WhatsApp.</p>
                        </div>
                    </Link>
                </div>
                <div className="contact-item">
                    <Link to="mailto:larisacessorios.loja@gmail.com" className="contact-link">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/6244/6244438.png"
                            alt="E-mail"
                            className="contact-icon"
                        />
                        <div className="contact-text">
                            <h3>E-mail</h3>
                            <p>Envie um e-mail para nós e responderemos o mais rápido possível.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
