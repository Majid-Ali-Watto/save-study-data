<template>
	<div>
		<header class="fixed left-0 top-0 w-full box-border flex items-center bg-black text-white hover:bg-slate-900 transition ease-in-out delay-150 z-50">
			<Navbar />
		</header>
		<main class="overflow-auto mt-14">
			<div v-if="loading" class="fixed left-0 top-0 h-0.5 w-full z-50 bg-green-500" />
			<slot />
		</main>
	</div>
</template>
<script setup lang="ts">
	const nuxtApp = useNuxtApp();
	const loading = ref(true);
	nuxtApp.hook("page:start", () => {
		console.log("loading page");
		loading.value = true;
	});
	nuxtApp.hook("page:finish", () => {
		loading.value = false;
	});
</script>
