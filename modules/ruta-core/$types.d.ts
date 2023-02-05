import type { URLPattern } from 'urlpattern-polyfill/dist/types';

/**
 * Define scrolling during navigation. Return a promise to delay the scrolling.
 */
export type ScrollFn = (to: URL, from: URL) => Promise<void> | void;

type WithEl = {
	/**
	 * An actual DOM element the app will mount into. This is required for apps
	 * embedded in other apps, and event listeners will be added on this element.
	 *
	 * @client
	 */
	el: HTMLElement;
};

type WithHref = {
	/**
	 * Initial URL to visit on the server. Must be a full string like
	 * `http://localhost:5173/ruta?svelte=R&vue=G&solid=B`
	 *
	 * @server
	 */
	href: string;
};

export type CommonRutaOptions<Comp = unknown> = {
	routes: ValidRouteConfig<Comp>[];
	base?: string;
	scroll?: ScrollFn;
};

export type RutaOptionsWithEl<Comp = unknown> = CommonRutaOptions<Comp> &
	WithEl;

export type RutaOptionsWithHref<Comp = unknown> = CommonRutaOptions<Comp> &
	WithHref;

export type RutaOptions<Comp = unknown> = RutaOptionsWithEl<Comp> &
	RutaOptionsWithHref<Comp>;

export type Navigation = {
	/** Current URL. */
	url: URL;
	/** All route parameters (including nested routes) of the current URL. */
	params: Record<string, string | string[]>;
	/**
	 * Metadata for the current URL. Already merged with parents.
	 * Child metadata always take priority.
	 */
	meta?: RouteMeta;
};

/**
 * The interface of the current route.
 */
export interface Route<Comp = unknown> {
	/**
	 * Current URL.
	 */
	url: URL;
	/**
	 * All route parameters (including nested routes) of the current URL.
	 */
	params: Record<string, string | string[]>;
	/**
	 * Components to render for the current URL.
	 */
	components: Comp[];
	/**
	 * Metadata for the current URL. Already merged with parents.
	 * Child metadata always take priority.
	 */
	meta?: RouteMeta;
}

/**
 * The route config for individual component.
 */
export interface RouteConfig<Comp = unknown> {
	pattern: RoutePattern;
	page: Comp;
	layout: Comp;
	error: Comp;
	children?: RouteConfig<Comp>[];
	meta?: RouteMeta;
	redirect_from_pattern?: RoutePattern;
}

/**
 * Internal resolved route config.
 */
export interface ValidRouteConfig<Comp = unknown> {
	pattern: URLPattern;
	page: Comp;
	layout?: Comp;
	error?: Comp;
	redirect?: URLPattern;
}

/**
 * The pattern of the route config.
 */
export type RoutePattern = string | { pathname: string; hash: string };

/**
 * Metadata for the route.
 */
export interface RouteMeta extends Record<string | number | symbol, unknown> {}
