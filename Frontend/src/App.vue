<script setup>
import { RouterView, useRoute } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import ShoppingCart from "@/components/ShoppingCart.vue";

const route = useRoute();
</script>

<template>
  <Navbar />
  <RouterView :key="route.fullPath"/>
</template>

<style scoped>

</style>
