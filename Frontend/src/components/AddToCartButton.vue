<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['add-to-cart']);
const basket = ref([]);

const props = defineProps  ({
  book: Object,
});

const addBook = (book) => {
  console.log('Add to cart clicked: ', props.book);
  emit('add-to-cart');
  basket.value.push(book);
};



</script>

<template>
  <button @click="addBook">Add to Cart</button>
</template>

<style scoped>
</style>