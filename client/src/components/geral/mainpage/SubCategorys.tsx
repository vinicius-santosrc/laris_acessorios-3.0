import { Link } from "react-router-dom";
import SubCategoryCard from "../subcategory-card/SubcategoryCard";
import "./SubCategory.css";
import { useEffect, useState } from "react";
import { Loader } from "../../../components/ui/loader";
import { adminService } from "../../../services/adminService";
import { Facilitys } from "../../../services/facilitysService";

interface SubCategoryProps {
    title: string;
    photoURL: string;
    redirect: string;
}

const SubCategories = () => {
    const [lastCategory, setLastCategory] = useState<any>();
    const [subCategoryImages, setSubCategoryImages] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        getLastCategories();
        subCategories.forEach((item) => {
            getSubCategoryImage(item.photoURL);
        });
    }, []);

    const getLastCategories = async () => {
        try {
            const categories: any[] = await adminService.getAllCategoriesData();
            if (categories.length > 0) {
                setLastCategory(categories[categories.length - 1]);
            }
        } catch (error: any) {
            throw error;
        }
    };

    const getSubCategoryImage = async (photoURL: string) => {
        try {
            const response = await Facilitys.get(photoURL);
            setSubCategoryImages((prev) => ({
                ...prev,
                [photoURL]: response?.data[0].data,
            }));
        } catch (error: any) {
            throw error;
        }
    };

    const subCategories: SubCategoryProps[] = [
        {
            title: "Presentes para ela",
            redirect: "/para-ela",
            photoURL: "presentes-para-ela-minibanner",
        },
        {
            title: "Lançamentos",
            redirect: "/lancamentos",
            photoURL: "lancamentos-minibanner",
        },
        {
            title: "Banhado a ouro",
            redirect: "/banhados-a-ouro",
            photoURL: "banhados-a-ouro-minibanner",
        },
        {
            title: "Pratas Brilhantes",
            redirect: "/pratas",
            photoURL: "pratas-brilhantes-minibanner",
        },
    ];

    return (
        <section className="subcategorys-section-wrapper">
            <div className="subcategory-section-content">
                {lastCategory ? (
                    subCategories.map((item) => (
                        <Link key={item.title} to={`${window.location.origin}/collections${item.redirect}`}>
                            <SubCategoryCard title={item.title} photoURL={subCategoryImages[item.photoURL] || item.photoURL} />
                        </Link>
                    ))
                ) : (
                    <Loader />
                )}
            </div>
        </section>
    );
};

export default SubCategories;
