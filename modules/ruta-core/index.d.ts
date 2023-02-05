import { Navigation, RutaOptionsWithEl, RutaOptionsWithHref } from './$types';

export class Ruta<Comp = unknown> {
	/** The navigation that is triggered **from**. */
	protected from: Navigation;
	/** The navigation that is triggered **to**. */
	protected to: Navigation;
	constructor(opts: RutaOptionsWithEl<Comp>);
	constructor(opts: RutaOptionsWithHref<Comp>);

	/**
	 * Initialize the router, will resolve to initial URL only once.
	 */
	init(): Promise<void>;

	/**
	 * Navigate to the specified URL.
	 *
	 * @param url could be URL instance, relative url, absolute url. Must not start with URL origin.
	 * @param replace `replaceState` or `pushState`.
	 */
	goto(url: URL | string, replace?: boolean): Promise<void>;
}
