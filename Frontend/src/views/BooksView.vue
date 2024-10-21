<script setup>
import Books from "@/components/Books.vue";

// const props = defineProps({
//   name: String
// })
// const link = "http://localhost:3001/api/books/" + name;

</script>

<template>
  <Books :limit="10" :name=name />
</template>
