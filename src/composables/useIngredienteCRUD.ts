/**
 * Composable para operaciones CRUD de Ingrediente
 * Sigue los principios SOLID:
 * - Single Responsibility: Solo maneja operaciones CRUD de Ingrediente
 * - Dependency Inversion: Depende de la abstracción (store) no de la implementación
 */

import { ref, computed } from 'vue';
import { useIngredientsStore } from '@/store/ingredients';
import type { Ingrediente, TipoIngrediente } from '@/types';
import { validateRequired, validatePositiveNumber, validateFields } from '@/utils/validators';

export interface IngredienteFormData {
  id_ingrediente?: number | string;
  nombre: string;
  tipo: TipoIngrediente;
  porcion_estandar: number;
  unidad: 'g' | 'ml' | 'u';
  valor_extra_clp: number;
  descripcion?: string;
  id_materia_prima: number | string | null;
}

const defaultFormData: IngredienteFormData = {
  nombre: '',
  tipo: 'helado',
  porcion_estandar: 80,
  unidad: 'g',
  valor_extra_clp: 0,
  descripcion: '',
  id_materia_prima: null,
};

export function useIngredienteCRUD() {
  const ingredientsStore = useIngredientsStore();

  // Estado del modal
  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const formData = ref<IngredienteFormData>({ ...defaultFormData });
  const error = ref<string>('');

  // Computed para verificar si el formulario es válido
  const isValid = computed(() => {
    return (
      formData.value.nombre.trim().length > 0 &&
      formData.value.porcion_estandar > 0 &&
      formData.value.valor_extra_clp >= 0
    );
  });

  /**
   * Abre el modal para crear un nuevo ingrediente
   */
  const openCreateModal = () => {
    isEditing.value = false;
    formData.value = { ...defaultFormData };
    error.value = '';
    isModalOpen.value = true;
  };

  /**
   * Abre el modal para editar un ingrediente existente
   */
  const openEditModal = (ingrediente: Ingrediente) => {
    isEditing.value = true;
    formData.value = {
      id_ingrediente: ingrediente.id_ingrediente,
      nombre: ingrediente.nombre,
      tipo: ingrediente.tipo,
      porcion_estandar: ingrediente.porcion_estandar,
      unidad: ingrediente.unidad,
      valor_extra_clp: ingrediente.valor_extra_clp,
      descripcion: ingrediente.descripcion ?? '',
      id_materia_prima: ingrediente.id_materia_prima,
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
      validatePositiveNumber(formData.value.porcion_estandar, 'La porción estándar'),
      validatePositiveNumber(formData.value.valor_extra_clp, 'El valor extra'),
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
   * Crea un nuevo ingrediente
   */
  const create = (): boolean => {
    if (!validate()) {
      return false;
    }

    try {
      ingredientsStore.crearIngrediente({
        nombre: formData.value.nombre.trim(),
        tipo: formData.value.tipo,
        porcion_estandar: formData.value.porcion_estandar,
        unidad: formData.value.unidad,
        valor_extra_clp: formData.value.valor_extra_clp,
        descripcion: formData.value.descripcion ?? '',
        id_materia_prima: formData.value.id_materia_prima,
      });

      closeModal();
      return true;
    } catch (err) {
      error.value = 'Error al crear el ingrediente';
      console.error(err);
      return false;
    }
  };

  /**
   * Actualiza un ingrediente existente
   */
  const update = (): boolean => {
    if (!validate()) {
      return false;
    }

    if (!formData.value.id_ingrediente) {
      error.value = 'ID de ingrediente no válido';
      return false;
    }

    try {
      const ingrediente: Ingrediente = {
        id_ingrediente: formData.value.id_ingrediente,
        nombre: formData.value.nombre.trim(),
        tipo: formData.value.tipo,
        porcion_estandar: formData.value.porcion_estandar,
        unidad: formData.value.unidad,
        valor_extra_clp: formData.value.valor_extra_clp,
        descripcion: formData.value.descripcion ?? '',
        id_materia_prima: formData.value.id_materia_prima,
      };

      ingredientsStore.actualizarIngrediente(ingrediente);
      closeModal();
      return true;
    } catch (err) {
      error.value = 'Error al actualizar el ingrediente';
      console.error(err);
      return false;
    }
  };

  /**
   * Elimina un ingrediente
   */
  const remove = (id: number | string): boolean => {
    try {
      ingredientsStore.eliminarIngrediente(id);
      return true;
    } catch (err) {
      console.error('Error al eliminar el ingrediente:', err);
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

