<script setup>
import Books from "@/components/Books.vue";

const props = defineProps({

  name: String
})
const link = "http://localhost:3001/api/books/" + props.name;
</script>

<template>
  <Books :limit="10" :link=link />
</template>
