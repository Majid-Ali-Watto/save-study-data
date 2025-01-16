<template>
	<div class="container mx-auto pt-4 rounded mt-4 min-h-screen">
		<h3 class="flex justify-between items-center flex-wrap">
			<strong class="italic underline">{{ title }}</strong>
			<pre>{{ createdAt ? new Date(createdAt).toDateString() : "" }}</pre>
			<button @click="copyCode" class="border rounded text-white px-1">Copy</button>
		</h3>
		<pre class="overflow-auto bg-slate-800 p-4 rounded-md text-left text-sm leading-relaxed text-gray-300 whitespace-pre-wrap break-words">{{ code }}</pre>
	</div>
</template>

<script setup lang="ts">
	import { useCodeID } from "../../store/CodeId";

	const store = useCodeID();
	console.log(store.getCodeID._id, store.getCodeID.title, store.getCodeID.createdAt);
	const { _id, title, createdAt, code } = store.getCodeID;
	const route = useRoute();
	console.log(route.params.id);
	function copyCode() {
		try {
			if (!code) throw new Error(`Empty code can not be copied`);
			navigator.clipboard.writeText(code);
			alert(`Code copied successfully`);
		} catch (error: any) {
			alert(error.message);
		}
	}
</script>

<style scoped></style>
