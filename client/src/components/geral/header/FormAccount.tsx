/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

export const FormAccount: React.FC<any> = ({ component, photoRef }: { component: JSX.Element, photoRef: string }) => {
    return (
        <section className="modal-create-account">
            <div className="modal-create-account__inside">
                <div className="modal-left-side">
                    {photoRef && <img alt="Account Modal" src={photoRef} />}
                </div>
                <div className="modal-right-side">
                    {component}
                </div>
            </div>
        </section>
    )
}
