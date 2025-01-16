<template>
  <div class="container">
    <AddTopics />

    <div v-if="status === 'pending'">Loading...</div>
    <div v-else-if="error">Something went wrong, reload the page.</div>
    <div v-else>
      <div v-if="links.length">
        <Home :links="links" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Ref } from "vue";
  definePageMeta({
    middleware: "auth"
  });

  interface Link {
    link: string;
    title: string;
    _id: string;
    createdAt: string;
    description: string;
  }

  // Initialize `links` as a reactive array of `Link`
  const links: Ref<Link[]> = ref([]);

  const { status, data, error } = useFetch("/api/get");
  console.log(data.value?.posts);

  // Update `links` once the data is available
  if (data.value?.posts) {
    links.value = Array.isArray(data.value?.posts) ? data.value?.posts : [];
  } else {
    links.value = [];
  }
</script>
