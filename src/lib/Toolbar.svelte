<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import {
		EyeIcon,
		EyeOffIcon,
		FullscreenIcon,
		MinimizeIcon,
		MousePointerSquareDashedIcon,
		MousePointerSquareIcon,
		RefreshCwIcon,
		SquareSlashIcon,
		UnplugIcon,
		XSquareIcon
	} from 'lucide-svelte';

	import type { ObsStore } from './obs';
	import type { AppStore } from './app';
	import type { LocalStore } from './local';
    import Tooltip from './Tooltip.svelte';

	const obsStore = getContext<ObsStore>( 'obs' );
	const localStore = getContext<LocalStore>( 'local' );
	const appStore = getContext<AppStore>( 'app' );

	let fullscreen = false;

	function onCycleToggleClick() {
		if ( $appStore.cycling ) {
			appStore.stopCycling();
		} else {
			appStore.startCycling();
		}
	}

	function onToggleSelectButtonClick() {
		appStore.toggleSelecting();
	}

	function onToggleFilterButtonClick() {
		appStore.toggleFilter();
	}

	function onCyclingIntervalInput( event: Event ) {
		const input = event.target as HTMLInputElement;
		localStore.setCycleInterval( parseInt( input.value, 10 ) );
	}

	function onTransitionOptionClick( transitionName: string ) {
		obsStore.setTransition( transitionName );
	}

	function onTransitionDurationInput( event: Event ) {
		const input = event.target as HTMLInputElement;
		obsStore.setTransitionDuration( parseInt( input.value, 10 ) );
	}

	function onToggleFullscreenButtonClick() {
		if ( document.fullscreenElement ) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
	}

	function onFullScreenChange() {
		fullscreen = !!document.fullscreenElement;
	}

	function onDisconnectClick() {
		window.location.reload();
	}

	onMount( () => {
		document.addEventListener( 'fullscreenchange', onFullScreenChange );

		return () => {
			document.removeEventListener( 'fullscreenchange', onFullScreenChange );
		};
	} );
</script>
<div class="toolbar" class:selecting={$appStore.selecting} class:cycling={$appStore.cycling}>
	<span class="toolbar-section">
		<span class="toolbar-tool">
			<Tooltip text={$appStore.cycling ? 'Stop' : 'Start'} position="bottom">
				<button
					on:click={onCycleToggleClick}
					class:selected={$appStore.cycling}
					class="cycle-toggle"
				>
					<RefreshCwIcon />
				</button>
			</Tooltip>
		</span>
		<span class="toolbar-tool">
			<Tooltip text="Cycle Duration" position="bottom">
				<input
					type="range"
					min="1000"
					max="30000"
					step="100"
					value={$localStore.cycleInterval}
					on:input={onCyclingIntervalInput}
				/>
			</Tooltip>
			<span class="time-label">
				{Math.round( $localStore.cycleInterval / 100 ) / 10}s
			</span>
		</span>
		<span class="toolbar-tool">
			{#each $obsStore.transitions as transition}
				<Tooltip text={transition.transitionName} position="bottom">
					<button
						class="transition-option"
						class:selected={$obsStore.transitionName === transition.transitionName}
						on:click={() => onTransitionOptionClick( transition.transitionName )}
					>
						{#if transition.transitionKind === 'fade_transition'}
							<XSquareIcon />
						{:else}
							<SquareSlashIcon />
						{/if}
					</button>
				</Tooltip>
			{/each}
			{#if $obsStore.transitionKind === 'fade_transition'}
				<Tooltip text="Transition Duration" position="bottom">
					<input
						type="range"
						min="0"
						max="10000"
						step="100"
						value={$obsStore.transitionDuration}
						on:input={onTransitionDurationInput}
					/>
				</Tooltip>
				<span class="time-label">
					{Math.round( $obsStore.transitionDuration / 100 ) / 10}s
				</span>
			{/if}
		</span>
	</span>
	<span class="toolbar-section">
		<span class="toolbar-tool">
			<Tooltip text={$appStore.selecting ? 'Selecting' : 'Select'} position="bottom">
				<button class:selected={$appStore.selecting} on:click={onToggleSelectButtonClick}>
					{#if $appStore.selecting}
						<MousePointerSquareIcon />
					{:else}
						<MousePointerSquareDashedIcon />
					{/if}
				</button>
			</Tooltip>
		</span>
		<span class="toolbar-tool">
			<Tooltip text={$appStore.filter ? 'Show All' : 'Show Selected'} position="bottom">
				<button on:click={onToggleFilterButtonClick}>
					{#if $appStore.filter}
						<EyeOffIcon />
					{:else}
						<EyeIcon />
					{/if}
				</button>
			</Tooltip>
		</span>
		<span class="toolbar-tool">
			<Tooltip text={fullscreen ? 'Leave Fullscreen' : 'Enter Fullscreen'} position="bottom">
				<button class:selected={fullscreen} on:click={onToggleFullscreenButtonClick}>
					{#if fullscreen}
						<MinimizeIcon />
					{:else}
						<FullscreenIcon />
					{/if}
				</button>
			</Tooltip>
		</span>
		<span class="toolbar-tool">
			<Tooltip text="Disconnect" position="bottom">
				<button on:click={onDisconnectClick}>
					<UnplugIcon />
				</button>
			</Tooltip>
		</span>
	</span>
</div>

<style>
	.toolbar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 9%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		box-sizing: border-box;
	}
	.toolbar-section {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0 1rem;
	}
	.toolbar-tool {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.cycle-toggle {
		transition: color 150ms ease-in-out;
	}
	.time-label {
		display: flex;
		align-items: center;
		justify-content: start;
		font-size: 0.75rem;
		width: 2rem;
		user-select: none;
	}
	.toolbar.cycling .cycle-toggle {
		animation: spin 3s linear infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.selected {
		color: rgb(45, 228, 139);
	}
</style>
