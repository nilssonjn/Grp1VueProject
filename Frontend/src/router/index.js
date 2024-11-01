import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Bookdetail from '../components/Bookdetail.vue';
import ShoppingCartView from "@/views/ShoppingCartView.vue";
import AboutView from "@/views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/category/home'
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/books/:id',
      name:'books',
      component: Bookdetail,
    },
    {
      path: '/category/:name',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
      props: true
    },
    {
      path: '/shoppingcart',
      name: 'shoppingcart',
      component: ShoppingCartView
    },
]
})

export default router
