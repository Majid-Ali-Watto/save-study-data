<template>
  <nav class="flex justify-between items-center">
    <NuxtLink
      to="/"
      :class="getLinkClass('/')"
    >
      Links
    </NuxtLink>
    <NuxtLink
      to="/CodeFiles"
      :class="getLinkClass('/CodeFiles')"
    >
      Code Files
    </NuxtLink>
    <NuxtLink
      to="/Codes"
      :class="getLinkClass('/Codes')"
    >
      Text Codes
    </NuxtLink>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

// A helper function to determine the class based on the active route
const getLinkClass = (path) => {
  const isActive = route.path === path;
  return [
    'p-4',
	"w-50",
    'hover:bg-slate-400',
    isActive ? 'bg-gray-800 text-white' : 'text-gray-500',
  ].join(' ');
};
</script>

<style scoped>
/* Optional: Adjust hover and active styles */
.hover\:bg-slate-400:hover {
  transition: background-color 0.3s ease;
}


</style>
