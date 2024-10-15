<script setup>

import ShoppingCart from "@/components/ShoppingCart.vue";
import Books from "@/components/Books.vue";
</script>

<template>
  <ShoppingCart />
  <Books :limit="10" :link="`http://localhost:3001/api/newbooks`" />
</template>
