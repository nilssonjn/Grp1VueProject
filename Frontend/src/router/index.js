import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Bookdetail from '../components/Bookdetail.vue';
import NewBooksView from "@/views/NewBooksView.vue";
import AboutView from "@/views/AboutView.vue";
import ScifiBooksView from "@/views/ScifiBooksView.vue";
import HorrorBooksView from "@/views/HorrorBooksView.vue";
import FantasyBooksView from "@/views/FantasyBooksView.vue";
import ShoppingCartView from "@/views/ShoppingCartView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      path: '/newBooks',
      name: 'newBooks',
      component: NewBooksView,
    },
    {
      path: '/scifi',
      name: 'scifi',
      component: ScifiBooksView
    },
    {
      path: '/horror',
      name: 'horror',
      component: HorrorBooksView
    },
    {
      path: '/fantasy',
      name: 'fantasy',
      component: FantasyBooksView
    },
    {
      path: '/shoppingcart',
      name: 'shoppingcart',
      component: ShoppingCartView
    },
]
})

export default router
