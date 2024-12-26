import { Link } from "react-router-dom";
import SubCategoryCard from "../subcategory-card/SubcategoryCard";
import "./SubCategory.css"

interface SubCategoryProps {
    title: string;
    photoURL: string;
    redirect: string;
}

const SubCategorys = () => {
    const subCategories: SubCategoryProps[] = [
        {
            title: "Presentes para ela",
            redirect: "/para-ela",
            photoURL: "https://uploaddeimagens.com.br/images/004/877/966/full/processed-5EF3B05D-B8F3-4B16-892C-E8508CCD0A48.jpeg?1735149543"
        },
        {
            title: "Presentes para ele",
            redirect: "/",
            photoURL: ""
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
                {subCategories.map((item) => {
                    return (
                        <Link to={window.location.origin + "/collections" + item.redirect}>
                            <SubCategoryCard key={item.title} title={item.title} photoURL={item.photoURL} />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default SubCategorys;
