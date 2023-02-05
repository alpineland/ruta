import 'urlpattern-polyfill';
import { BROWSER, DEV } from 'esm-env';

export { ensure_trailing_slash, normalise_base, flat_routes, warn };

/** @param {string} base */
function normalise_base(base) {
	if (DEV && base && (base.startsWith('/') || base.endsWith('/'))) {
		throw new Error(`"base" must not start and end with "/".`);
	}

	if (BROWSER && base !== '' && !base) {
		const href = document.querySelector('base')?.getAttribute('href');
		base = href ? new URL(href).pathname : base;
	}

	return base;
}

/**
 * @template Comp
 * @param {import('./$types').RouteConfig<Comp>[]} routes
 * @returns {import('./$types').ValidRouteConfig<Comp>[]}
 */
function flat_routes(routes) {
	/** @type {import('./$types').ValidRouteConfig<Comp>[]} */
	const r = [];

	flat_children(r, routes, '');

	return r;
}

/**
 * @template Comp
 * @param {import('./$types').ValidRouteConfig<Comp>[]} routes
 * @param {import('./$types').RouteConfig<Comp>[]} children
 * @param {string} parent_path
 */
function flat_children(routes, children, parent_path) {
	for (const child of children) {
		const pattern = /** @type {URLPattern} */ (
			to_urlpattern(parent_path, child.pattern)
		);
		const redirect = to_urlpattern(parent_path, child.redirect_from_pattern);
		const { error, layout, page } = child;

		routes.push({ layout, error, page, pattern, redirect });

		if (child.children && child.children.length) {
			const pp =
				typeof child.pattern === 'string'
					? parent_path + child.pattern
					: parent_path + child.pattern.pathname;
			flat_children(routes, child.children, pp);
		}
	}
}

/**
 * @param {string} parent_path
 * @param {import('./$types').RoutePattern} [pattern]
 */
function to_urlpattern(parent_path, pattern) {
	if (pattern) {
		return typeof pattern === 'string'
			? new URLPattern({ pathname: parent_path + pattern })
			: new URLPattern({
					pathname: parent_path + pattern.pathname,
					hash: pattern.hash,
			  });
	}
}

/** @param {string} s */
function ensure_trailing_slash(s) {
	return s.endsWith('/') ? s : s + '/';
}

/**
 * @param {string} msg
 * @param  {any[]} args
 */
function warn(msg, ...args) {
	console.warn(`[ruta warn]: ${msg}`, ...args);
}
