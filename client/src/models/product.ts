export interface ProductNew {
    productId: string;          // ID único do produto
    uid: string;                // UID associado ao produto
    productName: string;        // Nome do produto
    productReference: string;   // Referência do produto
    linkText: string;           // Texto do link relacionado ao produto
    releaseDate: string;        // Data de lançamento do produto
    productAvailability: string; // Disponibilidade do produto (ex: "Em estoque", "Fora de estoque")
    productSupplier: string;    // Nome do fornecedor do produto
    productType: string;        // Tipo de produto
    productCollections: string[]; // Coleções às quais o produto pertence (ex: ["Coleção Verão 2024", "Novidades"])
    productJewerlyType: string; // Tipo de joia, caso seja joia (ex: "Anel", "Brinco")
    productJewerlyName: string; // Nome específico de uma joia (ex: "Anel de Ouro")
    productDiscount: number;    // Desconto aplicado (ex: 10 para 10%)
    productPrice: number;       // Preço do produto
    productExtender: string;    // Extensor do produto
    productSizes: string[];     // Tamanhos disponíveis (ex: ["P", "M", "G"])
    productQuantity: number;    // Quantidade disponível em estoque
    productPhotoURL: string;    // URL da imagem do produto
}

export interface ProductNew {
    productId: string;          // ID único do produto
    uid: string;                // UID associado ao produto
    productName: string;        // Nome do produto
    productReference: string;   // Referência do produto
    linkText: string;           // Texto do link relacionado ao produto
    releaseDate: string;        // Data de lançamento do produto
    productAvailability: string; // Disponibilidade do produto (ex: "Em estoque", "Fora de estoque")
    productSupplier: string;    // Nome do fornecedor do produto
    productType: string;        // Tipo de produto
    productCollections: string[]; // Coleções às quais o produto pertence (ex: ["Coleção Verão 2024", "Novidades"])
    productJewerlyType: string; // Tipo de joia, caso seja joia (ex: "Anel", "Brinco")
    productJewerlyName: string; // Nome específico de uma joia (ex: "Anel de Ouro")
    productDiscount: number;    // Desconto aplicado (ex: 10 para 10%)
    productPrice: number;       // Preço do produto
    productExtender: string;    // Extensor do produto
    productSizes: string[];     // Tamanhos disponíveis (ex: ["P", "M", "G"])
    productQuantity: number;    // Quantidade disponível em estoque
    productPhotoURL: string;    // URL da imagem do produto
}

export interface Product {
    id: number; // Identificador único do produto
    name_product: string; // Nome do produto
    price: number; // Preço do produto
    desconto: number; // Desconto aplicado no produto (se houver)
    disponibilidade: boolean; // Indica se o produto está disponível ou não
    tamanhos: string[]; // Lista de tamanhos disponíveis para o produto
    quantidade_disponivel: number; // Quantidade disponível do produto no estoque
    categoria: string; // Categoria do produto
    url: string; // URL do produto na loja
    fornecedor: string; // Nome do fornecedor do produto
    tipo: string; // Tipo do produto (ex: "novo", "usado", etc.)
    personalizavel: boolean; // Indica se o produto é personalizável
    photoURL: string; // URL da foto do produto
    extensor: string; // Campo adicional para qualquer outra informação sobre o produto
    type_full_label: string //Prata de Lei // Banhado a ouro // Banhado a prata
}







