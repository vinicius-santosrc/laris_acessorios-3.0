import { createListCollection, MenuItemProps } from "@chakra-ui/react";
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

export const whiteListCategories: string[] = [
    "lancamentos",
]

export interface ModelDespesas {
    id: number;
    descricao: string;
    valor: number;
    tipo: "Receita" | "Despesa";
    created_at: Date;
    updated_at: Date
}

export enum TypeProduct {
    Chocker = 'Chocker',
    Colar = 'Colar',
    Pulseira = 'Pulseira',
    PhoneStrap = 'Phone-Strap',
    Chaveiros = 'Chaveiros',
    Scrunchie = 'Scrunchie',
    Touca = 'Touca',
    Brincos = 'Brincos',
    Aneis = 'Aneis',
    Pulseiras = 'Pulseiras',
    Braceletes = 'Braceletes',
    Tornozeleira = 'Tornozeleira',
    Piercing = 'Piercing'
}

export const typeCategorys = createListCollection({
    items: [
        { label: 'para-ela', value: "para-ela" },
        { label: 'anel', value: "anel" },
        { label: "colar", value: "colar"},
        { label: "brinco", value: "brinco"},
        { label: 'pulseira', value: "pulseira" },
        { label: 'bracelete', value: "bracelete" },
        { label: 'piercing', value: "piercing" },
        { label: "joias", value: "joias" },
        { label: "semijoias", value: "semijoias" },
        { label: "pratas", value: "pratas" },
        { label: "banhados-a-ouro", value: "banhados-a-ouro"}
    ]
});

export const typeProductList = createListCollection({
    items: [
        { label: 'Chocker', value: TypeProduct.Chocker },
        { label: 'Colar', value: TypeProduct.Colar },
        { label: 'Pulseira', value: TypeProduct.Pulseira },
        { label: 'Phone-Strap', value: TypeProduct.PhoneStrap },
        { label: 'Chaveiros', value: TypeProduct.Chaveiros },
        { label: 'Scrunchie', value: TypeProduct.Scrunchie },
        { label: 'Touca', value: TypeProduct.Touca },
        { label: 'Brincos', value: TypeProduct.Brincos },
        { label: 'Aneis', value: TypeProduct.Aneis },
        { label: 'Pulseiras', value: TypeProduct.Pulseiras },
        { label: 'Braceletes', value: TypeProduct.Braceletes },
        { label: 'Tornozeleira', value: TypeProduct.Tornozeleira },
        { label: 'Piercing', value: TypeProduct.Piercing },
    ]
});

export interface SheetItem {
    id: number;
    custos: number;
    detalhe: string;
    codigo: string;
    nameofitem: string;
    preco_compra: number;
    precorevenda: number;
    quantcompra: number;
    lucroporitem: number
}

export const defaultsCategories: CategoriesProps[] = [
    //PRINCIPAIS
    {
        highlightText: "Anéis",
        highlightDescription: "Explore nossa coleção de anéis sofisticados e modernos para todas as ocasiões.",
        highlightImage: "https://uploaddeimagens.com.br/images/004/880/695/full/aneis-page.png?1736520426",
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
    },
    {
        highlightText: "Lançamentos",
        highlightDescription: "Todos os nossos ultimos lançamentos.",
        highlightImage: "/images/lancamentos.jpg",
        urlLink: "lancamentos",
        products: []
    },
    {
        highlightText: "Acessórios",
        highlightDescription: "Todos os nossos acessórios.",
        highlightImage: "/images/acessorios.jpg",
        urlLink: "acessorios",
        products: []
    },
    {
        highlightText: "Busca",
        highlightDescription: "Procure por nossos todos os acessórios.",
        highlightImage: "/images/search.jpg",
        urlLink: "search",
        products: []
    }

]

export const modelData = [
    {
        question: "Como posso me tornar modelo para a LARI'S ACESSÓRIOS?",
        answer: "Para se tornar um modelo da LARI'S ACESSÓRIOS, basta preencher o formulário de cadastro disponível em nossa página de 'Seja Modelo' e enviar algumas fotos suas. Após o envio, nossa equipe irá avaliar o seu perfil e entrar em contato caso você seja selecionada para participar de nossas campanhas."
    },
    {
        question: "Quais são os requisitos para ser modelo?",
        answer: "Não exigimos um perfil específico para ser modelo, mas buscamos pessoas que se identifiquem com nossa marca e estejam dispostas a se engajar nas campanhas. Focamos na diversidade e buscamos modelos de diferentes estilos, idades e etnias. O mais importante é que você tenha confiança e uma atitude positiva diante das câmeras."
    },
    {
        question: "Quais tipos de modelos vocês procuram?",
        answer: "Nós procuramos modelos para diferentes finalidades: fotos para o site, redes sociais, campanhas publicitárias e outros materiais promocionais. Buscamos modelos de diferentes perfis e estilos, como modelos de rosto, corpo ou ainda influenciadores digitais que possam criar conteúdo para a nossa marca."
    },
    {
        question: "Preciso de experiência para me tornar modelo?",
        answer: "A experiência anterior não é um requisito obrigatório para se tornar modelo. Valorizamos mais a atitude e a confiança que você transmite nas fotos. Se você tem paixão por moda e acessórios e está disposta a aprender, certamente terá uma boa oportunidade conosco."
    },
    {
        question: "Quais são as etapas do processo de seleção?",
        answer: "O processo de seleção é simples. Primeiro, você envia suas informações e fotos através do formulário. Em seguida, nossa equipe avalia seu perfil e, se houver interesse, entraremos em contato para agendar um casting ou uma reunião para conversar mais sobre a parceria. Após isso, você será orientada sobre os próximos passos."
    },
    {
        question: "Como faço para entrar em contato com a equipe da LARI'S ACESSÓRIOS sobre ser modelo?",
        answer: "Se você deseja saber mais ou tem dúvidas sobre o processo de seleção para ser modelo, pode entrar em contato conosco através do e-mail larisacessorios.loja@gmail.com ou pelo telefone (35) 99739-4181. Estamos disponíveis para esclarecer todas as suas questões."
    },
    {
        question: "Quais tipos de campanhas a LARI'S ACESSÓRIOS realiza?",
        answer: "A LARI'S ACESSÓRIOS realiza uma variedade de campanhas, desde produções fotográficas para novas coleções até campanhas para datas comemorativas, como Dia das Mães e Natal. Também fazemos colaborações com influenciadores e modelos para criar conteúdos exclusivos para nossas redes sociais."
    },
    {
        question: "Posso compartilhar o conteúdo da campanha nas minhas redes sociais?",
        answer: "Sim! Quando você participa de uma campanha, você pode compartilhar o conteúdo produzido nas suas próprias redes sociais, desde que siga as orientações da equipe de marketing da LARI'S ACESSÓRIOS para garantir que a campanha seja divulgada de forma correta e com a imagem da marca preservada."
    }
];

export const faqData = [
    {
        question: "Como posso realizar uma compra em seu site?",
        answer: "Para realizar uma compra, basta navegar pelo nosso site, escolher os produtos desejados, adicioná-los ao carrinho e seguir para o checkout. Você precisará fornecer algumas informações pessoais para finalizar a compra, como endereço de entrega e forma de pagamento. Aceitamos cartões de crédito, Pix e outros meios de pagamento disponíveis."
    },
    {
        question: "Quais formas de pagamento vocês aceitam?",
        answer: "Aceitamos diversas formas de pagamento, incluindo cartões de crédito, transferências via Pix e boleto bancário. Durante o processo de compra, você poderá escolher a opção que melhor se adapta às suas necessidades."
    },
    {
        question: "Como posso rastrear meu pedido?",
        answer: "Após a confirmação do pagamento, você receberá um e-mail com o número de rastreamento do seu pedido. Você pode utilizar esse número para acompanhar a entrega diretamente pelo site dos correios ou pela plataforma de transporte escolhida."
    },
    {
        question: "Posso alterar ou cancelar meu pedido?",
        answer: "Alterações ou cancelamentos podem ser feitos até o momento em que o pedido for enviado. Se precisar fazer alguma alteração, entre em contato conosco o mais rápido possível. Caso o pedido já tenha sido enviado, não será possível realizar alterações, mas você pode solicitar a devolução do produto após o recebimento."
    },
    {
        question: "Quais são as políticas de troca e devolução?",
        answer: "Você pode solicitar a troca ou devolução de um produto em até 7 dias após o recebimento, desde que o item esteja em condições originais, sem uso e com a embalagem intacta. Para mais detalhes sobre o processo, consulte nossa política de trocas e devoluções ou entre em contato com nossa equipe de atendimento ao cliente."
    },
    {
        question: "Como sei que as joias e semijoias são de boa qualidade?",
        answer: "Trabalhamos com fornecedores de confiança e selecionamos cuidadosamente todos os nossos produtos. Nossas joias e semijoias são feitas com materiais de alta qualidade, como metais nobres e pedras naturais ou de excelente procedência. Garantimos que as peças atendem a rigorosos padrões de qualidade e durabilidade."
    },
    {
        question: "O que devo fazer se receber um produto com defeito?",
        answer: "Se você recebeu um produto com defeito ou avariado, entre em contato conosco imediatamente através do nosso e-mail ou telefone. Faremos o possível para resolver o problema, seja com a substituição do item ou o reembolso, conforme nossa política de trocas e devoluções."
    },
    {
        question: "Vocês entregam para todo o Brasil?",
        answer: "Sim, realizamos entregas em todo o Brasil. O frete será calculado com base no seu endereço durante o processo de checkout, e você poderá escolher entre as opções de envio disponíveis."
    },
    {
        question: "Posso acompanhar a atualização dos preços dos produtos?",
        answer: "Os preços dos nossos produtos podem ser atualizados ocasionalmente, com base em promoções, novos lançamentos ou alterações de custo. Para garantir que você receba as melhores ofertas, recomendamos que assine nossa newsletter ou acompanhe nossas redes sociais para atualizações e promoções exclusivas."
    },
    {
        question: "Como posso entrar em contato com o atendimento ao cliente?",
        answer: "Se você tiver dúvidas ou precisar de assistência, pode entrar em contato com o nosso atendimento ao cliente pelo e-mail <strong>larisacessorios.loja@gmail.com</strong> ou pelo telefone <strong>(35) 99739-4181</strong>. Estamos disponíveis para ajudar com qualquer dúvida ou necessidade que você possa ter."
    }
];

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

export const menuItemsAdmin: MenuItemsProps[] = [
    {
        title: "Dashboard",
        isLink: true,
        href: '/admin',
    },
    {
        title: "Produtos",
        isLink: true,
        href: '/admin/products',
    },
    {
        title: "Clientes",
        isLink: true,
        href: '/admin/clients',
    },
    {
        title: "Planilhas",
        isLink: false,
        subItems: [
            { title: "Planilha itens", href: '/admin/sheet/planilha-itens' },
            { title: "Planilha finanças", href: '/admin/sheet/planilha-despesas' },
        ]
    },
    {
        title: "Planejamentos",
        isLink: true,
        href: '/admin/planning',
    },
    {
        title: "Pedidos",
        isLink: true,
        href: '/admin/orders',
    },
    {
        title: "WebFacility",
        isLink: true,
        href: '/admin/reports',
    },
    {
        title: "Relatórios",
        isLink: true,
        href: '/admin/reports',
    },
    {
        title: "Configurações",
        isLink: true,
        href: '/admin/config',
    },
];


export const menuItems: MenuItemsProps[] = [
    {
        title: "Presentes",
        isLink: true,
        href: window.location.origin + '/collections/para-ela'
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
        title: "Carnaval",
        isLink: true,
        href: window.location.origin + '/collections/carnaval'
    },
]

export const getFirstAndLastName = (fullName: string) => {
    const nameParts = fullName.split(" ");
    if (nameParts.length > 1) {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        return `${firstName} ${lastName}`;
    }
    return fullName;
};

export function gerarUidComCaracteresENumeros(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';

    for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        uid += caracteres[randomIndex];
    }

    return uid;
}