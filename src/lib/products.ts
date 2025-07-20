export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Accessoires' | 'Vêtements' | 'Tech' | 'Maison';
  rating: number;
  stock: number;
  reviews: number;
  images: string[];
  features: string[];
  data_ai_hint: string;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Casque Audio Minimaliste',
    description: 'Un son immersif dans un design épuré. Confort et performance pour vos oreilles.',
    price: 149.99,
    category: 'Tech',
    rating: 4.8,
    stock: 25,
    reviews: 124,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    features: ['Réduction de bruit active', 'Autonomie de 20h', 'Bluetooth 5.2', 'Ultra-léger'],
    data_ai_hint: 'headphones elegant',
  },
  {
    id: 2,
    name: 'T-shirt en Coton Bio',
    description: 'Le basique essentiel, réinventé avec une coupe parfaite et un coton biologique ultra-doux.',
    price: 39.99,
    category: 'Vêtements',
    rating: 4.9,
    stock: 150,
    reviews: 230,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600'],
    features: ['100% Coton Biologique GOTS', 'Coupe ajustée', 'Col rond durable'],
    data_ai_hint: 'black t-shirt',
  },
  {
    id: 3,
    name: 'Sac à Dos Urbain',
    description: 'Le compagnon idéal pour vos aventures quotidiennes. Fonctionnel, durable et résistant à l\'eau.',
    price: 89.99,
    category: 'Accessoires',
    rating: 4.7,
    stock: 40,
    reviews: 98,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600'],
    features: ['Compartiment pour ordinateur 15"', 'Tissu déperlant', 'Poches de sécurité'],
    data_ai_hint: 'minimalist backpack',
  },
  {
    id: 4,
    name: 'Lampe de Bureau LED',
    description: 'Éclairez votre espace de travail avec style. Lumière ajustable et design moderne.',
    price: 75.0,
    category: 'Maison',
    rating: 4.6,
    stock: 30,
    reviews: 75,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600'],
    features: ['Intensité et température de couleur réglables', 'Bras articulé', 'Port USB intégré'],
    data_ai_hint: 'desk lamp',
  },
  {
    id: 5,
    name: 'Montre Classique Noire',
    description: 'L\'élégance au poignet. Un cadran sobre et un bracelet en cuir véritable.',
    price: 220.0,
    category: 'Accessoires',
    rating: 4.9,
    stock: 15,
    reviews: 150,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600'],
    features: ['Mouvement à quartz suisse', 'Verre saphir inrayable', 'Bracelet en cuir interchangeable'],
    data_ai_hint: 'black watch',
  },
  {
    id: 6,
    name: 'Sweat à Capuche Technique',
    description: 'Confort thermique et liberté de mouvement. Un vêtement technique au look décontracté.',
    price: 99.99,
    category: 'Vêtements',
    rating: 4.8,
    stock: 60,
    reviews: 88,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600'],
    features: ['Tissu respirant', 'Intérieur brossé pour la chaleur', 'Poches zippées'],
    data_ai_hint: 'black hoodie',
  },
  {
    id: 7,
    name: 'Enceinte Bluetooth Portable',
    description: 'La bande-son de votre vie, où que vous soyez. Un son puissant dans un format compact.',
    price: 119.99,
    category: 'Tech',
    rating: 4.7,
    stock: 55,
    reviews: 112,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600'],
    features: ['Son à 360°', 'Résistante à l\'eau (IPX7)', '12h d\'autonomie'],
    data_ai_hint: 'bluetooth speaker',
  },
  {
    id: 8,
    name: 'Tasse en Céramique Mate',
    description: 'Pour vos boissons chaudes, une tasse au design sobre et à la prise en main agréable.',
    price: 24.99,
    category: 'Maison',
    rating: 4.9,
    stock: 200,
    reviews: 310,
    images: ['https://placehold.co/600x600'],
    features: ['Finition mate', 'Passe au lave-vaisselle et au micro-ondes', 'Contenance de 350ml'],
    data_ai_hint: 'black mug',
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductCategories(): string[] {
  return [...new Set(products.map(p => p.category))];
}
