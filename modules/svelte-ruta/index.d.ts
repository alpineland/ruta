import { SvelteComponent } from 'svelte/internal';
import { Ruta } from 'ruta-core';

export * from 'ruta-core';

export class SvelteRuta extends Ruta<SvelteComponent> {}
