<template>
	<div class="text-gray-800 flex justify-center">
		<form @submit.prevent="handleSubmit" class="bg-white w-[100%] shadow-lg rounded-lg p-6 space-y-4">
			<h2 class="text-2xl font-bold text-center text-lime-600">Submit Your Favourite Link</h2>

			<div class="flex w-full flex-col">
				<label for="title" class="text-sm font-medium text-gray-700">Title</label>
				<input minlength="10" maxlength="150" v-model="form.title" id="title" type="text" name="title" placeholder="e.g. Nuxt JS" class="mt-1 p-1 outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm" required />
			</div>

			<div class="flex w-full flex-col">
				<label for="link" class="block text-sm font-medium text-gray-700">Link</label>
				<input v-model="form.link" id="link" type="text" name="link" placeholder="e.g. https://nuxt.com/docs" class="mt-1 p-1 outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm" required />
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
				<textarea minlength="20" maxlength="500" v-model="form.description" id="description" name="description" placeholder="e.g. it is official nuxt website for nuxt guidelines." rows="3" class="mt-1 p-1 block w-full outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm" required></textarea>
			</div>

			<div class="flex justify-center">
				<button type="submit" class="w-full py-2 px-4 bg-lime-600 text-white font-semibold rounded-lg shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2">Send</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
	import { reactive } from "vue";

	const form = reactive({
		title: "",
		link: "",
		description: ""
	});

	async function handleSubmit() {
		try {
			// Function to check for CORS error
			// function isCorsError(error: any) {
			// 	return error instanceof TypeError && error.message === "Failed to fetch";
			// }

			// // Function to check if the URL exists
			// async function isValidURL(url: string): Promise<boolean> {
			// 	try {
			// 		const response: any = await $fetch(url, {
			// 			method: "HEAD" // Use HEAD to only fetch headers for validation
			// 		});
			// 		console.log("🚀 -> file: AddTopics.vue:50 -> isValidURL -> response:", response);
			// 		return response.status === 200; // If status is 200, the URL exists
			// 	} catch (error) {
			// 		console.log("URL validation failed:",isCorsError(error), error);
			// 		if (isCorsError(error)) return true;
			// 		return false;
			// 	}
			// }
			// const isUrl = await isValidURL(form.link);
			// if (!isUrl) {
			// 	return alert("Please enter a valid URL");
			// }
			// Use $fetch to send the form data
			const response = await $fetch("/api/post", {
				method: "POST",
				body: form // Automatically stringified by $fetch
			});

			console.log("Server response:", response);

			if (response.success) {
				alert("Form submitted successfully!");
			} else {
				alert("Failed to submit the form.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Error submitting form.");
		}
	}
</script>
