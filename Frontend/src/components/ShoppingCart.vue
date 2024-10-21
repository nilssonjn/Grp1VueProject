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

const getBookFromID = async (book) => {
  // Fetch the current stock value from the database
  try {
    const response = await fetch(`http://localhost:3001/api/books/${book.id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stock for book ID ${book.id}`);
    }
    const bookData = await response.json();
    return bookData;
  } catch (error) {
    console.error('Failed to get stock value', error)
  }
};


async function updateStockInDB(book, newStock) {
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
  return updateResponse;
}

const checkAgainstStockInDB = async () => {
    const bookCounts = {};


    // add current book to a new list
    for (const book of cartItems.value) {
      if (bookCounts[book.id]) {
        bookCounts[book.id]++;
      } else {
        bookCounts[book.id] = 1;
      }
    }

  // Check stock for each book
  for (const bookId in bookCounts) {
    const bookData = await getBookFromID({ id: bookId });
    const countInCart = bookCounts[bookId];

    // check if stock in db minus how many books you wanna buy is < 0
    if (bookData.stock - countInCart < 0) {
      alert(`Not enough stock for book: ${bookData.title}`);
      return false;
    }
  }
  return true;
}


const buyBooks = async () => {
  const isStockAvailable = await checkAgainstStockInDB();
  if(isStockAvailable){
  try {

    for (const book of cartItems.value) {

      const bookData = await getBookFromID(book);

      // Update the stock

      const newStock = bookData.stock - 1;

      const updateResponse = await updateStockInDB(book, newStock);

      if (!updateResponse.ok) {
        throw new Error(`Failed to update stock for book ID ${book.id}`);
      }
    } // END OF LOOP

    alert('Books bought!');
    cartItems.value = [];
    localStorage.setItem('books', JSON.stringify(cartItems.value));
    window.dispatchEvent(new Event('basket-updated')); // Ensure the event is dispatched when buying books

  } catch (error) {
    console.error('Failed to update stock:', error);
  }
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