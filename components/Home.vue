<template>
	<div class="container mx-auto p-4">
		<input v-model="query" id="title" type="search" name="search" placeholder="Search code..." class="text-slate-700 mt-1 p-1 block outline-none rounded-sm border-gray-200 border-2 shadow-sm focus:border-lime-200 focus:ring-lime-300 sm:text-sm" required />

		<ul class="grid overflow-hidden grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<li v-for="link in filteredLinks" :key="link._id" class="p-4 bg-white lg:h-44 shadow-lg rounded-lg border hover:shadow-2xl transition-shadow">
				<a :href="link.link" target="_blank" rel="noopener noreferrer" :aria-label="`Open ${link.title} in a new tab`" class="block">
					<h1 class="font-bold text-lime-600 text-lg mb-2 hover:underline">
						{{ link.title }}
					</h1>
				</a>
				<p v-for="desc in link.description.split('\n')" :key="desc" class="text-gray-700 text-sm mb-2">
					{{ desc }}
				</p>
				<p class="text-gray-500 text-xs">Saved: {{ new Date(link.createdAt).toLocaleDateString() }}</p>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	const query = ref<string>("");
	// Define the interface for the Link type
	interface Link {
		link: string;
		title: string;
		_id: string;
		createdAt: string;
		description: string;
	}

	// Use defineProps to accept a typed links prop
	const props = defineProps<{
		links: Link[];
	}>();
	const filteredLinks = computed(() => {
		return props.links.filter((file) => file.title.toLocaleLowerCase().includes(query.value.toLocaleLowerCase()) || file.description.toLocaleLowerCase().includes(query.value.toLocaleLowerCase()));
	});
</script>
