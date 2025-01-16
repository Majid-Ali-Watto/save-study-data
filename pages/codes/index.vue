<template>
	<div class="container">
		<Head>
			<Title>Codes</Title>
			<Meta name="description" content="it is code section" />
		</Head>
		<AddCodeForm />
		<ViewCodes :codes="codes" />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import type { Ref } from "vue";
	definePageMeta({
		middleware: "auth"
	});
	interface Code {
		code: string;
		title: string;
		_id: string;
		createdAt: string;
	}

	// Initialize `codes` as a reactive array of `Code`
	const codes: Ref<Code[]> = ref([]);

	onMounted(async () => {
		try {
			const response = await $fetch("/api/get-codes");
			console.log(response);

			// Safely handle `response.posts` to ensure it is an array
			codes.value = Array.isArray(response.codes) ? response.codes : [];
		} catch (e) {
			console.error("Error fetching data:", e);
			alert("Error fetching data");
		}
	});
</script>
s