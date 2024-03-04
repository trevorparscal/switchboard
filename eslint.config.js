// 'plugin:svelte/recommended'
import stylisticPlugin from '@stylistic/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

/** @type {import('eslint').Linter.FlatConfig[ 'rules' ]} */
const rules = {
	// ESLint Stylistic Rules
	// {@link https://eslint.style/packages/default Rules Documentation}
	'@stylistic/array-bracket-newline': [ 'error', 'consistent' ],
	'@stylistic/array-bracket-spacing': [ 'error', 'always' ],
	'@stylistic/array-element-newline': [ 'off' ],
	'@stylistic/arrow-parens': [ 'error', 'always' ],
	'@stylistic/arrow-spacing': [ 'error', { before: true, after: true } ],
	'@stylistic/block-spacing': [ 'error', 'always' ],
	'@stylistic/brace-style': [ 'error', '1tbs' ],
	'@stylistic/comma-dangle': [ 'error', 'never' ],
	'@stylistic/comma-spacing': [ 'error', { before: false, after: true } ],
	'@stylistic/comma-style': [ 'error', 'last' ],
	'@stylistic/computed-property-spacing': [ 'error', 'always' ],
	'@stylistic/dot-location': [ 'error', 'property' ],
	'@stylistic/eol-last': 'error',
	'@stylistic/func-call-spacing': 'error',
	'@stylistic/function-call-argument-newline': [ 'error', 'consistent' ],
	'@stylistic/function-call-spacing': [ 'error', 'never' ],
	'@stylistic/function-paren-newline': [ 'error', 'consistent' ],
	'@stylistic/generator-star-spacing': [ 'error', 'both' ],
	'@stylistic/implicit-arrow-linebreak': [ 'error', 'beside' ],
	'@stylistic/indent': [ 'error', 'tab', { SwitchCase: 1 } ],
	'@stylistic/key-spacing': [ 'error', { beforeColon: false, afterColon: true } ],
	'@stylistic/keyword-spacing': [ 'error', { before: true } ],
	'@stylistic/linebreak-style': [ 'error', 'unix' ],
	'@stylistic/lines-around-comment': 'off',
	'@stylistic/lines-between-class-members': 'off',
	'@stylistic/max-len': [
		'warn',
		{
			code: 100,
			tabWidth: 4,
			ignorePattern: '^[\\s]*(//|<!--) (es|style)lint-.+',
			ignoreUrls: true,
			ignoreComments: false,
			ignoreRegExpLiterals: true,
			ignoreStrings: true,
			ignoreTemplateLiterals: true
		}
	],
	'@stylistic/max-statements-per-line': [ 'error', { max: 1 } ],
	'@stylistic/multiline-ternary': [ 'error', 'always-multiline' ],
	'@stylistic/new-parens': [ 'error', 'always' ],
	'@stylistic/newline-per-chained-call': [ 'error' ],
	'@stylistic/no-confusing-arrow': [ 'off' ],
	'@stylistic/no-extra-parens': [ 'off' ],
	'@stylistic/no-extra-semi': 'error',
	'@stylistic/no-floating-decimal': 'error',
	'@stylistic/no-mixed-operators': 'error',
	'@stylistic/no-mixed-spaces-and-tabs': 'error',
	'@stylistic/no-multi-spaces': 'error',
	'@stylistic/no-multiple-empty-lines': [ 'error', { max: 1, maxBOF: 0, maxEOF: 0 } ],
	'@stylistic/no-tabs': [ 'off' ],
	'@stylistic/no-trailing-spaces': 'error',
	'@stylistic/no-whitespace-before-property': 'error',
	'@stylistic/nonblock-statement-body-position': [ 'error', 'beside' ],
	'@stylistic/object-curly-newline': [ 'error', { consistent: true } ],
	'@stylistic/object-curly-spacing': [ 'error', 'always' ],
	'@stylistic/object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true } ],
	'@stylistic/one-var-declaration-per-line': 'off',
	'@stylistic/operator-linebreak': [ 'error', 'after' ],
	'@stylistic/padded-blocks': [ 'error', 'never' ],
	'@stylistic/padding-line-between-statements': 'off',
	'@stylistic/quote-props': [ 'error', 'as-needed' ],
	'@stylistic/quotes': [ 'error', 'single', { avoidEscape: true } ],
	'@stylistic/rest-spread-spacing': [ 'error', 'never' ],
	'@stylistic/semi': [ 'error', 'always' ],
	'@stylistic/semi-spacing': [ 'error', { before: false, after: true } ],
	'@stylistic/semi-style': [ 'error', 'last' ],
	'@stylistic/space-before-blocks': [ 'error', 'always' ],
	'@stylistic/space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never' } ],
	'@stylistic/space-in-parens': [ 'error', 'always', { exceptions: [ 'empty' ] } ],
	'@stylistic/space-infix-ops': 'error',
	'@stylistic/space-unary-ops': [ 'error', { words: true, nonwords: false } ],
	'@stylistic/spaced-comment': [ 'error', 'always', { exceptions: [ '*', '!' ], block: { balanced: true } } ],
	'@stylistic/switch-colon-spacing': [ 'error', { after: true, before: false } ],
	'@stylistic/template-curly-spacing': [ 'error', 'never' ],
	'@stylistic/template-tag-spacing': [ 'error', 'always' ],
	'@stylistic/wrap-iife': [ 'error', 'outside' ],
	'@stylistic/wrap-regex': 'error',
	'@stylistic/yield-star-spacing': [ 'error', 'both' ],
	'@stylistic/member-delimiter-style': [
		'error',
		{
			multiline: {
				delimiter: 'comma',
				requireLast: false
			},
			singleline: {
				delimiter: 'comma',
				requireLast: false
			},
			multilineDetection: 'brackets'
		}
	],
	'@stylistic/type-annotation-spacing': [
		'error',
		{ before: false, after: true, overrides: { arrow: { before: true, after: true } } }
	],

	// Core ESLint Rules
	// {@link https://eslint.org/docs/latest/rules/ Rules Documentation}
	'array-callback-return': 'error',
	'block-scoped-var': 'error',
	camelcase: [ 'error', { properties: 'always' } ],
	curly: [ 'error', 'all' ],
	'dot-notation': 'error',
	eqeqeq: 'error',
	'new-cap': [ 'error', { newIsCap: true, capIsNew: false, properties: true } ],
	'no-array-constructor': 'error',
	'no-bitwise': 'error',
	'no-caller': 'error',
	'no-constant-binary-expression': 'error',
	'no-constant-condition': [ 'error', { checkLoops: false } ],
	'no-empty': [ 'error', { allowEmptyCatch: true } ],
	'no-eval': 'error',
	'no-extend-native': 'error',
	'no-extra-bind': 'error',
	'no-extra-label': 'error',
	'no-implicit-coercion': [ 'error', { string: true, boolean: false, number: false } ],
	'no-implicit-globals': 'error',
	'no-label-var': 'error',
	'no-loop-func': 'error',
	'no-loss-of-precision': 'error',
	'no-new': 'error',
	'no-new-func': 'error',
	'no-new-object': 'error',
	'no-new-wrappers': 'error',
	'no-nonoctal-decimal-escape': 'error',
	'no-octal-escape': 'error',
	'no-proto': 'error',
	'no-prototype-builtins': 'error',
	'no-return-assign': 'error',
	'no-script-url': 'error',
	'no-self-compare': 'error',
	'no-sequences': 'error',
	'no-shadow': [ 'error', { hoist: 'all' } ],
	'no-shadow-restricted-names': 'error',
	'no-throw-literal': 'error',
	'no-undef-init': 'off',
	'no-underscore-dangle': 'error',
	'no-unmodified-loop-condition': 'error',
	'no-unneeded-ternary': [ 'error', { defaultAssignment: false } ],
	'no-unreachable-loop': 'error',
	'no-unused-expressions': 'error',
	'no-use-before-define': [ 'error', {
		functions: false,
		classes: false,
		variables: false,
		allowNamedExports: false
	} ],
	'no-useless-call': 'error',
	'no-useless-concat': 'error',
	'no-void': 'error',
	'no-with': 'error',
	'prefer-numeric-literals': 'error',
	'prefer-regex-literals': 'error',
	'unicode-bom': 'error',
	yoda: [ 'error', 'never' ]
};

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		files: [ 'src/**/*.ts', 'eslint.config.js', 'svelte.config.js', 'vite.config.ts' ],
		plugins: { '@stylistic': stylisticPlugin },
		languageOptions: { parser: typescriptParser },
		rules
	},
	{
		files: [ 'src/**/*.svelte' ],
		plugins: { '@stylistic': stylisticPlugin, svelte: sveltePlugin },
		processor: 'svelte/svelte',
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: typescriptParser,
				project: [ './tsconfig.json' ],
				extraFileExtensions: [ '.svelte' ]
			}
		},
		rules
	},
	{ ignores: [ '.svelte-kit' ] }
];
