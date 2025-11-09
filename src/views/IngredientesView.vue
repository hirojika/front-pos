<template>
  <div>
    <Header title="Gestión de Inventario" />
    <main class="p-6">
      <!-- PESTAÑAS Y BARRA DE ACCIONES -->
      <div class="flex items-center justify-between mb-4">
        <div class="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            class="px-3 py-1 rounded-md transition-colors"
            :class="tab === 'materias' ? 'bg-white shadow' : 'hover:bg-gray-200'"
            @click="tab = 'materias'"
          >
            Materias Primas
          </button>
          <button
            class="px-3 py-1 rounded-md transition-colors"
            :class="tab === 'ingredientes' ? 'bg-white shadow' : 'hover:bg-gray-200'"
            @click="tab = 'ingredientes'"
          >
            Ingredientes
          </button>
          <button
            class="px-3 py-1 rounded-md transition-colors"
            :class="tab === 'productos' ? 'bg-white shadow' : 'hover:bg-gray-200'"
            @click="tab = 'productos'"
          >
            Productos
          </button>
        </div>
        <button
          @click="exportInventory"
          class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar a Excel
        </button>
      </div>

      <!-- ==================== MATERIAS PRIMAS ==================== -->
      <section v-if="tab === 'materias'">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold">Materias Primas</h2>
            <div class="flex items-center gap-2">
              <input
                v-model="searchQuery"
                class="border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Buscar..."
                @input="inventoryStore.setBuscar(searchQuery)"
              />
              <button
                class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                @click="materiaPrimaCRUD.openCreateModal"
              >
                + Nueva materia
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo ingr.
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidad
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="m in inventoryStore.lista" :key="m.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ m.nombre }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span v-if="m.tipo_ingrediente" class="capitalize">{{ m.tipo_ingrediente }}</span>
                    <span v-else class="text-gray-400">—</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{{ m.unidad_medida }}</td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-right"
                    :class="m.stock_disponible < 0 ? 'text-red-600 font-semibold' : 'text-gray-500'"
                  >
                    {{ m.stock_disponible }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ m.descripcion }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button
                        @click="handleEditMateria(m)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="handleDeleteMateria(m.id)"
                        class="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ==================== INGREDIENTES ==================== -->
      <section v-if="tab === 'ingredientes'">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold">Ingredientes (porciones estandarizadas)</h2>
            <div class="flex items-center gap-2">
              <button
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                @click="ingredientsStore.sincronizarSaboresConInventario"
              >
                Sincronizar sabores
              </button>
              <button
                class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                @click="ingredienteCRUD.openCreateModal"
              >
                + Nuevo ingrediente
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Porción
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidad
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor extra
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materia fija
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="i in ingredientsStore.ingredientesOrdenados" :key="i.id_ingrediente" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ i.nombre }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{{ i.tipo }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {{ i.porcion_estandar }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{{ i.unidad }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ${{ formatPrice(i.valor_extra_clp) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span v-if="i.id_materia_prima">
                      {{ inventoryStore.materias.find((m) => m.id === i.id_materia_prima)?.nombre || '—' }}
                    </span>
                    <span v-else>—</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ i.descripcion }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button
                        @click="handleEditIngrediente(i)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="handleDeleteIngrediente(i.id_ingrediente)"
                        class="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ==================== PRODUCTOS ==================== -->
      <section v-if="tab === 'productos'">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold">Productos</h2>
            <button
              class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              @click="productoCRUD.openCreateModal"
            >
              + Nuevo producto
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="p in productsStore.products" :key="p.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ p.nombre }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{{ p.categoria }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ p.tipo }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <span v-if="p.tipo === 'configurable'">${{ formatPrice(p.precio_base_clp) }}</span>
                    <span v-else>${{ formatPrice(p.precio_clp) }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-3">
                      <button
                        @click="handleEditProducto(p)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        v-if="p.tipo === 'configurable'"
                        @click="openRecipeModal(p.id)"
                        class="text-green-600 hover:text-green-900"
                        title="Ver receta"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        @click="handleDeleteProducto(p.id)"
                        class="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>

    <!-- Modales usando componentes reutilizables -->
    <!-- Modal Materia Prima -->
    <MateriaPrimaForm
      :is-open="materiaModalOpen"
      :is-editing="materiaEditing"
      :form-data="materiaFormData"
      :error="materiaError"
      :is-valid="materiaValid"
      :tipos-ingrediente="tiposIngrediente"
      @update:isOpen="materiaModalOpen = $event"
      @update:formData="materiaFormData = $event"
      @cancel="materiaPrimaCRUD.closeModal"
      @save="materiaPrimaCRUD.save"
    />

    <!-- Modal Ingrediente -->
    <IngredienteForm
      :is-open="ingredienteModalOpen"
      :is-editing="ingredienteEditing"
      :form-data="ingredienteFormData"
      :error="ingredienteError"
      :is-valid="ingredienteValid"
      :tipos-ingrediente="tiposIngrediente"
      :materias-primas="inventoryStore.materias"
      @update:isOpen="ingredienteModalOpen = $event"
      @update:formData="ingredienteFormData = $event"
      @cancel="ingredienteCRUD.closeModal"
      @save="ingredienteCRUD.save"
    />

    <!-- Modal Producto -->
    <ProductoForm
      :is-open="productoModalOpen"
      :is-editing="productoEditing"
      :form-data="productoFormData"
      :error="productoError"
      :is-valid="productoValid"
      :categorias="categorias"
      @update:isOpen="productoModalOpen = $event"
      @update:formData="productoFormData = $event"
      @cancel="productoCRUD.closeModal"
      @save="productoCRUD.save"
    />

    <!-- Modal Receta -->
    <ProductRecipeModal
      :is-open="isRecipeModalOpen"
      :producto="selectedProduct"
      @update:isOpen="isRecipeModalOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Header from '../components/Header.vue';
import { useInventoryStore } from '@/store/inventory';
import { useIngredientsStore } from '@/store/ingredients';
import { useProductsStore, CATEGORIAS } from '@/store/products';
import { useMateriaPrimaCRUD } from '@/composables/useMateriaPrimaCRUD';
import { useIngredienteCRUD } from '@/composables/useIngredienteCRUD';
import { useProductoCRUD } from '@/composables/useProductoCRUD';
import MateriaPrimaForm from '../components/crud/MateriaPrimaForm.vue';
import IngredienteForm from '../components/crud/IngredienteForm.vue';
import ProductoForm from '../components/crud/ProductoForm.vue';
import ProductRecipeModal from '../components/crud/ProductRecipeModal.vue';
import type { TipoIngrediente, Producto, Id, MateriaPrima, Ingrediente } from '@/types';
import { exportInventoryToExcel } from '../utils/exportUtils';

// Estado de la pestaña activa
const tab = ref<'materias' | 'ingredientes' | 'productos'>('materias');

// Búsqueda local
const searchQuery = ref('');

// Stores
const inventoryStore = useInventoryStore();

// Sincronizar búsqueda con store
watch(searchQuery, (newVal) => {
  inventoryStore.setBuscar(newVal);
});

const ingredientsStore = useIngredientsStore();
const productsStore = useProductsStore();

// Composables CRUD
const materiaPrimaCRUD = useMateriaPrimaCRUD();
const ingredienteCRUD = useIngredienteCRUD();
const productoCRUD = useProductoCRUD();

// Computed properties para desenrollar refs (necesarios para TypeScript y reactividad)
const materiaModalOpen = computed({
  get: () => materiaPrimaCRUD.isModalOpen.value,
  set: (val) => { materiaPrimaCRUD.isModalOpen.value = val; }
});
const materiaEditing = computed(() => materiaPrimaCRUD.isEditing.value);
const materiaFormData = computed({
  get: () => materiaPrimaCRUD.formData.value,
  set: (val) => { materiaPrimaCRUD.formData.value = val; }
});
const materiaError = computed(() => materiaPrimaCRUD.error.value);
const materiaValid = computed(() => materiaPrimaCRUD.isValid.value);

const ingredienteModalOpen = computed({
  get: () => ingredienteCRUD.isModalOpen.value,
  set: (val) => { ingredienteCRUD.isModalOpen.value = val; }
});
const ingredienteEditing = computed(() => ingredienteCRUD.isEditing.value);
const ingredienteFormData = computed({
  get: () => ingredienteCRUD.formData.value,
  set: (val) => { ingredienteCRUD.formData.value = val; }
});
const ingredienteError = computed(() => ingredienteCRUD.error.value);
const ingredienteValid = computed(() => ingredienteCRUD.isValid.value);

const productoModalOpen = computed({
  get: () => productoCRUD.isModalOpen.value,
  set: (val) => { productoCRUD.isModalOpen.value = val; }
});
const productoEditing = computed(() => productoCRUD.isEditing.value);
const productoFormData = computed({
  get: () => productoCRUD.formData.value,
  set: (val) => { productoCRUD.formData.value = val; }
});
const productoError = computed(() => productoCRUD.error.value);
const productoValid = computed(() => productoCRUD.isValid.value);

// Constantes
const tiposIngrediente: TipoIngrediente[] = [
  'helado',
  'salsa',
  'banado',
  'fruta',
  'topping',
  'crema',
  'cafe',
  'leche',
];
const categorias = CATEGORIAS;

// Estado del modal de receta
const isRecipeModalOpen = ref(false);
const selectedProduct = ref<Producto | null>(null);

// Utilidades
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(Math.round(price));
};

// Handlers para eliminar (Delete)
const handleDeleteMateria = (id: Id) => {
  if (confirm('¿Está seguro de eliminar esta materia prima?')) {
    const success = materiaPrimaCRUD.remove(id);
    if (success) {
      ingredientsStore.sincronizarSaboresConInventario();
    } else {
      alert('Error al eliminar la materia prima');
    }
  }
};

const handleDeleteIngrediente = (id: Id) => {
  if (confirm('¿Está seguro de eliminar este ingrediente?')) {
    const success = ingredienteCRUD.remove(id);
    if (!success) {
      alert('Error al eliminar el ingrediente');
    }
  }
};

const handleDeleteProducto = (id: Id) => {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    const success = productoCRUD.remove(id);
    if (!success) {
      alert('Error al eliminar el producto');
    }
  }
};

// Wrapper functions para los botones de editar
const handleEditMateria = (materia: MateriaPrima) => {
  materiaPrimaCRUD.openEditModal(materia);
};

const handleEditIngrediente = (ingrediente: Ingrediente) => {
  ingredienteCRUD.openEditModal(ingrediente);
};

const handleEditProducto = (producto: Producto) => {
  productoCRUD.openEditModal(producto);
};

// Handler para abrir modal de receta
const openRecipeModal = (id: Id) => {
  const product = productsStore.getProductById(id);
  if (product) {
    selectedProduct.value = product;
    isRecipeModalOpen.value = true;
  }
};

// Exportar inventario a Excel
const exportInventory = () => {
  exportInventoryToExcel(
    inventoryStore.materias,
    ingredientsStore.ingredientes,
    productsStore.products,
    `inventario_${new Date().toISOString().split('T')[0]}.csv`
  );
};
</script>
