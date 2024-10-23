,
<script setup>
import {ref, onMounted} from 'vue';
import router from "@/router/index.js";
import AddToCartButton from "@/components/AddToCartButton.vue";


// list of books that will be filled by api
const books = ref([]);

// contains all the books with specific values picked out
const updatedBooks = ref([]);

function BookDetail(book) {
  //router.push({ name: 'bookdetail', params: { id: book.key.split('/').pop() } });
  router.push({name: 'books', params: {id: book.id}});
}

const props = defineProps({
  limit: Number,
  name: String,
});

const link = "http://localhost:3001/api/books/" + props.name;

onMounted(async () => {
  try {
    console.log('Fetching books for category:', props.name);
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

<!--original template-->

<!--<template>-->
<!--  <div class="bookList">-->
<!--    <ul>-->

<!--      <li v-for="book in books.slice(0, props.limit)" :key="book.id">-->
<!--        <h3>{{ book.title }}</h3>-->
<!--        <img :src="book.image" alt="book cover" @click="BookDetail(book)"/>-->
<!--        <p>{{ book.author }}</p>-->
<!--        <AddToCartButton-->
<!--            :book="book"-->
<!--            :stock="book.stock"-->
<!--            @add-to-cart="addToCart"-->
<!--        />-->
<!--      </li>-->
<!--    </ul>-->
<!--  </div>-->
<!--</template>-->
<template>
  <section id="Books"
           class="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3
           md:grid-cols-2 justify-items-center justify-center gap-y-10 gap-x-10 mt-10 mb-5">
    <div v-for="book in books.slice(0, props.limit)" :key="book.id"
         class="w-72 bg-white shadow-md rounded-xl overflow-hidden duration-500 hover:scale-105 hover:shadow-xl">
      <div class="w-full h-72">
        <img :src="book.image" alt="book cover" @click="BookDetail(book)"
             class="h-full w-full object-cover"/>
      </div>
      <div class="px-4 py-3">
        <span class="text-gray-400 mr-3 uppercase text-xs">{{ book.author }}</span>
        <p class="text-lg font-bold text-black truncate block capitalize">{{ book.title }}</p>
        <div class="flex items-center">
          <p class="text-lg font-semibold text-black cursor-auto my-3">{{ book.price }} kr</p>
          <AddToCartButton
              :book="book"
              @add-to-cart="addToCart"/>
          <div class="ml-auto">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


