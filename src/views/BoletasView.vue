<template>
  <div>
    <Header title="Boletas" action-label="+ Añadir Boleta" @action="handleAddBoleta" />
    <main class="p-6">
      <!-- Barra de acciones -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Gestión de Boletas</h2>
        <button
          @click="exportBoletas"
          class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar a PDF
        </button>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Búsqueda por número de boleta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por número</label>
            <input
              v-model="filters.searchId"
              type="text"
              placeholder="Ej: VENTA-001"
              class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Filtro por estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="filters.status"
              class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="Emitida">Emitida</option>
              <option value="Anulada">Anulada</option>
            </select>
          </div>

          <!-- Filtro por sucursal -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
            <select
              v-model="filters.branch"
              class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todas</option>
              <option v-for="branch in uniqueBranches" :key="branch" :value="branch">
                {{ branch }}
              </option>
            </select>
          </div>

          <!-- Filtro por vendedor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
            <select
              v-model="filters.seller"
              class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todos</option>
              <option v-for="seller in uniqueSellers" :key="seller" :value="seller">
                {{ seller }}
              </option>
            </select>
          </div>

          <!-- Filtro por fecha desde -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Filtro por fecha hasta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Botón limpiar filtros -->
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>

          <!-- Contador de resultados -->
          <div class="flex items-end">
            <span class="text-sm text-gray-600">
              Mostrando {{ filteredSales.length }} de {{ sales.length }} boletas
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Boleta
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de emisión
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de pago
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IVA
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="sale in filteredSales"
                :key="sale.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ sale.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(sale.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ sale.branch }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ sale.seller }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ sale.paymentMethod }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ formatPrice(sale.subtotal) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ formatPrice(sale.iva) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${{ formatPrice(sale.total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="
                      sale.status === 'Emitida'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="
                        sale.status === 'Emitida'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      "
                    ></span>
                    {{ sale.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button
                      @click="viewSale(sale.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Ver"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="printSale(sale.id)"
                      class="text-green-600 hover:text-green-900"
                      title="Imprimir PDF"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    <button
                      v-if="sale.status === 'Emitida'"
                      @click="voidSale(sale.id)"
                      class="text-red-600 hover:text-red-900"
                      title="Anular"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal de detalle de boleta -->
    <SaleDetailModal
      :is-open="showDetailModal"
      :sale="selectedSale"
      @update:is-open="showDetailModal = $event"
    />

    <!-- Modal de añadir boleta -->
    <AddBoletaModal
      :is-open="showAddModal"
      @update:is-open="showAddModal = $event"
      @created="handleBoletaCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Header from '../components/Header.vue';
import SaleDetailModal from '../components/SaleDetailModal.vue';
import AddBoletaModal from '../components/AddBoletaModal.vue';
import { useSalesStore } from '../store/sales';
import { useIngredientsStore } from '../store/ingredients';
import type { Sale } from '../store/sales';
import type { TipoIngrediente, Id } from '@/types';
import { exportBoletasToPDF } from '../utils/exportUtils';

const salesStore = useSalesStore();
const ingredientsStore = useIngredientsStore();
const sales = computed(() => salesStore.getSales);

// Filtros
const filters = ref({
  searchId: '',
  status: '',
  branch: '',
  seller: '',
  dateFrom: '',
  dateTo: '',
});

// Obtener valores únicos para los selectores
const uniqueBranches = computed(() => {
  const branches = new Set(sales.value.map(s => s.branch));
  return Array.from(branches).sort();
});

const uniqueSellers = computed(() => {
  const sellers = new Set(sales.value.map(s => s.seller));
  return Array.from(sellers).sort();
});

// Sales filtradas
const filteredSales = computed(() => {
  let result = [...sales.value];

  // Filtro por número de boleta
  if (filters.value.searchId) {
    const searchTerm = filters.value.searchId.toLowerCase();
    result = result.filter(s => s.id.toLowerCase().includes(searchTerm));
  }

  // Filtro por estado
  if (filters.value.status) {
    result = result.filter(s => s.status === filters.value.status);
  }

  // Filtro por sucursal
  if (filters.value.branch) {
    result = result.filter(s => s.branch === filters.value.branch);
  }

  // Filtro por vendedor
  if (filters.value.seller) {
    result = result.filter(s => s.seller === filters.value.seller);
  }

  // Filtro por fecha desde
  if (filters.value.dateFrom) {
    const dateFrom = new Date(filters.value.dateFrom);
    dateFrom.setHours(0, 0, 0, 0);
    result = result.filter(s => {
      const saleDate = new Date(s.date);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate >= dateFrom;
    });
  }

  // Filtro por fecha hasta
  if (filters.value.dateTo) {
    const dateTo = new Date(filters.value.dateTo);
    dateTo.setHours(23, 59, 59, 999);
    result = result.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate <= dateTo;
    });
  }

  return result;
});

// Limpiar filtros
const clearFilters = () => {
  filters.value = {
    searchId: '',
    status: '',
    branch: '',
    seller: '',
    dateFrom: '',
    dateTo: '',
  };
};

// Exportar boletas a PDF
const exportBoletas = () => {
  exportBoletasToPDF(filteredSales.value, `boletas_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Helper para obtener nombre de ingrediente
function getIngredientName(tipo: TipoIngrediente, id: Id | null): string {
  if (!id) return '';
  const ingrediente = ingredientsStore.getIngredientesByTipo(tipo).find(
    (ing: any) => ing.id_ingrediente === id
  );
  return ingrediente?.nombre || String(id);
}

const showDetailModal = ref(false);
const showAddModal = ref(false);
const selectedSale = ref<Sale | null>(null);

const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(price);
};

const viewSale = (id: string) => {
  const sale = sales.value.find(s => s.id === id);
  if (sale) {
    selectedSale.value = sale;
    showDetailModal.value = true;
  }
};

const handleAddBoleta = () => {
  showAddModal.value = true;
};

const handleBoletaCreated = () => {
  // La boleta ya fue creada por el modal
  // Aquí podrías agregar una notificación de éxito si lo deseas
};

const voidSale = (id: string) => {
  const sale = sales.value.find(s => s.id === id);
  if (!sale) return;
  
  const reason = prompt('Ingrese la razón de anulación (opcional):');
  if (reason !== null) {
    if (confirm(`¿Está seguro de anular la boleta ${id}?`)) {
      const success = salesStore.voidSale(id, reason || undefined);
      if (success) {
        alert(`Boleta ${id} anulada exitosamente`);
      } else {
        alert('No se pudo anular la boleta. Verifique que esté en estado "Emitida".');
      }
    }
  }
};

const printSale = (id: string) => {
  const sale = sales.value.find(s => s.id === id);
  if (!sale) return;
  
  // Crear ventana para imprimir
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita ventanas emergentes para imprimir');
    return;
  }
  
  // Generar HTML de la boleta
  const html = generateSaleHTML(sale);
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Esperar a que se cargue el contenido y luego imprimir
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

const generateSaleHTML = (sale: Sale): string => {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL').format(Math.round(price));
  };
  
  const getProductPrice = (product: any) => {
    if (product.tipo === 'configurable') {
      return product.precio_base_clp;
    } else {
      return product.precio_clp;
    }
  };
  
  let itemsHTML = '';
  sale.order.items.forEach((item, index) => {
    const unitPrice = item.customization ? item.subtotal / item.quantity : getProductPrice(item.product);
    itemsHTML += `
      <tr>
        <td class="border px-4 py-2">${index + 1}</td>
        <td class="border px-4 py-2">${item.product.nombre}</td>
        <td class="border px-4 py-2 text-right">${item.quantity}</td>
        <td class="border px-4 py-2 text-right">$${formatPrice(unitPrice)}</td>
        <td class="border px-4 py-2 text-right">$${formatPrice(item.subtotal)}</td>
      </tr>
    `;
    
    // Agregar detalles de personalización si existe
    if (item.customization) {
      let customizationDetails = '<tr><td colspan="5" class="border px-4 py-2 bg-gray-50 text-xs">';
      customizationDetails += '<strong>Personalización:</strong><br>';
      
      if (item.customization && item.customization.variacionId && item.product.tipo === 'configurable') {
        const variacion = item.product.variaciones?.find((v: any) => v.id_variacion === item.customization!.variacionId);
        if (variacion) {
          customizationDetails += `• Variación: ${variacion.nombre}<br>`;
        }
      }
      
      if (item.customization.sabores.length > 0) {
        const sabores = item.customization.sabores.map((s: any) => `${s.nombre || s.id} (${s.cantidad})`).join(', ');
        customizationDetails += `• Sabores: ${sabores}<br>`;
      }
      
      if (item.customization.salsa) {
        customizationDetails += `• Salsa: ${getIngredientName('salsa', item.customization.salsa)}<br>`;
      }
      
      if (item.customization.fruta) {
        customizationDetails += `• Fruta: ${getIngredientName('fruta', item.customization.fruta)}<br>`;
      }
      
      if (item.customization.crema) {
        customizationDetails += `• Crema chantilly: Sí<br>`;
      }
      
      if (item.customization.extras.toppings.length > 0) {
        const toppings = item.customization.extras.toppings.map((t: any) => `${getIngredientName('topping', t.id)} (${t.cantidad})`).join(', ');
        customizationDetails += `• Toppings: ${toppings}<br>`;
      }
      
      if (item.customization.extras.salsa_extra.cantidad > 0) {
        const tipoSalsa = item.customization.extras.salsa_extra.tipo 
          ? getIngredientName('salsa', item.customization.extras.salsa_extra.tipo)
          : '';
        customizationDetails += `• Salsa extra: ${item.customization.extras.salsa_extra.cantidad}x${tipoSalsa ? ` (${tipoSalsa})` : ''}<br>`;
      }
      
      if (item.customization.extras.fruta_extra.cantidad > 0) {
        const tipoFruta = item.customization.extras.fruta_extra.tipo 
          ? getIngredientName('fruta', item.customization.extras.fruta_extra.tipo)
          : '';
        customizationDetails += `• Fruta extra: ${item.customization.extras.fruta_extra.cantidad}x${tipoFruta ? ` (${tipoFruta})` : ''}<br>`;
      }
      
      if (item.customization.extras.crema_extra > 0) {
        customizationDetails += `• Crema extra: ${item.customization.extras.crema_extra}x<br>`;
      }
      
      customizationDetails += '</td></tr>';
      itemsHTML += customizationDetails;
    }
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Boleta ${sale.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary { margin-top: 20px; }
        .summary-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
        .status-emitida { background-color: #d4edda; color: #155724; }
        .status-anulada { background-color: #f8d7da; color: #721c24; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>BOLETA DE VENTA</h1>
        <p><strong>N° ${sale.id}</strong></p>
        <p>Fecha: ${formatDate(sale.date)}</p>
        <p>Sucursal: ${sale.branch}</p>
        <p>Vendedor: ${sale.seller}</p>
        <p>Método de pago: ${sale.paymentMethod}</p>
        <p>
          <span class="status ${sale.status === 'Emitida' ? 'status-emitida' : 'status-anulada'}">
            ${sale.status}
          </span>
        </p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th class="border px-4 py-2">#</th>
            <th class="border px-4 py-2">Producto</th>
            <th class="border px-4 py-2 text-right">Cantidad</th>
            <th class="border px-4 py-2 text-right">Precio Unit.</th>
            <th class="border px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
      
      <div class="summary">
        <div class="summary-row">
          <span>Subtotal (IVA incluido):</span>
          <span>$${formatPrice(sale.subtotal)}</span>
        </div>
        ${sale.discount && sale.discount > 0 ? `
        <div class="summary-row">
          <span>Descuento:</span>
          <span style="color: red;">-$${formatPrice(sale.discount)}</span>
        </div>
        ` : ''}
        <div class="summary-row">
          <span>IVA incluido (19%):</span>
          <span>$${formatPrice(sale.iva)}</span>
        </div>
        <div class="summary-row total">
          <span>TOTAL:</span>
          <span>$${formatPrice(sale.total)}</span>
        </div>
      </div>
      
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        <p>Gracias por su compra</p>
      </div>
    </body>
    </html>
  `;
};
</script>
