<script setup>
import { defineEmits, ref } from 'vue';

const emit = defineEmits(['add-to-cart', 'basket-updated']);

const props = defineProps({
  book: Object,
  stock: {
    type: Number,
  },
});

const currentStock = ref(props.stock);

const addBook = () => {

  console.log('Add to cart clicked: ', props.book);
  console.log('stock of clicked book: ', currentStock.value);
  const booksInStorage = JSON.parse(localStorage.getItem('books')) || [];
  booksInStorage.push(props.book);
  localStorage.setItem('books', JSON.stringify(booksInStorage));
  emit('add-to-cart'); // Emit event after updating local storage
  window.dispatchEvent(new Event('basket-updated'));
};


</script>

<template>
  <button
      @click="addBook"
      :disabled="currentStock === 0"
  >
    {{ currentStock === 0 ? 'Out of Stock' : 'Add to Cart' }}
  </button>
</template>

<style scoped>
</style>