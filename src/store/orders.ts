import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from './products';

export interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
  createdAt: Date;
}

export const useOrdersStore = defineStore('orders', () => {
  const currentOrder = ref<OrderItem[]>([]);
  const orderHistory = ref<Order[]>([]);
  const IVA_RATE = 0.19; // 19% IVA

  // Calcular subtotal del pedido actual
  const subtotal = computed(() => {
    return currentOrder.value.reduce((sum, item) => sum + item.subtotal, 0);
  });

  // Calcular IVA
  const iva = computed(() => {
    return subtotal.value * IVA_RATE;
  });

  // Calcular total
  const total = computed(() => {
    return subtotal.value + iva.value;
  });

  // Agregar producto al pedido
  const addToOrder = (product: Product, quantity: number = 1) => {
    const existingItem = currentOrder.value.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.product.price * existingItem.quantity;
    } else {
      currentOrder.value.push({
        product,
        quantity,
        subtotal: product.price * quantity,
      });
    }
  };

  // Remover producto del pedido
  const removeFromOrder = (productId: string) => {
    const index = currentOrder.value.findIndex(item => item.product.id === productId);
    if (index > -1) {
      currentOrder.value.splice(index, 1);
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId: string, quantity: number) => {
    const item = currentOrder.value.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromOrder(productId);
      } else {
        item.quantity = quantity;
        item.subtotal = item.product.price * quantity;
      }
    }
  };

  // Limpiar pedido actual
  const clearOrder = () => {
    currentOrder.value = [];
  };

  // Registrar pedido (finalizar venta)
  const registerOrder = (discount: number = 0): Order => {
    const order: Order = {
      id: `VENTA-${String(orderHistory.value.length + 1).padStart(3, '0')}`,
      items: [...currentOrder.value],
      subtotal: subtotal.value,
      discount,
      iva: iva.value,
      total: total.value - discount,
      createdAt: new Date(),
    };

    orderHistory.value.push(order);
    clearOrder();
    
    return order;
  };

  // Obtener historial de pedidos
  const getOrderHistory = computed(() => orderHistory.value);

  return {
    currentOrder,
    subtotal,
    iva,
    total,
    addToOrder,
    removeFromOrder,
    updateQuantity,
    clearOrder,
    registerOrder,
    getOrderHistory,
  };
});

