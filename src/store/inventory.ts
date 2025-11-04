import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  status: 'En Stock' | 'Bajo Stock' | 'No queda Stock' | 'Stock estancado';
  image?: string;
}

export interface StockAlert {
  id: string;
  ingredient: string;
  description: string;
  quantity: number;
  type: 'Bajo Stock' | 'No queda Stock' | 'Stock estancado';
}

export const useInventoryStore = defineStore('inventory', () => {
  const ingredients = ref<Ingredient[]>([
    {
      id: '1',
      name: 'Helado de Chocolate',
      description: 'Helado sabor chocolate',
      productId: '67869052',
      productName: 'Helado de Chocolate',
      quantity: 40,
      price: 3000,
      status: 'En Stock',
    },
    {
      id: '2',
      name: 'Chispitas de Arcoiris',
      description: 'Chispitas de colores para decorar',
      productId: '68970163',
      productName: 'Chispitas de Arcoiris',
      quantity: 40,
      price: 4000,
      status: 'En Stock',
    },
    {
      id: '3',
      name: 'Salsa de Frutilla',
      description: 'Salsa dulce de frutilla',
      productId: '66758941',
      productName: 'Salsa de Frutilla',
      quantity: 50,
      price: 2000,
      status: 'En Stock',
    },
    {
      id: '4',
      name: 'Frambuesas',
      description: 'Frambuesas frescas',
      productId: '67869052',
      productName: 'Frambuesas',
      quantity: 40,
      price: 3000,
      status: 'En Stock',
    },
    {
      id: '5',
      name: 'Dulces de Gomita',
      description: 'Gomitas de colores',
      productId: '68970163',
      productName: 'Dulces de Gomita',
      quantity: 40,
      price: 4000,
      status: 'En Stock',
    },
    {
      id: '6',
      name: 'Crema Chantilly',
      description: 'Crema batida para decorar',
      productId: '66758941',
      productName: 'Crema Chantilly',
      quantity: 50,
      price: 2000,
      status: 'En Stock',
    },
    {
      id: '7',
      name: 'Agua Mineral',
      description: 'Agua mineral natural',
      productId: '67869052',
      productName: 'Agua Mineral',
      quantity: 40,
      price: 3000,
      status: 'En Stock',
    },
  ]);

  const stockAlerts = ref<StockAlert[]>([
    {
      id: 'alert-1',
      ingredient: 'Bajo Stock',
      description: 'Queda bajo Stock del producto 67869052 (Helado de Chocolate) ¡Debes reponer el producto!',
      quantity: 5,
      type: 'Bajo Stock',
    },
    {
      id: 'alert-2',
      ingredient: 'No queda Stock',
      description: 'No queda Stock del producto Producto 67869052 (Helado de Chocolate) ¡Debes reponer el producto con urgencia!',
      quantity: 0,
      type: 'No queda Stock',
    },
    {
      id: 'alert-3',
      ingredient: 'Stock estancado',
      description: 'El Stock del producto Producto 67869052 (Helado de Chocolate) esta estancado ¡Revisa la fecha de vencimiento!',
      quantity: 10,
      type: 'Stock estancado',
    },
  ]);

  const addIngredient = (ingredient: Ingredient) => {
    ingredients.value.push(ingredient);
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    const index = ingredients.value.findIndex(i => i.id === id);
    if (index > -1) {
      ingredients.value[index] = { ...ingredients.value[index], ...updates };
    }
  };

  const deleteIngredient = (id: string) => {
    const index = ingredients.value.findIndex(i => i.id === id);
    if (index > -1) {
      ingredients.value.splice(index, 1);
    }
  };

  const deleteAlert = (id: string) => {
    const index = stockAlerts.value.findIndex(a => a.id === id);
    if (index > -1) {
      stockAlerts.value.splice(index, 1);
    }
  };

  const getIngredients = computed(() => ingredients.value);
  const getAlerts = computed(() => stockAlerts.value);

  return {
    ingredients,
    stockAlerts,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    deleteAlert,
    getIngredients,
    getAlerts,
  };
});

