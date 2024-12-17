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
            redirect: "/",
            photoURL: ""
        },
        {
            title: "Presentes para ele",
            redirect: "/",
            photoURL: ""
        },
        {
            title: "Banhado a ouro",
            redirect: "/",
            photoURL: ""
        },
        {
            title: "Pratas Brilhantes",
            redirect: "/",
            photoURL: ""
        },
    ];

    return (
        <section className="subcategorys-section-wrapper">
            <div className="subcategory-section-content">
                {subCategories.map((item) => {
                    return <SubCategoryCard key={item.title} title={item.title} photoURL={item.photoURL} />;
                })}
            </div>
        </section>
    );
};

export default SubCategorys;
