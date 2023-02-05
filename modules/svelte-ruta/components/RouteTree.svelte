<script context="module">
	const DEPTH_KEY = Symbol();
</script>

<script>
	import { getContext, setContext } from 'svelte';

	/** @type {import('svelte/internal').SvelteComponent[]} */
	export let components;

	const depth = getContext(DEPTH_KEY) || 0;

	$: has_children = depth + 1 < components.length;

	setContext(DEPTH_KEY, depth + 1);
</script>

{#if has_children}
	<svelte:component this={components[depth]}>
		<svelte:self {components} />
	</svelte:component>
{:else}
	<svelte:component this={components[depth]} />
{/if}
