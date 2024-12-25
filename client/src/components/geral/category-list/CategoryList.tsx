import { Categorys } from "../../../lib/utils";
import CategoryCard from "../category-card/CategoryCard";
import "./CategoryList.css"

const CategoryList = () => {
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
