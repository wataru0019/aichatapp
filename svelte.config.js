// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true // Explicitly enable runes, though often default in Svelte 5
	  },
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// See below for an explanation of these options
			// config: undefined,
			// platformProxy: {
			// 	configPath: undefined,
			// 	environment: undefined,
			// 	persist: undefined
			// },
			// fallback: 'plaintext',
			// routes: {
			// 	include: ['/*'],
			// 	exclude: ['<all>']
			// }
		})
	}
};

export default config;
