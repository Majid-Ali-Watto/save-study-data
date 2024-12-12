<script setup lang="ts">
	import { ref, onMounted } from "vue";
	// Modal state and properties
	const modalTitle = ref<string>("");
	const modalContent = ref<string>("");
	const isModalVisible = ref<boolean>(false);
	const query = ref<string>("");
	type FileType = { filename: string; contentType: string; size: number; description: string };
	// Define refs for storing the list of files, the selected filename, and message
	const files = ref<FileType[]>([]);
	const message = ref<string>("");

	// Fetch the list of available files from the server when the component mounts
	onMounted(async () => {
		try {
			const response = await fetch("/api/read-files");
			const res = await response.json();
			console.log(res);
			if (!response.ok) {
				throw res.message;
			}

			// Parse the file list response
			files.value = res.files;
		} catch (error: any) {
			message.value = error;
		}
	});
	const filteredFiles = computed(() => {
		return files.value.filter((file) => file.filename.toLocaleLowerCase().includes(query.value.toLocaleLowerCase()) || file.description.toLocaleLowerCase().includes(query.value.toLocaleLowerCase()));
	});
	// const previewFile = async (fileName: string): Promise<void> => {
	// 	if (!fileName) {
	// 		message.value = "Please select a file to preview.";
	// 		return;
	// 	}

	// 	try {
	// 		const response = await fetch(`/api/read-file?filename=${encodeURIComponent(fileName)}`);

	// 		if (!response.ok) {
	// 			throw new Error("Failed to fetch file.");
	// 		}

	// 		// Get the binary data
	// 		const blob = await response.blob();

	// 		// Detect content type
	// 		const contentType = response.headers.get("Content-Type") || "";
	// 		console.log("🚀 -> file: ReadFiles.vue:50 -> previewFile -> contentType:", contentType);
	// 		// Handle file preview based on type
	// 		if (contentType.startsWith("text/") || fileName.endsWith(".js") || fileName.endsWith(".jsx")) {
	// 			// Decode and show as text (JavaScript or Text)
	// 			const text = await blob.text();
	// 			showModal(fileName, `<pre>${escapeHtml(text)}</pre>`);
	// 		} else if (contentType === "application/octet-stream" || fileName.endsWith(".vue")) {
	// 			// Treat the file as a text file
	// 			const text = await blob.text();
	// 			showModal(fileName, `<pre>${escapeHtml(text)}</pre>`);

	// 		} else if (contentType === "application/pdf") {
	// 			// Show as embedded PDF
	// 			const pdfUrl = URL.createObjectURL(blob);
	// 			window.open(pdfUrl, "_blank");
	// 			// Cleanup URL after use
	// 			URL.revokeObjectURL(pdfUrl);
	// 		} else if (contentType.startsWith("image/")) {
	// 			const imageUrl = URL.createObjectURL(blob);
	// 			window.open(imageUrl, "_blank");
	// 			// After the modal is closed, revoke the object URL
	// 			URL.revokeObjectURL(imageUrl);
	// 		}
	// 		 else if (contentType.startsWith("video/")) {
	// 			const imageUrl = URL.createObjectURL(blob);
	// 			window.open(imageUrl, "_blank");
	// 			// After the modal is closed, revoke the object URL
	// 			URL.revokeObjectURL(imageUrl);
	// 		}
	// 		 else {
	// 			message.value = "Unsupported file type for preview.";
	// 		}
	// 	} catch (error) {
	// 		console.error(error);
	// 		message.value = "Error previewing file.";
	// 	}
	// };
	const previewFile = async (fileName: string): Promise<void> => {
		if (!fileName) {
			message.value = "Please select a file to preview.";
			return;
		}

		try {
			const response = await fetch(`/api/read-file?filename=${encodeURIComponent(fileName)}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch file: ${response.statusText}`);
			}

			const blob = await response.blob();
			const contentType = response.headers.get("Content-Type") || "";

			console.log("🚀 -> Content-Type detected:", contentType);

			if (contentType.startsWith("text/") || /\.(js|jsx|vue|txt|md|mdx)$/.test(fileName)) {
				// Handle text-based files
				const text = await blob.text();
				showModal(fileName, `<pre>${escapeHtml(text)}</pre>`);
			} else if (isNotText(contentType, fileName)) {
				// create blob url e.g blob:http://localhost:8080
				const url = URL.createObjectURL(blob);
				window.open(url, "_blank");
				// Clean up
				setTimeout(() => URL.revokeObjectURL(url), 1000); // Delay revoking the URL after a short period
			} else {
				message.value = "Unsupported file type for preview.";
			}
		} catch (error) {
			console.error("Error previewing file:", error);
			message.value = "Error previewing file. Please try again.";
		}
	};
	function isNotText(contentType: string, fileName: string) {
		return contentType === "application/pdf" || fileName.endsWith(".pdf") || contentType.startsWith("image/") || /\.(png|jpg|jpeg|gif|bmp|webp|svg)$/.test(fileName) || contentType.startsWith("video/") || /\.(mp4|webm|ogg|avi|mkv)$/.test(fileName);
	}
	const escapeHtml = (unsafe: string): string => {
		return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	};

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
		return `${size?.toFixed(2)} ${units[index]}`;
	};
	// Function to show the modal
	const showModal = (title: string, content: string): void => {
		modalTitle.value = title;
		modalContent.value = content;
		isModalVisible.value = true;
	};

	// Function to hide the modal
	const closeModal = (): void => {
		isModalVisible.value = false;
		modalTitle.value = "";
		modalContent.value = "";
	};
</script>
<template>
	<div>
		<div class="text-gray-600 font-bold flex justify-between flex-wrap">
			<header v-if="filteredFiles.length > 0">All Files</header>
			<input v-model="query" id="title" type="search" name="search" placeholder="Search files..." class="mt-1 p-1 block outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm" required />
		</div>
		<!-- List of files available for download -->
		<Modal @close="closeModal" :title="modalTitle" :code="modalContent" :isVisible="isModalVisible" />
		<div v-if="filteredFiles.length > 0" class="mt-5">
			<div v-for="file in filteredFiles" :key="file.filename">
				<div class="flex flex-col border rounded mb-1 bg-slate-100">
					<div class="p-[8px] text-gray-600 italic text-justify overflow-auto">{{ file.description }}</div>
					<div class="flex justify-between items-center flex-wrap p-[10px] gap-2">
						<div class="flex gap-x-[15px] justify-between font-medium overflow-auto">
							<span class="text-slate-700 bg-white border p-1 rounded">{{ file.filename }}</span>
							<span class="text-slate-600 bg-white border p-1 rounded">{{ formatSize(file.size) }}</span>
							<span class="text-slate-600 bg-white border p-1 rounded">{{ file.contentType }}</span>
						</div>
						<div class="flex justify-between gap-x-2">
							<!-- Download button for each file -->
							<button @click="downloadFile(file.filename)" class="download-btn">Download</button>
							<button @click="previewFile(file.filename)" class="download-btn">Preview</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- If no files are available -->
		<p v-if="filteredFiles.length === 0" class="file-name">No files available for download.</p>

		<!-- Display message to the user -->
		<p v-if="message" class="message">{{ message }}</p>
	</div>
</template>

<style scoped>
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
