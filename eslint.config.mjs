import config from '@lusc/eslint-config';

export default [
	...config,
	{
		rules: {
			'unicorn/max-nested-calls': 'off',
		},
		files: ['test/**/*.ts'],
	},
];
