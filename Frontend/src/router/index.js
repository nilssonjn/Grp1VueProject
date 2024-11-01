import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/category/home'
        },
        {
            path: '/books/:id',
            name: 'books',
            component: () => import('@/components/Bookdetail.vue'),
        },
        {
            path: '/category/:name',
            name: 'category',
            component: () => import('@/views/CategoryView.vue'),
            props: true
        },
        {
            path: '/shoppingcart',
            name: 'shoppingcart',
            component: () => import('@/views/ShoppingCartView.vue'),
        },
    ]
})

export default router
