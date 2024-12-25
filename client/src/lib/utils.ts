import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface CategoriesProps {
    highlightText: string;
    highlightDescription: string;
    highlightImage: any;
    urlLink: string;
    products: any;
}

export const defaultsCategories: CategoriesProps[] = [
    {
        highlightText: "Anéis",
        highlightDescription: "Explore nossa coleção de anéis sofisticados e modernos para todas as ocasiões.",
        highlightImage: "/images/rings.jpg",
        urlLink: "aneis",
        products: []
    },
    {
        highlightText: "Colares",
        highlightDescription: "Descubra colares deslumbrantes, ideais para dar um toque especial ao seu look.",
        highlightImage: "/images/necklaces.jpg",
        urlLink: "colar",
        products: []
    },
    {
        highlightText: "Brincos",
        highlightDescription: "Brincos que variam de elegantes a ousados, para combinar com qualquer estilo.",
        highlightImage: "/images/earrings.jpg",
        urlLink: "brincos",
        products: []
    },
    {
        highlightText: "Braceletes",
        highlightDescription: "Abrace o estilo com braceletes que refletem sua personalidade e elegância.",
        highlightImage: "/images/bracelets.jpg",
        urlLink: "bracelete",
        products: []
    },
    {
        highlightText: "Tornozeleiras",
        highlightDescription: "Tornozeleiras delicadas e modernas para realçar a beleza dos seus pés.",
        highlightImage: "/images/anklets.jpg",
        urlLink: "tornozeleira",
        products: []
    },
    {
        highlightText: "Piercings",
        highlightDescription: "Piercings estilosos para todos os gostos, ideais para quem deseja um toque ousado.",
        highlightImage: "/images/piercings.jpg",
        urlLink: "piercing",
        products: []
    }
]
