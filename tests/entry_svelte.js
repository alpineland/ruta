/// <reference types="svelte" />

import { SvelteRuta, flat_routes } from 'svelte-ruta';
import MatchedRoutes from 'svelte-ruta/components/MatchedRoutes.svelte';

const routes = flat_routes([
	{
		pattern: '/',
		layout: () => import('./index/svelte/+layout.svelte'),
		error: () => import('./index/svelte/+error.svelte'),
		page: () => import('./index/svelte/+page.svelte'),
	},
	{
		pattern: '/error',
		layout: () => import('./index/svelte/+layout.svelte'),
		page: () => import('./index/svelte/+error.svelte'),
	},
]);

const el = /** @type {HTMLElement} */ (document.getElementById('svelte'));
const router = new SvelteRuta({ routes, el });

await router.init();

new MatchedRoutes({
	target: el,
	props: { router },
});
