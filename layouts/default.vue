<template>
	<div>
		<header class="fixed left-0 top-0 w-full box-border flex items-center bg-black text-white hover:bg-slate-900 transition ease-in-out delay-150">
			<Navbar />
		</header>
		<main class="overflow-auto mt-14">
			<slot />
		</main>
	</div>
</template>
