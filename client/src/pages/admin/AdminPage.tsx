import SideBar from "../../components/admin/SideBar";
import '../../components/admin/dashboard/dashboard.css'
import { DashboardHeader } from "../../components/admin/DashboardHeader";

const AdminPage = ({ children }: any) => {

    return (
        <section className="adminPage">
            <div className="backgroundAdminPage"></div>
            <SideBar />
            <DashboardHeader />
            <section className="contentPage">
                {children}
            </section>
        </section>
    )
}

export default AdminPage;