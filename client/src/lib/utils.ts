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

interface CategoryProps {
    title: string;
    redirect: string;
    photoURL: string;
}

export const Categorys: CategoryProps[] = [
    { title: "COLARES", redirect: "colar", photoURL: "" },
    { title: "BRINCOS", redirect: "brincos", photoURL: "" },
    { title: "ANÉIS", redirect: "aneis", photoURL: "" },
    { title: "PULSEIRAS", redirect: "pulseiras", photoURL: "" },
    { title: "BRACELETES", redirect: "braceletes", photoURL: "" },
    { title: "PIERCINGS", redirect: "piercing", photoURL: "" }
];

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
        urlLink: "braceletes",
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
    },
    {
        highlightText: "Pulseiras",
        highlightDescription: "Pulseiras descricao",
        highlightImage: "/images/pulseiras.jpg",
        urlLink: "pulseiras",
        products: []
    }
]
