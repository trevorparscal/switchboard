<script lang="ts">
	import { getContext, createEventDispatcher } from 'svelte';
	import { PlugZapIcon, VideoIcon, XIcon } from 'lucide-svelte';

	import type { LocalStore } from './local';
    import Tooltip from './Tooltip.svelte';

	const dispatch = createEventDispatcher<{ connect: { url: string, password: string } }>();
	const localStore = getContext<LocalStore>( 'local' );

	let url = $localStore.connectionUrl;
	let password = $localStore.connectionPassword;

	function onConnectClick() {
		dispatch( 'connect', { url, password } );
	}

	function onInputChange() {
		localStore.setConnectionSettings( url, password );
	}
</script>

<div class="settings">
	<div class="title">
		<VideoIcon size="2rem" />
		Switchboard
	</div>
	<div class="form">
		<input
			placeholder="URL"
			class="input"
			type="text"
			id="url"
			on:change={onInputChange}
			bind:value={url}
		/>
		<input
			placeholder="Password"
			class="input"
			type="password"
			id="password"
			on:change={onInputChange}
			bind:value={password}
		/>
		<div>
			<Tooltip text="Connect" position="bottom">
				<button class="button" on:click={onConnectClick}>
					<PlugZapIcon size="2rem" strokeWidth="1.5px" />
				</button>
			</Tooltip>
		</div>
	</div>
</div>

<style>
	.settings {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 15rem;
		background: #333;
		color: inherit;
		border: none;
		border-radius: 1rem;
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2rem;
	}
	.settings::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
	.title {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		user-select: none;
	}
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.input {
		width: 100%;
		padding: 0.5rem 1rem;
		box-sizing: border-box;
		border: solid 2px transparent;
		border-radius: 1.5rem;
		background: #555;
		color: inherit;
		font-size: inherit;
		transition: all 150ms ease-in-out;
	}
	.input:focus {
		outline: none;
		border-color: #666;
	}
	.button {
		padding: 1rem;
		aspect-ratio: 1/1;
		box-sizing: border-box;
		border: solid 2px transparent;
		border-radius: 100%;
		background: rgb(45, 228, 139);
		color: #000;
		font-size: inherit;
		transition: all 150ms ease-in-out;
		user-select: none;
	}
	.button:focus {
		outline: none;
		border-color: rgb(122, 255, 191);;
	}
	.button:active {
		background-color: #111;
	}
</style>
