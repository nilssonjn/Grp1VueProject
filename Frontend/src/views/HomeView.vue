<script setup>

import Books from "@/components/Books.vue";
import ShoppingCart from "@/components/ShoppingCart.vue";
</script>

<template>
  <ShoppingCart />
  <Books :limit="10"  />
</template>
