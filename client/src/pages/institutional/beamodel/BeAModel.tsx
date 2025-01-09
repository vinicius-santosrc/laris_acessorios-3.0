import { modelData } from "../../../lib/utils";
import "./BeAModel.css"

export const BeaModelPage = () => {
    return (
        <main className="model-container">
            <header className="model-header">
                <h1 className="model-title">Seja Modelo - LARI'S ACESSÓRIOS</h1>
            </header>

            {modelData.map((item, index) => (
                <section className="model-section" key={index}>
                    <h2>{item.question}</h2>
                    <p>{item.answer}</p>
                </section>
            ))}

            <footer className="model-footer">
                <p>Última atualização: 08/01/2025.</p>
            </footer>
        </main>
    )
}
