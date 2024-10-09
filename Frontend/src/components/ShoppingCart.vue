<script setup>
import { ref, onMounted } from 'vue';

const cartItems = ref([]);

const updateCart = () => {
  const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
  cartItems.value = storedBooks;
};

onMounted(() => {
  updateCart();
  window.addEventListener('basket-updated', updateCart);
});

const removeBook = (index) => {
  cartItems.value.splice(index, 1);
  localStorage.setItem('books', JSON.stringify(cartItems.value));
  window.dispatchEvent(new Event('basket-updated')); // Ensure the event is dispatched when removing a book
};

const checkOutBooks = () => {
  cartItems.value.forEach(book => {
    console.log(`Checking out book: ${book.title}`);
    // Add your checkout logic here
    });
  };

</script>

<template>
  <div>
    <h1>Shopping Cart</h1>
    <ul>
      <li v-for="(book, index) in cartItems" :key="index">
        <h2>{{ book.title }}</h2>
        <button @click="removeBook(index)">Remove</button>
      </li>
    </ul>
  </div>
</template>
<style scoped>

</style>