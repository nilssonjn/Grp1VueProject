<script setup>
const emit = defineEmits(['add-to-cart', 'basket-updated']);

const props = defineProps({
  book: Object,
});

const addBook = () => {
  console.log('Add to cart clicked: ', props.book);
  const booksInStorage = JSON.parse(localStorage.getItem('books')) || [];
  booksInStorage.push(props.book);
  localStorage.setItem('books', JSON.stringify(booksInStorage));
  emit('add-to-cart');
  window.dispatchEvent(new Event('basket-updated'));
};
</script>

<template>
  <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" @click="addBook">
    <slot>Add to Cart</slot>
  </button>
</template>