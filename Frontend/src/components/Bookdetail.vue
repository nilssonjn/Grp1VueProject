<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref, defineProps} from "vue";
import AddToCartButton from "@/components/AddToCartButton.vue";

const route = useRoute();
const bookId = route.params.id; // Använd detta ID för att hämta bokinformation

const book = ref(null);

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
              <span class="font-bold text-black">Availability: </span>
              <span :class="{'text-red-500': book.stock < 10}" class="text-black"> {{ book.stock }}</span>
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