<template>
	<div class="container mx-auto pt-4">
		<ul class="flex flex-wrap gap-y-8">
			<li v-for="code in codes" :key="code._id" class="p-6 bg-slate-900 text-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300 w-full">
				<div class="flex justify-between flex-wrap">
					<h1 class="font-semibold text-lime-500 text-xl mb-2 hover:underline cursor-pointer">
						{{ code.title }}
					</h1>
					<span class="block text-gray-400 text-sm mb-4"> Saved: {{ new Date(code.createdAt).toLocaleDateString() }} </span>
				</div>
				<pre class="overflow-auto bg-slate-800 p-4 rounded-md text-left text-sm text-gray-200 whitespace-pre-wrap break-words">{{ code.code?.trimStart() || "" }}</pre
				>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	// Define the interface for the Code type
	interface Code {
		code: string;
		title: string;
		_id: string;
		createdAt: string;
	}

	// Use defineProps to accept a typed codes prop
	defineProps<{
		codes: Code[];
	}>();
</script>
