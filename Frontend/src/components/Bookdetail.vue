<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, defineProps } from "vue";
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

<template>
  <div v-if="book">
    <h1>{{ book.title }}</h1>
    <img :src="book.image" alt="book cover" />
    <AddToCartButton
        :book="book"
        :stock="book.stock"
        @add-to-cart="addToCart"
    />
    <p>{{ book.author || 'Ingen författare tillgänglig' }}</p>
    <p>Lagerstatus: {{book.stock}}</p>
    <p>Publiceringsår: {{ book.publishyear || 'Inget publiceringsdatum tillgänglig' }}</p>
    <p>ISBN:{{book.isbn}}</p>
    <p>{{book.price}}</p>
    <p>{{ book.summary }}</p>
  </div>
  <div v-else>
    <p>Laddar bokinformation...</p>
  </div>
</template>



<style scoped>

</style>
