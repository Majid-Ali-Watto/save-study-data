<template>
	<div class="container mx-auto rounded mt-2 p-6 min-h-screen">
		<!-- Search Bar -->
		<div class="relative max-w-md mx-auto">
			<input v-model="query" type="search" placeholder="Search code snippets or links..." class="w-full text-gray-800 p-1 pl-10 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all" required />
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 text-gray-500 absolute left-3 top-3">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M16.92 10.74a6.75 6.75 0 11-9.54-9.54 6.75 6.75 0 019.54 9.54z" />
			</svg>
		</div>

		<!-- Links Grid -->
		<ul v-if="filteredLinks.length > 0" aria-live="polite" class="mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
			<li v-for="link in filteredLinks" :key="link._id" class="p-6 h-52 overflow-auto rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
				<!-- Link Title -->
				<a :href="link.link" target="_blank" rel="noopener noreferrer" :aria-label="`Open ${link.title} in a new tab`" class="block">
					<h1 class="text-lime-600 font-semibold text-lg leading-snug hover:underline">
						{{ link.title }}
					</h1>
				</a>
				<!-- Description -->
				<p v-for="desc in link.description.split('\n')" :key="desc" class="text-gray-300 text-sm leading-relaxed mt-2">
					{{ desc }}
				</p>
				<!-- Created Date -->
				<p class="mt-4 text-gray-400 text-xs">Saved: {{ link.createdAt ? new Date(link.createdAt).toDateString() : "Unknown Date" }}</p>
			</li>
		</ul>
		<div v-else class="text-gray-500 text-center mt-10">No results found for "{{ query }}"</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch } from "vue";
	import debounce from "lodash/debounce";

	const query = ref<string>("");

	interface Link {
		link: string;
		title: string;
		_id: string;
		createdAt: string;
		description: string;
	}

	const props = defineProps<{
		links: Link[];
	}>();

	const debouncedQuery = ref("");
	watch(
		query,
		debounce((newQuery: string) => (debouncedQuery.value = newQuery), 300)
	);

	const filteredLinks = computed(() => {
		return props.links.filter((file) => file.title.toLocaleLowerCase().includes(debouncedQuery.value.toLocaleLowerCase()) || file.description.toLocaleLowerCase().includes(debouncedQuery.value.toLocaleLowerCase()));
	});
</script>
