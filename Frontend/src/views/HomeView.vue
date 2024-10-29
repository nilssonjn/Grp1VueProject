<script setup>

import Books from "@/components/Books.vue";
</script>

<template>
  <Books :limit="9" :link="`http://localhost:3001/api/books`" />
</template>
