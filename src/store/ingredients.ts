// src/store/ingredients.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Id, Ingrediente, TipoIngrediente, Unidad } from '@/types';
import { useInventoryStore } from '@/store/inventory';

const uid = () => Date.now() + Math.floor(Math.random() * 1e5);

export const useIngredientsStore = defineStore('ingredients', () => {
  const inventory = useInventoryStore();

  /** Ingredientes (porciones estándar) */
  const ingredientes = ref<Ingrediente[]>([]);

  /** ordenados por tipo y nombre */
  const ingredientesOrdenados = computed(() =>
    [...ingredientes.value].sort((a, b) => {
      if (a.tipo === b.tipo) return a.nombre.localeCompare(b.nombre);
      return a.tipo.localeCompare(b.tipo);
    })
  );

  /** Helper: sabores (ingredientes de tipo 'helado') */
  const sabores = computed(() =>
    ingredientes.value.filter((x) => x.tipo === 'helado')
  );

  /** Obtener ingredientes por tipo */
  const getIngredientesByTipo = computed(
    () => (tipo: TipoIngrediente) =>
      ingredientes.value.filter((i) => i.tipo === tipo)
  );

  /** Obtener ingrediente por ID */
  function getIngredienteById(id: Id): Ingrediente | undefined {
    return ingredientes.value.find((i) => i.id_ingrediente === id);
  }

  /** Sincroniza sabores con materias primas que tengan tipo_ingrediente='helado' */
  function sincronizarSaboresConInventario() {
    const materiasHelado = inventory.materias.filter(
      (m) => m.tipo_ingrediente === 'helado'
    );

    // por cada materia de helado, si no existe un ingrediente homónimo de helado, lo crea
    materiasHelado.forEach((m) => {
      const exists = ingredientes.value.some(
        (i) => i.tipo === 'helado' && i.nombre.toLowerCase() === m.nombre.toLowerCase()
      );
      if (!exists) {
        crearIngrediente({
          nombre: m.nombre,
          tipo: 'helado',
          porcion_estandar: 80,
          unidad: m.unidad_medida as Unidad,
          valor_extra_clp: 0,
          descripcion: '',
          id_materia_prima: m.id,
        });
      }
    });
  }

  /** Crear ingrediente */
  function crearIngrediente(data: {
    nombre: string;
    tipo: TipoIngrediente;
    porcion_estandar: number;
    unidad: Unidad;
    valor_extra_clp: number;
    descripcion?: string;
    id_materia_prima: Id | null;
  }): Ingrediente {
    const ing: Ingrediente = {
      id_ingrediente: uid(),
      nombre: data.nombre,
      tipo: data.tipo,
      porcion_estandar: data.porcion_estandar,
      unidad: data.unidad,
      valor_extra_clp: data.valor_extra_clp,
      descripcion: data.descripcion ?? '',
      id_materia_prima: data.id_materia_prima,
    };
    ingredientes.value.unshift(ing);
    return ing;
  }

  /** Actualizar ingrediente */
  function actualizarIngrediente(i: Ingrediente) {
    const ix = ingredientes.value.findIndex((x) => x.id_ingrediente === i.id_ingrediente);
    if (ix >= 0) ingredientes.value[ix] = { ...i };
  }

  /** Eliminar ingrediente */
  function eliminarIngrediente(id: Id) {
    ingredientes.value = ingredientes.value.filter((x) => x.id_ingrediente !== id);
  }

  // Semillas mínimas si está vacío
  function seed() {
    if (ingredientes.value.length) return;
    
    // Sabores de helado (se sincronizarán con inventario, pero agregamos algunos básicos)
    crearIngrediente({
      nombre: 'Vainilla',
      tipo: 'helado',
      porcion_estandar: 80,
      unidad: 'g',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Sabor vainilla',
    });
    crearIngrediente({
      nombre: 'Chocolate',
      tipo: 'helado',
      porcion_estandar: 80,
      unidad: 'g',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Sabor chocolate',
    });
    crearIngrediente({
      nombre: 'Frutilla',
      tipo: 'helado',
      porcion_estandar: 80,
      unidad: 'g',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Sabor frutilla',
    });
    crearIngrediente({
      nombre: 'Piña',
      tipo: 'helado',
      porcion_estandar: 80,
      unidad: 'g',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Sabor piña',
    });
    crearIngrediente({
      nombre: 'Sandía',
      tipo: 'helado',
      porcion_estandar: 80,
      unidad: 'g',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Sabor sandía',
    });
    crearIngrediente({
      nombre: 'Chocolate suizo',
      tipo: 'helado',
      porcion_estandar: 80,
      unidad: 'g',
      valor_extra_clp: 400,
      id_materia_prima: null,
      descripcion: 'Sabor chocolate suizo',
    });
    crearIngrediente({
      nombre: 'Pistacho',
      tipo: 'helado',
      porcion_estandar: 80,
      unidad: 'g',
      valor_extra_clp: 400,
      id_materia_prima: null,
      descripcion: 'Sabor pistacho',
    });
    crearIngrediente({
      nombre: 'Cookies & Cream',
      tipo: 'helado',
      porcion_estandar: 80,
      unidad: 'g',
      valor_extra_clp: 400,
      id_materia_prima: null,
      descripcion: 'Sabor cookies & cream',
    });

    // Salsas
    crearIngrediente({
      nombre: 'Chocolate',
      tipo: 'salsa',
      porcion_estandar: 20,
      unidad: 'ml',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Salsa de chocolate',
    });
    crearIngrediente({
      nombre: 'Manjar',
      tipo: 'salsa',
      porcion_estandar: 20,
      unidad: 'ml',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Salsa de manjar',
    });
    crearIngrediente({
      nombre: 'Frambuesa',
      tipo: 'salsa',
      porcion_estandar: 20,
      unidad: 'ml',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Salsa de frambuesa',
    });

    // Frutas
    crearIngrediente({
      nombre: 'Piña',
      tipo: 'fruta',
      porcion_estandar: 50,
      unidad: 'g',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Piña fresca',
    });
    crearIngrediente({
      nombre: 'Durazno',
      tipo: 'fruta',
      porcion_estandar: 50,
      unidad: 'g',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Durazno fresco',
    });
    crearIngrediente({
      nombre: 'Frutilla',
      tipo: 'fruta',
      porcion_estandar: 50,
      unidad: 'g',
      valor_extra_clp: 0,
      id_materia_prima: null,
      descripcion: 'Frutilla fresca',
    });

    // Toppings
    crearIngrediente({
      nombre: 'Chispitas',
      tipo: 'topping',
      porcion_estandar: 10,
      unidad: 'g',
      valor_extra_clp: 300,
      id_materia_prima: null,
      descripcion: 'Chispitas de colores',
    });
    crearIngrediente({
      nombre: 'Dulces',
      tipo: 'topping',
      porcion_estandar: 10,
      unidad: 'g',
      valor_extra_clp: 100,
      id_materia_prima: null,
      descripcion: 'Dulces y gomitas',
    });
  }
  seed();

  return {
    // state
    ingredientes,
    // getters
    ingredientesOrdenados,
    sabores,
    getIngredientesByTipo,
    getIngredienteById,
    // acciones (CRUD)
    crearIngrediente,
    actualizarIngrediente,
    eliminarIngrediente,
    // sync con inventario
    sincronizarSaboresConInventario,
  };
});

