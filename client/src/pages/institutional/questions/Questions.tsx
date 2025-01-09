import { faqData } from "../../../lib/utils"
import "./Questions.css"

export const Questions = () => {
    return (
        <main className="faq-container">
            <header className="faq-header">
                <h1 className="faq-title">Perguntas Frequentes - LARI'S ACESSÓRIOS</h1>
            </header>

            {faqData.map((item, index) => (
                <section className="faq-section" key={index}>
                    <h2>{item.question}</h2>
                    <p>{item.answer}</p>
                </section>
            ))}

            <footer className="faq-footer">
                <p>Última atualização: 08/01/2025.</p>
            </footer>
        </main>
    )
}