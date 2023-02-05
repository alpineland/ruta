import { Ruta } from 'ruta-core';
import { writable } from 'svelte/store';

/**
 * @typedef {import('svelte/internal').SvelteComponent} SvelteComponent
 */

export { SvelteRuta };
export * from 'ruta-core';

/**
 * @extends {Ruta<SvelteComponent>}
 */
class SvelteRuta extends Ruta {
	/** @type {import('svelte/store').Writable<import('svelte-ruta').Route<SvelteComponent>>} */
	#route;

	/** @param {import('ruta-core').RutaOptions<SvelteComponent>} opts */
	constructor(opts) {
		super(opts);
		this.#route = writable(this._route);
	}

	/**
	 * @returns {import('svelte/store').Readable<import('svelte-ruta').Route<SvelteComponent>>}
	 */
	get route() {
		return { subscribe: this.#route.subscribe };
	}
}
