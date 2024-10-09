<script setup>
import { ref, onMounted } from 'vue';
import router from "@/router/index.js";
import AddToCartButton from "@/components/AddToCartButton.vue";


// list of books that will be filled by api
const books = ref([]);

// contains all the books with specific values picked out
const updatedBooks = ref([]);

function viewBookDetail(book) {
  router.push({ name: 'bookdetail', params: { id: book.key.split('/').pop() } }); // Skickar bara ID
}

defineProps ({
  limit: Number
});

onMounted(async () => {
  try {
   // const response = await fetch("https://openlibrary.org/developers/api");
    const response = await fetch('https://openlibrary.org/search.json?q=books&limit=50');

    // Check for successful response
    if (!response.ok) {
      console.error("Failed to fetch books. Status:", response.status);
      return; // Exit early if not successful to avoid potential errors
    }

    // Parse response as JSON
    const data = await response.json();

    // Update books with fetched data, handling potential absence of "docs" property
    books.value = data.docs || [];

    console.log('Books fetched successfully:', books.value);

  } catch (error) {
    console.error(error);
  }
  console.log(books.value);
});


</script>


<template>
  <h1>Books</h1>

<div class="bookList">
    <ul>
      <li v-for="book in books.slice(0, limit || books.length)" :key="book.key">{{ book.title }}
        <img :src="'https://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg'" alt="book cover" />
        <p>{{ book.author_name }}</p>
        <!-- AddToCartButton component usage -->
        <AddToCartButton
            :book="book"
            @add-to-cart="addToCart"
        />
      </li>
    </ul>
</div>

</template>

<style scoped>

.bookList {
  display: grid;
  flex-direction: row;
  grid-template-columns: repeat(5, 1fr);
  border: #181818 solid 1px;
}

</style>