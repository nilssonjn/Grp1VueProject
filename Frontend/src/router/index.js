import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Bookdetail from '../components/Bookdetail.vue';
import NewBooksView from "@/views/NewBooksView.vue";

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
      component: () => import('../views/AboutView.vue')
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
  ]
})

export default router
