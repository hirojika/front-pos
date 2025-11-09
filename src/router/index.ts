import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from '../store/auth';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'DashboardView',
                component: () => import('../views/DashboardView.vue')
            }
        ]
    },
    {
        path: '/pos',
        name: 'POS',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'POSView',
                component: () => import('../views/POSView.vue')
            }
        ]
    },
    {
        path: '/boletas',
        name: 'Boletas',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'BoletasView',
                component: () => import('../views/BoletasView.vue')
            }
        ]
    },
    {
        path: '/ingredientes',
        name: 'Ingredientes',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'IngredientesView',
                component: () => import('../views/IngredientesView.vue')
            }
        ]
    },
    {
        path: '/configuracion',
        name: 'Configuracion',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'ConfiguracionView',
                component: () => import('../views/ConfiguracionView.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard de navegación
router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();
    
    // Verificar autenticación en cada navegación para asegurar que el estado esté actualizado
    authStore.checkAuth();
    
    // Obtener el estado de autenticación actual (después de checkAuth)
    const isAuthenticated = authStore.isAuthenticated;
    
    // Si el usuario está autenticado y va a la página de login o a la raíz, redirigir al dashboard
    if ((to.name === 'Login' || to.path === '/') && isAuthenticated) {
        next({ name: 'Dashboard' });
        return;
    }
    
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir al login
    if (to.meta.requiresAuth !== false && !isAuthenticated) {
        next({ name: 'Login' });
        return;
    }
    
    next();
});

export default router;