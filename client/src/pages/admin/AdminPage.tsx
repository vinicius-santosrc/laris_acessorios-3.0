/**
 * Creation Date: 20/12/2024
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import '../../components/admin/dashboard/dashboard.css'
import { DashboardHeader } from "../../components/admin/DashboardHeader";

const AdminPage = ({ children }: any) => {

    return (
        <section className="adminPage">
            <div className="backgroundAdminPage"></div>
            <DashboardHeader />
            <section className="contentPage">
                {children}
            </section>
        </section>
    )
}

export default AdminPage;