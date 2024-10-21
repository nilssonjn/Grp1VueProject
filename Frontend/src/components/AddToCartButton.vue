<script setup>
import {defineEmits, ref, watch, onMounted} from 'vue';

const emit = defineEmits(['add-to-cart', 'basket-updated']);

const props = defineProps({
  book: Object,
  stock: {
    type: Number,
  },
});

const currentStock = ref(props.stock);

onMounted(() => {
  const stockData = JSON.parse(localStorage.getItem('stockData')) || {};
  if (stockData[props.book.id] !== undefined) {
    currentStock.value = stockData[props.book.id];
  }
});
/*const booksInStorage = JSON.parse(localStorage.getItem('books')) || [];
const bookInCart = booksInStorage.find((book) => book.id === props.book.id);
if(booksInStorage){
  currentStock.value = booksInStorage.stock;
}*/

watch(currentStock, (newStock) => {
  props.book.stock = newStock;
});

watch(currentStock, (newStock) => {
  const stockData = JSON.parse(localStorage.getItem('stockData')) || {};
  stockData[props.book.id] = newStock;
  localStorage.setItem('stockData', JSON.stringify(stockData));
});

const addBook = () => {
  console.log('Add to cart clicked: ', props.book);
  console.log('stock of clicked book: ', currentStock.value);
  const booksInStorage = JSON.parse(localStorage.getItem('books')) || [];
  booksInStorage.push(props.book);
  localStorage.setItem('books', JSON.stringify(booksInStorage));
  currentStock.value--;
  console.log('stock after updating: ', currentStock.value);
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