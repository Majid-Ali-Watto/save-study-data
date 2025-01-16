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
				console.log("opening modal");
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
		try {
			if (!fileName) {
				throw new Error("Please select a file to download.");
			}
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
		} catch (error: any) {
			console.error(error);
			message.value = error.message || "Error downloading file.";
		} finally {
			const textColor = message.value != "File downloaded successfully." ? "red" : "green";
			showModal("Download Status", `<pre style="color:${textColor} !important;">${escapeHtml(message.value)}</pre>`);
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
		<div class="text-slate-300 font-bold flex justify-between items-center flex-wrap">
			<header v-if="filteredFiles.length > 0">All Files</header>
			<!-- <input v-model="query" id="title" type="search" name="search" placeholder="Search files..." class="text-slate-700 font-normal mt-1 p-1 block outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm" required /> -->
			<div>
				<div class="relative max-w-md mx-auto mb-2">
					<input v-model="query" type="search" placeholder="Search files..." class="w-full text-slate-700 font-normal p-1 pl-10 rounded-lg border shadow-md focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all" required />
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 text-gray-500 absolute left-3 top-3">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M16.92 10.74a6.75 6.75 0 11-9.54-9.54 6.75 6.75 0 019.54 9.54z" />
					</svg>
				</div>
			</div>
		</div>
		<!-- List of files available for download -->
		<Modal @close="closeModal" :title="modalTitle" :code="modalContent" :isVisible="isModalVisible" />
		<div v-if="filteredFiles.length > 0">
			<div v-for="file in filteredFiles" :key="file.filename">
				<div class="flex flex-col border rounded mb-4">
					<div class="p-[8px] text-slate-300 italic text-justify overflow-auto">{{ file.description }}</div>
					<div class="flex justify-between items-center flex-wrap p-[10px] gap-2">
						<div class="flex gap-x-[15px] justify-between font-medium overflow-auto">
							<span class="text-slate-300 border p-1 rounded">{{ file.filename }}</span>
							<span class="text-slate-300 border p-1 rounded">{{ formatSize(file.size) }}</span>
							<span class="text-slate-300 border p-1 rounded">{{ file.contentType }}</span>
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
