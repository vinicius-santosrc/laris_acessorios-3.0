import SideBar from "../../components/admin/SideBar";
import { Dashboard } from "../../components/admin/Dashboard";
import '../../components/admin/dashboard/dashboard.css'
import { DashboardHeader } from "../../components/admin/DashboardHeader";

const AdminPage = () => {

    return (
        <section className="adminPage">
            <SideBar />
            <DashboardHeader />
            <section className="contentPage">
                <Dashboard />
            </section>
        </section>
    )
}

export default AdminPage;