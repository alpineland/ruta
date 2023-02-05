import { BROWSER, DEV } from 'esm-env';
import {
	ensure_trailing_slash,
	normalise_base,
	flat_routes,
	warn,
} from './utils.js';

export { Ruta, flat_routes };

/** @type {import('.').Ruta} */
class Ruta {
	/** @type {string} */
	#base;

	/**
	 * origin + base. Trailing slash is ensured.
	 *
	 * @type {string}
	 */
	#oribase;

	/** @type {import('./$types').ValidRouteConfig[]} */
	#routes;

	/** @type {import('./$types').ScrollFn | undefined} */
	#scroll;

	/** @type {boolean} */
	#ok = false;

	/** @param {import('./$types').RutaOptions} opts */
	constructor(opts) {
		if (!opts.routes) {
			throw new Error(`"routes" is required in router options.`);
		}

		if (BROWSER && !opts.el) {
			throw new Error(`"el" is required for browser.`);
		}

		if (!BROWSER && !opts.href) {
			throw new Error(`"href" is required in SSR.`);
		}

		this.#base = normalise_base(opts.base || '');

		/** @type {import('.').Ruta['to']} */
		this.to = this.from = {
			url: new URL(BROWSER ? opts.href || location.href : opts.href),
			params: {},
			meta: {},
		};

		this.#routes = opts.routes;
		this.#oribase = this.to.url.origin + this.#base;

		if (BROWSER) {
			history.scrollRestoration = 'manual';
			this.#scroll = opts.scroll;

			addEventListener('click', (/** @type {MouseEvent} */ e) => {
				if (
					// ignore on modifier keys
					e.ctrlKey ||
					e.shiftKey ||
					e.altKey ||
					e.metaKey ||
					// ignore if already default prevented
					e.defaultPrevented ||
					// ignore if not left click
					e.button !== 0
				) {
					return;
				}

				const anchor = /** @type {HTMLElement} */ (e.target).closest('a');

				if (anchor) {
					const { href, target, relList, pathname, protocol, hostname } =
						anchor;

					if (
						!anchor.hasAttribute('download') &&
						!relList.contains('external') &&
						target !== '_blank' &&
						protocol === location.protocol &&
						hostname === location.hostname
					) {
						e.preventDefault();
						if (pathname !== location.pathname) this.goto(href);
					}
				}
			});
		}
	}

	async init() {
		if (this.#ok) return;
		this.#ok = true;
		await this.goto(this.to.url);
	}

	/** @type {import('.').Ruta['goto'] } */
	async goto(url, replace = false) {
		// relative url
		if (typeof url === 'string' && url.startsWith('.')) {
			// normalise as `/base/parent/sibling/../sibling/url`
			url = ensure_trailing_slash(this.from.url.pathname) + url;
		}

		this.to.url = url = new URL(url, this.#oribase);
		const pathname = url.pathname.replace(this.#base, '');

		await this.#match(pathname, url.hash);

		// navigation on browser
		if (BROWSER) {
			history[replace ? 'replaceState' : 'pushState'](
				null,
				'',
				this.#base + pathname + url.hash,
			);

			if (this.#scroll) {
				this.#scroll();
			} else {
				const el = url.hash && document.getElementById(url.hash.slice(1));
				if (el) el.scrollIntoView();
				else scrollTo(0, 0);
			}
		}
	}

	/**
	 * @param {string} pathname URL.pathname without base.
	 * @param {string} [hash] URL.hash for hash routing.
	 */
	async #match(pathname, hash) {
		for (const r of this.#routes) {
			const res = r.pattern.exec({ pathname, hash });
			if (res) {
				const comps = (await Promise.all([r.layout(), r.page()])).map(
					(v) => v.default,
				);

				this.to.params = Object.fromEntries(
					Object.entries(res.pathname.groups)
						.filter((v) => v[1])
						.map(([k, v]) => {
							if (v?.includes('/')) return [k, v.split('/')];
							return [k, v];
						}),
				);

				return;
			} else if (DEV) {
				warn(`unmatched route: ${pathname}${hash}`);
			}
		}
	}
}
