<template>
  <Modal
    :is-open="isOpen"
    :title="`Personalizar ${product?.nombre || ''}`"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <div v-if="product && product.tipo === 'configurable'" class="space-y-6">
      <!-- Selección de Variación (Bañado/No Bañado) -->
      <div v-if="product.variaciones && product.variaciones.length > 0">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Tipo</h3>
        <div class="grid grid-cols-2 gap-2">
          <button
            :class="[
              'px-4 py-3 border-2 rounded-lg text-sm font-medium transition-colors',
              selectedVariation === null
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
            @click="selectedVariation = null"
          >
            {{ product.nombre }}
            <div class="text-xs text-gray-500 mt-1">${{ formatPrice(product.precio_base_clp) }}</div>
          </button>
          <button
            v-for="variacion in product.variaciones"
            :key="variacion.id_variacion"
            :class="[
              'px-4 py-3 border-2 rounded-lg text-sm font-medium transition-colors',
              selectedVariation === variacion.id_variacion
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
            @click="selectedVariation = variacion.id_variacion"
          >
            {{ product.nombre }} ({{ variacion.nombre }})
            <div class="text-xs text-gray-500 mt-1">${{ formatPrice(variacion.precio_final_clp) }}</div>
          </button>
        </div>
      </div>

      <!-- Reglas de Ingredientes -->
      <div v-for="regla in sortedRules" :key="regla.id_regla" class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700 capitalize">{{ regla.tipo }}</h3>
          <span v-if="regla.obligatorio" class="text-xs text-gray-500">Obligatorio</span>
        </div>

        <!-- Sabores (Helado) -->
        <div v-if="regla.tipo === 'helado'" class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="sabor in saboresDisponibles"
              :key="sabor.id_ingrediente"
              :class="[
                'px-3 py-2 border rounded-lg text-sm transition-colors flex items-center gap-2',
                getSaborQuantity(sabor.id_ingrediente) > 0
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              ]"
              @click="toggleSabor(sabor)"
            >
              <span>{{ sabor.nombre }}</span>
              <span
                v-if="getSaborQuantity(sabor.id_ingrediente) > 0"
                class="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {{ getSaborQuantity(sabor.id_ingrediente) }}
              </span>
              <span v-if="sabor.valor_extra_clp > 0" class="text-xs text-gray-500">
                (+${{ formatPrice(sabor.valor_extra_clp) }})
              </span>
            </button>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">
              Bolas seleccionadas: {{ totalSaboresSeleccionados }}/{{ regla.maximo }}
            </span>
            <div class="flex gap-2">
              <button
                v-for="sabor in saboresSeleccionados"
                :key="sabor.id"
                @click="decrementarSabor(sabor.id)"
                class="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-1"
              >
                {{ sabor.nombre }} ({{ sabor.cantidad }})
                <span class="text-red-600">−</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Salsa -->
        <div v-else-if="regla.tipo === 'salsa'" class="flex flex-wrap gap-2">
          <button
            v-for="salsa in salsasDisponibles"
            :key="salsa.id_ingrediente"
            :class="[
              'px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors',
              selectedSalsa === salsa.id_ingrediente
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
            @click="selectedSalsa = salsa.id_ingrediente"
          >
            {{ salsa.nombre }}
            <span v-if="salsa.valor_extra_clp > 0" class="text-xs text-gray-500">
              (+${{ formatPrice(salsa.valor_extra_clp) }})
            </span>
          </button>
          <button
            v-if="!regla.obligatorio"
            :class="[
              'px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors',
              selectedSalsa === null
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
            @click="selectedSalsa = null"
          >
            Sin salsa
          </button>
        </div>

        <!-- Fruta -->
        <div v-else-if="regla.tipo === 'fruta'" class="flex flex-wrap gap-2">
          <button
            v-for="fruta in frutasDisponibles"
            :key="fruta.id_ingrediente"
            :class="[
              'px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors',
              selectedFruta === fruta.id_ingrediente
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
            @click="selectedFruta = fruta.id_ingrediente"
          >
            {{ fruta.nombre }}
            <span v-if="fruta.valor_extra_clp > 0" class="text-xs text-gray-500">
              (+${{ formatPrice(fruta.valor_extra_clp) }})
            </span>
          </button>
          <button
            v-if="!regla.obligatorio"
            :class="[
              'px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors',
              selectedFruta === null
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
            @click="selectedFruta = null"
          >
            Sin fruta
          </button>
        </div>

        <!-- Crema -->
        <div v-else-if="regla.tipo === 'crema'" class="flex flex-wrap gap-2">
          <button
            :class="[
              'px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors',
              selectedCrema === true
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
            @click="selectedCrema = true"
          >
            Con crema
          </button>
          <button
            v-if="!regla.obligatorio"
            :class="[
              'px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors',
              selectedCrema === false
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
            @click="selectedCrema = false"
          >
            Sin crema
          </button>
        </div>

        <!-- Topping/Extras -->
        <div v-else-if="regla.tipo === 'topping'" class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <div
              v-for="topping in toppingsDisponibles"
              :key="topping.id_ingrediente"
              class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg"
            >
              <span class="text-sm text-gray-700">{{ topping.nombre }}</span>
              <span v-if="topping.valor_extra_clp > 0" class="text-xs text-gray-500">
                (+${{ formatPrice(topping.valor_extra_clp) }})
              </span>
              <div class="flex items-center gap-1 ml-2">
                <button
                  @click="decrementarExtra(topping.id_ingrediente, 'topping')"
                  class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="text-sm font-medium w-6 text-center">
                  {{ getExtraQuantity(topping.id_ingrediente, 'topping') }}
                </span>
                <button
                  @click="incrementarExtra(topping.id_ingrediente, 'topping')"
                  class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Extras Adicionales -->
      <div class="space-y-3 border-t pt-4">
        <h3 class="text-sm font-semibold text-gray-700">Extras</h3>
        
        <!-- Salsa Extra -->
        <div v-if="salsasDisponibles.length > 0" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Salsa extra (+$300)</span>
            <select
              v-if="extraSalsaQuantity > 0"
              v-model="selectedExtraSalsa"
              class="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option :value="null">Seleccionar...</option>
              <option
                v-for="salsa in salsasDisponibles"
                :key="salsa.id_ingrediente"
                :value="salsa.id_ingrediente"
              >
                {{ salsa.nombre }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="decrementarExtra(null, 'salsa_extra')"
              class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-sm font-medium w-6 text-center">{{ extraSalsaQuantity }}</span>
            <button
              @click="incrementarExtra(null, 'salsa_extra')"
              class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Fruta Extra -->
        <div v-if="frutasDisponibles.length > 0" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Fruta extra (+$500)</span>
            <select
              v-if="extraFrutaQuantity > 0"
              v-model="selectedExtraFruta"
              class="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option :value="null">Seleccionar...</option>
              <option
                v-for="fruta in frutasDisponibles"
                :key="fruta.id_ingrediente"
                :value="fruta.id_ingrediente"
              >
                {{ fruta.nombre }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="decrementarExtra(null, 'fruta_extra')"
              class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-sm font-medium w-6 text-center">{{ extraFrutaQuantity }}</span>
            <button
              @click="incrementarExtra(null, 'fruta_extra')"
              class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Crema Extra -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-700">Crema extra (+$700)</span>
          <div class="flex items-center gap-1">
            <button
              @click="decrementarExtra(null, 'crema_extra')"
              class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-sm font-medium w-6 text-center">{{ extraCremaQuantity }}</span>
            <button
              @click="incrementarExtra(null, 'crema_extra')"
              class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Precio Total -->
      <div class="border-t pt-4">
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold text-gray-900">Precio:</span>
          <span class="text-2xl font-bold text-primary">${{ formatPrice(precioTotal) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        @click="$emit('update:isOpen', false)"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="handleSave"
        :disabled="!isValid"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Guardar
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Modal from './Modal.vue';
import type { ProductoConfigurable, Ingrediente, Id, TipoIngrediente } from '@/types';
import { useIngredientsStore } from '@/store/ingredients';

const props = defineProps<{
  isOpen: boolean;
  product: ProductoConfigurable | null;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'save': [customization: ProductCustomization];
}>();

// Definir tipo para personalización (exportado para usar en otros componentes)
export interface ProductCustomization {
  variacionId: Id | null;
  sabores: Array<{ id: Id; cantidad: number; nombre?: string }>;
  salsa: Id | null;
  fruta: Id | null;
  crema: boolean;
  extras: {
    toppings: Array<{ id: Id; cantidad: number }>;
    salsa_extra: { cantidad: number; tipo: Id | null };
    fruta_extra: { cantidad: number; tipo: Id | null };
    crema_extra: number;
  };
}

const ingredientsStore = useIngredientsStore();

// Estado del formulario
const selectedVariation = ref<Id | null>(null);
const selectedSabor = ref<Array<{ id: Id; cantidad: number }>>([]);
const selectedSalsa = ref<Id | null>(null);
const selectedFruta = ref<Id | null>(null);
const selectedCrema = ref<boolean | null>(null);
const extras = ref<{
  toppings: Array<{ id: Id; cantidad: number }>;
  salsa_extra: { cantidad: number; tipo: Id | null };
  fruta_extra: { cantidad: number; tipo: Id | null };
  crema_extra: number;
}>({
  toppings: [],
  salsa_extra: { cantidad: 0, tipo: null },
  fruta_extra: { cantidad: 0, tipo: null },
  crema_extra: 0,
});

const selectedExtraSalsa = ref<Id | null>(null);
const selectedExtraFruta = ref<Id | null>(null);

// Resetear formulario cuando cambia el producto o se abre el modal
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.product && props.product.tipo === 'configurable') {
    resetForm();
    // Usar setTimeout para asegurar que los computed estén actualizados
    setTimeout(() => {
      const product = props.product as ProductoConfigurable;
      // Inicializar valores por defecto según reglas
      product.reglas.forEach((regla) => {
        if (regla.obligatorio) {
          if (regla.tipo === 'helado') {
            // Para helado, seleccionar los sabores necesarios por defecto
            // Seleccionar los primeros sabores disponibles hasta llegar al mínimo requerido
            const saboresNecesarios = Math.min(regla.minimo, saboresDisponibles.value.length);
            for (let i = 0; i < saboresNecesarios; i++) {
              const sabor = saboresDisponibles.value[i];
              if (sabor) {
                const existing = selectedSabor.value.find(s => s.id === sabor.id_ingrediente);
                if (!existing) {
                  selectedSabor.value.push({ id: sabor.id_ingrediente, cantidad: 1 });
                } else {
                  existing.cantidad = 1;
                }
              }
            }
          } else if (regla.tipo === 'salsa' && salsasDisponibles.value.length > 0 && salsasDisponibles.value[0]) {
            selectedSalsa.value = salsasDisponibles.value[0].id_ingrediente;
          } else if (regla.tipo === 'fruta' && frutasDisponibles.value.length > 0 && frutasDisponibles.value[0]) {
            selectedFruta.value = frutasDisponibles.value[0].id_ingrediente;
          } else if (regla.tipo === 'crema') {
            selectedCrema.value = true;
          }
        }
      });
    }, 100);
  }
});

function resetForm() {
  selectedVariation.value = null;
  selectedSabor.value = [];
  selectedSalsa.value = null;
  selectedFruta.value = null;
  selectedCrema.value = null;
  extras.value = {
    toppings: [],
    salsa_extra: { cantidad: 0, tipo: null },
    fruta_extra: { cantidad: 0, tipo: null },
    crema_extra: 0,
  };
  selectedExtraSalsa.value = null;
  selectedExtraFruta.value = null;
  
  // Si el producto tiene variaciones, seleccionar la primera por defecto
  if (props.product && props.product.tipo === 'configurable' && props.product.variaciones && props.product.variaciones.length > 0 && props.product.variaciones[0]) {
    selectedVariation.value = props.product.variaciones[0].id_variacion;
  }
}

// Obtener reglas ordenadas
const sortedRules = computed(() => {
  if (!props.product || props.product.tipo !== 'configurable') return [];
  return [...props.product.reglas].sort((a, b) => a.orden_visual - b.orden_visual);
});

// Obtener regla por tipo
const getRuleByType = (tipo: TipoIngrediente) => {
  return sortedRules.value.find((r) => r.tipo === tipo);
};

// Ingredientes disponibles por tipo
const saboresDisponibles = computed(() => {
  return ingredientsStore.getIngredientesByTipo('helado');
});

const salsasDisponibles = computed(() => {
  return ingredientsStore.getIngredientesByTipo('salsa');
});

const frutasDisponibles = computed(() => {
  return ingredientsStore.getIngredientesByTipo('fruta');
});

const toppingsDisponibles = computed(() => {
  return ingredientsStore.getIngredientesByTipo('topping');
});

// Manejo de sabores
const totalSaboresSeleccionados = computed(() => {
  return selectedSabor.value.reduce((sum, s) => sum + s.cantidad, 0);
});

const saboresSeleccionados = computed(() => {
  return selectedSabor.value
    .filter((s) => s.cantidad > 0)
    .map((s) => {
      const ingrediente = saboresDisponibles.value.find((ing) => ing.id_ingrediente === s.id);
      return {
        id: s.id,
        cantidad: s.cantidad,
        nombre: ingrediente?.nombre || '',
      };
    });
});

function getSaborQuantity(id: Id): number {
  const sabor = selectedSabor.value.find((s) => s.id === id);
  return sabor ? sabor.cantidad : 0;
}

function toggleSabor(sabor: Ingrediente) {
  const regla = getRuleByType('helado');
  if (!regla) return;

  const existing = selectedSabor.value.find((s) => s.id === sabor.id_ingrediente);
  if (existing) {
    if (existing.cantidad > 0) {
      existing.cantidad--;
      if (existing.cantidad === 0) {
        selectedSabor.value = selectedSabor.value.filter((s) => s.id !== sabor.id_ingrediente);
      }
    }
  } else {
    if (totalSaboresSeleccionados.value < regla.maximo) {
      selectedSabor.value.push({ id: sabor.id_ingrediente, cantidad: 1 });
    }
  }
}

function decrementarSabor(id: Id) {
  const sabor = selectedSabor.value.find((s) => s.id === id);
  if (sabor && sabor.cantidad > 0) {
    sabor.cantidad--;
    if (sabor.cantidad === 0) {
      selectedSabor.value = selectedSabor.value.filter((s) => s.id !== id);
    }
  }
}

// Manejo de extras
function getExtraQuantity(id: Id | null, type: string): number {
  if (type === 'topping') {
    const extra = extras.value.toppings.find((e) => e.id === id);
    return extra ? extra.cantidad : 0;
  } else if (type === 'salsa_extra') {
    return extras.value.salsa_extra.cantidad;
  } else if (type === 'fruta_extra') {
    return extras.value.fruta_extra.cantidad;
  } else if (type === 'crema_extra') {
    return extras.value.crema_extra;
  }
  return 0;
}

// Computed properties para cantidades de extras
const extraSalsaQuantity = computed(() => extras.value.salsa_extra.cantidad);
const extraFrutaQuantity = computed(() => extras.value.fruta_extra.cantidad);
const extraCremaQuantity = computed(() => extras.value.crema_extra);

function incrementarExtra(id: Id | null, type: string) {
  if (type === 'topping' && id) {
    const existing = extras.value.toppings.find((e) => e.id === id);
    if (existing) {
      existing.cantidad++;
    } else {
      extras.value.toppings.push({ id, cantidad: 1 });
    }
  } else if (type === 'salsa_extra') {
    extras.value.salsa_extra.cantidad++;
    if (extras.value.salsa_extra.cantidad === 1 && salsasDisponibles.value.length > 0 && salsasDisponibles.value[0]) {
      extras.value.salsa_extra.tipo = salsasDisponibles.value[0].id_ingrediente;
      selectedExtraSalsa.value = salsasDisponibles.value[0].id_ingrediente;
    }
  } else if (type === 'fruta_extra') {
    extras.value.fruta_extra.cantidad++;
    if (extras.value.fruta_extra.cantidad === 1 && frutasDisponibles.value.length > 0 && frutasDisponibles.value[0]) {
      extras.value.fruta_extra.tipo = frutasDisponibles.value[0].id_ingrediente;
      selectedExtraFruta.value = frutasDisponibles.value[0].id_ingrediente;
    }
  } else if (type === 'crema_extra') {
    extras.value.crema_extra++;
  }
}

function decrementarExtra(id: Id | null, type: string) {
  if (type === 'topping' && id) {
    const extra = extras.value.toppings.find((e) => e.id === id);
    if (extra && extra.cantidad > 0) {
      extra.cantidad--;
      if (extra.cantidad === 0) {
        extras.value.toppings = extras.value.toppings.filter((e) => e.id !== id);
      }
    }
  } else if (type === 'salsa_extra') {
    if (extras.value.salsa_extra.cantidad > 0) {
      extras.value.salsa_extra.cantidad--;
      if (extras.value.salsa_extra.cantidad === 0) {
        extras.value.salsa_extra.tipo = null;
        selectedExtraSalsa.value = null;
      }
    }
  } else if (type === 'fruta_extra') {
    if (extras.value.fruta_extra.cantidad > 0) {
      extras.value.fruta_extra.cantidad--;
      if (extras.value.fruta_extra.cantidad === 0) {
        extras.value.fruta_extra.tipo = null;
        selectedExtraFruta.value = null;
      }
    }
  } else if (type === 'crema_extra') {
    if (extras.value.crema_extra > 0) {
      extras.value.crema_extra--;
    }
  }
}

// Watch para actualizar tipo de extra cuando cambia la selección
watch(selectedExtraSalsa, (newVal) => {
  if (extras.value.salsa_extra.cantidad > 0) {
    extras.value.salsa_extra.tipo = newVal;
  }
});

watch(selectedExtraFruta, (newVal) => {
  if (extras.value.fruta_extra.cantidad > 0) {
    extras.value.fruta_extra.tipo = newVal;
  }
});

// Calcular precio total
const precioTotal = computed(() => {
  if (!props.product || props.product.tipo !== 'configurable') return 0;

  let precio = 0;

  // Precio base o variación
  if (selectedVariation.value !== null) {
    const variacion = props.product.variaciones?.find(
      (v) => v.id_variacion === selectedVariation.value
    );
    if (variacion) {
      precio = variacion.precio_final_clp;
    }
  } else {
    precio = props.product.precio_base_clp;
  }

  // Sumar extras de sabores (solo los que exceden las incluidas)
  const reglaHelado = getRuleByType('helado');
  if (reglaHelado) {
    const incluidas = reglaHelado.incluidas;
    const total = totalSaboresSeleccionados.value;
    if (total > incluidas) {
      const extras = total - incluidas;
      precio += extras * reglaHelado.precio_extra_unitario_clp;
    }
    // Sumar valor extra de cada sabor
    selectedSabor.value.forEach((s) => {
      const ingrediente = saboresDisponibles.value.find((ing) => ing.id_ingrediente === s.id);
      if (ingrediente) {
        precio += s.cantidad * ingrediente.valor_extra_clp;
      }
    });
  }

  // Sumar extras de salsa
  if (selectedSalsa.value) {
    const salsa = salsasDisponibles.value.find((s) => s.id_ingrediente === selectedSalsa.value);
    if (salsa) {
      precio += salsa.valor_extra_clp;
    }
  }

  // Sumar extras de fruta
  if (selectedFruta.value) {
    const fruta = frutasDisponibles.value.find((f) => f.id_ingrediente === selectedFruta.value);
    if (fruta) {
      precio += fruta.valor_extra_clp;
    }
  }

  // Sumar extras adicionales
  extras.value.toppings.forEach((topping) => {
    const ing = toppingsDisponibles.value.find((t) => t.id_ingrediente === topping.id);
    if (ing) {
      precio += topping.cantidad * (ing.valor_extra_clp + 300); // Precio base + extra
    }
  });

  // Salsa extra
  if (extras.value.salsa_extra.cantidad > 0) {
    precio += extras.value.salsa_extra.cantidad * 300;
  }

  // Fruta extra
  if (extras.value.fruta_extra.cantidad > 0) {
    precio += extras.value.fruta_extra.cantidad * 500;
  }

  // Crema extra
  if (extras.value.crema_extra > 0) {
    precio += extras.value.crema_extra * 700;
  }

  return precio;
});

// Validación
const isValid = computed(() => {
  if (!props.product || props.product.tipo !== 'configurable') return false;

  // Validar reglas obligatorias
  for (const regla of sortedRules.value) {
    if (regla.obligatorio) {
      if (regla.tipo === 'helado') {
        // Para helado, debe tener al menos el mínimo de sabores
        if (totalSaboresSeleccionados.value < regla.minimo) {
          return false;
        }
        // Verificar que no exceda el máximo
        if (totalSaboresSeleccionados.value > regla.maximo) {
          return false;
        }
      } else if (regla.tipo === 'salsa') {
        if (selectedSalsa.value === null) return false;
      } else if (regla.tipo === 'fruta') {
        if (selectedFruta.value === null) return false;
      } else if (regla.tipo === 'crema') {
        if (selectedCrema.value === null) return false;
      }
    }

    // Validar límites (solo para tipos no obligatorios)
    if (!regla.obligatorio && regla.tipo === 'helado') {
      if (totalSaboresSeleccionados.value > 0 && totalSaboresSeleccionados.value > regla.maximo) {
        return false;
      }
    }
  }

  return true;
});

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CL').format(Math.round(price));
}

function handleSave() {
  if (!props.product || !isValid.value) {
    console.error('Cannot save: product or validation failed', { product: props.product, isValid: isValid.value });
    return;
  }

  // Agregar nombres a los sabores para mostrar en el resumen
  const saboresConNombre = selectedSabor.value
    .filter((s) => s.cantidad > 0)
    .map((s) => {
      const ingrediente = saboresDisponibles.value.find((ing) => ing.id_ingrediente === s.id);
      return {
        id: s.id,
        cantidad: s.cantidad,
        nombre: ingrediente?.nombre || '',
      };
    });

  const customization: ProductCustomization = {
    variacionId: selectedVariation.value,
    sabores: saboresConNombre,
    salsa: selectedSalsa.value,
    fruta: selectedFruta.value,
    crema: selectedCrema.value === true,
    extras: {
      toppings: extras.value.toppings.filter((t) => t.cantidad > 0),
      salsa_extra: {
        cantidad: extras.value.salsa_extra.cantidad,
        tipo: selectedExtraSalsa.value,
      },
      fruta_extra: {
        cantidad: extras.value.fruta_extra.cantidad,
        tipo: selectedExtraFruta.value,
      },
      crema_extra: extras.value.crema_extra,
    },
  };

  console.log('Saving customization:', customization);
  emit('save', customization);
  emit('update:isOpen', false);
}
</script>

