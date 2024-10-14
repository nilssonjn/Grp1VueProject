<script setup>

import NewBooks from "@/components/NewBooks.vue";
import ShoppingCart from "@/components/ShoppingCart.vue";
</script>

<template>
  <ShoppingCart />
  <new-books :limit="10"  />
</template>
