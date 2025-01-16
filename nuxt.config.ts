// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
	css: ["./assets/main.css"],
	routeRules: {
		// Homepage pre-rendered at build time
		"/": { prerender: true },
		// CodeFiles renders only on client-side
		"/CodeFiles": { ssr: false },
		// Add cors headers on API routes
		"/api/**": { cors: true }
	},
	// this transition is causing issues. To be fixed later.
	app: {
		// 	pageTransition: {
		// 		name: "fade",
		// 		mode: "out-in" // default
		// 	},
		// 	layoutTransition: {
		// 		name: "slide",
		// 		mode: "out-in" // default
		// 	},
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1"
		}
	}
});
