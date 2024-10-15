,<script setup>
import { ref, onMounted } from 'vue';
import router from "@/router/index.js";
import AddToCartButton from "@/components/AddToCartButton.vue";


// list of books that will be filled by api
const books = ref([]);

// contains all the books with specific values picked out
const updatedBooks = ref([]);

function BookDetail(book) {
  //router.push({ name: 'bookdetail', params: { id: book.key.split('/').pop() } });
  router.push({ name: 'books', params: { id: book.id }});
}

const { limit, link } = defineProps({
  limit: Number,
  link: String
});

onMounted(async () => {
  try {

    const response = await fetch(link);
    // Check for successful response
    if (!response.ok) {
      console.error("Failed to fetch books. Status:", response.status);
      return; // Exit early if not successful to avoid potential errors
    }

    // Parse response as JSON
    const data = await response.json();

    // Update books with fetched data, handling potential absence of "docs" property
    //books.value = data.docs || [];
    books.value = data;

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

      <li v-for="book in books.slice(0, limit)" :key="book.id">
        <h3>{{ book.title }}</h3>
        <img :src="book.image" alt="book cover" @click="BookDetail(book)"/>
        <p>{{ book.author }}</p>
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