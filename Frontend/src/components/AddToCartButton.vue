<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['add-to-cart']);

const props = defineProps  ({
  book: Object,
});

const addBook = (book) => {
  console.log('Add to cart clicked: ', props.book);
  emit('add-to-cart');
  basket.value.push(book);
};

const addBook = () => {
  console.log('Add to cart clicked: ', props.book);
  emit('add-to-cart');
  // save the props book to localstorage?
  const booksInStorage = JSON.parse(localStorage.getItem('books')) || [];
  booksInStorage.push(props.book);
  localStorage.setItem('books', JSON.stringify(booksInStorage));
  emit('basket-updated'); // Emit event after updating local storage

};
</script>

<template>
  <button @click="addBook">Add to Cart</button>
</template>

<style scoped>
</style>