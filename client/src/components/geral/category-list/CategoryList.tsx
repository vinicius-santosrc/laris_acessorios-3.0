import CategoryCard from "../category-card/CategoryCard";
import "./CategoryList.css"

interface CategoryProps {
    title: string;
    photoURL: string;
}

const CategoryList = () => {
    const Categorys: CategoryProps[] = [
        { title: "COLARES", photoURL: "" },
        { title: "BRINCOS", photoURL: "" },
        { title: "ANÉIS", photoURL: "" },
        { title: "PULSEIRAS", photoURL: "" },
        { title: "BRACELETES", photoURL: "" },
        { title: "PIERCINGS", photoURL: "" }
    ];

    return (
        <section className="category-list-wrapper">
            <div className="category-list-content">
                {Categorys.map((item, id) => (
                    <CategoryCard title={item.title} key={id} photoURL={item.photoURL} />
                ))}
            </div>
        </section>
    );
}

export default CategoryList;
