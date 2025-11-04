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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard de navegación
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
        next({ name: 'Dashboard' });
    } else {
        next();
    }
});

export default router;