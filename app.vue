<template>
	<NuxtLayout>
		<div class="flex justify-center items-center bg-neutral-800 text-white p-2">
			<NuxtPage />
		</div>
	</NuxtLayout>
</template>
<script setup lang="ts">
	useSeoMeta({
		title: "My Study Site",
		ogTitle: "My Study Site",
		description: "This is my amazing study site, it is for saving and getting study data.",
		ogDescription: "This is my amazing study site, it is for saving and getting study data.",
		ogImage: "./public/favicon.ico",
		twitterCard: "summary_large_image"
	});
</script>
