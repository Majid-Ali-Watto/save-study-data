<template>
	<div class="text-gray-800 min-h-dvh lg:w-1/3 flex items-center justify-center">
		<form
			@submit.prevent="handleSubmit"
			class="bg-white w-full max-w-lg shadow-lg rounded-lg p-6 space-y-4"
		>
			<h2 class="text-2xl font-bold text-center text-lime-600">Submit Your Link</h2>

			<div>
				<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
				<input
					v-model="form.title"
					id="title"
					type="text"
					name="title"
					placeholder="e.g. Nuxt JS"
					class="mt-1 p-1 block w-full outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm"
					required
				/>
			</div>

			<div>
				<label for="link" class="block text-sm font-medium text-gray-700">Link</label>
				<input
					v-model="form.link"
					id="link"
					type="text"
					name="link"
					placeholder="e.g. https://nuxt.com/docs"
					class="mt-1 p-1 block w-full outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm"
					required
				/>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
				<textarea
					v-model="form.description"
					id="description"
					name="description"
					placeholder="e.g. it is official nuxt website for nuxt guidelines."
					rows="3"
					class="mt-1 p-1 block w-full outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm"
					required
				></textarea>
			</div>

			<div class="flex justify-center">
				<button
					type="submit"
					class="w-full py-2 px-4 bg-lime-600 text-white font-semibold rounded-lg shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
				>
					Send
				</button>
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
