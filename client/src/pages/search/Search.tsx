import { defaultsCategories } from "../../lib/utils";
import Categories from "../categories/Categories";
import "./Search.css";

export const SearchPage = () => {
    const categorie = defaultsCategories.find((category: any) => category.urlLink === "search");
    return (
        <Categories
            CategoryHeaderContent={categorie}
        ></Categories>
    )
}