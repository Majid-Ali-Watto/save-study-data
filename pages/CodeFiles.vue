<script setup lang="ts">
	import { ref } from "vue";

	// Types for responses
	interface UploadResponse {
		message: string;
	}

	const message = ref<string>("");
	const description = ref<string>("");
	const selectedFile = ref<File | null>(null);

	const handleFileChange = (event: Event): void => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			selectedFile.value = target.files[0];
		}
	};
	const handleDescChange = (event: Event): void => {
		const target = event.target as HTMLInputElement;
		description.value = target.value;
	};

	const uploadFile = async (): Promise<void> => {
		if (!selectedFile.value) {
			message.value = "Please select a file.";
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile.value);
		formData.append("description", description.value);
		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData
			});
			const data: UploadResponse = await response.json();
			alert(data.message);
		} catch (error) {
			message.value = "Error uploading file.";
		}
	};
</script>

<template>
	<!-- <div class="min-h-screen py-10"> -->
		<div class="container mx-auto">
			<!-- Header -->
			<h1 class="text-3xl font-bold text-white mb-6 text-center">Upload Files</h1>

			<!-- Upload Form -->
			<div class="box-border bg-white shadow-md rounded-lg p-6 mb-10">
				<form @submit.prevent="uploadFile" class="space-y-4">
					<div class="flex flex-col space-x-4">
						<label class="text-gray-900" for="code-file-description">Code Description</label>
						<textarea type="text" placeholder="Write meaningful description of code file being uploaded." @change="handleDescChange" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-md p-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
					</div>
					<div class="flex items-center space-x-4">
						<input type="file" @change="handleFileChange"  accept="video/mkv,video/mp4, video/webm, video/ogg,image/png, image/jpeg, image/jpg, image/gif, image/webp,.js,.jsx,.pdf,.txt,.vue,.tsx,.ts,.md,.mdx" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
						<button type="submit" class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">Upload</button>
					</div>
				</form>
				<p v-if="message" class="text-green-600 font-medium mt-4">{{ message }}</p>
			</div>

			<!-- Read Files Section -->
			<div class="bg-white shadow-md rounded-lg p-6">
				<ReadFiles />
			</div>
		</div>
	<!-- </div> -->
</template>
