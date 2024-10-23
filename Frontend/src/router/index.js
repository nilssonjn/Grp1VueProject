import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Bookdetail from '../components/Bookdetail.vue';
import BooksView from "@/views/BooksView.vue";
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
      path: '/home',
      name: 'home',
      component: HomeView
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
      //props: true
    },
    {
      path: '/category/:name',
      name: 'category',
      component: () => import('../views/BooksView.vue'),
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
