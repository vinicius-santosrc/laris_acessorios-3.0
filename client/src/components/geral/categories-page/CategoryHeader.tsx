import { CategoriesProps } from "@/lib/utils";
import "../../../styles/categories.css"
import { Button } from "../../../components/ui/button";

const CategoryHeader: React.FC<CategoriesProps> = ({ highlightText, highlightDescription, highlightImage, products }) => {
    return (
        <section className="categories-page-wrapper">
                    <div className="categories-page-header">
                        <div className="categories-page-image">
                            <img src={highlightImage} alt={highlightText + " Image"} />
                        </div>
                        <div className="categories-page-about">
                            <div className="categories-page-about__header">
                                <h2>{highlightText}</h2>
                            </div>
                            <div className="categories-page-about__body">
                                <p>{highlightDescription}</p>
                            </div>
                            <div className="categories-page-about__footer">
                                <Button className="categories-page-btn">Descubra seu tamanho</Button>
                            </div>
                        </div>
                    </div>
                </section>
    )
}

export default CategoryHeader;