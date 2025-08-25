module.exports = {
	extends: 'erb',
	root: true,
	plugins: ['unused-imports', 'simple-import-sort', '@typescript-eslint'],
	rules: {
		'no-console': 'off',
		'global-require': 'off',
		'import/no-dynamic-require': 'off',
		// A temporary hack related to IDE not resolving correct package.json
		'import/no-extraneous-dependencies': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-filename-extension': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'import/no-import-module-exports': 'off',
		// '@typescript-eslint/no-floating-promises': 'error',
		'unused-imports/no-unused-imports': 'error',
		'simple-import-sort/exports': 'error',
		'promise/no-callback-in-promise': 'off',
		'no-void': ['error', { allowAsStatement: true }],
		'react/no-unescaped-entities': 'off',
		'class-methods-use-this': 'off',
		'promise/catch-or-return': 'off',
		'import/prefer-default-export': 'off',
		'react/jsx-props-no-spreading': 'off',
		'promise/always-return': 'off',
		'no-underscore-dangle': ['error', { allow: ['_unknown'] }],
		'no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
		'prettier/prettier': ['error'],
		'react/require-default-props': 'off',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// "react" should always show first
					['^(react)$'],
					// All 3rd - party imports
					['^(?!(app\\/)|(.*.scss)|(\\.)).*$'],
					// SCSS files
					['^.*.scss$'],
					// local absolute imports
					['^(app\\/).*$'],
					// local relative imports
					['^\\.'],
				],
			},
		],
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: ['./tsconfig.json'],
		tsconfigRootDir: __dirname,
		createDefaultProgram: true,
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
	},
};