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
            photoURL: "https://uploaddeimagens.com.br/images/004/877/966/full/processed-5EF3B05D-B8F3-4B16-892C-E8508CCD0A48.jpeg?1735149543"
        },
        lastCategory ?
            { 
                title: lastCategory.highlightText,
                redirect: `/${lastCategory.urlLink}`,
                photoURL: lastCategory.highlightImage || "", 
            }
            : {
                title: "Presentes para ele",  // Caso contrário, mantém a categoria original
                redirect: "/",
                photoURL: "",
            },
        {
            title: "Banhado a ouro",
            redirect: "/banhados-a-ouro",
            photoURL: "https://uploaddeimagens.com.br/images/004/877/991/full/Brinco-Asa.png?1735179720"
        },
        {
            title: "Pratas Brilhantes",
            redirect: "/pratas",
            photoURL: "https://uploaddeimagens.com.br/images/004/877/971/full/processed-3D859BD8-1459-4679-8CBA-2AA437141FAB_%281%29.jpeg?1735151183"
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
