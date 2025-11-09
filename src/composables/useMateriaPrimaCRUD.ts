/**
 * Composable para operaciones CRUD de MateriaPrima
 * Sigue los principios SOLID:
 * - Single Responsibility: Solo maneja operaciones CRUD de MateriaPrima
 * - Dependency Inversion: Depende de la abstracción (store) no de la implementación
 */

import { ref, computed } from 'vue';
import { useInventoryStore } from '@/store/inventory';
import { useIngredientsStore } from '@/store/ingredients';
import type { MateriaPrima } from '@/types';
import { validateRequired, validatePositiveNumber, validateFields } from '@/utils/validators';

export interface MateriaPrimaFormData {
  id?: number | string;
  nombre: string;
  unidad_medida: 'g' | 'ml' | 'u';
  stock_disponible: number;
  descripcion?: string;
  tipo_ingrediente?: string;
}

const defaultFormData: MateriaPrimaFormData = {
  nombre: '',
  unidad_medida: 'g',
  stock_disponible: 0,
  descripcion: '',
  tipo_ingrediente: undefined,
};

export function useMateriaPrimaCRUD() {
  const inventoryStore = useInventoryStore();
  const ingredientsStore = useIngredientsStore();

  // Estado del modal
  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const formData = ref<MateriaPrimaFormData>({ ...defaultFormData });
  const error = ref<string>('');

  // Computed para verificar si el formulario es válido
  const isValid = computed(() => {
    return formData.value.nombre.trim().length > 0 && formData.value.stock_disponible >= 0;
  });

  /**
   * Abre el modal para crear una nueva materia prima
   */
  const openCreateModal = () => {
    isEditing.value = false;
    formData.value = { ...defaultFormData };
    error.value = '';
    isModalOpen.value = true;
  };

  /**
   * Abre el modal para editar una materia prima existente
   */
  const openEditModal = (materia: MateriaPrima) => {
    isEditing.value = true;
    formData.value = {
      id: materia.id,
      nombre: materia.nombre,
      unidad_medida: materia.unidad_medida,
      stock_disponible: materia.stock_disponible,
      descripcion: materia.descripcion ?? '',
      tipo_ingrediente: materia.tipo_ingrediente,
    };
    error.value = '';
    isModalOpen.value = true;
  };

  /**
   * Cierra el modal y resetea el formulario
   */
  const closeModal = () => {
    isModalOpen.value = false;
    formData.value = { ...defaultFormData };
    error.value = '';
  };

  /**
   * Valida los datos del formulario
   */
  const validate = (): boolean => {
    const validations = [
      validateRequired(formData.value.nombre, 'El nombre'),
      validatePositiveNumber(formData.value.stock_disponible, 'El stock'),
    ];

    const result = validateFields(validations);
    if (!result.isValid) {
      error.value = result.error || 'Error de validación';
      return false;
    }

    error.value = '';
    return true;
  };

  /**
   * Crea una nueva materia prima
   */
  const create = (): boolean => {
    if (!validate()) {
      return false;
    }

    try {
      inventoryStore.crear({
        nombre: formData.value.nombre.trim(),
        unidad_medida: formData.value.unidad_medida,
        stock_disponible: formData.value.stock_disponible,
        descripcion: formData.value.descripcion ?? '',
        tipo_ingrediente: formData.value.tipo_ingrediente as any,
      });

      // Sincronizar sabores después de crear
      ingredientsStore.sincronizarSaboresConInventario();
      closeModal();
      return true;
    } catch (err) {
      error.value = 'Error al crear la materia prima';
      console.error(err);
      return false;
    }
  };

  /**
   * Actualiza una materia prima existente
   */
  const update = (): boolean => {
    if (!validate()) {
      return false;
    }

    if (!formData.value.id) {
      error.value = 'ID de materia prima no válido';
      return false;
    }

    try {
      const materia: MateriaPrima = {
        id: formData.value.id,
        nombre: formData.value.nombre.trim(),
        unidad_medida: formData.value.unidad_medida,
        stock_disponible: formData.value.stock_disponible,
        descripcion: formData.value.descripcion ?? '',
        tipo_ingrediente: formData.value.tipo_ingrediente as any,
      };

      inventoryStore.actualizar(materia);
      ingredientsStore.sincronizarSaboresConInventario();
      closeModal();
      return true;
    } catch (err) {
      error.value = 'Error al actualizar la materia prima';
      console.error(err);
      return false;
    }
  };

  /**
   * Elimina una materia prima
   */
  const remove = (id: number | string): boolean => {
    try {
      inventoryStore.eliminar(id);
      return true;
    } catch (err) {
      console.error('Error al eliminar la materia prima:', err);
      return false;
    }
  };

  /**
   * Guarda los cambios (create o update según el estado)
   */
  const save = (): boolean => {
    return isEditing.value ? update() : create();
  };

  return {
    // State
    isModalOpen,
    isEditing,
    formData,
    error,
    isValid,

    // Methods
    openCreateModal,
    openEditModal,
    closeModal,
    save,
    create,
    update,
    remove,
    validate,
  };
}

