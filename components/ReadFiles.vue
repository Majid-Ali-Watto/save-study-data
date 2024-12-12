<script setup lang="ts">
	import { ref, onMounted } from "vue";

	// Define refs for storing the list of files, the selected filename, and message
	const files = ref<{ filename: string; contentType: string; length: number }[]>([]);
	const message = ref<string>("");

	// Fetch the list of available files from the server when the component mounts
	onMounted(async () => {
		try {
			const response = await fetch("/api/read-files");

			if (!response.ok) {
				throw new Error("Failed to fetch files");
			}

			// Parse the file list response
			files.value = await response.json();
		} catch (error) {
			console.error(error);
			message.value = "Error loading file list.";
		}
	});

	// Function to handle downloading a selected file
	const downloadFile = async (fileName: string): Promise<void> => {
		if (!fileName) {
			message.value = "Please select a file to download.";
			return;
		}

		try {
			const response = await fetch(`/api/read-file?filename=${encodeURIComponent(fileName)}`);
			console.log(response);
			if (!response.ok) {
				throw new Error("Failed to download file");
			}

			// Create a blob and trigger download
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.download = fileName; // Set the filename for downloading
			link.click();

			URL.revokeObjectURL(url); // Clean up the blob URL
			message.value = "File downloaded successfully.";
		} catch (error) {
			console.error(error);
			message.value = "Error downloading file.";
		}
	};
	// Format file size from bytes to a human-readable format
	const formatSize = (bytes: number): string => {
		const units = ["bytes", "KB", "MB", "GB", "TB"];
		let index = 0;
		let size = bytes;
		while (size >= 1024 && index < units.length - 1) {
			size /= 1024;
			index++;
		}
		return `${size.toFixed(2)} ${units[index]}`;
	};
</script>
<template>
	<div>
		<h1>Download Files</h1>

		<!-- List of files available for download -->
		<div v-if="files.length > 0" class="file-list">
			<div v-for="file in files" :key="file.filename" class="file-item">
				<div class="file-info">
					<span class="file-name">{{ file.filename }}</span>
					<span class="file-size">{{ formatSize(file.length) }}</span>
					<span class="file-type">{{ file.contentType }}</span>
				</div>
				<!-- Download button for each file -->
				<button @click="downloadFile(file.filename)" class="download-btn">Download</button>
			</div>
		</div>

		<!-- If no files are available -->
		<p v-if="files.length === 0">No files available for download.</p>

		<!-- Display message to the user -->
		<p v-if="message" class="message">{{ message }}</p>
	</div>
</template>

<style scoped>
	.file-list {
		margin-top: 20px;
	}

	.file-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border: 1px solid #ccc;
		margin-bottom: 10px;
		border-radius: 5px;
		background-color: #f9f9f9;
	}

	.file-info {
		display: flex;
		gap: 15px;
		font-weight: bold;
	}

	.file-name {
		color: #333;
	}

	.file-size,
	.file-type {
		color: #666;
	}

	.download-btn {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 5px 15px;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s;
	}

	.download-btn:hover {
		background-color: #0056b3;
	}

	.message {
		margin-top: 20px;
		color: #28a745;
		font-weight: bold;
	}
</style>
