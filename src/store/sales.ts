import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Order } from './orders';

export interface Sale {
  id: string;
  orderId: string;
  date: Date;
  branch: string;
  seller: string;
  paymentMethod: 'Efectivo' | 'Débito' | 'Crédito' | 'Transferencia';
  subtotal: number;
  iva: number;
  total: number;
  status: 'Emitida' | 'Anulada';
  order: Order;
}

export const useSalesStore = defineStore('sales', () => {
  const sales = ref<Sale[]>([
    {
      id: 'VENTA-001',
      orderId: 'VENTA-001',
      date: new Date('2025-10-04T14:32:00'),
      branch: 'Casa Matriz',
      seller: 'Empleado #004',
      paymentMethod: 'Débito',
      subtotal: 10378,
      iva: 1972,
      total: 12350,
      status: 'Emitida',
      order: {} as Order,
    },
    {
      id: 'VENTA-002',
      orderId: 'VENTA-002',
      date: new Date('2025-10-04T15:05:00'),
      branch: 'Casa Matriz',
      seller: 'Empleado #004',
      paymentMethod: 'Transferencia',
      subtotal: 7059,
      iva: 1341,
      total: 8400,
      status: 'Anulada',
      order: {} as Order,
    },
    {
      id: 'VENTA-003',
      orderId: 'VENTA-003',
      date: new Date('2025-10-04T15:45:00'),
      branch: 'Casa Matriz',
      seller: 'Empleado #004',
      paymentMethod: 'Efectivo',
      subtotal: 1933,
      iva: 367,
      total: 2300,
      status: 'Emitida',
      order: {} as Order,
    },
    {
      id: 'VENTA-004',
      orderId: 'VENTA-004',
      date: new Date('2025-10-05T16:22:00'),
      branch: 'Casa Matriz',
      seller: 'Empleado #004',
      paymentMethod: 'Crédito',
      subtotal: 17269,
      iva: 3281,
      total: 20550,
      status: 'Emitida',
      order: {} as Order,
    },
  ]);

  const addSale = (sale: Sale) => {
    sales.value.unshift(sale);
  };

  const deleteSale = (id: string) => {
    const index = sales.value.findIndex(s => s.id === id);
    if (index > -1) {
      sales.value.splice(index, 1);
    }
  };

  const getSales = computed(() => sales.value);

  const getSalesByStatus = (status: 'Emitida' | 'Anulada') => {
    return sales.value.filter(s => s.status === status);
  };

  // Estadísticas calculadas
  const totalRevenue = computed(() => {
    return sales.value
      .filter(s => s.status === 'Emitida')
      .reduce((sum, sale) => sum + sale.total, 0);
  });

  const totalExpenses = computed(() => {
    // Por ahora retornamos un valor fijo, pero podría calcularse desde otro store
    return 4500000;
  });

  const getSalesByPeriod = (period: 'today' | 'week' | 'month' | 'year') => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return sales.value.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= startDate && s.status === 'Emitida';
    });
  };

  const getDailySales = (days: number = 7) => {
    const salesByDay: number[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const daySales = sales.value
        .filter(s => {
          const saleDate = new Date(s.date);
          return saleDate >= dayStart && saleDate < dayEnd && s.status === 'Emitida';
        })
        .reduce((sum, sale) => sum + sale.total, 0);
      
      salesByDay.push(daySales);
    }
    
    return salesByDay;
  };

  return {
    sales,
    addSale,
    deleteSale,
    getSales,
    getSalesByStatus,
    totalRevenue,
    totalExpenses,
    getSalesByPeriod,
    getDailySales,
  };
});

