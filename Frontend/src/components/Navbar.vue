<script setup>
import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {Bars3Icon, BookOpenIcon, XMarkIcon, ShoppingCartIcon} from '@heroicons/vue/24/outline'
import {RouterLink, useRoute} from "vue-router";
import ShoppingCart from "@/components/ShoppingCart.vue";
import {ref, onMounted } from "vue";

const route = useRoute();

const navigation = [
  {name: 'Home', to: 'home', current: true},
  {name: 'New Books', to: 'newBooks', current: false},
  {name: 'Sci-fi', to: 'scifi', current: false},
  {name: 'Fantasy', to: 'fantasy', current: false},
  {name: 'Horror', to: 'horror', current: false},
]

const shoppingCartLink = [
  {name: 'Shopping Cart', to: '/shoppingcart', current: false}
]
const cartItems =ref([]);
const getCartItemCount = () => cartItems.value.length;
const updateCartItems = (() => {
  const booksInStorage = JSON.parse(localStorage.getItem('books')) || [];
  cartItems.value = booksInStorage;
})


onMounted(() => {
  updateCartItems();
  window.addEventListener('basket-updated', updateCartItems);
});

</script>

<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="absolute -inset-0.5"/>
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <BookOpenIcon class="h-8 w-auto text-gray-400" aria-hidden="true"/>
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                  v-for="item in navigation"
                  :key="item.name"
                  :to="{name:'category', params: {name: item.to}, props: true}"
                  :class="[
                    route.path === item.to
                    ? 'bg-gray-900'
                    : 'hover:bg-gray-700 hover:text-white',
                    'px-3',
                    'py-2',
                    'text-sm',
                    'font-medium',
                    'rounded-md',
                    'text-white',
                  ]"
                  :aria-current="route.path === item.to ? 'page' : undefined"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton
                  class="relative flex rounded-full bg-gray-800 text-sm
                  focus:outline-none focus:ring-2 focus:ring-white
                  focus:ring-offset-2 focus:ring-offset-gray-800
                  hover:bg-gray-700 hover:text-white p-2">
                <span class="absolute -inset-1.5"/>
                <span class="sr-only">Open user menu</span>
                <ShoppingCartIcon class="h-6 w-6 text-gray-400" aria-hidden="true"/>
                <span v-if="getCartItemCount() > 0"
                      class="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {{ getCartItemCount() }}
                </span>
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                  class="absolute right-5 z-10 mt-2 w-96 h-96 origin-top-right overflow-auto
                  rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }"
                          :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                  <ShoppingCart class="w-full h-full"/>
                </MenuItem>
                <MenuItem>
                  <RouterLink
                      v-for="item in shoppingCartLink"
                      :key="item.name"
                      :to="item.to"
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Go to your
                    shopping cart
                  </RouterLink>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="{name:'category', params: {name: item.to}, props: true}"
            :class="[
              route.path === item.to
              ? 'bg-gray-900'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block rounded-md',
              'px-3',
              'py-2',
              'text-base',
              'font-medium',
              'text-white'
             ]"
            :aria-current="route.path === item.to ? 'page' : undefined"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
