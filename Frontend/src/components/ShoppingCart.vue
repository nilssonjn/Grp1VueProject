<script setup>
import {ref, onMounted, computed} from 'vue';
import AddToCartButton from "@/components/AddToCartButton.vue";

const cartItems = ref([]);

const updateCart = () => {
  const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
  cartItems.value = storedBooks;
};

onMounted(() => {
  updateCart();
});

const removeBook = (bookId) => {
  const index = cartItems.value.findIndex(book => book.id === bookId);
  if (index !== -1) {
    cartItems.value.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(cartItems.value));
    window.dispatchEvent(new Event('basket-updated')); // Ensure the event is dispatched when removing a book
  }
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
    const bookData = await getBookFromID({id: bookId});
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
  if (isStockAvailable) {
    try {

      for (const book of cartItems.value) {

        const bookData = await getBookFromID(book);
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
      window.location.reload(); // Reload the page

    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  }
};

const bookCounts = computed(() => {
  const counts = {};
  for (const book of cartItems.value) {
    if (counts[book.id]) {
      counts[book.id].count++;
    } else {
      counts[book.id] = {...book, count: 1};
    }
  }
  return Object.values(counts);
});

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, book) => total + book.price, 0);
});

</script>

<template>
  <div class="max-w-md mx-auto mt-2 bg-white rounded-lg overflow-auto md:max-w-lg">
    <div class="px-5 py-2 border-b border-gray-200">
      <h2 class="font-semibold text-gray-800">Shopping Cart</h2>
    </div>
    <div class="flex flex-col divide-y divide-gray-200">
      <div v-for="book in bookCounts" :key="book.id" class="flex items-center py-4 px-6">
        <div class="ml-3">
          <h3 class="text-gray-900 font-semibold">{{ book.title }} ({{ book.count }})</h3>
          <p class="text-gray-700 mt-1">{{ book.price }} kr</p>
        </div>
        <button @click.stop="removeBook(book.id)" class="ml-auto py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded">
          -
        </button>
        <AddToCartButton @click.stop :book="book" :stock="book.stock" @add-to-cart="updateCart" class="py-2 px-4">
          +
        </AddToCartButton>
      </div>
    </div>
    <div class="flex items-center justify-between px-6 py-3 bg-gray-100">
      <h3 class="text-gray-900 font-semibold">Total: {{ totalPrice }} kr</h3>
      <button @click="buyBooks" class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
        Checkout
      </button>
    </div>
  </div>
</template>