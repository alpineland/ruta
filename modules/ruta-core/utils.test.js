import { flat_routes, normalise_base } from './utils.js';
// import { describe, test, assert } from 'vitest';

// describe('normalise_base', () => {
// 	test('base', () => {
// 		const res = normalise_base('base');
// 		assert.deepEqual(res, 'base/');
// 	});

// 	test('path/subpath', () => {
// 		const res = normalise_base('path/subpath');
// 		assert.deepEqual(res, 'path/subpath/');
// 	});

// 	test('throw error', () => {
// 		assert.throws(
// 			() => normalise_base('/base'),
// 			'"base" should not start and end with "/".',
// 		);
// 		assert.throws(
// 			() => normalise_base('base/'),
// 			'"base" should not start and end with "/".',
// 		);
// 		assert.throws(
// 			() => normalise_base('/base/'),
// 			'"base" should not start and end with "/".',
// 		);
// 	});
// });

/** @type {import('./$types').RouteConfig[]} */
const routes = [
	{
		pattern: '/',
		layout: 0,
		error: 1,
		page: 2,
		children: [
			{
				pattern: '/child',
				layout: 3,
				error: 4,
				page: 5,
				children: [
					{
						pattern: {
							pathname: '/grandchild',
							hash: 'abc',
						},
						layout: 6,
						error: 7,
						page: 8,
					},
				],
			},
		],
	},
	{
		pattern: '/sibling',
		layout: 9,
		error: 10,
		page: 11,
		children: [
			{
				pattern: '/sib-child',
				layout: 12,
				error: 13,
				page: 14,
				children: [
					{
						pattern: {
							pathname: '/sib-grandchild',
							hash: 'def',
						},
						layout: 15,
						error: 16,
						page: 17,
					},
				],
			},
		],
	},
];

const res = flat_routes(routes);

console.log(res);
