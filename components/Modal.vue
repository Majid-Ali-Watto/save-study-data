<template>
	<Teleport to="body">
		<dialog :open="isVisible" class="fixed overflow-hidden z-auto w-[85%] h-[90%] bg-slate-800 text-white rounded-md" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-content">
			<header id="modal-title" class="p-4 text-lg font-bold border-b border-gray-600 overflow-x-auto">
				{{ title }}
			</header>
			<main id="modal-content" class="p-4 h-[80%] overflow-auto" v-html="code"></main>
			<footer class="p-4 border-t border-gray-600 flex justify-end">
				<button @click="closeModal" class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">Close</button>
			</footer>
		</dialog>
	</Teleport>
</template>

<script setup lang="ts">
	import { onMounted } from "vue";
	const props = defineProps({
		title: {
			type: String,
			required: true
		},
		code: {
			type: String,
			required: true
		},
		isVisible: {
			type: Boolean,
			required: true
		}
	});

	onMounted(() => {
		window.scrollTo(0, 0);
		console.log(props);
	});
	// Declare the "close" event explicitly
	const emit = defineEmits(["close"]);

	// Emit the close event when the button is clicked
	function closeModal() {
		emit("close");
	}
</script>
