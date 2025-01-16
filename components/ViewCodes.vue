<template>
	<div class="container mx-auto pt-4 rounded mt-4 min-h-screen">
		<!-- Search Bar -->
		<div class="relative max-w-md mx-auto mb-2">
			<input v-model="query" type="search" placeholder="Search code snippets..." class="w-full text-gray-800 p-1 pl-10 rounded-lg border shadow-md focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all" required />
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 text-gray-500 absolute left-3 top-3">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M16.92 10.74a6.75 6.75 0 11-9.54-9.54 6.75 6.75 0 019.54 9.54z" />
			</svg>
		</div>

		<!-- Code Snippets List -->
		<ul class="flex flex-wrap gap-6">
			<li v-for="code in filteredCode" :key="code._id" @click="() => readCode(code)" class="p-0 lg:p-6 md:p-6 w-full">
				<div class="flex justify-between items-center flex-wrap gap-x-1">
					<h1 class="font-semibold text-gray-300 text-lg leading-tight hover:underline cursor-pointer truncate" :title="code.title">
						{{ code.title }}
					</h1>
					<span class="text-gray-400 text-sm">Saved: {{ new Date(code.createdAt).toLocaleDateString() }}</span>
				</div>
				<pre class="overflow-auto bg-slate-800  p-4 rounded-md text-left text-sm leading-relaxed text-gray-300"
					>{{ code.code?.trimStart() || "" }}
				</pre
				>
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
	import { useCodeID } from "../store/CodeId";

	// Define the interface for the Code type
	const router = useRouter();
	const store = useCodeID();
	interface Code {
		code: string;
		title: string;
		_id: string;
		createdAt: string;
	}

	const query = ref<string>("");
	// Use defineProps to accept a typed codes prop
	const props = defineProps<{
		codes: Code[];
	}>();
	const filteredCode = computed(() => props.codes.filter((code) => code.title.toLocaleLowerCase().includes(query.value)));
	function readCode(code: Code) {
		store.saveCodeID(code);
		router.push(`/codes/${code._id}`);
	}
</script>
<style scoped>
	input::placeholder {
		color: #9ca3af;
		font-style: italic;
	}

	input:focus::placeholder {
		color: transparent;
		transition: color 0.2s;
	}
</style>
