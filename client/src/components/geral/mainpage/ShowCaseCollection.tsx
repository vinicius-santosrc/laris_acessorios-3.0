import { Button } from "@chakra-ui/react";
import "./ShowCaseCollection.css";
import { Link } from 'react-router-dom';

interface ShowcaseItem {
    url: string;
    redirect: string;
    title: string;
    description: string;
}

interface ShowCaseCollectionProps {
    items: ShowcaseItem[];
    type: "Grid" | "Showcase";
    style: "default" | "alternative"
}

const ShowCaseCollection = ({ items, type, style }: ShowCaseCollectionProps) => {
    if (style == "alternative") {
        return (
            <section className="showcase-component">
                <div className="showcase-inside-alternative">
                    <div className="showcase-left-side">
                        <img src={items[0].url} alt={`Showcase category`} />
                    </div>
                    <div className="showcase-right-side">
                        <p>{items[0].title}</p>
                        <Button onClick={() => window.location.href = window.location.origin + items[0].redirect} className="btn-showcase">COMPRAR AGORA</Button>
                    </div>
                </div>
            </section>
        )
    }
    return (
        <section className="showcase-component">
            {type != "Showcase" ?
                <div className="showcase-inside">
                    {items.map((item, index) => (
                        <div key={index} className="showcase-box">
                            <Link to={item.redirect}>
                                <img src={item.url} alt={`Showcase category ${index + 1}`} />
                                <div className="descriptionshowcase">
                                    <h1>{item.title}</h1>
                                    <p>{item.description}</p>
                                </div>
                            </Link>
                        </div>

                    ))}

                </div>
                :
                <div className="showcase-inside-full">
                    {items.map((item, index) => (
                        <div key={index} className="showcase-box-full">
                            <Link to={item.redirect}>
                                <img src={item.url} alt={`Showcase category ${index + 1}`} />
                                <div className="descriptionshowcase">
                                    <h1>{item.title}</h1>
                                    <p>{item.description}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            }
        </section>
    );
};

export default ShowCaseCollection;
