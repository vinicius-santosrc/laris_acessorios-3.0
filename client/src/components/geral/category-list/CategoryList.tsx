import CategoryCard from "../category-card/CategoryCard";
import "./CategoryList.css"

interface CategoryProps {
    title: string;
    redirect: string;
    photoURL: string;
}

const CategoryList = () => {
    const Categorys: CategoryProps[] = [
        { title: "COLARES", redirect: "colar", photoURL: "" },
        { title: "BRINCOS", redirect: "brincos", photoURL: "" },
        { title: "ANÉIS", redirect: "aneis", photoURL: "" },
        { title: "PULSEIRAS", redirect: "pulseiras", photoURL: "" },
        { title: "BRACELETES", redirect: "braceletes", photoURL: "" },
        { title: "PIERCINGS", redirect: "piercing",  photoURL: "" }
    ];

    return (
        <section className="category-list-wrapper">
            <div className="category-list-content">
                {Categorys.map((item, id) => (
                    <CategoryCard title={item.title} redirect={item.redirect} key={id} photoURL={item.photoURL} />
                ))}
            </div>
        </section>
    );
}

export default CategoryList;
