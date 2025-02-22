import { Link } from "react-router-dom";
import SubCategoryCard from "../subcategory-card/SubcategoryCard";
import "./SubCategory.css"
import { useEffect, useState } from "react";
import { Loader } from "../../../components/ui/loader";
import { adminService } from "../../../services/adminService";

interface SubCategoryProps {
    title: string;
    photoURL: string;
    redirect: string;
}

const SubCategorys = () => {
    const [lastCategory, setLastCategory] = useState<any>();
    useEffect(() => {
        getLastCategories()
    }, [])

    const getLastCategories = async () => {
        try {
            const categories: any[] = await adminService.getAllCategoriesData();
            if (categories.length > 0) {
                setLastCategory(categories[categories.length - 1]);  // Pega a última categoria
            }
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };


    const subCategories: SubCategoryProps[] = [
        {
            title: "Presentes para ela",
            redirect: "/para-ela",
            photoURL: "https://i.ibb.co/Tq7pLjTV/Brinco-Asa.png"
        },
        lastCategory ?
            { 
                title: lastCategory.highlightText,
                redirect: `/${lastCategory.urlLink}`,
                photoURL: "https://i.ibb.co/bRP1xP28/anel-cora-o-com-zirc-nia-1.png", 
            }
            : {
                title: "Presentes para ele",  // Caso contrário, mantém a categoria original
                redirect: "/",
                photoURL: "",
            },
        {
            title: "Banhado a ouro",
            redirect: "/banhados-a-ouro",
            photoURL: "https://i.ibb.co/JFbfsHWX/IMG-4658-removebg-preview.png"
        },
        {
            title: "Pratas Brilhantes",
            redirect: "/pratas",
            photoURL: "https://i.ibb.co/Z1gTMHcR/brinco-com-veneziana.png"
        },
    ];

    return (
        <section className="subcategorys-section-wrapper">
            <div className="subcategory-section-content">
                {lastCategory ?
                    <>
                        {subCategories.map((item) => {
                            return (
                                <Link to={window.location.origin + "/collections" + item.redirect}>
                                    <SubCategoryCard key={item.title} title={item.title} photoURL={item.photoURL} />
                                </Link>
                            );
                        })}
                    </>
                    :
                    <Loader />
                }
            </div>
        </section>
    );
};

export default SubCategorys;
