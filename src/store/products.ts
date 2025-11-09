// src/store/products.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Producto,
  ProductoConfigurable,
  ProductoNoConfigurable,
  CategoriaProducto,
  ReglaTipoIngrediente,
  VariacionProducto,
} from '@/types';

const uid = () => Date.now() + Math.floor(Math.random() * 100000);

export const CATEGORIAS: CategoriaProducto[] = [
  'conos',
  'copas',
  'batidos',
  'waffles',
  'banana_split',
  'cafes_calientes',
  'bebestibles',
  'pasteles',
  'otros',
];

export function nuevaRegla(
  id_producto: number | string,
  tipo: ReglaTipoIngrediente['tipo']
): ReglaTipoIngrediente {
  return {
    id_regla: uid(),
    id_producto,
    tipo,
    minimo: 1,
    maximo: 1,
    incluidas: 1,
    obligatorio: true,
    precio_extra_unitario_clp: 0,
    orden_visual: 1,
  };
}

function asignarIdProductoAReglas(idProducto: number | string, reglas: ReglaTipoIngrediente[]) {
  return reglas.map((r) => ({ ...r, id_producto: idProducto }));
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<Producto[]>([]);

  function seedConos() {
    if (products.value.length) return;

    const mkCono = (
      nombre: string,
      desc: string,
      precioBase: number,
      bolas: number,
      variaciones: Array<{ nombre: string; precio_final_clp: number }>
    ): ProductoConfigurable => {
      const id = uid();
      const reglas: ReglaTipoIngrediente[] = [
        {
          id_regla: uid(),
          id_producto: id,
          tipo: 'helado',
          minimo: bolas,
          maximo: bolas,
          incluidas: bolas,
          obligatorio: true,
          precio_extra_unitario_clp: 900,
          orden_visual: 1,
        },
        {
          id_regla: uid(),
          id_producto: id,
          tipo: 'salsa',
          minimo: 1,
          maximo: 1,
          incluidas: 1,
          obligatorio: true,
          precio_extra_unitario_clp: 0,
          orden_visual: 2,
        },
      ];
      return {
        id,
        nombre,
        descripcion: desc,
        categoria: 'conos',
        tipo: 'configurable',
        precio_base_clp: precioBase,
        reglas,
        variaciones: variaciones.map((v) => ({ id_variacion: uid(), ...v })),
      };
    };

    const mkCopa = (
      nombre: string,
      desc: string,
      precioBase: number,
      bolas: number,
      variaciones: Array<{ nombre: string; precio_final_clp: number }>
    ): ProductoConfigurable => {
      const id = uid();
      const reglas: ReglaTipoIngrediente[] = [
        {
          id_regla: uid(),
          id_producto: id,
          tipo: 'helado',
          minimo: bolas,
          maximo: bolas,
          incluidas: bolas,
          obligatorio: true,
          precio_extra_unitario_clp: 900,
          orden_visual: 1,
        },
        {
          id_regla: uid(),
          id_producto: id,
          tipo: 'salsa',
          minimo: 1,
          maximo: 1,
          incluidas: 1,
          obligatorio: false,
          precio_extra_unitario_clp: 0,
          orden_visual: 2,
        },
        {
          id_regla: uid(),
          id_producto: id,
          tipo: 'fruta',
          minimo: 0,
          maximo: 1,
          incluidas: 1,
          obligatorio: false,
          precio_extra_unitario_clp: 0,
          orden_visual: 3,
        },
        {
          id_regla: uid(),
          id_producto: id,
          tipo: 'crema',
          minimo: 0,
          maximo: 1,
          incluidas: 1,
          obligatorio: false,
          precio_extra_unitario_clp: 0,
          orden_visual: 4,
        },
        {
          id_regla: uid(),
          id_producto: id,
          tipo: 'topping',
          minimo: 0,
          maximo: 10,
          incluidas: 0,
          obligatorio: false,
          precio_extra_unitario_clp: 300,
          orden_visual: 5,
        },
      ];
      return {
        id,
        nombre,
        descripcion: desc,
        categoria: 'copas',
        tipo: 'configurable',
        precio_base_clp: precioBase,
        reglas,
        variaciones: variaciones.map((v) => ({ id_variacion: uid(), ...v })),
      };
    };

    // Conos
    products.value = [
      mkCono('Cono simple pequeño', 'Cono pequeño + 1 bola + 1 salsa', 1000, 1, [
        { nombre: 'Bañado', precio_final_clp: 1400 },
      ]),
      mkCono('Cono simple grande', 'Cono grande + 1 bola + 1 salsa', 1200, 1, [
        { nombre: 'Bañado', precio_final_clp: 1600 },
      ]),
      mkCono('Cono doble', 'Cono doble + 2 bolas + 1 salsa', 1900, 2, [
        { nombre: 'Bañado', precio_final_clp: 2500 },
      ]),
      mkCono('Cono triple', 'Cono triple + 3 bolas + 1 salsa', 2500, 3, [
        { nombre: 'Bañado', precio_final_clp: 3000 },
      ]),
    ];

    // Copas
    products.value.push(
      mkCopa('Copa junior', 'Copa junior + 1 bolita', 1800, 1, [
        { nombre: 'Bañada', precio_final_clp: 2300 },
      ]),
      mkCopa('Copa chica', 'Copa chica + 2 bolitas', 2500, 2, [
        { nombre: 'Bañada', precio_final_clp: 3200 },
      ]),
      mkCopa('Copa triple', 'Copa triple + 3 bolitas', 3600, 3, [
        { nombre: 'Bañada', precio_final_clp: 4400 },
      ])
    );

    // Agregar algunos productos no configurables de ejemplo
    const productoNoConfig: ProductoNoConfigurable = {
      id: uid(),
      nombre: 'Agua Mineral',
      descripcion: 'Agua mineral natural',
      categoria: 'bebestibles',
      tipo: 'no_configurable',
      precio_clp: 1000,
    };
    products.value.push(productoNoConfig);
  }
  seedConos();

  const getProductsByCategory = computed(
    () => (category: CategoriaProducto) =>
      products.value.filter((p) => p.categoria === category)
  );

  const getProductById = (id: number | string): Producto | undefined =>
    products.value.find((p) => p.id === id);

  function crearProducto(
    data:
      | (Omit<ProductoConfigurable, 'id' | 'reglas' | 'variaciones'> & {
          reglas?: ReglaTipoIngrediente[];
          variaciones?: VariacionProducto[];
        })
      | Omit<ProductoNoConfigurable, 'id'>
  ): Producto {
    const id = uid();
    let nuevo: Producto;

    if ((data as any).tipo === 'configurable') {
      const d = data as any;
      const reglas = asignarIdProductoAReglas(id, d.reglas ?? []);
      const variaciones = (d.variaciones ?? []).map((v: any) => ({
        ...v,
        id_variacion: uid(),
      }));
      nuevo = { ...d, id, reglas, variaciones };
    } else {
      nuevo = { ...(data as any), id };
    }

    products.value.unshift(nuevo);
    return nuevo;
  }

  function actualizarProducto(p: Producto) {
    const ix = products.value.findIndex((x) => x.id === p.id);
    if (ix < 0) return;
    const clone = { ...p };
    if (clone.tipo === 'configurable') {
      clone.reglas = asignarIdProductoAReglas(clone.id, clone.reglas);
    }
    products.value[ix] = clone;
  }

  function eliminarProducto(id: number | string) {
    products.value = products.value.filter((p) => p.id !== id);
  }

  function agregarRegla(idProducto: number | string, reg: ReglaTipoIngrediente) {
    const p = getProductById(idProducto);
    if (!p || p.tipo !== 'configurable') return;
    p.reglas.push({ ...reg, id_regla: uid(), id_producto: idProducto });
  }

  function actualizarRegla(idProducto: number | string, reg: ReglaTipoIngrediente) {
    const p = getProductById(idProducto);
    if (!p || p.tipo !== 'configurable') return;
    const ix = p.reglas.findIndex((r) => r.id_regla === reg.id_regla);
    if (ix >= 0) p.reglas[ix] = { ...reg, id_producto: idProducto };
  }

  function eliminarRegla(idProducto: number | string, id_regla: number | string) {
    const p = getProductById(idProducto);
    if (!p || p.tipo !== 'configurable') return;
    p.reglas = p.reglas.filter((r) => r.id_regla !== id_regla);
  }

  function agregarVariacion(
    idProducto: number | string,
    v: Omit<VariacionProducto, 'id_variacion'>
  ) {
    const p = getProductById(idProducto);
    if (!p || p.tipo !== 'configurable') return;
    p.variaciones = p.variaciones ?? [];
    p.variaciones.push({ ...v, id_variacion: uid() });
  }

  function actualizarVariacion(idProducto: number | string, v: VariacionProducto) {
    const p = getProductById(idProducto);
    if (!p || p.tipo !== 'configurable' || !p.variaciones) return;
    const ix = p.variaciones.findIndex((x) => x.id_variacion === v.id_variacion);
    if (ix >= 0) p.variaciones[ix] = { ...v };
  }

  function eliminarVariacion(idProducto: number | string, id_variacion: number | string) {
    const p = getProductById(idProducto);
    if (!p || p.tipo !== 'configurable' || !p.variaciones) return;
    p.variaciones = p.variaciones.filter((v) => v.id_variacion !== id_variacion);
  }

  return {
    products,
    getProductsByCategory,
    getProductById,

    crearProducto,
    actualizarProducto,
    eliminarProducto,

    agregarRegla,
    actualizarRegla,
    eliminarRegla,

    agregarVariacion,
    actualizarVariacion,
    eliminarVariacion,

    CATEGORIAS,
  };
});
