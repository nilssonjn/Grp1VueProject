<script setup>
import {ref, onMounted} from 'vue';

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


const buyBooks = async () => {
  try {
    let available = true;
    let allBooksAvaliable = true;

    for (const book of cartItems.value) {
      // Fetch the current stock value from the database
      const response = await fetch(`http://localhost:3001/api/books/${book.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stock for book ID ${book.id}`);
      }
      const bookData = await response.json();

      if(bookData.stock <= 0){
        allBooksAvaliable = false;
        break;
      }
    }


    for (const book of cartItems.value) {
      // Fetch the current stock value from the database
      const response = await fetch(`http://localhost:3001/api/books/${book.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stock for book ID ${book.id}`);
      }
      const bookData = await response.json();

      if (allBooksAvaliable) {
        //proceed
        // Update the stock value
        const newStock = bookData.stock - 1;


        // Send the updated stock value in the PUT request
        const updateResponse = await fetch(`http://localhost:3001/api/books/stock/${book.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stock: newStock
          })
        });

        if (!updateResponse.ok) {
          throw new Error(`Failed to update stock for book ID ${book.id}`);
        }
      } else {
        alert('Sorry the book is not available');
        available = false;
        break;
      }
    }
    if(available){
      alert('Books bought!');
      cartItems.value = [];
      localStorage.setItem('books', JSON.stringify(cartItems.value));
      window.dispatchEvent(new Event('basket-updated')); // Ensure the event is dispatched when buying books
    }
  } catch(error){
    console.error('Failed to update stock:', error);
  }
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
    <button @click="buyBooks">Check Out</button>
  </div>
</template>
<style scoped>

</style>