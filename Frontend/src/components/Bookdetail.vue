<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref, defineProps} from "vue";
import AddToCartButton from "@/components/AddToCartButton.vue";

const route = useRoute();
const bookId = route.params.id; // Använd detta ID för att hämta bokinformation

const book = ref(null);

//const props = defineProps(['id']);

const props = defineProps({
  book: Object,
  stock: {
    type: Number,
  },
});

onMounted(async () => {
  try {
    console.log('Fetching book with ID:', bookId);

    const response = await fetch(`http://localhost:3001/api/books/${bookId}`); // Använd bookId här
    //const response = await fetch(`http://localhost:3001/api/books/${props.id}`);
    if (!response.ok) {
      console.error("Failed to fetch book. Status:", response.status);
      return;
    }

    const data = await response.json();

    if (data) {
      book.value = data;
    } else {
      console.log('No book data found');
    }

    console.log('Book fetched successfully:', book.value);
    console.log('Fetching book with ID:', bookId);
  } catch (error) {
    console.error(error);
  }
});
</script>

<!--<template>-->
<!--  <section id="Bookdetail"-->
<!--           class="w-fit mx-auto grid grid-cols-1-->
<!--           justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">-->
<!--    <div class="w-90">-->
<!--      <div v-if="book">-->
<!--        <img :src="book.image" alt="book cover" class="h-82 w-72 object-cover px-4 py-3"/>-->
<!--        <div class="px-4 py-3 w-90">-->
<!--          <AddToCartButton-->
<!--              :book="book"-->
<!--              :stock="book.stock"-->
<!--              @add-to-cart="addToCart"-->
<!--          />-->
<!--          -->
<!--          <p class="text-lg font-bold text-black truncate block capitalize py-2">{{ book.title }}</p>-->
<!--          <div class="bg-gray-100 p-4 rounded-md">-->
<!--            <p>Author: {{ book.author || 'Ingen författare tillgänglig' }}</p>-->
<!--            <p>Available: {{ book.stock }}</p>-->
<!--            <p>Published: {{ book.publishyear || 'Inget publiceringsdatum tillgänglig' }}</p>-->
<!--            <p>ISBN: {{ book.isbn }}</p>-->
<!--            <p>Price: {{ book.price }} kr</p>-->
<!--          </div>-->
<!--          <br>-->
<!--          <div class="bg-gray-100 p-4 rounded-md">-->
<!--            <p>Summary: {{ book.summary }}</p>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div v-else>-->
<!--        <p>Laddar bokinformation...</p>-->
<!--      </div>-->
<!--    </div>-->
<!--  </section>-->
<!--</template>-->


<template>
  <div class="bg-white py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="book" class="flex flex-col md:flex-row -mx-4">
        <div class="md:flex-1 px-4">
          <div class="h-[460px] rounded-lg bg-gray-100 border-lg mb-4">
            <img class="w-full h-full object-contain"
                 :src="book.image" alt="book cover">
          </div>

        </div>
        <div class="md:flex-1 px-4">
          <h2 class="text-2xl font-bold text-black mb-2">{{ book.title }}</h2>
          <div class="flex mb-4">
            <div class="mr-4">
              <span class="font-bold text-black">Price: </span>
              <span class="text-black">{{ book.price }} kr</span>
            </div>
            <div>
              <span class="font-bold text-black">Availability:</span>
              <span class="text-black"> {{ book.stock }}</span>
            </div>
          </div>

          <div class="flex mx-0 mb-4">
            <div class="w-full px-0">
              <AddToCartButton
                  :book="book"
                  @add-to-cart="addToCart"/>
            </div>
          </div>

          <div>
            <span class="font-bold text-black">Book summary </span>
            <p class="text-black text-sm mt-2">
              {{ book.summary }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>