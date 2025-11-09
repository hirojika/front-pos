import { defineStore } from 'pinia';
import { nextTick, ref, watch } from 'vue';

export interface BusinessInfo {
  nombreComercial: string;
  rut: string;
  direccion: string;
  telefono: string;
  correo: string;
  logo?: string;
}

export interface POSSettings {
  impresoraTermica: boolean;
  gavetaDinero: boolean;
  lectorCodigos: boolean;
  pantallaSecundaria: boolean;
  metodosPago: {
    efectivo: boolean;
    tarjeta: boolean;
    transferencia: boolean;
    credito: boolean;
    vales: boolean;
  };
  modoOffline: boolean;
  sincronizacionAutomatica: boolean;
}

export interface InventorySettings {
  stockMinimo: number;
  stockMaximo: number;
  alertaStockBajo: boolean;
  umbralStockBajo: number;
  unidadPeso: 'g' | 'kg' | 'lb' | 'oz';
  unidadVolumen: 'ml' | 'l' | 'fl oz' | 'cup';
  unidadLongitud: 'cm' | 'm' | 'in' | 'ft';
  aplicarIVA: boolean;
  porcentajeIVA: number;
  redondearPrecios: boolean;
  decimales: number;
  calcularMargenes: boolean;
}

export interface BillingSettings {
  tipoComprobante: 'boleta' | 'factura' | 'nota-credito' | 'guia-despacho';
  conectarSII: boolean;
  prefijoNumeracion: string;
  numeracionInicial: number;
  copiaAutomatica: boolean;
  respaldoPDF: boolean;
  formatoBoleta: 'A4' | 'Ticket';
  imprimirAutomaticamente: boolean;
  plantillaPersonalizada: string;
}

export interface NotificationSettings {
  alertasStock: boolean;
  alertasVentas: boolean;
  alertasErrores: boolean;
  recordatoriosVencimiento: boolean;
  notificacionesEmail: boolean;
  notificacionesWhatsApp: boolean;
  emailEmpresa: string;
  whatsappEmpresa: string;
}

export interface IntegrationSettings {
  tiendaOnline: boolean;
  sistemaContable: boolean;
  respaldosAutomaticos: boolean;
  frecuenciaRespaldo: 'diario' | 'semanal' | 'mensual';
  apiKeys: {
    ecommerce?: string;
    contabilidad?: string;
    otros?: string;
  };
}

export interface SecuritySettings {
  controlSesiones: boolean;
  tiempoInactividad: number; // minutos
  copiaSeguridadManual: boolean;
  copiaSeguridadAutomatica: boolean;
  cifradoDatos: boolean;
  modoMantenimiento: boolean;
  logsAuditoria: boolean;
}

export interface ReportSettings {
  metricasVisibles: {
    ventas: boolean;
    inventario: boolean;
    usuarios: boolean;
    productos: boolean;
  };
  formatoExportacion: 'PDF' | 'Excel' | 'CSV';
  filtrosPredefinidos: {
    porFecha: boolean;
    porCategoria: boolean;
    porVendedor: boolean;
  };
}

export interface AppSettings {
  // 1. Configuración General
  businessInfo: BusinessInfo;
  idioma: 'es' | 'en';
  moneda: 'CLP' | 'USD' | 'EUR';
  formatoFecha: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  formatoHora: '12h' | '24h';
  zonaHoraria: string;
  tema: 'light' | 'dark' | 'auto';
  
  // 2. Configuración del POS
  posSettings: POSSettings;
  
  // 3. Gestión de Inventario
  inventorySettings: InventorySettings;
  
  // 4. Documentos y Facturación
  billingSettings: BillingSettings;
  
  // 5. Notificaciones y Alertas
  notificationSettings: NotificationSettings;
  
  // 6. Integraciones
  integrationSettings: IntegrationSettings;
  
  // 7. Seguridad y Mantenimiento
  securitySettings: SecuritySettings;
  
  // 8. Personalización de Reportes
  reportSettings: ReportSettings;
  
  // Configuraciones de ventas (legacy, mantener por compatibilidad)
  mostrarIVA: boolean;
  permitirDescuentos: boolean;
  maxDescuentoPorcentaje: number;
  redondearPrecios: boolean;
  mostrarNotificaciones: boolean;
  sonidoNotificaciones: boolean;
}

const defaultBusinessInfo: BusinessInfo = {
  nombreComercial: '',
  rut: '',
  direccion: '',
  telefono: '',
  correo: '',
};

const defaultPOSSettings: POSSettings = {
  impresoraTermica: false,
  gavetaDinero: false,
  lectorCodigos: false,
  pantallaSecundaria: false,
  metodosPago: {
    efectivo: true,
    tarjeta: true,
    transferencia: true,
    credito: false,
    vales: false,
  },
  modoOffline: false,
  sincronizacionAutomatica: true,
};

const defaultInventorySettings: InventorySettings = {
  stockMinimo: 0,
  stockMaximo: 1000,
  alertaStockBajo: true,
  umbralStockBajo: 10,
  unidadPeso: 'g',
  unidadVolumen: 'ml',
  unidadLongitud: 'cm',
  aplicarIVA: true,
  porcentajeIVA: 19,
  redondearPrecios: true,
  decimales: 0,
  calcularMargenes: false,
};

const defaultBillingSettings: BillingSettings = {
  tipoComprobante: 'boleta',
  conectarSII: false,
  prefijoNumeracion: 'VENTA',
  numeracionInicial: 1,
  copiaAutomatica: false,
  respaldoPDF: false,
  formatoBoleta: 'A4',
  imprimirAutomaticamente: false,
  plantillaPersonalizada: '',
};

const defaultNotificationSettings: NotificationSettings = {
  alertasStock: true,
  alertasVentas: false,
  alertasErrores: true,
  recordatoriosVencimiento: false,
  notificacionesEmail: false,
  notificacionesWhatsApp: false,
  emailEmpresa: '',
  whatsappEmpresa: '',
};

const defaultIntegrationSettings: IntegrationSettings = {
  tiendaOnline: false,
  sistemaContable: false,
  respaldosAutomaticos: false,
  frecuenciaRespaldo: 'diario',
  apiKeys: {},
};

const defaultSecuritySettings: SecuritySettings = {
  controlSesiones: true,
  tiempoInactividad: 30,
  copiaSeguridadManual: false,
  copiaSeguridadAutomatica: true,
  cifradoDatos: true,
  modoMantenimiento: false,
  logsAuditoria: true,
};

const defaultReportSettings: ReportSettings = {
  metricasVisibles: {
    ventas: true,
    inventario: true,
    usuarios: true,
    productos: true,
  },
  formatoExportacion: 'PDF',
  filtrosPredefinidos: {
    porFecha: true,
    porCategoria: true,
    porVendedor: true,
  },
};

const defaultSettings: AppSettings = {
  businessInfo: defaultBusinessInfo,
  idioma: 'es',
  moneda: 'CLP',
  formatoFecha: 'DD/MM/YYYY',
  formatoHora: '24h',
  zonaHoraria: 'America/Santiago',
  tema: 'light',
  posSettings: defaultPOSSettings,
  inventorySettings: defaultInventorySettings,
  billingSettings: defaultBillingSettings,
  notificationSettings: defaultNotificationSettings,
  integrationSettings: defaultIntegrationSettings,
  securitySettings: defaultSecuritySettings,
  reportSettings: defaultReportSettings,
  // Legacy settings
  mostrarIVA: true,
  permitirDescuentos: true,
  maxDescuentoPorcentaje: 100,
  redondearPrecios: true,
  mostrarNotificaciones: true,
  sonidoNotificaciones: true,
};

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({ ...defaultSettings });

  // Cargar configuración desde localStorage
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Migrar configuraciones antiguas a nueva estructura si es necesario
        const migrated = migrateOldSettings(parsed);
        
        // Merge con defaults para asegurar que todas las propiedades existan
        settings.value = {
          ...defaultSettings,
          ...migrated,
          businessInfo: { ...defaultBusinessInfo, ...(migrated.businessInfo || {}) },
          posSettings: { 
            ...defaultPOSSettings, 
            ...(migrated.posSettings || {}),
            metodosPago: { ...defaultPOSSettings.metodosPago, ...(migrated.posSettings?.metodosPago || {}) }
          },
          inventorySettings: { ...defaultInventorySettings, ...(migrated.inventorySettings || {}) },
          billingSettings: { ...defaultBillingSettings, ...(migrated.billingSettings || {}) },
          notificationSettings: { ...defaultNotificationSettings, ...(migrated.notificationSettings || {}) },
          integrationSettings: { 
            ...defaultIntegrationSettings, 
            ...(migrated.integrationSettings || {}),
            apiKeys: { ...defaultIntegrationSettings.apiKeys, ...(migrated.integrationSettings?.apiKeys || {}) }
          },
          securitySettings: { ...defaultSecuritySettings, ...(migrated.securitySettings || {}) },
          reportSettings: { 
            ...defaultReportSettings, 
            ...(migrated.reportSettings || {}),
            metricasVisibles: { ...defaultReportSettings.metricasVisibles, ...(migrated.reportSettings?.metricasVisibles || {}) },
            filtrosPredefinidos: { ...defaultReportSettings.filtrosPredefinidos, ...(migrated.reportSettings?.filtrosPredefinidos || {}) }
          },
        };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Migrar configuraciones antiguas a nueva estructura
  const migrateOldSettings = (oldSettings: any): any => {
    const migrated: any = { ...oldSettings };
    
    // Si existen configuraciones antiguas en la raíz, migrarlas
    if (oldSettings.unidadPeso && !oldSettings.inventorySettings) {
      migrated.inventorySettings = {
        ...defaultInventorySettings,
        unidadPeso: oldSettings.unidadPeso,
        unidadVolumen: oldSettings.unidadVolumen || defaultInventorySettings.unidadVolumen,
        unidadLongitud: oldSettings.unidadLongitud || defaultInventorySettings.unidadLongitud,
        alertaStockBajo: oldSettings.alertaStockBajo ?? defaultInventorySettings.alertaStockBajo,
        umbralStockBajo: oldSettings.umbralStockBajo || defaultInventorySettings.umbralStockBajo,
        decimales: oldSettings.decimales ?? defaultInventorySettings.decimales,
        redondearPrecios: oldSettings.redondearPrecios ?? defaultInventorySettings.redondearPrecios,
        aplicarIVA: oldSettings.mostrarIVA ?? defaultInventorySettings.aplicarIVA,
      };
    }
    
    if (oldSettings.formatoBoleta && !oldSettings.billingSettings) {
      migrated.billingSettings = {
        ...defaultBillingSettings,
        formatoBoleta: oldSettings.formatoBoleta,
        imprimirAutomaticamente: oldSettings.imprimirAutomaticamente ?? defaultBillingSettings.imprimirAutomaticamente,
      };
    }
    
    if (oldSettings.mostrarNotificaciones && !oldSettings.notificationSettings) {
      migrated.notificationSettings = {
        ...defaultNotificationSettings,
        alertasStock: oldSettings.alertaStockBajo ?? defaultNotificationSettings.alertasStock,
      };
    }
    
    return migrated;
  };

  // Guardar configuración en localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings.value));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Actualizar configuración
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    settings.value[key] = value;
    saveSettings();
  };

  // Actualizar múltiples configuraciones
  const updateSettings = (updates: Partial<AppSettings>) => {
    Object.assign(settings.value, updates);
    saveSettings();
  };

  // Actualizar sub-configuración (ej: businessInfo, posSettings, etc.)
  const updateSubSetting = <T extends keyof AppSettings>(
    category: T,
    updates: Partial<AppSettings[T]>
  ) => {
    if (typeof settings.value[category] === 'object' && settings.value[category] !== null) {
      Object.assign(settings.value[category] as any, updates);
      saveSettings();
    }
  };

  // Resetear a configuración por defecto
  const resetToDefaults = () => {
    settings.value = { ...defaultSettings };
    saveSettings();
  };

  // Resetear una categoría específica
  const resetCategory = <T extends keyof AppSettings>(category: T) => {
    if (category === 'businessInfo') {
      settings.value.businessInfo = { ...defaultBusinessInfo };
    } else if (category === 'posSettings') {
      settings.value.posSettings = { ...defaultPOSSettings };
    } else if (category === 'inventorySettings') {
      settings.value.inventorySettings = { ...defaultInventorySettings };
    } else if (category === 'billingSettings') {
      settings.value.billingSettings = { ...defaultBillingSettings };
    } else if (category === 'notificationSettings') {
      settings.value.notificationSettings = { ...defaultNotificationSettings };
    } else if (category === 'integrationSettings') {
      settings.value.integrationSettings = { ...defaultIntegrationSettings };
    } else if (category === 'securitySettings') {
      settings.value.securitySettings = { ...defaultSecuritySettings };
    } else if (category === 'reportSettings') {
      settings.value.reportSettings = { ...defaultReportSettings };
    }
    saveSettings();
  };

  // Obtener valor de configuración
  const getSetting = <K extends keyof AppSettings>(key: K): AppSettings[K] => {
    return settings.value[key];
  };

  // Cargar configuración al inicializar
  loadSettings();

  // Guardar automáticamente cuando cambien las configuraciones (solo después de inicializar)
  const isInitialized = ref(false);

  watch(settings, () => {
    if (isInitialized.value) {
      saveSettings();
    }
  }, { deep: true });

  // Establecer isInitialized a true después de cargar la configuración inicial
  nextTick(() => {
    isInitialized.value = true;
  });

  return {
    settings,
    loadSettings,
    saveSettings,
    updateSetting,
    updateSettings,
    updateSubSetting,
    resetToDefaults,
    resetCategory,
    getSetting,
  };
});
