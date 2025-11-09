import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Producto, Id, ProductoConfigurable, Ingrediente } from '@/types';
import type { ProductCustomization } from '@/components/ProductCustomizationModal.vue';

export interface OrderItem {
  product: Producto;
  quantity: number;
  subtotal: number;
  customization?: ProductCustomization;
}

// Helper para obtener el precio de un producto según su tipo
function getProductPrice(product: Producto): number {
  if (product.tipo === 'configurable') {
    return product.precio_base_clp;
  } else {
    return product.precio_clp;
  }
}

// Helper para calcular precio con personalización
function calculateCustomizedPrice(
  product: ProductoConfigurable,
  customization: ProductCustomization,
  ingredientsStore: any
): number {
  let precio = 0;

  // Precio base o variación
  if (customization.variacionId !== null) {
    const variacion = product.variaciones?.find(
      (v) => v.id_variacion === customization.variacionId
    );
    if (variacion) {
      precio = variacion.precio_final_clp;
    }
  } else {
    precio = product.precio_base_clp;
  }

  // Regla de helado
  const reglaHelado = product.reglas.find((r) => r.tipo === 'helado');
  if (reglaHelado) {
    const totalSabores = customization.sabores.reduce((sum, s) => sum + s.cantidad, 0);
    const incluidas = reglaHelado.incluidas;
    if (totalSabores > incluidas) {
      const extras = totalSabores - incluidas;
      precio += extras * reglaHelado.precio_extra_unitario_clp;
    }
    // Sumar valor extra de cada sabor
    customization.sabores.forEach((s) => {
      const ingrediente = ingredientsStore.getIngredienteById(s.id);
      if (ingrediente) {
        precio += s.cantidad * ingrediente.valor_extra_clp;
      }
    });
  }

  // Salsa
  if (customization.salsa) {
    const salsa = ingredientsStore.getIngredientesByTipo('salsa').find(
      (s: Ingrediente) => s.id_ingrediente === customization.salsa
    );
    if (salsa) {
      precio += salsa.valor_extra_clp;
    }
  }

  // Fruta
  if (customization.fruta) {
    const fruta = ingredientsStore.getIngredientesByTipo('fruta').find(
      (f: Ingrediente) => f.id_ingrediente === customization.fruta
    );
    if (fruta) {
      precio += fruta.valor_extra_clp;
    }
  }

  // Extras de toppings
  customization.extras.toppings.forEach((topping) => {
    const ing = ingredientsStore.getIngredientesByTipo('topping').find(
      (t: Ingrediente) => t.id_ingrediente === topping.id
    );
    if (ing) {
      precio += topping.cantidad * (ing.valor_extra_clp + 300); // Precio base + extra
    }
  });

  // Salsa extra
  if (customization.extras.salsa_extra.cantidad > 0) {
    precio += customization.extras.salsa_extra.cantidad * 300;
  }

  // Fruta extra
  if (customization.extras.fruta_extra.cantidad > 0) {
    precio += customization.extras.fruta_extra.cantidad * 500;
  }

  // Crema extra
  if (customization.extras.crema_extra > 0) {
    precio += customization.extras.crema_extra * 700;
  }

  return precio;
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

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number; // Valor original: porcentaje (0-100) o monto fijo
}

export const useOrdersStore = defineStore('orders', () => {
  const currentOrder = ref<OrderItem[]>([]);
  const orderHistory = ref<Order[]>([]);
  const currentDiscount = ref<Discount | null>(null);
  const IVA_RATE = 0.19; // 19% IVA
  // Factor para extraer IVA de un precio que ya lo incluye: 19/119 = 0.159663865546...
  const IVA_EXTRACTION_FACTOR = IVA_RATE / (1 + IVA_RATE); // 0.159663865546...

  // Calcular subtotal del pedido actual (precios ya incluyen IVA)
  const subtotal = computed(() => {
    return currentOrder.value.reduce((sum, item) => sum + item.subtotal, 0);
  });

  // Calcular monto del descuento
  const discountAmount = computed(() => {
    if (!currentDiscount.value) return 0;
    
    if (currentDiscount.value.type === 'percentage') {
      return subtotal.value * (currentDiscount.value.value / 100);
    } else {
      return Math.min(currentDiscount.value.value, subtotal.value);
    }
  });

  // Calcular subtotal después del descuento (ya incluye IVA)
  const subtotalAfterDiscount = computed(() => {
    return Math.max(0, subtotal.value - discountAmount.value);
  });

  // Calcular IVA incluido en el subtotal (extraer IVA de precio que ya lo incluye)
  // Si el precio es $1000 con IVA incluido, el IVA es $1000 * (19/119) = $159.66
  const iva = computed(() => {
    return subtotalAfterDiscount.value * IVA_EXTRACTION_FACTOR;
  });

  // Calcular total (el subtotal después del descuento ya incluye IVA, no se suma)
  const total = computed(() => {
    return subtotalAfterDiscount.value;
  });

  // Agregar producto al pedido
  const addToOrder = (
    product: Producto,
    quantity: number = 1,
    customization?: ProductCustomization,
    ingredientsStore?: any
  ) => {
    // Si es configurable, necesitamos calcular el precio con personalización
    let price: number;
    if (product.tipo === 'configurable' && customization) {
      price = calculateCustomizedPrice(product, customization, ingredientsStore!);
    } else {
      price = getProductPrice(product);
    }

    // Para productos configurable, SIEMPRE debe tener personalización
    if (product.tipo === 'configurable') {
      if (!customization) {
        console.error('Producto configurable agregado sin personalización:', product.nombre);
        // No agregar productos configurables sin personalización
        return;
      }
      // Producto personalizado: agregar siempre como nuevo item (cada personalización es única)
      // Hacer una copia profunda de la personalización para preservarla
      const customizationCopy: ProductCustomization = JSON.parse(JSON.stringify(customization));
      const newItem = {
        product,
        quantity,
        subtotal: price * quantity,
        customization: customizationCopy,
      };
      console.log('Adding item to order:', {
        product: product.nombre,
        hasCustomization: !!newItem.customization,
        customization: newItem.customization,
      });
      currentOrder.value.push(newItem);
    } else {
      // Producto no configurable: buscar si existe
      const existingItem = currentOrder.value.find(
        (item) => item.product.id === product.id && !item.customization
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = price * existingItem.quantity;
      } else {
        currentOrder.value.push({
          product,
          quantity,
          subtotal: price * quantity,
      });
      }
    }
  };

  // Remover producto del pedido
  const removeFromOrder = (productId: Id) => {
    // Para productos no personalizados, buscar y remover el primero que coincida
    const index = currentOrder.value.findIndex(
      item => item.product.id === productId && !item.customization
    );
    if (index > -1) {
      currentOrder.value.splice(index, 1);
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId: Id, quantity: number, ingredientsStore?: any) => {
    const item = currentOrder.value.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromOrder(productId);
      } else {
        item.quantity = quantity;
        let price: number;
        if (item.product.tipo === 'configurable' && item.customization) {
          price = calculateCustomizedPrice(item.product, item.customization, ingredientsStore!);
        } else {
          price = getProductPrice(item.product);
        }
        item.subtotal = price * quantity;
      }
    }
  };

  // Limpiar pedido actual
  const clearOrder = () => {
    currentOrder.value = [];
    currentDiscount.value = null;
  };

  // Aplicar descuento
  const applyDiscount = (value: number, type: 'percentage' | 'fixed') => {
    // Validar que el descuento no sea mayor al subtotal (para montos fijos)
    if (type === 'fixed' && value > subtotal.value) {
      throw new Error('El descuento no puede ser mayor al subtotal');
    }
    
    // Validar que el porcentaje no sea mayor al máximo (100%)
    if (type === 'percentage' && value > 100) {
      throw new Error('El descuento no puede ser mayor al 100%');
    }
    
    currentDiscount.value = {
      type,
      value,
    };
  };

  // Quitar descuento
  const clearDiscount = () => {
    currentDiscount.value = null;
  };

  // Registrar pedido (finalizar venta)
  const registerOrder = (): Order => {
    // Hacer una copia profunda usando JSON para preservar toda la estructura de personalización
    const itemsWithCustomization = JSON.parse(JSON.stringify(currentOrder.value));

    const order: Order = {
      id: `VENTA-${String(orderHistory.value.length + 1).padStart(3, '0')}`,
      items: itemsWithCustomization,
      subtotal: subtotal.value, // Subtotal original (con IVA incluido)
      discount: discountAmount.value,
      iva: iva.value, // IVA extraído del total final
      total: total.value, // Total final (subtotal - descuento, ya incluye IVA)
      createdAt: new Date(),
    };

    orderHistory.value.push(order);
    clearOrder();
    
    return order;
  };

  // Obtener historial de pedidos
  const getOrderHistory = computed(() => orderHistory.value);

  // Exponer función para calcular precio personalizado (para uso externo)
  function calculateCustomizedPriceExternal(
    product: ProductoConfigurable,
    customization: ProductCustomization,
    ingredientsStore: any
  ): number {
    return calculateCustomizedPrice(product, customization, ingredientsStore);
  }

  return {
    currentOrder,
    currentDiscount,
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    iva,
    total,
    addToOrder,
    removeFromOrder,
    updateQuantity,
    clearOrder,
    applyDiscount,
    clearDiscount,
    registerOrder,
    getOrderHistory,
    calculateCustomizedPrice: calculateCustomizedPriceExternal,
  };
});

