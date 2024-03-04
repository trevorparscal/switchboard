<script lang="ts">
    import { setContext, getContext } from 'svelte';
	import { CircleIcon, DotIcon } from 'lucide-svelte';

	import type { LocalStore } from './local';
	import type { ObsStore } from './obs';
    import { createAppStore } from './app';
    import Toolbar from './Toolbar.svelte';
	import ProgressIcon from './ProgressIcon.svelte';

	export let obsStore: ObsStore;

	const localStore = getContext<LocalStore>( 'local' );
	const appStore = createAppStore( obsStore, localStore );

	setContext( 'obs', obsStore );
	setContext( 'app', appStore );

	function onSceneClick( event: MouseEvent, sceneName: string ) {
		if ( $appStore.selecting ) {
			if ( $localStore.includedSceneNames.includes( sceneName ) ) {
				localStore.excludeScene( sceneName );
			} else {
				localStore.includeScene( sceneName );
			}
		} else {
			if ( $obsStore.nextScene === sceneName ) {
				obsStore.triggerTransition();
			} else {
				obsStore.setNextScene( sceneName );
			}
		}
	}
</script>

<div class="switcher" class:selecting={$appStore.selecting} class:cycling={$appStore.cycling}>
	<div class="scenes">
		{#each $obsStore.scenes as { sceneName, sceneIndex } ( sceneIndex )}
			{@const included = $localStore.includedSceneNames.includes( sceneName )}
			{@const current = $obsStore.currentScene === sceneName}
			{@const next = $obsStore.nextScene === sceneName}
			{@const transitioning = $obsStore.sceneIsTransitioning && ( next || current )}
			{#if !$appStore.filter || included}
				<button
					class="scene"
					class:current
					class:next
					class:included
					class:transitioning
					on:click={( event ) => onSceneClick( event, sceneName )}
				>
					<div
						class="scene-image"
						style:background-image={`url(${$obsStore.sceneImages[ sceneName ]})`}
					/>
					<div class="scene-title">{sceneName}</div>
					<div class="scene-control">
						<span class="scene-indicator">
							<DotIcon />
						</span>
						<div class="scene-progress">
							{#if current && $appStore.cycling}
								<ProgressIcon value={1 - $appStore.cycleProgress} />
							{:else if current || transitioning}
								<CircleIcon />
							{/if}
						</div>
					</div>
				</button>
			{/if}
		{/each}
	</div>
	<Toolbar />
</div>

<style>
	.switcher {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: auto;
		aspect-ratio: 16 / 10;
		background-color: #444;
	}
	.scenes {
		position: absolute;
		top: 9%;
		left: 0;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 0.25rem;
		padding: 0.25rem;
		box-sizing: border-box;
		overflow-y: auto;
	}
	.scene {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		margin: 0;
		padding: 0;
		user-select: none;
	}
	.switcher.selecting .scene:not(.included) .scene-image {
		opacity: 0.25;
	}
	.scene.current .scene-image {
		box-shadow: inset 0 0 0 0.25rem rgb(255, 12, 49);
	}
	.scene.next .scene-image {
		box-shadow: inset 0 0 0 0.25rem rgb(45, 228, 139);
	}
	.scene.current.next .scene-image {
		box-shadow: inset 0 0 0 0.25rem rgb(255, 12, 49), inset 0 0 0 0.5rem rgb(45, 228, 139);
	}
	.scene-control,
	.scene-title {
		position: absolute;
		background-color: rgba(38,38,38,0.75);
		backdrop-filter: blur(0.25rem);
		color: white;
		border-radius: 2rem;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.scene-title {
		bottom: 1rem;
		left: 50%;
		transform: translateX( -50% );
		padding: 0.25rem 1rem;
	}
	.scene-control {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		padding: 0.25rem;
	}
	.scene-indicator {
		transition: opacity 150ms ease-in-out;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		opacity: 0;
	}
	.scene-progress {
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		transition: color 150ms ease-in-out;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 1;
	}
	.scene.included .scene-indicator {
		opacity: 1;
	}
	.scene.next .scene-control {
		color: rgb(45, 228, 139);
	}
	.scene.current .scene-control {
		color: rgb(255, 12, 49);
	}
	.scene.next.transitioning .scene-progress {
		animation: pulse 500ms ease-in-out infinite;
	}
	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.25;
		}
		100% {
			opacity: 1;
		}
	}
	.scene-image {
		aspect-ratio: 16 / 9;
		width: 100%;
		height: auto;
		background-size: cover;
		transition: box-shadow 300ms ease-in-out, opacity 150ms ease-in-out;
	}
</style>
