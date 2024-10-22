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

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-40">
      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <div v-for="book in books.slice(0, props.limit)" :key="book.id" class="group relative">
          <div
              class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200
               lg:aspect-none group-hover:opacity-75 lg:h-80">
            <img :src="book.image" alt="book cover" @click="BookDetail(book)"
                 class="h-full w-full object-cover object-center lg:h-full lg:w-full" />
          </div>
          <div class="mt-4 flex justify-between">
            <div>
              <h3 class="text-sm text-gray-700">
                  <span aria-hidden="true" class="absolute inset-0"/>
                  {{ book.title }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">{{ book.author }}</p>
            </div>
            <p class="text-sm font-medium text-gray-900">{{ book.price }} kr</p>
          </div>
          <AddToCartButton
              :book="book"
              :stock="book.stock"
              @add-to-cart="addToCart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

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

