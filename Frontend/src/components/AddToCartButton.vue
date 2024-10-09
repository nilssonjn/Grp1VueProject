<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['add-to-cart', 'basket-updated']);

const props = defineProps  ({
  book: Object,
});

const addBook = () => {
  console.log('Add to cart clicked: ', props.book);
  //emit('add-to-cart');
  // save the props book to localstorage?
  const booksInStorage = JSON.parse(localStorage.getItem('books')) || [];
  booksInStorage.push(props.book);

  localStorage.setItem('books', JSON.stringify(booksInStorage));
  emit('add-to-cart'); // Emit event after updating local storage
  window.dispatchEvent(new Event('basket-updated'));

};
</script>

<template>
  <button @click="addBook">Add to Cart</button>
</template>

<style scoped>
</style>