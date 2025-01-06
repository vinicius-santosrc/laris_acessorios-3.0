import { createListCollection } from "@chakra-ui/react";
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

export interface CategoryProps {
    title: string;
    redirect: string;
    photoURL: string;
}

export const Categorys: CategoryProps[] = [
    { title: "COLARES", redirect: "colar", photoURL: "https://uploaddeimagens.com.br/images/004/877/952/full/chocker_quadradinho_%281%29.png?1735146528" },
    { title: "BRINCOS", redirect: "brinco", photoURL: "https://uploaddeimagens.com.br/images/004/877/931/full/Brinco_Heart.png?1735141030" },
    { title: "ANÉIS", redirect: "anel", photoURL: "https://uploaddeimagens.com.br/images/004/877/944/full/anel_corac%CC%A7a%CC%83o_cravejado.png?1735144015" },
    { title: "PULSEIRAS", redirect: "pulseira", photoURL: "https://uploaddeimagens.com.br/images/004/877/957/full/pulseira_nossa_senhora_%281%29.png?1735147752" },
    { title: "BRACELETES", redirect: "bracelete", photoURL: "https://uploaddeimagens.com.br/images/004/877/949/full/bracelete_oval.png?1735145171" },
    { title: "PIERCINGS", redirect: "piercing", photoURL: "https://uploaddeimagens.com.br/images/004/877/938/full/piercing-palito.png?1735142864" }
];

export const defaultsCategories: CategoriesProps[] = [
    //PRINCIPAIS
    {
        highlightText: "Anéis",
        highlightDescription: "Explore nossa coleção de anéis sofisticados e modernos para todas as ocasiões.",
        highlightImage: "/images/rings.jpg",
        urlLink: "anel",
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
        urlLink: "brinco",
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
    },
    {
        highlightText: "Pulseiras",
        highlightDescription: "Complete seu visual com nossas pulseiras sofisticadas e versáteis, ideais para adicionar um toque de elegância e personalidade ao seu estilo. Sejam delicadas ou mais ousadas, nossas pulseiras são perfeitas para qualquer ocasião, desde o dia a dia até eventos especiais.",
        highlightImage: "/images/pulseiras.jpg",
        urlLink: "pulseira",
        products: []
    },
    {
        highlightText: "Joias",
        highlightDescription: "Encante-se com nossa coleção de joias exclusivas.",
        highlightImage: "/images/jewerlys.jpg",
        urlLink: "joias",
        products: []
    },
    {
        highlightText: "Pratas",
        highlightDescription: "Pratas de lei para momentos especiais.",
        highlightImage: "/images/pratas.jpg",
        urlLink: "pratas",
        products: []
    },
    {
        highlightText: "Semijoias",
        highlightDescription: "Semijoias sofisticadas para complementar seu estilo.",
        highlightImage: "/images/pratas.jpg",
        urlLink: "semijoias",
        products: []
    },
    {
        highlightText: "Presentes para Ela",
        highlightDescription: "Presentes encantadores para surpreender aquela pessoa especial.",
        highlightImage: "/images/presentes_para_ela.jpg",
        urlLink: "para-ela",
        products: []
    },
    {
        highlightText: "Banhados a Ouro",
        highlightDescription: "Beleza e elegância com nossos banhados a ouro.",
        highlightImage: "/images/banhados_a_ouro.jpg",
        urlLink: "banhados-a-ouro",
        products: []
    }

]

export interface MenuItemsProps {
    title: string;
    isLink: boolean;
    href?: any;
    subItems?: MenuSubItemsProps[]
}

export interface MenuSubItemsProps {
    title: string;
    href: string;
}

export interface UserAuthProps {
    email: string;
    cpf: string;
    nome_completo: string;
    password: string;
}

export const EnumPaymentMethod = {
    CreditCard: 0,
    Pix: 1
}

export interface paymentInsideMethod {
    label: string;
    value: number;
}

export const paymentsMethods = createListCollection({
    items: [
        { label: "Cartão de Crédito", value: EnumPaymentMethod.CreditCard },
        { label: "Pix", value: EnumPaymentMethod.Pix }
    ]
})

export const parcelamentosDisponiveis = createListCollection({
    items: [
        { label: "1x", id: 1, juros: false, jurosPerc: 1.00 },
        { label: "2x", id: 2, juros: false, jurosPerc: 1.00 },
        { label: "3x", id: 3, juros: false, jurosPerc: 1.00 },
        { label: "4x", id: 4, juros: false, jurosPerc: 1.00 },
        { label: "5x", id: 5, juros: true, jurosPerc: 1.02 },
        { label: "6x", id: 6, juros: true, jurosPerc: 1.03 },
    ]
})

export const formatCPF = (value: string) => {
    return value
        .replace(/\D/g, '') // Remove caracteres não numéricos
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen
};

export const formatTelefone = (value: string) => {
    return value
        .replace(/\D/g, '') // Remove caracteres não numéricos
        .replace(/(\d{2})(\d)/, '($1) $2') // Adiciona parênteses e espaço
        .replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen
};

export const formatCEP = (value: string) => {
    return value
        .replace(/\D/g, '') // Remove caracteres não numéricos
        .replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen
};

export const getCEPJson = async (cep: string) => {
    const cepReturn = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const cepJSON = await cepReturn.json()
    return cepJSON;
}

export const formatarCartaoCredito = (numeroCartao: string) => {
    const apenasDigitos = numeroCartao.replace(/\D/g, '');

    const formatado = apenasDigitos.replace(/(.{4})/g, '$1 ').trim();

    return formatado;
};

export const menuItems: MenuItemsProps[] = [
    {
        title: "Presentes",
        isLink: true,
        href: window.location.origin + '/collections/presentes'
    },
    {
        title: "Lançamentos",
        isLink: true,
        href: window.location.origin + '/collections/lancamentos',
    },
    {
        title: "Joias",
        isLink: true,
        href: window.location.origin + '/collections/joias',
        subItems: [
            { title: "Colares", href: window.location.origin + '/collections/colar' },
            { title: "Brincos", href: window.location.origin + '/collections/brinco' },
            { title: "Aneis", href: window.location.origin + '/collections/anel' },
            { title: "Pulseiras", href: window.location.origin + '/collections/pulseira' },
            { title: "Braceletes", href: window.location.origin + '/collections/bracelete' },
            { title: "Piercings", href: window.location.origin + '/collections/piercing' },
        ]
    },
    {
        title: "Semijoias",
        isLink: true,
        href: window.location.origin + '/collections/semijoias',
        subItems: [
            { title: "Colares", href: window.location.origin + '/collections/colar' },
            { title: "Brincos", href: window.location.origin + '/collections/brinco' },
            { title: "Aneis", href: window.location.origin + '/collections/anel' },
            { title: "Pulseiras", href: window.location.origin + '/collections/pulseira' },
            { title: "Braceletes", href: window.location.origin + '/collections/bracelete' },
            { title: "Piercings", href: window.location.origin + '/collections/piercing' },
        ]
    },
    {
        title: "Acessórios",
        isLink: true,
        href: window.location.origin + '/collections/acessorios',
        subItems: [
            { title: "Porta-Joias", href: window.location.origin + '/collections/porta-joias' }
        ]
    },
    {
        title: "Coleções",
        isLink: false,
        subItems: [
            { title: "Coleção A", href: "/colecao-a" },
            { title: "Coleção B", href: "/colecao-b" }
        ]
    },
    {
        title: "Final de ano",
        isLink: false,
        subItems: [
            { title: "Best Sellers", href: window.location.origin + '/collections/best-sellers' },
            { title: "Para Reveillon", href: window.location.origin + '/collections/reveillon' }
        ]
    },
]