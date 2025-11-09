// src/store/inventory.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Id, Unidad, MateriaPrima, TipoIngrediente } from '@/types';

const uid = () => Date.now() + Math.floor(Math.random() * 1e5);

export const useInventoryStore = defineStore('inventory', () => {
  /** Materias primas del inventario */
  const materias = ref<MateriaPrima[]>([]);

  /** texto de búsqueda en la grilla */
  const buscar = ref<string>('');

  /** lista filtrada por búsqueda */
  const lista = computed(() => {
    const q = buscar.value.trim().toLowerCase();
    if (!q) return materias.value;
    return materias.value.filter(
      (m) =>
        m.nombre.toLowerCase().includes(q) ||
        (m.descripcion ?? '').toLowerCase().includes(q)
    );
  });

  function setBuscar(q: string) {
    buscar.value = q;
  }

  /** Crear una materia prima */
  function crear(data: {
    nombre: string;
    unidad_medida: Unidad;
    stock_disponible: number;
    descripcion?: string;
    categoria?: string;
    tipo_ingrediente?: TipoIngrediente | undefined;
  }): MateriaPrima {
    const m: MateriaPrima = {
      id: uid(),
      nombre: data.nombre,
      unidad_medida: data.unidad_medida,
      stock_disponible: data.stock_disponible,
      descripcion: data.descripcion ?? '',
      categoria: data.categoria,
      tipo_ingrediente: data.tipo_ingrediente,
    };
    materias.value.unshift(m);
    return m;
  }

  /** Actualizar una materia prima */
  function actualizar(m: MateriaPrima) {
    const ix = materias.value.findIndex((x) => x.id === m.id);
    if (ix >= 0) materias.value[ix] = { ...m };
  }

  /** Eliminar una materia prima */
  function eliminar(id: Id) {
    materias.value = materias.value.filter((m) => m.id !== id);
  }

  /** Obtener materia prima por ID */
  function getMateriaById(id: Id): MateriaPrima | undefined {
    return materias.value.find((m) => m.id === id);
  }

  /** Semilla de ejemplo para no partir en blanco */
  function seed() {
    if (materias.value.length) return;
    crear({
      nombre: 'Helado vainilla',
      unidad_medida: 'g',
      stock_disponible: 8000,
      tipo_ingrediente: 'helado',
      descripcion: 'Base láctea',
    });
    crear({
      nombre: 'Helado chocolate',
      unidad_medida: 'g',
      stock_disponible: 8000,
      tipo_ingrediente: 'helado',
    });
    crear({
      nombre: 'Salsa frutilla',
      unidad_medida: 'ml',
      stock_disponible: 4000,
      tipo_ingrediente: 'salsa',
    });
    crear({
      nombre: 'Manjar',
      unidad_medida: 'ml',
      stock_disponible: 4000,
      tipo_ingrediente: 'salsa',
    });
    crear({
      nombre: 'Chispitas de Arcoiris',
      unidad_medida: 'g',
      stock_disponible: 500,
      descripcion: 'Chispitas de colores para decorar',
      categoria: 'decorativos',
    });
    crear({
      nombre: 'Frambuesas',
      unidad_medida: 'g',
      stock_disponible: 1000,
      tipo_ingrediente: 'fruta',
    });
    crear({
      nombre: 'Crema Chantilly',
      unidad_medida: 'g',
      stock_disponible: 2000,
      tipo_ingrediente: 'crema',
    });
  }
  seed();

  return {
    materias,
    buscar,
    lista,
    setBuscar,
    crear,
    actualizar,
    eliminar,
    getMateriaById,
  };
});
