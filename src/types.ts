// src/types.ts

/** Id numérico o string (para semillas) */
export type Id = number | string;

/** Unidades para inventario/ingredientes */
export type Unidad = 'g' | 'ml' | 'u';

/** Tipos lógicos de ingredientes (para reglas/recetas) */
export type TipoIngrediente =
  | 'helado'
  | 'salsa'
  | 'banado'
  | 'fruta'
  | 'topping'
  | 'crema'
  | 'cafe'
  | 'leche';

/* ===================== INVENTARIO ===================== */
export interface MateriaPrima {
  id: Id;
  nombre: string;
  unidad_medida: Unidad;
  stock_disponible: number;
  descripcion?: string;
  categoria?: string;
  /** Si esta materia se asocia a un tipo de ingrediente (para sincronizar sabores) */
  tipo_ingrediente?: TipoIngrediente;
}

/* ===================== INGREDIENTES ===================== */
export interface Ingrediente {
  id_ingrediente: Id;
  nombre: string;
  tipo: TipoIngrediente;
  porcion_estandar: number;
  unidad: Unidad;
  /** Valor extra por seleccionar este ingrediente en el POS */
  valor_extra_clp: number;
  descripcion?: string;
  /** Si el ingrediente siempre descuenta de una materia fija */
  id_materia_prima: Id | null;
}

/* ===================== PRODUCTOS ===================== */
export type CategoriaProducto =
  | 'conos'
  | 'copas'
  | 'batidos'
  | 'waffles'
  | 'banana_split'
  | 'cafes_calientes'
  | 'bebestibles'
  | 'pasteles'
  | 'otros';

/** Regla por tipo de ingrediente (receta) */
export interface ReglaTipoIngrediente {
  id_regla: Id;
  id_producto: Id;
  tipo: TipoIngrediente;
  minimo: number;
  maximo: number;
  incluidas: number;
  obligatorio: boolean;
  precio_extra_unitario_clp: number;
  orden_visual: number;
}

/** Variación de un producto configurable (ej. "Bañado") */
export interface VariacionProducto {
  id_variacion: Id;
  nombre: string;
  precio_final_clp: number;
}

/** Producto configurable (usa reglas + variaciones) */
export interface ProductoConfigurable {
  id: Id;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaProducto;
  tipo: 'configurable';
  precio_base_clp: number;
  reglas: ReglaTipoIngrediente[];
  variaciones?: VariacionProducto[];
}

/** Producto NO configurable */
export interface ProductoNoConfigurable {
  id: Id;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaProducto;
  tipo: 'no_configurable';
  precio_clp: number;
}

export type Producto = ProductoConfigurable | ProductoNoConfigurable;

