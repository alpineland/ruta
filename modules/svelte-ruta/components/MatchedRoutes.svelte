<script>
	import { onMount } from 'svelte';
	import RouteTree from './RouteTree.svelte';

	/** @type {import('svelte-ruta').SvelteRuta} */
	export let router;

	let mounted = false;
	/** @type {string | null} */
	let title = null;

	const { route } = router;

	onMount(() => {
		mounted = true;
		title = document.title;
	});
</script>

<RouteTree components={$route.components} />

{#if mounted}
	<slot name="a11y">
		<div
			id="svelte-announcer"
			aria-live="assertive"
			aria-atomic="true"
			style="position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"
		>
			{title}
		</div>
	</slot>
{/if}
