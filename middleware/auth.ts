import type { RouteLocationNormalized } from "vue-router";

export default defineNuxtRouteMiddleware((to, from) => {
	// isAuthenticated() is an example method verifying if a user is authenticated
	if (isAuthenticated(to) === false) {
		return navigateTo("/");
	}
});

function isAuthenticated(to: RouteLocationNormalized): boolean {
	// if (to.path == "/Codes") return false;
	return true;
}
