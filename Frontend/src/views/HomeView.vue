<script setup>

import Books from "@/components/Books.vue";
</script>

<template>
  <Books :limit="10" :link="`http://localhost:3001/api/books`" />
</template>
