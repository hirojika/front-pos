/**
 * Composable para operaciones CRUD de Producto
 * Sigue los principios SOLID:
 * - Single Responsibility: Solo maneja operaciones CRUD de Producto
 * - Dependency Inversion: Depende de la abstracción (store) no de la implementación
 */

import { ref, computed } from 'vue';
import { useProductsStore } from '@/store/products';
import type { Producto, CategoriaProducto } from '@/types';
import { validateRequired, validatePositiveNumber, validateFields } from '@/utils/validators';

export interface ProductoFormData {
  id?: number | string;
  nombre: string;
  categoria: CategoriaProducto;
  tipo: 'configurable' | 'no_configurable';
  precio_base_clp?: number;
  precio_clp?: number;
  descripcion?: string;
  reglas?: any[];
  variaciones?: any[];
}

const defaultFormData: ProductoFormData = {
  nombre: '',
  categoria: 'conos',
  tipo: 'configurable',
  precio_base_clp: 1000,
  precio_clp: 1000,
  descripcion: '',
  reglas: [],
  variaciones: [],
};

export function useProductoCRUD() {
  const productsStore = useProductsStore();

  // Estado del modal
  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const formData = ref<ProductoFormData>({ ...defaultFormData });
  const error = ref<string>('');

  // Computed para verificar si el formulario es válido
  const isValid = computed(() => {
    const hasName = formData.value.nombre.trim().length > 0;
    const hasPrice =
      (formData.value.tipo === 'configurable' && formData.value.precio_base_clp !== undefined && formData.value.precio_base_clp > 0) ||
      (formData.value.tipo === 'no_configurable' && formData.value.precio_clp !== undefined && formData.value.precio_clp > 0);
    return hasName && hasPrice;
  });

  /**
   * Abre el modal para crear un nuevo producto
   */
  const openCreateModal = () => {
    isEditing.value = false;
    formData.value = {
      ...defaultFormData,
      variaciones: [{ id_variacion: Date.now(), nombre: 'Bañado', precio_final_clp: 1400 }],
    };
    error.value = '';
    isModalOpen.value = true;
  };

  /**
   * Abre el modal para editar un producto existente
   */
  const openEditModal = (producto: Producto) => {
    isEditing.value = true;
    if (producto.tipo === 'configurable') {
      formData.value = {
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        tipo: 'configurable',
        precio_base_clp: producto.precio_base_clp,
        descripcion: producto.descripcion ?? '',
        reglas: producto.reglas ?? [],
        variaciones: producto.variaciones ?? [],
      };
    } else {
      formData.value = {
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        tipo: 'no_configurable',
        precio_clp: producto.precio_clp,
        descripcion: producto.descripcion ?? '',
      };
    }
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
    const validations = [validateRequired(formData.value.nombre, 'El nombre')];

    if (formData.value.tipo === 'configurable') {
      validations.push(
        validatePositiveNumber(formData.value.precio_base_clp || 0, 'El precio base')
      );
    } else {
      validations.push(validatePositiveNumber(formData.value.precio_clp || 0, 'El precio'));
    }

    const result = validateFields(validations);
    if (!result.isValid) {
      error.value = result.error || 'Error de validación';
      return false;
    }

    error.value = '';
    return true;
  };

  /**
   * Crea un nuevo producto
   */
  const create = (): boolean => {
    if (!validate()) {
      return false;
    }

    try {
      const productData: any = {
        nombre: formData.value.nombre.trim(),
        categoria: formData.value.categoria,
        tipo: formData.value.tipo,
        descripcion: formData.value.descripcion ?? '',
      };

      if (formData.value.tipo === 'configurable') {
        productData.precio_base_clp = formData.value.precio_base_clp;
        productData.reglas = formData.value.reglas || [];
        productData.variaciones = formData.value.variaciones || [];
      } else {
        productData.precio_clp = formData.value.precio_clp;
      }

      productsStore.crearProducto(productData);
      closeModal();
      return true;
    } catch (err) {
      error.value = 'Error al crear el producto';
      console.error(err);
      return false;
    }
  };

  /**
   * Actualiza un producto existente
   */
  const update = (): boolean => {
    if (!validate()) {
      return false;
    }

    if (!formData.value.id) {
      error.value = 'ID de producto no válido';
      return false;
    }

    try {
      const productData: any = {
        id: formData.value.id,
        nombre: formData.value.nombre.trim(),
        categoria: formData.value.categoria,
        tipo: formData.value.tipo,
        descripcion: formData.value.descripcion ?? '',
      };

      if (formData.value.tipo === 'configurable') {
        productData.precio_base_clp = formData.value.precio_base_clp;
        productData.reglas = formData.value.reglas || [];
        productData.variaciones = formData.value.variaciones || [];
      } else {
        productData.precio_clp = formData.value.precio_clp;
      }

      productsStore.actualizarProducto(productData);
      closeModal();
      return true;
    } catch (err) {
      error.value = 'Error al actualizar el producto';
      console.error(err);
      return false;
    }
  };

  /**
   * Elimina un producto
   */
  const remove = (id: number | string): boolean => {
    try {
      productsStore.eliminarProducto(id);
      return true;
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
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

