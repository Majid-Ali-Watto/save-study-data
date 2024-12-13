<template>
	<div class="container">
		<AddTopics />
		<Home :links="links" />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
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

	onMounted(async () => {
		try {
			const response = await $fetch("/api/get");
			console.log(response);

			// Safely handle `response.posts` to ensure it is an array
			links.value = Array.isArray(response.posts) ? response.posts : [];
		} catch (e) {
			console.error("Error fetching data:", e);
			alert("Error fetching data");
		}
	});
</script>
