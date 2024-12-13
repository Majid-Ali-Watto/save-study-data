<template>
	<Teleport to="body">
		<dialog ref="dialog" class="fixed overflow-hidden z-auto w-[85%] h-[90%] bg-slate-800 text-white rounded-md" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-content">
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

	const dialog = ref<HTMLDialogElement | null>(null);

	watch(
		() => props.isVisible,
		(newVal) => {
			if (dialog.value) {
				if (newVal) {
					dialog.value.showModal();
				} else {
					dialog.value.close();
				}
			}
		}
	);

	onMounted(() => {
		console.log(props);
	});

	const emit = defineEmits(["close"]);

	function closeModal() {
		emit("close");
	}
</script>
