<script lang="ts">
	import '@fontsource/inter';

    import { setContext } from 'svelte';

	import { type ObsStore, createObsStore } from './lib/obs';
	import Switcher from './lib/Switcher.svelte';
	import Settings from './lib/Settings.svelte';

    import { createLocalStore } from './lib/local';

	const localStore = createLocalStore();

	let obsStore: ObsStore;

	setContext( 'local', localStore );

	async function onSettingsConnect( event: CustomEvent<{ url: string, password: string }> ) {
		obsStore = await createObsStore( event.detail.url, event.detail.password );
	}
</script>

{#if obsStore}
	<Switcher {obsStore} />
{:else}
	<Settings on:connect={onSettingsConnect} />
{/if}

<main />
