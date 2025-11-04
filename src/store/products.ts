import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cones' | 'cups';
  image?: string;
  type: 'simple-small' | 'simple-large' | 'double' | 'junior' | 'small-cup' | 'large-cup';
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([
    // Helados de Conos
    {
      id: '1',
      name: 'Simple Pequeño + 1 bolita',
      description: '1 Sabor de helado.',
      price: 900,
      category: 'cones',
      type: 'simple-small',
    },
    {
      id: '2',
      name: 'Simple Grande + 1 bolita',
      description: '1 Sabor de helado.',
      price: 1000,
      category: 'cones',
      type: 'simple-large',
    },
    {
      id: '3',
      name: 'Doble + 2 bolitas',
      description: '2 Sabores de helado',
      price: 5000,
      category: 'cones',
      type: 'double',
    },
    // Helados en Copas
    {
      id: '4',
      name: 'Copa Junior + 1 bolita',
      description: '1 Sabor de helado más 1 salsa, 1 fruta y crema chantilly',
      price: 1800,
      category: 'cups',
      type: 'junior',
    },
    {
      id: '5',
      name: 'Copa Chica + 2 bolitas',
      description: '2 Sabores de helado más 1 salsa 1 fruta y cream chantilly',
      price: 2500,
      category: 'cups',
      type: 'small-cup',
    },
    {
      id: '6',
      name: 'Copa Grande + 2 bolitas',
      description: '2 Sabores de helado más 1 salsa 1 fruta y crema chantilly',
      price: 5000,
      category: 'cups',
      type: 'large-cup',
    },
  ]);

  // Ingredientes adicionales
  const toppings = ref<Product[]>([
    {
      id: 'topping-1',
      name: 'Chispitas de Arcoiris',
      description: 'Chispitas de colores',
      price: 300,
      category: 'cones',
      type: 'simple-small',
    },
  ]);

  const getProductsByCategory = computed(() => (category: 'cones' | 'cups') => {
    return products.value.filter(p => p.category === category);
  });

  const getProductById = (id: string) => {
    return products.value.find(p => p.id === id) || toppings.value.find(t => t.id === id);
  };

  return {
    products,
    toppings,
    getProductsByCategory,
    getProductById,
  };
});

